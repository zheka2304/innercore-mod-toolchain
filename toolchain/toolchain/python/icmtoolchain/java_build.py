import json
import os
import platform
import re
import subprocess
from collections import namedtuple
from os.path import basename, exists, isdir, isfile, join, relpath
from typing import Collection, Dict, List
from zipfile import ZipFile

from . import GLOBALS
from .base_config import BaseConfig
from .component import install_components
from .shell import abort, debug, error, info, warn
from .utils import (copy_directory, copy_file, ensure_directory, get_all_files,
                    remove_tree, request_executable_version, request_tool,
                    walk_all_files)

BuildTarget = namedtuple("BuildTarget", "directory relative_directory output_directory manifest")

def prepare_directory_order(directory: str) -> List[str]:
	directories = os.listdir(directory)
	if "order.txt" in directories:
		with open(join(directory, "order.txt"), encoding="utf-8") as order:
			directories = order.readlines()
	else:
		directories = list(filter(lambda name: isdir(join(directory, name)), directories))
	return directories

def prepare_build_targets(directories: Collection[str]) -> List[BuildTarget]:
	targets = []
	for directory in directories:
		with open(join(directory, "manifest"), encoding="utf-8") as manifest:
			manifest = json.load(manifest)
		# relative_directory = GLOBALS.MAKE_CONFIG.get_relative_path(directory)
		relative_directory = basename(directory)
		output_directory = GLOBALS.MOD_STRUCTURE.new_build_target("java", relative_directory)
		ensure_directory(output_directory)
		targets.append(BuildTarget(directory, relative_directory, output_directory, BaseConfig(manifest)))
	return targets

def rebuild_library_cache(relative_directory: str, libraries: Collection[str], target_directory: str) -> List[str]:
	target_classes_directory = join(target_directory, "libraries", "classes", relative_directory)
	compressed_libraries = join(target_directory, "libraries", relative_directory + ".zip")

	debug("Rebuilding library cache:", relative_directory)
	remove_tree(target_classes_directory)
	ensure_directory(target_classes_directory)

	import shutil
	for filename in libraries:
		debug("Extracting library classes:", basename(filename))
		shutil.unpack_archive(filename, target_classes_directory, "zip")

	debug("Zipping extracted cache")
	remove_tree(compressed_libraries)
	shutil.make_archive(compressed_libraries[:-4], "zip", target_classes_directory)
	return [compressed_libraries]

def update_modified_targets(targets: Collection[BuildTarget], target_directory: str) -> Dict[str, Dict[str, List[str]]]:
	modified_files = {}
	for target in targets:
		classes_directory = join(target_directory, "classes", target.relative_directory, "classes")
		classes = GLOBALS.BUILD_STORAGE.get_modified_files(classes_directory, (".class"))
		libraries = []
		for library_path in target.manifest.get_value("library-dirs", []):
			library_directory = join(target.directory, library_path)
			libraries.extend(GLOBALS.BUILD_STORAGE.get_modified_files(library_directory, (".jar")))
		if len(libraries) > 0:
			libraries = rebuild_library_cache(target.relative_directory, libraries, target_directory)
		if len(classes) > 0 or len(libraries) > 0:
			modified_files[target.relative_directory] = {
				"classes": classes,
				"libraries": libraries
			}
	return modified_files

def copy_additional_sources(targets: Collection[BuildTarget]) -> None:
	for target in targets:
		if target.manifest.get_value("keepLibraries", False) or GLOBALS.MAKE_CONFIG.get_value("java.keepLibraries", False) or GLOBALS.MAKE_CONFIG.get_value("gradle.keepLibraries", True):
			library_directories = target.manifest.get_value("library-dirs", [])
			for relative_directory in library_directories:
				directory = join(target.directory, relative_directory)
				if isdir(directory):
					copy_directory(directory, join(target.output_directory, relative_directory), clear_destination=True)
			target.manifest.remove_value("keepLibraries")

		if target.manifest.get_value("keepSources", False) or GLOBALS.MAKE_CONFIG.get_value("java.keepSources", False) or GLOBALS.MAKE_CONFIG.get_value("gradle.keepSources", False):
			source_directories = target.manifest.get_value("source-dirs", [])
			for relative_directory in source_directories:
				directory = join(target.directory, relative_directory)
				if isdir(directory):
					copy_directory(directory, join(target.output_directory, relative_directory), clear_destination=True)
			target.manifest.remove_value("keepSources")

		with open(join(target.output_directory, "manifest"), "w", encoding="utf-8") as manifest:
			manifest.write(json.dumps(target.manifest.json))

