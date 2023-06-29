import json
import os
import subprocess
from os.path import abspath, basename, exists, isdir, isfile, join, relpath
from typing import Any, Final, Iterable, Optional

from . import native_setup
from .make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG, BaseConfig
from .shell import abort, debug, error, info, warn
from .utils import (copy_directory, copy_file, ensure_directory,
                    ensure_file_directory, get_all_files, remove_tree)

CODE_OK: Final[int] = 0
CODE_FAILED_NO_GCC: Final[int] = 1001
CODE_FAILED_INVALID_MANIFEST: Final[int] = 1002
CODE_DUPLICATE_NAME: Final[int] = 1003
CODE_INVALID_JSON: Final[int] = 1004
CODE_INVALID_PATH: Final[int] = 1005


def prepare_compiler_executable(abi: str) -> Optional[str]:
	arch = native_setup.abi_to_arch(abi)
	return native_setup.require_compiler_executable(arch=abi if arch is None else arch, install_if_required=True)

def get_manifest(directory: str) -> Any:
	with open(join(directory, "manifest"), "r", encoding="utf-8") as file:
		manifest = json.load(file)
	return manifest

def get_name_from_manifest(directory: str) -> Optional[str]:
	try:
		return get_manifest(directory)["shared"]["name"]
	except Exception:
		return None

def search_directory(parent: str, name: str) -> Optional[str]:
	for dirpath, dirnames, filenames in os.walk(parent):
		for dir in dirnames:
			path = join(dirpath, dir)
			if get_name_from_manifest(path) == name:
				return path

def get_fake_so_dir(abi: str) -> str:
	fake_so_dir = TOOLCHAIN_CONFIG.get_path(join("toolchain", "ndk", "fakeso", abi))
	ensure_directory(fake_so_dir)
	return fake_so_dir

def add_fake_so(gcc: str, abi: str, name: str) -> None:
	file = join(get_fake_so_dir(abi), "lib" + name + ".so")
	if not isfile(file):
		result = subprocess.call([
			gcc, "-std=c++11",
			TOOLCHAIN_CONFIG.get_path("toolchain/bin/fakeso.cpp"),
			"-shared", "-o", file
		])
		print("Created fake so:", name, result, "OK" if result == CODE_OK else "ERROR")

def build_native_dir(directory: str, output_dir: str, cache_dir: str, abis: Iterable[str], std_includes_path: str, rules: BaseConfig) -> int:
	executables = {}
	for abi in abis:
		executable = prepare_compiler_executable(abi)
		if executable is None:
			abort("Failed to acquire GCC executable from NDK for ABI", abi, code=CODE_FAILED_NO_GCC)
		executables[abi] = executable

	try:
		manifest = get_manifest(directory)
		targets = {}
		soname = "lib" + manifest["shared"]["name"] + ".so"
		for abi in abis:
			targets[abi] = join(output_dir, "so", abi, soname)
	except Exception as err:
		abort("Failed to read manifest for directory {directory} with unexpected error!", code=CODE_FAILED_INVALID_MANIFEST, cause=err)

	keep_sources = rules.get_value("keepSources", fallback=False)
	if keep_sources:
		# copy everything and clear build files
		copy_directory(directory, output_dir, clear_destination=True)
		remove_tree(join(output_dir, "so"))
		os.remove(join(output_dir, soname))
	else:
		remove_tree(output_dir)

		# copy manifest
		copy_file(join(directory, "manifest"), join(output_dir, "manifest"))

		# copy includes
		keep_includes = rules.get_value("keepIncludes", fallback=True)
		for include_path in manifest["shared"]["include"]:
			src_include_path = join(directory, include_path)
			output_include_path = join(output_dir, include_path)
			if keep_includes:
				copy_directory(src_include_path, output_include_path, clear_destination=True)
			else:
				remove_tree(output_include_path)

	std_includes = []
	if exists(std_includes_path):
		for std_includes_dir in os.listdir(std_includes_path):
			std_includes_dirpath = join(std_includes_path, std_includes_dir)
			if isdir(std_includes_dirpath):
				std_includes.append(abspath(std_includes_dirpath))

	# compile for every abi
	overall_result = CODE_OK
	for abi in abis:
		info(f"* Compiling '{basename(directory)}' for '{abi}'")

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
					warn(f"* Dependency directory {dependency} is not found, it will be skipped.")

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
			debug("Preprocessing " + relative_file + " " * 48, end="\r")

			object_file = join(object_dir, relative_file) + ".o"
			preprocessed_file = join(preprocessed_dir, relative_file)
			tmp_preprocessed_file = preprocessed_file + ".tmp"
			ensure_file_directory(preprocessed_file)
			ensure_file_directory(object_file)
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

					debug("Compiling " + relative_file + " " * 96)
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
			error("Failed to compile with result ", overall_result)
			return overall_result
		else:
			info(f"Recompiled {recompiled_count}/{len(object_files)} files with result {overall_result}")

		ensure_file_directory(targets[abi])

		command = []
		command += gcc
		command += object_files
		command.append("-shared")
		command.append("-Wl,-soname=" + soname)
		command.append("-o")
		command.append(targets[abi])
		command += includes
		command += dependencies
		debug("Linking object files")
		result = subprocess.call(command)
		if result != CODE_OK:
			error("Linker failed with result ", result)
			overall_result = result
			return overall_result
		print()
	return overall_result

def compile_all_using_make_config(abis: Iterable[str]) -> int:
	import time
	start_time = time.time()
	directories = []
	overall_result = CODE_OK

	for native_dir in MAKE_CONFIG.get_filtered_list("compile", "type", ("native")):
		directories.append(native_dir)

	from .mod_structure import MOD_STRUCTURE
	MOD_STRUCTURE.cleanup_build_target("native")
	if len(directories) > 0:
		std_includes = TOOLCHAIN_CONFIG.get_path("toolchain/stdincludes")
		if not exists(std_includes):
			warn("Not found 'toolchain/stdincludes', in most cases build will be failed, please install it via tasks.")
		cache_dir = MAKE_CONFIG.get_build_path("gcc")
		ensure_directory(cache_dir)

		for native_dir in directories:
			if "source" not in native_dir:
				warn("* Skipped invalid native directory json: ", native_dir)
				overall_result = CODE_INVALID_JSON
				continue

			for native_dir_path in MAKE_CONFIG.get_paths(native_dir["source"]):
				if isdir(native_dir_path):
					directory_name = basename(native_dir_path)
					overall_result = build_native_dir(
						native_dir_path,
						MOD_STRUCTURE.new_build_target("native", directory_name + "{}"),
						join(cache_dir, directory_name),
						abis,
						std_includes,
						BaseConfig(native_dir["rules"] if "rules" in native_dir else {})
					)
					if overall_result == CODE_FAILED_NO_GCC:
						return overall_result
				else:
					warn("* Skipped non-existing native directory: ", native_dir["source"])
					overall_result = CODE_INVALID_PATH

	MOD_STRUCTURE.update_build_config_list("nativeDirs")
	print(f"Completed native build in {int((time.time() - start_time) * 100) / 100}s with result {overall_result} - {'OK' if overall_result == CODE_OK else 'ERROR'}")
	return overall_result


if __name__ == "__main__":
	compile_all_using_make_config(["x86"])
