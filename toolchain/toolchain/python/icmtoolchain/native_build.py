import json
import os
import subprocess
from os.path import abspath, basename, exists, isdir, isfile, join, relpath
from typing import Any, Collection, Optional

from . import GLOBALS
from .make_config import BaseConfig, ToolchainConfig
from .native_setup import abi_to_arch, require_compiler_executable
from .shell import abort, debug, error, info, warn
from .utils import (copy_directory, copy_file, ensure_directory,
                    ensure_file_directory, get_all_files, remove_tree)

CODE_OK = 0
CODE_FAILED_NO_GCC = 1001
CODE_FAILED_INVALID_MANIFEST = 1002
CODE_DUPLICATE_NAME = 1003
CODE_INVALID_JSON = 1004
CODE_INVALID_PATH = 1005


def prepare_compiler_executable(abi: str) -> Optional[str]:
	arch = abi_to_arch(abi)
	return require_compiler_executable(arch=abi if not arch else arch, install_if_required=True)

def get_manifest(directory: str) -> ToolchainConfig:
	return ToolchainConfig(join(directory, "manifest"))

def get_name_from_manifest(directory: str) -> Optional[str]:
	try:
		return get_manifest(directory).get_value("shared.name", basename(directory))
	except:
		return None

def search_in_directory(parent: str, name: str) -> Optional[str]:
	for dirpath, dirnames, filenames in os.walk(parent):
		for dir in dirnames:
			path = join(dirpath, dir)
			if get_name_from_manifest(path) == name:
				return path

def get_fake_so_directory(abi: str) -> str:
	fake_so_dir = GLOBALS.TOOLCHAIN_CONFIG.get_path(join("toolchain", "ndk", "fakeso", abi))
	ensure_directory(fake_so_dir)
	return fake_so_dir

def add_fake_so(gcc: str, abi: str, name: str) -> None:
	file = join(get_fake_so_directory(abi), "lib" + name + ".so")
	if not isfile(file):
		result = subprocess.call([
			gcc, "-std=c++11",
			GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/fakeso.cpp"),
			"-shared", "-o", file
		])
		if result == 0:
			debug(f"Created linking fake so {name!r} successfully")
		else:
			warn(f"Stubbing fake so failed with result {result}!")

def build_native_directory(directory: str, output_directory: str, target_directory: str, abis: Collection[str], std_includes: Collection[str], rules: BaseConfig) -> int:
	executables = dict()
	for abi in abis:
		executable = prepare_compiler_executable(abi)
		if not executable:
			abort(f"Failed to acquire GCC executable from NDK for ABI {abi!r}!", code=CODE_FAILED_NO_GCC)
		executables[abi] = executable

	try:
		manifest = get_manifest(directory)
	except Exception as err:
		abort(f"Failed to read manifest for directory {directory} with unexpected error!", code=CODE_FAILED_INVALID_MANIFEST, cause=err)
	targets = dict()
	library_name = manifest.get_value("shared.name", basename(directory))
	if len(library_name) == 0 or library_name.isspace() or (manifest.get_value("shared") and library_name == "unnamed"):
		abort(f"Library directory {directory} uses illegal name {library_name!r}!", code=CODE_FAILED_INVALID_MANIFEST)
	soname = "lib" + library_name + ".so"
	if manifest.get_value("library.version", -1) < 0 and manifest.get_value("library"):
		abort(f"Library directory {directory} shares library with illegal version!", code=CODE_FAILED_INVALID_MANIFEST)
	make_path = join(directory, "make.txt")
	if exists(make_path):
		with open(make_path, encoding="utf-8") as file:
			make = file.read().strip()
	else:
		make = None

	keep_sources = rules.get_value("keepSources", fallback=False)
	if keep_sources:
		# Copy everything without built directories.
		copy_directory(directory, output_directory, clear_destination=True)
		remove_tree(join(output_directory, "so"))
		os.remove(join(output_directory, soname))
	else:
		remove_tree(output_directory)
		copy_file(manifest.path, join(output_directory, "manifest"))

		keep_includes = rules.get_value("keepIncludes", fallback=False)
		for include_path in manifest.get_value("shared.include", fallback=list()):
			src_include_path = join(directory, include_path)
			output_include_path = join(output_directory, include_path)
			if keep_includes:
				copy_directory(src_include_path, output_include_path, clear_destination=True)
			else:
				remove_tree(output_include_path)

	if exists(join(directory, ".precompiled")):
		info(f"* Library directory {directory} skipped, because precompiled flag is set.")

		libraries_count = 0
		for abi in abis:
			source_library = abspath(join(directory, "so", abi, soname))
			if isfile(source_library):
				target_library = abspath(join(output_directory, "so", abi, soname))
				copy_file(source_library, target_library)
				libraries_count += 1

		if libraries_count == 0:
			source_library = abspath(join(directory, soname))
			if isfile(source_library):
				target_library = abspath(join(output_directory, soname))
				copy_file(source_library, target_library)
				libraries_count += 1

		if libraries_count == 0:
			warn(f"* Library directory {directory} should be precompiled, but there is no shared libraries.")
			return CODE_FAILED_INVALID_MANIFEST
		return CODE_OK

	for abi in abis:
		targets[abi] = abspath(join(output_directory, soname)) if len(abis) == 1 \
			else abspath(join(output_directory, "so", abi, soname))

	overall_result = CODE_OK
	for abi in abis:
		info(f"* Compiling {library_name!r} for {abi}")

		executable = executables[abi]
		gcc = [executable, "-std=c++11"]
		includes = list()
		for std_includes_dir in std_includes:
			includes.append(f"-I{std_includes_dir}")
		dependencies = [f"-L{get_fake_so_directory(abi)}", "-landroid", "-lm", "-llog"]
		for link in rules.get_value("link", fallback=list()) + GLOBALS.MAKE_CONFIG.get_value("linkNative", fallback=list()) + ["horizon"]:
			add_fake_so(executable, abi, link)
			dependencies.append(f"-l{link}")

		# Always search for dependencies in current directory.
		search_directory = abspath(join(directory, ".."))
		for dependency in manifest.get_value("depends", fallback=list()):
			if dependency:
				add_fake_so(executable, abi, dependency)
				dependencies.append("-l" + dependency)
				dependency_directory = search_in_directory(search_directory, dependency)
				if dependency_directory:
					try:
						for include_dir in get_manifest(dependency_directory).get_value("shared.include", fallback=list()):
							includes.append("-I" + join(dependency_directory, include_dir))
					except KeyError:
						pass
			else:
				warn(f"* Dependency directory {dependency} is not found, it will be skipped.")

		source_files = get_all_files(directory, extensions=(".cpp", ".c"))
		preprocessed_directory = abspath(join(target_directory, "preprocessed", abi))
		ensure_directory(preprocessed_directory)
		object_directory = abspath(join(target_directory, "object", abi))
		ensure_directory(object_directory)

		import filecmp
		object_files = list()
		recompiled_count = 0
		for file in source_files:
			relative_file = relpath(file, directory)
			debug(f"Preprocessing {relative_file}{' ' * 48}", end="\r")

			object_file = join(object_directory, relative_file) + ".o"
			preprocessed_file = join(preprocessed_directory, relative_file)
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

					debug(f"Compiling {relative_file}{' ' * 48}", end="\r")
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

		print()
		if overall_result != CODE_OK:
			return overall_result
		info(f"Recompiled {recompiled_count}/{len(object_files)} files with result {overall_result}")

		ensure_file_directory(targets[abi])

		debug("Linking object files")
		linking_command = list()
		linking_command += gcc
		linking_command += object_files
		if make and len(make) != 0 and not make.isspace():
			linking_command.append(make)
		linking_command.append("-shared")
		linking_command.append("-Wl,-soname=" + soname)
		linking_command.append("-o")
		linking_command.append(targets[abi])
		linking_command += includes
		linking_command += dependencies
		overall_result = subprocess.call(linking_command)
		if overall_result != CODE_OK:
			break

	return overall_result