### D8/L8/R8

def run_d8(target: BuildTarget, modified_pathes: Dict[str, List[str]], classpath: Collection[str], target_directory: str, debug_build: bool = False) -> int:
	classpath_targets = []
	for filename in classpath:
		classpath_targets += ["--classpath", filename]
	compressed_libraries = join(target_directory, "classes", target.relative_directory, "libs", target.relative_directory + "-all.jar")
	libraries = []
	if exists(compressed_libraries):
		libraries += ["--lib", compressed_libraries]
	else:
		walk_all_files((join(target.directory, library) for library in target.manifest.get_value("library-dirs", [])), lambda filename: libraries.extend(("--lib", filename)), (".jar"))

	target_d8_directory = join(target_directory, "d8", target.relative_directory)
	compressed_target = target_d8_directory + ".zip"
	ensure_directory(target_d8_directory)

	modified_classes = modified_pathes["classes"]
	modified_libraries = modified_pathes["libraries"]

	debug("Dexing libraries")
	result = subprocess.call([
		"java",
		"-classpath", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8/r8.jar"),
		"com.android.tools.r8.D8"
	] + modified_libraries + classpath_targets + libraries + [
		"--min-api", "19",
		"--debug" if debug_build else "--release",
		"--intermediate",
		"--output", target_d8_directory
	])
	if result != 0:
		return result

	debug("Dexing classes")
	result = subprocess.call([
		"java",
		"-classpath", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8/r8.jar"),
		"com.android.tools.r8.D8"
	] + modified_classes + classpath_targets + libraries + [
		"--min-api", "19",
		"--debug" if debug_build else "--release",
		"--intermediate",
		"--file-per-class",
		"--output", target_d8_directory
	])
	if result != 0:
		return result

	debug("Compressing archives")
	with ZipFile(compressed_target, "w") as archive:
		walk_all_files(target_d8_directory, lambda filename: archive.write(filename, arcname=filename[len(target_d8_directory) + 1:]), (".dex"))

	return result

def merge_compressed_dexes(target: BuildTarget, target_directory: str, debug_build: bool = False) -> int:
	compressed_target = join(target_directory, "d8", target.relative_directory + ".zip")
	output_directory = join(target_directory, "odex", target.relative_directory)
	remove_tree(output_directory)
	ensure_directory(output_directory)

	debug("Merging dex")
	return subprocess.call([
		"java",
		"-classpath", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8/r8.jar"),
		"com.android.tools.r8.D8",
		compressed_target,
		"--min-api", "19",
		"--debug" if debug_build else "--release",
		"--intermediate",
		"--output", output_directory
	])

### JAVAC

