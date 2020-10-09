import sys
import os
import os.path
import subprocess
import json

from utils import ensure_directory, copy_directory, copy_file, clear_directory, ensure_file_dir, get_all_files, relative_path
import native.native_setup as native_setup
from make_config import make_config, BaseConfig, MakeConfig
from mod_structure import mod_structure

CODE_OK = 0
CODE_FAILED_NO_GCC = 1001
CODE_FAILED_INVALID_MANIFEST = 1002
CODE_DUPLICATE_NAME = 1003
CODE_INVALID_JSON = 1004
CODE_INVALID_PATH = 1005


def prepare_compiler_executable(abi):
	abi_map = {
		"armeabi-v7a": "arm",
		"arm64-v8a": "arm64",
		"x86": "x86",
		"x86_64": "x86_64"
	}
	if abi in abi_map:
		abi = abi_map[abi]
	else:
		print("warning: unregistered abi " + abi)
	return native_setup.require_compiler_executable(arch=abi, install_if_required=True)


def get_manifest(directory):
	with open(os.path.join(directory, "manifest"), "r", encoding="utf-8") as file:
		manifest = json.load(file)
	return manifest


def get_name_from_manifest(directory):
	try:
		return get_manifest(directory)["shared"]["name"]
	except Exception:
		return None


def search_directory(parent, name):
	for root, dirs, _ in os.walk(parent):
		for directory in dirs:
			path = os.path.join(root, directory)
			if get_name_from_manifest(path) == name:
				return path


def get_fake_so_dir(abi):
	fake_so_dir = make_config.get_path(os.path.join("toolchain/ndk/fakeso", abi))
	ensure_directory(fake_so_dir)
	return fake_so_dir


def add_fake_so(gcc, abi, name):
	file = os.path.join(get_fake_so_dir(abi), "lib" + name + ".so")
	if not os.path.isfile(file):
		result = subprocess.call([
			gcc, "-std=c++11",
			f'{make_config.get_path("toolchain/bin/fakeso.cpp")}',
			"-shared", "-o", f"{file}"
		])
		print("created fake so:", name, result, "OK" if result == CODE_OK else "ERROR")