def compile_native(abis: Collection[str]) -> int:
	from time import time
	startup_millis = time()
	directories = list()
	overall_result = CODE_OK
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("native")

	for native_directory in GLOBALS.MAKE_CONFIG.get_filtered_list("compile", "type", ("native")):
		directories.append(native_directory)
	if overall_result != CODE_OK or len(directories) == 0:
		GLOBALS.MOD_STRUCTURE.update_build_config_list("nativeDirs")
		return overall_result

	std_includes_toolchain = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/stdincludes")
	std_includes_custom = GLOBALS.MAKE_CONFIG.get_path("stdincludes")
	if not exists(std_includes_toolchain):
		warn("Not found 'toolchain/stdincludes', in most cases build will be failed, please install it via tasks.")
	std_includes = list()
	if exists(std_includes_toolchain):
		for std_includes_dir in os.listdir(std_includes_toolchain):
			std_includes_dirpath = join(std_includes_toolchain, std_includes_dir)
			if isdir(std_includes_dirpath):
				std_includes.append(abspath(std_includes_dirpath))
	if exists(std_includes_custom):
		for std_includes_dir in os.listdir(std_includes_custom):
			std_includes_dirpath = join(std_includes_custom, std_includes_dir)
			if isdir(std_includes_dirpath):
				std_includes.append(abspath(std_includes_dirpath))
	target_directory = GLOBALS.MAKE_CONFIG.get_build_path("gcc")
	ensure_directory(target_directory)

	for native_directory in directories:
		if "source" not in native_directory:
			warn(f"* Skipped invalid native directory {native_directory!r} json!")
			overall_result = CODE_INVALID_JSON
			continue

		for relative_directory in GLOBALS.MAKE_CONFIG.get_paths(native_directory["source"]):
			if isdir(relative_directory):
				directory_name = basename(relative_directory)
				overall_result = build_native_directory(
					relative_directory,
					GLOBALS.MOD_STRUCTURE.new_build_target("native", directory_name + "{}"),
					join(target_directory, directory_name),
					abis,
					std_includes,
					BaseConfig(native_directory["rules"] if "rules" in native_directory else dict())
				)
				if overall_result != CODE_OK:
					return overall_result
			else:
				warn(f"* Skipped non-existing native directory {native_directory['source']!r}!")
				overall_result = CODE_INVALID_PATH

	GLOBALS.MOD_STRUCTURE.update_build_config_list("nativeDirs")
	startup_millis = time() - startup_millis
	if len(directories) > 0 and overall_result == CODE_OK:
		print(f"Completed native build in {startup_millis:.2f}s!")
	if overall_result != CODE_OK:
		error(f"Failed native build in {startup_millis:.2f}s with result {overall_result}.")
	return overall_result
