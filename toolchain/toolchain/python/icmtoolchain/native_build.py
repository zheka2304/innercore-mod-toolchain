import json
import os
import subprocess
from collections import namedtuple
from os.path import abspath, basename, exists, isdir, isfile, join, relpath
from typing import Collection, Dict, List, Optional

from . import GLOBALS, PROPERTIES
from .language import get_language_directories
from .make_config import BaseConfig, ToolchainConfig
from .native_setup import abi_to_arch, prepare_compiler_executable
from .shell import abort, debug, error, info, warn
from .utils import (RuntimeCodeError, copy_directory, copy_file,
                    ensure_directory, ensure_file_directory, get_all_files,
                    remove_tree)

CODE_OK = 0
CODE_FAILED_NO_GCC = 1001
CODE_FAILED_INVALID_MANIFEST = 1002
CODE_DUPLICATE_NAME = 1003
CODE_INVALID_JSON = 1004
CODE_INVALID_PATH = 1005


BuildTarget = namedtuple("BuildTarget", "directory relative_directory output_directory manifest stdincludes")

def collect_stdincludes_directories(directories: Optional[Collection[str]]) -> List[str]:
	stdincludes = list()
	if not directories:
		return stdincludes
	for directory in directories:
		stdincludes_directory = GLOBALS.MAKE_CONFIG.get_absolute_path(directory)
		if not isdir(stdincludes_directory):
			stdincludes_directory = GLOBALS.TOOLCHAIN_CONFIG.get_absolute_path(directory)
		if not isdir(stdincludes_directory):
			warn(f"* Skipped non-existing stdincludes directory {directory!r}, please make sure that them exist!")
			continue
		has_directories = False
		for filename in os.listdir(stdincludes_directory):
			stdincludes_headers = join(stdincludes_directory, filename)
			if isdir(stdincludes_headers):
				stdincludes.append(stdincludes_headers)
				has_directories = True
			elif not has_directories and filename.endswith((".h", ".hpp")):
				warn(f"* Header {filename} should be inside any of stdincludes directory, otherwise it will be ignored.")
	return stdincludes

def get_manifest(directory: str) -> ToolchainConfig:
	return ToolchainConfig(join(directory, "manifest"))

def get_name_from_manifest(directory: str) -> Optional[str]:
	try:
		return get_manifest(directory).get_value("shared.name", basename(directory))
	except:
		return None

def search_in_directory(parent: str, name: str) -> Optional[str]:
	for dirpath, dirnames, filenames in os.walk(parent):
		for relative_directory in dirnames:
			path = join(dirpath, relative_directory)
			if get_name_from_manifest(path) == name:
				return path

def get_fake_so_directory(abi: str) -> str:
	fake_so_directory = GLOBALS.TOOLCHAIN_CONFIG.get_path(join("toolchain", "ndk", "fakeso", abi))
	ensure_directory(fake_so_directory)
	return fake_so_directory

def add_fake_so(executable: str, abi: str, name: str) -> None:
	file = join(get_fake_so_directory(abi), "lib" + name + ".so")
	if not isfile(file):
		result = subprocess.call([
			executable, "-std=c++11",
			GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/fakeso.cpp"),
			"-shared", "-o", file
		])
		if result == 0:
			debug(f"Created linking fake so {name!r} successfully")
		else:
			warn(f"Stubbing fake so failed with result {result}!")

def is_relevant_configuration(configuration: str, *properties: str) -> bool:
	if len(configuration) == 0 or configuration == "*":
		return True
	rules = configuration.split("-")
	rule_match_abi = None
	for rule in rules:
		try:
			arch = abi_to_arch(rule)
			if arch in properties:
				rule_match_abi = True
			elif rule_match_abi is None:
				rule_match_abi = False
		except ValueError:
			pass
		if rule == "debug" or rule == "release":
			is_release = PROPERTIES.get_value("release")
			if (is_release and rule == "debug") or (not is_release and rule == "release"):
				return False
			continue
		if rule in properties:
			continue
		# debug(f"* Mismatched rule {rule} in configuration {configuration!r}, ignoring it...")
		return False
	return rule_match_abi != False

def merge_relevant_configurations(configurations: BaseConfig, *properties: str) -> BaseConfig:
	relevant = BaseConfig()
	for key, _ in configurations.iterate_entries(recursive=False):
		config = configurations.get_config(key)
		if config and is_relevant_configuration(key, *properties):
			relevant.merge_config(config)
	return relevant

