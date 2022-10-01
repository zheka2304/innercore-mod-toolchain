import os
from os.path import exists, join, basename, abspath, isfile, isdir, relpath
import subprocess
import json

from utils import copy_file, clear_directory, ensure_directory, ensure_file_dir, copy_directory, get_all_files
import native.native_setup as native_setup
from make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG, BaseConfig

CODE_OK = 0
CODE_FAILED_NO_GCC = 1001
CODE_FAILED_INVALID_MANIFEST = 1002
CODE_DUPLICATE_NAME = 1003
CODE_INVALID_JSON = 1004
CODE_INVALID_PATH = 1005

def prepare_compiler_executable(abi):
	from native.native_setup import abi_to_arch
	arch = abi_to_arch(abi)
	if arch is None:
		print(f"WARNING: Unregistered abi {abi}!")
	return native_setup.require_compiler_executable(arch=abi if arch is None else arch, install_if_required=True)

def get_manifest(directory):
	with open(join(directory, "manifest"), "r", encoding="utf-8") as file:
		manifest = json.load(file)
	return manifest

def get_name_from_manifest(directory):
	try:
		return get_manifest(directory)["shared"]["name"]
	except Exception:
		return None

def search_directory(parent, name):
	for dirpath, dirnames, filenames in os.walk(parent):
		for dir in dirnames:
			path = join(dirpath, dir)
			if get_name_from_manifest(path) == name:
				return path

def get_fake_so_dir(abi):
	fake_so_dir = TOOLCHAIN_CONFIG.get_path(join("toolchain/ndk/fakeso", abi))
	ensure_directory(fake_so_dir)
	return fake_so_dir

def add_fake_so(gcc, abi, name):
	file = join(get_fake_so_dir(abi), "lib" + name + ".so")
	if not isfile(file):
		result = subprocess.call([
			gcc, "-std=c++11",
			TOOLCHAIN_CONFIG.get_path("toolchain/bin/fakeso.cpp"),
			"-shared", "-o", file
		])
		print("Created fake so:", name, result, "OK" if result == CODE_OK else "ERROR")