def build_java_with_javac(targets: Collection[BuildTarget], target_directory: str, classpath: Collection[str]) -> int:
	result = 0
	javac_executable = None
	supports_modules = False

	for target in targets:
		source_directories = target.manifest.get_value("source-dirs", [])
		library_directories = target.manifest.get_value("library-dirs", [])
		if len(source_directories) == len(library_directories) == 0:
			debug(f"* Directory {target.relative_directory!r} is empty")
			continue

		from time import time
		startup_millis = time()
		target_compiler_directory = join(target_directory, "classes", target.relative_directory)
		target_classes_directory = join(target_compiler_directory, "classes")
		ensure_directory(target_classes_directory)
		target_sources_directory = join(target_compiler_directory, "generated", "sources", "annotationProcessor")
		target_headers_directory = join(target_compiler_directory, "generated", "sources", "headers")
		ensure_directory(target_sources_directory)
		ensure_directory(target_headers_directory)

		classes_listing = join(target_compiler_directory, ".classes")
		if not write_changed_source_files(target, source_directories, classes_listing):
			info(f"* Directory {target.relative_directory!r} is not changed")
			continue

		if not javac_executable:
			javac_executable = request_tool("javac")
			if not javac_executable:
				abort("Executable 'javac' is required for compilation, nothing to do.")
			supports_modules = request_executable_version(javac_executable)
			supports_modules = supports_modules >= 1.9 or supports_modules >= 9

		options = target.manifest.get_value("options", [])
		if supports_modules:
			options += ["--release", "8"]
		else:
			options += [
				"-source", "8",
				"-target", "8"
			]
		if target.manifest.get_value("verbose", False):
			options.append("-verbose")
		if len(source_directories) > 0:
			options += ["-sourcepath", os.pathsep.join(join(target.directory, source) for source in source_directories)]
		precompiled = []
		if supports_modules:
			precompiled += classpath
		else:
			# Might be unstable with lambdas, desugaring requires JDK >= 9.
			options += ["-bootclasspath", os.pathsep.join(classpath)]
		if len(library_directories) > 0:
			precompiled += get_all_files((join(target.directory, library) for library in library_directories), (".jar"))
		options += ["-classpath", os.pathsep.join(precompiled)]

		result = subprocess.call([
			javac_executable
		] + options + [
			"-Xlint",
			"-Xlint:-cast",
			"-implicit:class",
			"-d", target_classes_directory,
			"-s", target_sources_directory,
			"-h", target_headers_directory,
			f"@{classes_listing}"
		])
		startup_millis = time() - startup_millis
		if result != 0:
			error(f"Failed {target.relative_directory!r} compilation in {startup_millis:.2f}s with result {result}.")
			return result
		debug(f"Completed {target.relative_directory!r} compilation in {startup_millis:.2f}s!")
	return 0

def write_changed_source_files(target: BuildTarget, directories: Collection[str], filename: str) -> bool:
	contains_modifications = False
	with open(filename, "w", encoding="utf-8") as output:
		for directory in directories:
			modifications = GLOBALS.BUILD_STORAGE.get_modified_files(join(target.directory, directory), (".java"))
			try:
				next(iter(modifications))
			except StopIteration:
				continue
			contains_modifications = True
			output.writelines(modification + os.linesep for modification in modifications)
	return contains_modifications

### ECJ

def build_java_with_ecj(targets: Collection[BuildTarget], target_directory: str, classpath: Collection[str]) -> int:
	result = 0
	ecj_executable = None

	for target in targets:
		source_directories = target.manifest.get_value("source-dirs", [])
		library_directories = target.manifest.get_value("library-dirs", [])
		if len(source_directories) == len(library_directories) == 0:
			debug(f"* Directory {target.relative_directory!r} is empty")
			continue

		from time import time
		startup_millis = time()
		target_compiler_directory = join(target_directory, "classes", target.relative_directory)
		target_classes_directory = join(target_compiler_directory, "classes")
		ensure_directory(target_classes_directory)
		target_sources_directory = join(target_compiler_directory, "generated", "sources")
		ensure_directory(target_sources_directory)

		classes_listing = join(target_compiler_directory, ".classes")
		if not write_changed_source_files(target, source_directories, classes_listing):
			info(f"* Directory {target.relative_directory!r} is not changed")
			continue

		if not ecj_executable:
			java_executable = request_tool("java")
			if not java_executable:
				abort("Executable 'java' is required for compilation, nothing to do.")
			ecj_pattern = re.compile(r"ecj-(\d+\.)*jar")
			ecj_executables = GLOBALS.TOOLCHAIN_CONFIG.get_paths("toolchain/bin/*", lambda filename: isfile(filename) and re.fullmatch(ecj_pattern, basename(filename)) is not None)
			if len(ecj_executables) == 0:
				abort("Executable 'ecj-*.jar' is required for compilation, nothing to do.")
			ecj_executable = []
			for executable in ecj_executables:
				ecj_executable = [java_executable, "-jar", executable]
				if request_executable_version(ecj_executable) != 0.0:
					break
			if result != 0:
				error("Executable 'ecj-*.jar' is not supported, nothing to do.")
				return result

		options = target.manifest.get_value("options", [])
		if target.manifest.get_value("verbose", False):
			options.append("-verbose")
		if len(source_directories) > 0:
			options += ["-sourcepath", ":".join(join(target.directory, source) for source in source_directories)]
		precompiled = list(classpath)
		if len(library_directories) > 0:
			precompiled += get_all_files((join(target.directory, library) for library in library_directories), (".jar"))
		options += ["-classpath", ":".join(precompiled)]

		result = subprocess.call(ecj_executable + [
			"--release", "8",
			"-Xlint",
			"-Xlint:-cast",
			"-Xemacs",
			"-proceedOnError",
			"-d", target_classes_directory,
			"-s", target_sources_directory
		] + options + [
			f"@{classes_listing}"
		])
		startup_millis = time() - startup_millis
		if result == 0:
			debug(f"Completed {target.relative_directory!r} compilation in {startup_millis:.2f}s!")
		else:
			error(f"Failed {target.relative_directory!r} compilation in {startup_millis:.2f}s with result {result}.")
			return result
	return 0