def get_native_build_targets(directories: Dict[str, BaseConfig]) -> List[BuildTarget]:
	targets = list()

	for directory, config in directories.items():
		# TODO: Maybe move logic to relative directory instead of hashed one.
		# relative_directory = config.get_value("directory")
		# assert relative_directory, "Internal error, relative directory cannot be empty."
		relative_directory = GLOBALS.MAKE_CONFIG.unique_folder_name(directory)

		# Apply global configurations to preserve keepIncludes, etc. in builds.
		configurations = config.get_config("configurations")
		if configurations:
			config.merge_config(merge_relevant_configurations(configurations))

		with open(join(directory, "manifest"), encoding="utf-8") as manifest:
			try:
				manifest = BaseConfig(json.load(manifest))
				manifest.remove_value("directory")
				# Obtain deprecated `rules` property to being merged.
				if manifest.has_value("rules"):
					rules_config = manifest.get_config("rules")
					if rules_config:
						config.merge_config(rules_config)
				config.merge_config(manifest)
			except json.JSONDecodeError as exc:
				raise RuntimeCodeError(2, f"* Malformed native directory {directory!r} manifest, you should fix it: {exc.msg}.")

		output_directory = GLOBALS.MOD_STRUCTURE.new_build_target("native", relative_directory)
		ensure_directory(output_directory)
		stdincludes = collect_stdincludes_directories(config.get_value("stdincludes"))
		target = BuildTarget(directory, relative_directory, output_directory, config, stdincludes)
		targets.append(target)

	return targets

def build_native_with_ndk(directory: str, output_directory: str, target_directory: str, abis: Collection[str], stdincludes: Collection[str], manifest: BaseConfig) -> int:
	configurations = manifest.get_config("configurations")
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

	keep_sources = manifest.get_value("keepSources", fallback=False)
	if keep_sources:
		# Copy everything without built directories.
		copy_directory(directory, output_directory, clear_destination=True)
		remove_tree(join(output_directory, "so"))
		os.remove(join(output_directory, soname))
	else:
		# Cleanup built directories and copy manifest.
		remove_tree(output_directory)
		copy_file(join(directory, "manifest"), join(output_directory, "manifest"))

		# Also copy includes if necessary.
		keep_includes = manifest.get_value("keepIncludes", fallback=False)
		for include_path in manifest.get_list("shared.include"):
			src_include_path = join(directory, include_path)
			output_include_path = join(output_directory, include_path)
			if keep_includes:
				copy_directory(src_include_path, output_include_path, clear_destination=True)
			else:
				remove_tree(output_include_path)

	# Copy already prebuilt libraries, output path will be 'libname.so' or 'so/arch/libname.so'.
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

	# Compile library for requested ABIs.
	targets = dict()
	for abi in abis:
		targets[abi] = abspath(join(output_directory, soname)) if len(abis) == 1 \
			else abspath(join(output_directory, "so", abi, soname))

	overall_result = CODE_OK
	for abi in abis:
		info(f"* Compiling {library_name!r} for {abi}")
		manifest_abi = manifest
		if configurations:
			configuration = merge_relevant_configurations(configurations, abi)
			manifest_abi = BaseConfig()
			manifest_abi.merge_config(manifest)
			manifest_abi.merge_config(configuration)

		executable = prepare_compiler_executable(abi)
		compiler_command = [executable, "-DANDROID_STL=c++_static"]
		includes = list()
		for stdincludes_directory in stdincludes:
			includes.append(f"-I{stdincludes_directory}")
		dependencies = [f"-L{get_fake_so_directory(abi)}", "-landroid", "-lm", "-llog", "-ldl", "-lc"]
		links = manifest_abi.get_list("link")
		if not "horizon" in links:
			links.append("horizon")
		for link in links:
			add_fake_so(executable, abi, link)
			dependencies.append(f"-l{link}")
		options = manifest_abi.get_value("options", ["-std=c++11"])

		# Always search for dependencies in current directory.
		search_directory = abspath(join(directory, ".."))
		for dependency in manifest_abi.get_list("depends"):
			if dependency:
				add_fake_so(executable, abi, dependency)
				dependencies.append("-l" + dependency)
				dependency_directory = search_in_directory(search_directory, dependency)
				if dependency_directory:
					try:
						for include_directory in get_manifest(dependency_directory).get_list("shared.include"):
							includes.append("-I" + join(dependency_directory, include_directory))
					except KeyError:
						pass
			else:
				warn(f"* Dependency directory {dependency} is not found, it will be skipped.")

		# Collect files and prepare output cache directories.
		source_files = get_all_files(directory, extensions=(".cpp", ".c"))
		preprocessed_directory = abspath(join(target_directory, "preprocessed", abi))
		ensure_directory(preprocessed_directory)
		object_directory = abspath(join(target_directory, "object", abi))
		ensure_directory(object_directory)

		# Preprocess to compile changed sources.
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

			result = subprocess.call(compiler_command + [
				"-E", file, "-o", tmp_preprocessed_file
			] + includes + options)
			if result == CODE_OK:
				if not isfile(preprocessed_file) or not isfile(object_file) \
						or not filecmp.cmp(preprocessed_file, tmp_preprocessed_file):
					if isfile(preprocessed_file):
						os.remove(preprocessed_file)
					os.rename(tmp_preprocessed_file, preprocessed_file)
					if isfile(object_file):
						os.remove(object_file)

					debug(f"Compiling {relative_file}{' ' * 48}", end="\r")
					result = max(result, subprocess.call(compiler_command + [
						"-c", preprocessed_file, "-shared", "-o", object_file
					] + options))
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

		for link in manifest_abi.get_list("linkStatic"):
			link_path = GLOBALS.MAKE_CONFIG.get_path(join("static_libs", abi, link))
			if isdir(link_path):
				for object_file in get_all_files(link_path):
					object_files.append(object_file)
			elif exists(link_path):
				object_files.append(link_path)
			else:
				warn(f"* Skipped static library {link}, because it was not exist.")

		ensure_file_directory(targets[abi])

		debug("Linking object files")
		linking_command = list()
		linking_command += compiler_command
		linking_command += object_files
		if make and len(make) != 0 and not make.isspace():
			linking_command.append(make)
		linking_command.append("-shared")
		linking_command.append("-Wl,-soname=" + soname)
		if "-flto" in options:
			debug("Linker time optimization is enabled")
			linking_command += options
		linking_command.append("-o")
		linking_command.append(targets[abi])
		linking_command += includes
		linking_command += dependencies
		overall_result = subprocess.call(linking_command)
		if overall_result != CODE_OK:
			break

	return overall_result