def build_native_dir(directory, output_dir, cache_dir, abis, std_includes_path, rules: BaseConfig):
	executables = {}
	for abi in abis:
		executable = prepare_compiler_executable(abi)
		if executable is None:
			print("Failed to acquire GCC executable from NDK for abi", abi)
			return CODE_FAILED_NO_GCC
		executables[abi] = executable

	try:
		manifest = get_manifest(directory)
		targets = {}
		soname = "lib" + manifest["shared"]["name"] + ".so"
		for abi in abis:
			targets[abi] = join(output_dir, "so", abi, soname)
	except Exception as err:
		print("Failed to read manifest for directory", f"{directory}:", err)
		return CODE_FAILED_INVALID_MANIFEST

	keep_sources = rules.get_value("keepSources", fallback=False)
	if keep_sources:
		# copy everything and clear build files
		copy_directory(directory, output_dir, clear_dst=True)
		clear_directory(join(output_dir, "so"))
		os.remove(join(output_dir, soname))
	else:
		clear_directory(output_dir)

		# copy manifest
		copy_file(join(directory, "manifest"), join(output_dir, "manifest"))

		# copy includes
		keep_includes = rules.get_value("keepIncludes", fallback=True)
		for include_path in manifest["shared"]["include"]:
			src_include_path = join(directory, include_path)
			output_include_path = join(output_dir, include_path)
			if keep_includes:
				copy_directory(src_include_path, output_include_path, clear_dst=True)
			else:
				clear_directory(output_include_path)

	std_includes = []
	if exists(std_includes_path):
		for std_includes_dir in os.listdir(std_includes_path):
			std_includes_dirpath = join(std_includes_path, std_includes_dir)
			if isdir(std_includes_dirpath):
				std_includes.append(abspath(std_includes_dirpath))

	# compile for every abi
	overall_result = CODE_OK
	for abi in abis:
		print(f"* Compiling {basename(directory)} for {abi}")

		executable = executables[abi]
		gcc = [executable, "-std=c++11"]
		includes = []
		for std_includes_dir in std_includes:
			includes.append(f"-I{std_includes_dir}")
		dependencies = [f"-L{get_fake_so_dir(abi)}", "-landroid", "-lm", "-llog"]
		for link in rules.get_value("link", fallback=[]) + MAKE_CONFIG.get_value("linkNative", fallback=[]) + ["horizon"]:
			add_fake_so(executable, abi, link)
			dependencies.append(f"-l{link}")
		if "depends" in manifest:
			search_dir = abspath(join(directory, "..")) # always search for dependencies in current dir
			for dependency in manifest["depends"]:
				if dependency is not None:
					add_fake_so(executable, abi, dependency)
					dependencies.append("-l" + dependency)
					dependency_dir = search_directory(search_dir, dependency)
					if dependency_dir is not None:
						try:
							for include_dir in get_manifest(dependency_dir)["shared"]["include"]:
								includes.append("-I" + join(dependency_dir, include_dir))
						except KeyError:
							pass
				else:
					print(f"WARNING: Dependency directory {dependency} is not found, it will be skipped")

		# prepare directories
		source_files = get_all_files(directory, extensions=(".cpp", ".c"))
		preprocessed_dir = abspath(join(cache_dir, "preprocessed", abi))
		ensure_directory(preprocessed_dir)
		object_dir = abspath(join(cache_dir, "object", abi))
		ensure_directory(object_dir)

		# pre-process and compile changes
		import filecmp
		object_files = []
		recompiled_count = 0
		for file in source_files:
			relative_file = relpath(file, directory)
			print("Preprocessing " + relative_file + " " * 48, end="\r")

			object_file = join(object_dir, relative_file) + ".o"
			preprocessed_file = join(preprocessed_dir, relative_file)
			tmp_preprocessed_file = preprocessed_file + ".tmp"
			ensure_file_dir(preprocessed_file)
			ensure_file_dir(object_file)
			object_files.append(object_file)

			result = subprocess.call(gcc + [
				"-E", file, "-o", tmp_preprocessed_file
			] + includes)
			if result == CODE_OK:
				if not isfile(preprocessed_file) or not isfile(object_file) \
						or not filecmp.cmp(preprocessed_file, tmp_preprocessed_file):
					if isfile(preprocessed_file):
						os.remove(preprocessed_file)
					os.rename(tmp_preprocessed_file, preprocessed_file)
					if isfile(object_file):
						os.remove(object_file)

					print("Compiling " + relative_file + " " * 96)
					result = max(result, subprocess.call(gcc + [
						"-c", preprocessed_file, "-shared", "-o", object_file
					]))
					if result != CODE_OK:
						if isfile(object_file):
							os.remove(object_file)
						overall_result = result
					else:
						recompiled_count += 1
			else:
				if isfile(object_file):
					os.remove(object_file)
				overall_result = result

		if overall_result != CODE_OK:
			print("Failed to compile with result", overall_result)
			return overall_result
		else:
			print(f"Recompiled {recompiled_count}/{len(object_files)} files with result {overall_result}")

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
		print("Linking object files")
		result = subprocess.call(command)
		if result == CODE_OK:
			print("Build successfully completed")
		else:
			print("Linker failed with result", result)
			overall_result = result
			return overall_result
		print()
	return overall_result

def compile_all_using_make_config(abis):
	from mod_structure import mod_structure
	import time
	start_time = time.time()

	std_includes = TOOLCHAIN_CONFIG.get_path("toolchain/stdincludes")
	if not exists(std_includes):
		print("\x1b[93mNot found toolchain/stdincludes, in most cases build will be failed, please install it via tasks.\x1b[0m")
	cache_dir = MAKE_CONFIG.get_build_path("gcc")
	ensure_directory(cache_dir)
	mod_structure.cleanup_build_target("native")

	overall_result = CODE_OK

	for native_dir in MAKE_CONFIG.get_filtered_list("compile", "type", ("native")):
		if "source" not in native_dir:
			print("Skipped invalid native directory json", native_dir)
			overall_result = CODE_INVALID_JSON
			continue
		for native_dir_path in MAKE_CONFIG.get_paths(native_dir["source"]):
			if isdir(native_dir_path):
				directory_name = basename(native_dir_path)
				result = build_native_dir(
					native_dir_path,
					mod_structure.new_build_target("native", directory_name + "{}"),
					join(cache_dir, directory_name),
					abis,
					std_includes,
					BaseConfig(native_dir["rules"] if "rules" in native_dir else {})
				)
				if result == CODE_FAILED_NO_GCC:
					return overall_result
				if result != CODE_OK:
					overall_result = result
			else:
				print("Skipped non existing native directory", native_dir["source"])
				overall_result = CODE_INVALID_PATH

	mod_structure.update_build_config_list("nativeDirs")
	print(f"Completed native build in {int((time.time() - start_time) * 100) / 100}s with result {overall_result} - {'OK' if overall_result == CODE_OK else 'ERROR'}")
	return overall_result


if __name__ == "__main__":
	compile_all_using_make_config(["x86"])