### GRADLE

def build_java_with_gradle(targets: Collection[BuildTarget], target_directory: str, classpath: Collection[str]) -> int:
	setup_gradle_project(targets, target_directory, classpath)
	gradle_executable = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/gradlew")
	if platform.system() == "Windows":
		gradle_executable += ".bat"
	options = []
	for target in targets:
		if target.manifest.get_value("verbose", False):
			options += ["--console", "verbose"]
			break
	result = subprocess.call([
		gradle_executable,
		"-p", target_directory, "shadowJar"
	] + options)
	cleanup_gradle_scripts(targets)
	if result != 0:
		return result
	print()
	return result

def setup_gradle_project(targets: Collection[BuildTarget], target_directory: str, classpath: Collection[str]) -> None:
	with open(join(target_directory, "settings.gradle"), "w", encoding="utf-8") as settings_gradle:
		for target in targets:
			settings_gradle.write(f'include ":{target.relative_directory}"')
			settings_gradle.write(os.linesep)
			project_directory = target.directory.replace("\\", "\\\\")
			settings_gradle.write(f'project(":{target.relative_directory}").projectDir = file("{project_directory}")')
			settings_gradle.write(os.linesep)

	target_classes_directory = join(target_directory, "classes")
	ensure_directory(target_classes_directory)
	for target in targets:
		# if not exists(join(target.directory, "build.gradle")):
		source_directories = target.manifest.get_value("source-dirs", [])
		library_directories = target.manifest.get_value("library-dirs", [])
		write_build_gradle(target.directory, classpath, target_classes_directory, source_directories, library_directories)

def write_build_gradle(directory: str, classpath: Collection[str], target_classes_directory: str, source_directories: Collection[str], library_directories: Collection[str]) -> None:
	with open(join(directory, "build.gradle"), "w", encoding="utf-8") as build_gradle:
		build_gradle.write(
"""plugins {
	id "com.github.johnrengelman.shadow" version "5.2.0"
	id "java"
}

dependencies {
	""" + ("""compile fileTree(\"""" + "\", \"".join([
			path.replace("\\", "\\\\") for path in library_directories
		])
		+ """\") { include \"*.jar\" }""" if len(library_directories) > 0 else "") + """
}

sourceSets {
	main {
		java {
			srcDirs = [\"""" + "\", \"".join([
				path.replace("\\", "\\\\") for path in source_directories
			]) + """\"]
			buildDir = \"""" + join(target_classes_directory, "${project.name}").replace("\\", "\\\\") + """\"
		}
		resources {
			srcDirs = []
		}""" + (("""
		compileClasspath += files(\"""" + "\", \"".join([
			path.replace("\\", "\\\\") for path in classpath
		]) + "\")") if len(classpath) > 0 else "") + """
	}
}
""")