def build_native_dir(directory, output_dir, cache_dir, abis, std_includes_path, rules: BaseConfig):
	executables = {}
	for abi in abis:
		executable = prepare_compiler_executable(abi)
		if executable is None:
			print("failed to acquire GCC executable from NDK for abi " + abi)
			return CODE_FAILED_NO_GCC
		executables[abi] = executable

	try:
		manifest = get_manifest(directory)
		targets = {}
		soname = "lib" + manifest["shared"]["name"] + ".so"
		for abi in abis:
			targets[abi] = os.path.join(output_dir, "so/" + abi + "/" + soname)
	except Exception as err:
		print("failed to read manifest for directory " + directory + " error: " + str(err))
		return CODE_FAILED_INVALID_MANIFEST

	keep_sources = rules.get_value("keepSources", fallback=False)
	if keep_sources:
		# copy everything and clear build files
		copy_directory(directory, output_dir, clear_dst=True)
		clear_directory(os.path.join(output_dir, "so"))
		os.remove(os.path.join(output_dir, soname))
	else:
		clear_directory(output_dir)

		# copy manifest
		copy_file(os.path.join(directory, "manifest"), os.path.join(output_dir, "manifest"))

		# copy includes
		keep_includes = rules.get_value("keepIncludes", fallback=True)
		for include_path in manifest["shared"]["include"]:
			src_include_path = os.path.join(directory, include_path)
			output_include_path = os.path.join(output_dir, include_path)
			if keep_includes:
				copy_directory(src_include_path, output_include_path, clear_dst=True)
			else:
				clear_directory(output_include_path)

	std_includes = []
	for std_includes_dir in os.listdir(std_includes_path):
		std_includes.append(os.path.abspath(os.path.join(std_includes_path, std_includes_dir)))

	# compile for every abi
	overall_result = CODE_OK
	for abi in abis:
		printed_compilation_title = f"compiling {os.path.basename(directory)} for {abi}"
		print("\n")
		print(f"{'=' * (48 - len(printed_compilation_title) // 2)} {printed_compilation_title} {'=' * (48 - (1 + len(printed_compilation_title)) // 2)}")

		executable = executables[abi]
		gcc = [executable, "-std=c++11"]
		includes = []
		for std_includes_dir in std_includes:
			includes.append(f'-I{std_includes_dir}')
		dependencies = [f'-L{get_fake_so_dir(abi)}', "-landroid", "-lm", "-llog"]
		for link in rules.get_value("link", fallback=[]) + make_config.get_value("make.linkNative", fallback=[]) + ["horizon"]:
			add_fake_so(executable, abi, link)
			dependencies.append(f'-l{link}')
		if "depends" in manifest:
			search_dir = os.path.abspath(os.path.join(directory, ".."))  # always search for dependencies in current dir
			for dependency in manifest["depends"]:
				if dependency is not None:
					add_fake_so(executable, abi, dependency)
					dependencies.append("-l" + dependency)
					dependency_dir = search_directory(search_dir, dependency)
					if dependency_dir is not None:
						try:
							for include_dir in get_manifest(dependency_dir)["shared"]["include"]:
								includes.append("-I" + os.path.join(dependency_dir, include_dir))
						except KeyError:
							pass
				else:
					print(f"ERROR: dependency directory {dependency} is not found, it will be skipped")

		# prepare directories
		source_files = get_all_files(directory, extensions=(".cpp", ".c"))
		preprocessed_dir = os.path.abspath(os.path.join(cache_dir, "preprocessed", abi))
		ensure_directory(preprocessed_dir)
		object_dir = os.path.abspath(os.path.join(cache_dir, "object", abi))
		ensure_directory(object_dir)

		# pre-process and compile changes
		import filecmp
		object_files = []
		recompiled_count = 0
		for file in source_files:
			relative_file = relative_path(directory, file)
			sys.stdout.write("preprocessing " + relative_file + " " * 64 + "\r")

			object_file = os.path.join(object_dir, relative_file) + ".o"
			preprocessed_file = os.path.join(preprocessed_dir, relative_file)
			tmp_preprocessed_file = preprocessed_file + ".tmp"
			ensure_file_dir(preprocessed_file)
			ensure_file_dir(object_file)
			object_files.append(object_file)

			result = subprocess.call(gcc + ["-E", file, "-o", tmp_preprocessed_file] + includes)
			if result == CODE_OK:
				if not os.path.isfile(preprocessed_file) or not os.path.isfile(object_file) or \
						not filecmp.cmp(preprocessed_file, tmp_preprocessed_file):
					if os.path.isfile(preprocessed_file):
						os.remove(preprocessed_file)
					os.rename(tmp_preprocessed_file, preprocessed_file)
					if os.path.isfile(object_file):
						os.remove(object_file)

					sys.stdout.write("compiling " + relative_file + " " * 64 + "\n")
					result = max(result, subprocess.call(gcc + ["-c", preprocessed_file, "-shared", "-o", object_file]))
					if result != CODE_OK:
						if os.path.isfile(object_file):
							os.remove(object_file)
						overall_result = result
					else:
						recompiled_count += 1
			else:
				if os.path.isfile(object_file):
					os.remove(object_file)
				overall_result = result

		print(" " * 128)
		if overall_result != CODE_OK:
			print("failed to compile", overall_result)
			return overall_result
		else:
			print(f"recompiled {recompiled_count}/{len(object_files)} files with result {overall_result}")

		ensure_file_dir(targets[abi])

		command = []
		command += gcc
		command += object_files
		command.append("-shared")
		command.append("-Wl,-soname=" + soname)
		command.append("-o")
		command.append(targets[abi])
		command += includes
		command += dependencies
		print("linking object files...")
		result = subprocess.call(command)
		if result == CODE_OK:
			print("build successful")
		else:
			print("linker failed with result code", result)
			overall_result = result
			return overall_result
	return overall_result


def compile_all_using_make_config(abis):
	import time
	start_time = time.time()

	std_includes = make_config.get_path("toolchain/stdincludes")
	cache_dir = make_config.get_path("toolchain/build/gcc")
	ensure_directory(cache_dir)
	mod_structure.cleanup_build_target("native")

	overall_result = CODE_OK
	for native_dir in make_config.get_filtered_list("compile", prop="type", values=("native",)):
		if "source" not in native_dir:
			print("skipped invalid native directory json", native_dir, file=sys.stderr)
			overall_result = CODE_INVALID_JSON
			continue
		for native_dir_path in make_config.get_paths(native_dir["source"]):
			if os.path.isdir(native_dir_path):
				directory_name = os.path.basename(native_dir_path)
				result = build_native_dir(
					native_dir_path,
					mod_structure.new_build_target("native", directory_name + "{}"),
					os.path.join(cache_dir, directory_name),
					abis,
					std_includes,
					BaseConfig(native_dir["rules"] if "rules" in native_dir else {})
				)
				if result != CODE_OK:
					overall_result = result
			else:
				print("skipped non-existing native directory path", native_dir["source"], file=sys.stderr)
				overall_result = CODE_INVALID_PATH

	mod_structure.update_build_config_list("nativeDirs")
	print(f"completed native build in {int((time.time() - start_time) * 100) / 100}s with result {overall_result} - {'OK' if overall_result == CODE_OK else 'ERROR'}")
	return overall_result


if __name__ == '__main__':
	compile_all_using_make_config(["x86"])