def build_native_directories(abis: Collection[str], directories: Dict[str, BaseConfig], target_directory: str) -> int:
	targets = get_native_build_targets(directories)

	for target in targets:
		target_library_directory = join(target_directory, target.relative_directory)
		result = build_native_with_ndk(target.directory, target.output_directory, target_library_directory, abis, target.stdincludes, target.manifest)
		if result != 0:
			return result

	return 0

def compile_native(abis: Collection[str]) -> int:
	from time import time
	startup_millis = time()
	overall_result = CODE_OK
	target_directory = GLOBALS.MAKE_CONFIG.get_build_path("gcc")
	ensure_directory(target_directory)
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("native")

	stdincludes_directories = list()
	stdincludes_toolchain = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/stdincludes")
	if not isdir(stdincludes_toolchain):
		warn("Not found 'toolchain/stdincludes', in most cases build will be failed, please install it via tasks.")
	else:
		stdincludes_directories.append(stdincludes_toolchain)
	stdincludes_custom = GLOBALS.MAKE_CONFIG.get_path("stdincludes")
	if exists(stdincludes_custom):
		stdincludes_directories.append(stdincludes_custom)

	try:
		native_config = GLOBALS.MAKE_CONFIG.get_config("native")
		if not native_config:
			# Obtain deprecated config `linkNative` property.
			native_config = BaseConfig()
			if GLOBALS.MAKE_CONFIG.has_value("linkNative"):
				native_config.set_value("link", GLOBALS.MAKE_CONFIG.get_value("linkNative"))
		if len(stdincludes_directories) > 0:
			additional_config = BaseConfig()
			additional_config.set_value("stdincludes", stdincludes_directories)
			native_config.merge_config(additional_config, exclusive_lists=True)
		directories = get_language_directories("native", native_config)
	except RuntimeCodeError as exc:
		error(exc)
		return exc.code
	if len(directories) == 0:
		GLOBALS.MOD_STRUCTURE.update_build_config_list("nativeDirs")
		return 0

	overall_result = build_native_directories(abis, directories, target_directory)

	GLOBALS.MOD_STRUCTURE.update_build_config_list("nativeDirs")
	startup_millis = time() - startup_millis
	if overall_result == CODE_OK:
		print(f"Completed native build in {startup_millis:.2f}s!")
	else:
		error(f"Failed native build in {startup_millis:.2f}s with result {overall_result}.")

	return overall_result

def copy_shared_objects(abis: Collection[str]) -> int:
	shared_objects = GLOBALS.MAKE_CONFIG.get_list("native.sharedObjects")
	if len(shared_objects) == 0 or not GLOBALS.MAKE_CONFIG.has_value("manifest"):
		return 0
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("shared_object")
	order = set()

	overall_result = 0
	for shared_object in shared_objects:
		formatted_shared_object = shared_object.format("")
		if shared_object == formatted_shared_object:
			if shared_object[-1] == "*":
				shared_object = shared_object[0:-1] + "/{}/*"
			else:
				error(f"* Shared object path {formatted_shared_object} should contain required architecture or ends with asterisk.")
				overall_result += 1
				continue
		for abi in abis:
			formatted_shared_object = shared_object.format(abi)
			for shared_object_path in GLOBALS.MAKE_CONFIG.get_paths(formatted_shared_object):
				shared_object_name = basename(shared_object_path)
				if shared_object_name in order:
					warn(f"* Found duplicate shared object {formatted_shared_object}, overriding existing one...")
				output_file = GLOBALS.MOD_STRUCTURE.new_build_target("shared_object", shared_object_name)
				copy_file(shared_object_path, output_file)
				order.add(shared_object_name)

	if len(order) > 0:
		output_directory = GLOBALS.MOD_STRUCTURE.get_target_directories("shared_object")[0]
		with open(join(output_directory, "order.txt"), "w", encoding="utf-8") as order_file:
			order_file.write("\n".join(order) + "\n")
	if overall_result == 0:
		print(f"Completed shared objects include!")
	else:
		error(f"Failed include shared objects with result {overall_result}.")
	return overall_result