def cleanup_gradle_scripts(targets: Collection[BuildTarget]) -> None:
	for target in targets:
		gradle_script = join(target.directory, "build.gradle")
		if isfile(gradle_script):
			os.remove(gradle_script)

### TASKS

def build_java_with(tool: str, directories: Collection[str], target_directory: str, classpath_directories: Collection[str]) -> int:
	classpath = get_all_files(classpath_directories, (".jar"))
	targets = prepare_build_targets(directories)

	if tool == "gradle":
		result = build_java_with_gradle(targets, target_directory, classpath)
	elif tool == "ecj":
		result = build_java_with_ecj(targets, target_directory, classpath)
	else: # javac
		result = build_java_with_javac(targets, target_directory, classpath)
	if result != 0:
		return result

	modified_targets = update_modified_targets(targets, target_directory)
	for target in targets:
		if target.relative_directory not in modified_targets:
			# Otherwise it will be reported immediately.
			if tool == "gradle":
				info(f"* Directory {target.relative_directory!r} is not changed")
		else:
			debug(f"* Running d8 with {target.relative_directory!r}")
			result = run_d8(target, modified_targets[target.relative_directory], classpath, target_directory)
			if result != 0:
				error(f"Failed to dex {target.relative_directory!r} with result {result}.")
				return result
			result = merge_compressed_dexes(target, target_directory)
			if result != 0:
				error(f"Failed to merge {target.relative_directory!r} with result {result}.")
				return result

		target_odex_directory = join(target_directory, "odex", target.relative_directory)
		for dirpath, dirnames, filenames in os.walk(target_odex_directory):
			for filename in filenames:
				relative_directory = relpath(dirpath, target_odex_directory)
				copy_file(join(dirpath, filename), join(target.output_directory, relative_directory, filename))

	copy_additional_sources(targets)
	GLOBALS.BUILD_STORAGE.save()
	return result

def compile_java(tool: str = "gradle") -> int:
	if tool not in ("gradle", "javac", "ecj"):
		error(f"Java compilation will be cancelled, because tool {tool!r} is not availabled.")
		return 255
	from time import time
	startup_millis = time()
	overall_result = 0

	target_directory = GLOBALS.MAKE_CONFIG.get_build_path(tool)
	ensure_directory(target_directory)
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("java")

	directories = []
	for directory in GLOBALS.MAKE_CONFIG.get_filtered_list("compile", "type", ("java")):
		if "source" not in directory:
			warn(f"* Skipped invalid java directory {directory!r} json!")
			overall_result += 1
			continue
		for path in GLOBALS.MAKE_CONFIG.get_paths(directory["source"]):
			if not isdir(path):
				warn(f"* Skipped non-existing java directory {directory!r}!")
				overall_result += 1
				continue
			directories.append(path)
	if overall_result != 0 or len(directories) == 0:
		if len(directories) > 0:
			error("Java compilation will be cancelled, because some directories skipped.")
		return overall_result

	if not exists(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8")):
		install_components("java")
		if not exists(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8")):
			abort("Component 'java' is required for compilation, nothing to do.")
	classpath_directory = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/classpath")
	if not exists(classpath_directory):
		warn("Not found 'toolchain/classpath', in most cases build will be failed, please install it via tasks.")
		classpath_directory = None

	classpath_directories = GLOBALS.MAKE_CONFIG.get_value("java.classpath")
	# Just in case if someone meaning to use outdated property.
	if not classpath_directories:
		classpath_directories = GLOBALS.MAKE_CONFIG.get_value("gradle.classpath", [])
	if classpath_directory:
		classpath_directories.insert(0, classpath_directory)

	overall_result = build_java_with(tool, directories, target_directory, classpath_directories)

	GLOBALS.MOD_STRUCTURE.update_build_config_list("javaDirs")
	startup_millis = time() - startup_millis
	if overall_result == 0:
		print(f"Completed java build in {startup_millis:.2f}s!")
	else:
		error(f"Failed java build in {startup_millis:.2f}s with result {overall_result}.")
	return overall_result
