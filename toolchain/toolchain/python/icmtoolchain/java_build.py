import json
import os
import platform
import re
import subprocess
from collections import namedtuple
from os.path import basename, exists, isdir, isfile, join, relpath, splitext
from typing import Collection, Dict, List, Optional
from zipfile import ZipFile

from . import GLOBALS, PROPERTIES
from .base_config import BaseConfig
from .component import install_components
from .language import get_language_directories
from .shell import abort, debug, error, info, warn
from .utils import (RuntimeCodeError, copy_directory, copy_file,
                    ensure_directory, ensure_file, get_all_files,
                    get_next_filename, remove_tree, request_executable_version,
                    request_tool, walk_all_files)

BuildTarget = namedtuple("BuildTarget", "directory relative_directory output_directory manifest classpath")

def collect_classpath_files(directories: Optional[Collection[str]]) -> List[str]:
	classpath = list()
	if not directories:
		return classpath
	for directory in directories:
		classpath_directory = GLOBALS.MAKE_CONFIG.get_absolute_path(directory)
		if not isdir(classpath_directory):
			classpath_directory = GLOBALS.TOOLCHAIN_CONFIG.get_absolute_path(directory)
		if not isdir(classpath_directory):
			warn(f"* Skipped non-existing classpath directory {directory!r}, please make sure that them exist!")
			continue
		libraries = get_all_files(classpath_directory, (".jar"))
		classpath.extend(libraries)
	return classpath

def flatten_classpath_files(targets: Collection[BuildTarget]) -> List[str]:
	return [
		library for target in targets for library in target.classpath
	]

def rebuild_library_cache(relative_directory: str, libraries: Collection[str], target_directory: str) -> List[str]:
	target_classes_directory = join(target_directory, "libraries", "classes", relative_directory)
	compressed_libraries = join(target_directory, "libraries", relative_directory + ".zip")

	debug(f"Rebuilding library cache: {relative_directory}")
	remove_tree(target_classes_directory)
	ensure_directory(target_classes_directory)

	import shutil
	for filename in libraries:
		debug(f"Extracting library classes: {basename(filename)}")
		shutil.unpack_archive(filename, target_classes_directory, "zip")

	debug("Zipping extracted cache")
	remove_tree(compressed_libraries)
	shutil.make_archive(compressed_libraries[:-4], "zip", target_classes_directory)
	return [compressed_libraries]

def update_modified_targets(targets: Collection[BuildTarget], target_directory: str) -> Dict[str, Dict[str, List[str]]]:
	modified_files = dict()

	for target in targets:
		classes_directory = join(target_directory, "classes", target.relative_directory, "classes")
		classes = GLOBALS.BUILD_STORAGE.get_modified_files(classes_directory, (".class")) if isdir(classes_directory) else []
		libraries = list()

		for library_path in target.manifest.get_value("library-dirs", list()):
			library_directory = join(target.directory, library_path)
			if exists(library_directory) and isdir(library_directory):
				libraries.extend(GLOBALS.BUILD_STORAGE.get_modified_files(library_directory, (".jar")))
			else:
				warn(f"* Directory {library_path!r} could not be found, please check your 'manifest' file!")

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
		if target.manifest.get_value("keepLibraries", False) or GLOBALS.MAKE_CONFIG.get_value("java.keepLibraries", False) or GLOBALS.MAKE_CONFIG.get_value("gradle.keepLibraries", False):
			library_directories = target.manifest.get_value("library-dirs", list())
			for relative_directory in library_directories:
				directory = join(target.directory, relative_directory)
				if isdir(directory):
					copy_directory(directory, join(target.output_directory, relative_directory), clear_destination=True)
			target.manifest.remove_value("keepLibraries")

		if target.manifest.get_value("keepSources", False) or GLOBALS.MAKE_CONFIG.get_value("java.keepSources", False) or GLOBALS.MAKE_CONFIG.get_value("gradle.keepSources", False):
			source_directories = target.manifest.get_value("source-dirs", list())
			for relative_directory in source_directories:
				directory = join(target.directory, relative_directory)
				if isdir(directory):
					copy_directory(directory, join(target.output_directory, relative_directory), clear_destination=True)
			target.manifest.remove_value("keepSources")

		with open(join(target.output_directory, "manifest"), "w", encoding="utf-8") as manifest:
			manifest.write(json.dumps(target.manifest.json, ensure_ascii=False))

### D8/L8/R8

def run_d8(target: BuildTarget, modified_pathes: Dict[str, List[str]], classpath: Collection[str], target_directory: str) -> int:
	java_executable = request_tool("java")
	if not java_executable:
		abort("Executable 'java' is required for compilation, nothing to do.")

	classpath_targets = list()
	for filename in classpath:
		classpath_targets += ["--classpath", filename]
	compressed_libraries = join(target_directory, "classes", target.relative_directory, "libs", target.relative_directory + "-all.jar")
	libraries = list()
	if exists(compressed_libraries):
		libraries += ["--lib", compressed_libraries]
	else:
		walk_all_files((join(target.directory, library) for library in target.manifest.get_value("library-dirs", list())), lambda filename: libraries.extend(("--lib", filename)), (".jar"))

	target_d8_directory = join(target_directory, "d8", target.relative_directory)
	compressed_target = target_d8_directory + ".zip"
	ensure_directory(target_d8_directory)

	modified_class_pathes = modified_pathes["classes"]
	modified_classes = join(target_d8_directory, "modified_classes.txt")
	with open(modified_classes, "w", encoding="utf-8") as modified:
		modified.writelines(path + "\n" for path in modified_class_pathes)
	modified_library_pathes = modified_pathes["libraries"]
	modified_libraries = join(target_d8_directory, "modified_libraries.txt")
	with open(modified_libraries, "w", encoding="utf-8") as modified:
		modified.writelines(path + "\n" for path in modified_library_pathes)

	debug("Dexing libraries")
	result = subprocess.run([
		java_executable,
		"-classpath", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8/r8.jar"),
		"com.android.tools.r8.D8",
		f"@{modified_libraries}"
	] + classpath_targets + libraries + [
		"--min-api", "19",
		"--release" if PROPERTIES.get_value("release") else "--debug",
		"--intermediate",
		"--output", target_d8_directory
	], text=True, capture_output=True)
	if result.returncode != 0:
		error(result.stderr.strip())
		return result.returncode

	debug("Dexing classes")
	result = subprocess.run([
		java_executable,
		"-classpath", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8/r8.jar"),
		"com.android.tools.r8.D8",
		f"@{modified_classes}"
	] + classpath_targets + libraries + [
		"--min-api", "19",
		"--release" if PROPERTIES.get_value("release") else "--debug",
		"--intermediate",
		"--file-per-class",
		"--output", target_d8_directory
	], text=True, capture_output=True)
	if result.returncode != 0:
		error(result.stderr.strip())
		return result.returncode

	debug("Compressing archives")
	with ZipFile(compressed_target, "w") as archive:
		walk_all_files(target_d8_directory, lambda filename: archive.write(filename, arcname=filename[len(target_d8_directory) + 1:]), (".dex"))

	return 0

def merge_compressed_dexes(target: BuildTarget, target_directory: str) -> int:
	compressed_target = join(target_directory, "d8", target.relative_directory + ".zip")
	output_directory = join(target_directory, "odex", target.relative_directory)
	remove_tree(output_directory)
	ensure_directory(output_directory)

	java_executable = request_tool("java")
	if not java_executable:
		abort("Executable 'java' is required for compilation, nothing to do.")

	debug("Merging dex")
	result = subprocess.run([
		java_executable,
		"-classpath", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8/r8.jar"),
		"com.android.tools.r8.D8",
		compressed_target,
		"--min-api", "19",
		"--release" if PROPERTIES.get_value("release") else "--debug",
		"--intermediate",
		"--output", output_directory
	], text=True, capture_output=True)
	if result.returncode != 0:
		error(result.stderr.strip())
		return result.returncode

	return 0

### JAVAC

def build_java_with_javac(targets: Collection[BuildTarget], target_directory: str) -> int:
	javac_executable = None
	supports_modules = False

	for target in targets:
		source_directories = target.manifest.get_value("source-dirs", list())
		library_directories = target.manifest.get_value("library-dirs", list())
		if len(source_directories) == 0 and len(library_directories) == 0:
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
			info(f"* Directory {target.relative_directory!r} is not changed.")
			continue

		if not javac_executable:
			javac_executable = request_tool("javac")
			if not javac_executable:
				abort("Executable 'javac' is required for compilation, nothing to do.")
			supports_modules = request_executable_version(javac_executable)
			supports_modules = supports_modules >= 1.9 or supports_modules >= 9

		options = target.manifest.get_value("options", list())
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
		precompiled = list()
		if supports_modules:
			precompiled += target.classpath
		else:
			# Might be unstable with lambdas, desugaring requires JDK >= 9.
			options += ["-bootclasspath", os.pathsep.join(target.classpath)]
		if len(library_directories) > 0:
			precompiled += get_all_files((join(target.directory, library) for library in library_directories), (".jar"))
		options += ["-classpath", os.pathsep.join(precompiled)]

		result = subprocess.run([
			javac_executable
		] + options + [
			"-Xlint",
			"-Xlint:-cast",
			"-implicit:class",
			"-d", target_classes_directory,
			"-s", target_sources_directory,
			"-h", target_headers_directory,
			f"@{classes_listing}"
		], text=True, capture_output=True)
		startup_millis = time() - startup_millis
		if result.returncode != 0:
			error(result.stderr.strip())
			error(f"Failed {target.relative_directory!r} compilation in {startup_millis:.2f}s with result {result.returncode}.")
			return result.returncode
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
			output.writelines(json.dumps(modification, ensure_ascii=False) + os.linesep for modification in modifications)
	return contains_modifications

### ECJ

def build_java_with_ecj(targets: Collection[BuildTarget], target_directory: str) -> int:
	ecj_executable = None

	for target in targets:
		source_directories = target.manifest.get_value("source-dirs", list())
		library_directories = target.manifest.get_value("library-dirs", list())
		if len(source_directories) == 0 and len(library_directories) == 0:
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
			info(f"* Directory {target.relative_directory!r} is not changed.")
			continue

		if not ecj_executable:
			java_executable = request_tool("java")
			if not java_executable:
				abort("Executable 'java' is required for compilation, nothing to do.")
			ecj_pattern = re.compile(r"ecj-(\d+\.)*jar")
			ecj_executables = GLOBALS.TOOLCHAIN_CONFIG.get_paths("toolchain/bin/*", lambda filename: isfile(filename) and re.fullmatch(ecj_pattern, basename(filename)) is not None)
			if len(ecj_executables) == 0:
				abort("Executable 'ecj-*.jar' is required for compilation, nothing to do.")
			ecj_executable = list()
			for executable in ecj_executables:
				ecj_executable = [java_executable, "-jar", executable]
				if request_executable_version(ecj_executable) != 0.0:
					break
			# TODO: error("Executable 'ecj-*.jar' is not supported, nothing to do.")

		options = target.manifest.get_value("options", list())
		if target.manifest.get_value("verbose", False):
			options.append("-verbose")
		if len(source_directories) > 0:
			options += ["-sourcepath", ":".join(join(target.directory, source) for source in source_directories)]
		precompiled = target.classpath
		if len(library_directories) > 0:
			precompiled += get_all_files((join(target.directory, library) for library in library_directories), (".jar"))
		options += ["-classpath", ":".join(precompiled)]

		result = subprocess.run(ecj_executable + [
			"--release", "8",
			"-Xlint",
			"-Xlint:-cast",
			"-Xemacs",
			"-proceedOnError",
			"-d", target_classes_directory,
			"-s", target_sources_directory
		] + options + [
			f"@{classes_listing}"
		], text=True, capture_output=True)
		startup_millis = time() - startup_millis
		if result.returncode == 0:
			debug(f"Completed {target.relative_directory!r} compilation in {startup_millis:.2f}s!")
		else:
			error(result.stderr.strip())
			error(f"Failed {target.relative_directory!r} compilation in {startup_millis:.2f}s with result {result.returncode}.")
			return result.returncode
	return 0

### GRADLE

def build_java_with_gradle(targets: Collection[BuildTarget], target_directory: str) -> int:
	setup_gradle_project(targets, target_directory, flatten_classpath_files(targets))
	gradle_executable = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/gradlew")
	if platform.system() == "Windows":
		gradle_executable += ".bat"

	options = list()
	for target in targets:
		if target.manifest.get_value("verbose", False):
			options += ["--console", "verbose"]
			break

	result = subprocess.run([
		gradle_executable,
		"-p", target_directory, "shadowJar"
	] + options)
	cleanup_gradle_scripts(targets)
	# if result.returncode != 0:
		# fallback = result.stderr.splitlines()
		# if "Could not initialize class org.codehaus.groovy.runtime.InvokerHelper" in fallback or \
				# "java.lang.NoClassDefFoundError: Could not initialize class org.codehaus.groovy.vmplugin.v7.Java7" in fallback:
			# warn("It seems that you are using an incompatible version of Java. We need OpenJDK 8 to compile sources (e.g., https://github.com/corretto/corretto-8/releases).")
		# else:
			# error(result.stderr.strip())
		# return result.returncode

	print()
	return result.returncode

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
		if not GLOBALS.MAKE_CONFIG.get_value("java.configurable", False) or not exists(join(target.directory, "build.gradle")):
			source_directories = target.manifest.get_value("source-dirs", list())
			library_directories = target.manifest.get_value("library-dirs", list())
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
	if not GLOBALS.MAKE_CONFIG.get_value("java.configurable", False):
		for target in targets:
			gradle_script = join(target.directory, "build.gradle")
			if isfile(gradle_script):
				os.remove(gradle_script)

### TASKS

def get_java_build_targets(directories: Dict[str, BaseConfig]) -> List[BuildTarget]:
	targets = list()

	for directory, config in directories.items():
		relative_directory = basename(directory)
		output_directory = GLOBALS.MOD_STRUCTURE.new_build_target("java", relative_directory)
		ensure_directory(output_directory)

		with open(join(directory, "manifest"), encoding="utf-8") as manifest:
			try:
				manifest = BaseConfig(json.load(manifest))
				manifest.remove_value("directory")
				config.merge_config(manifest, exclusive_lists=True)
			except json.JSONDecodeError as exc:
				raise RuntimeCodeError(2, f"* Malformed java directory {directory!r} manifest, you should fix it: {exc.msg}.")

		classpath = collect_classpath_files(config.get_value("classpath"))
		target = BuildTarget(directory, relative_directory, output_directory, config, classpath)
		targets.append(target)

	return targets

def build_java_directories(tool: str, directories: Dict[str, BaseConfig], target_directory: str) -> int:
	targets = get_java_build_targets(directories)

	if tool == "gradle":
		result = build_java_with_gradle(targets, target_directory)
	elif tool == "ecj":
		result = build_java_with_ecj(targets, target_directory)
	else: # javac
		result = build_java_with_javac(targets, target_directory)
	if result != 0:
		return result

	modified_targets = update_modified_targets(targets, target_directory)
	for target in targets:
		if target.relative_directory not in modified_targets:
			# Otherwise it will be reported immediately.
			if tool == "gradle":
				info(f"* Directory {target.relative_directory!r} is not changed.")
		else:
			debug(f"* Running d8 with {target.relative_directory!r}")
			result = run_d8(target, modified_targets[target.relative_directory], target.classpath, target_directory)
			if result != 0:
				error(f"Failed to dex {target.relative_directory!r} with result {result}.")
				return result
			result = merge_compressed_dexes(target, target_directory)
			if result != 0:
				error(f"Failed to merge {target.relative_directory!r} with result {result}.")
				return result

		built_successfully = False

		target_odex_directory = join(target_directory, "odex", target.relative_directory)
		for dirpath, dirnames, filenames in os.walk(target_odex_directory):
			for filename in filenames:
				relative_directory = relpath(dirpath, target_odex_directory)
				copy_file(join(dirpath, filename), join(target.output_directory, relative_directory, filename))
				built_successfully = True
		for filename in os.listdir(target.directory):
			filepath = join(target.directory, filename)
			if splitext(filename)[1] == ".dex" and isfile(filepath):
				copy_file(filepath, join(target.output_directory, get_next_filename(target.output_directory, "classes", extension=".dex", start_index=2)))
				built_successfully = True

		if not built_successfully:
			warn(f"* Directory {target.relative_directory!r} is empty.")

	if GLOBALS.MAKE_CONFIG.has_value("manifest"):
		target_output_path = GLOBALS.MOD_STRUCTURE.get_target_output_directory("java")
		order = [relpath(target.output_directory, target_output_path) for target in targets]
		order_path = join(target_output_path, "order.txt")
		ensure_file(order_path)

		with open(order_path, "w", encoding="utf-8") as order_file:
			order_file.write("\n".join(order))
			order_file.write("\n")

	copy_additional_sources(targets)
	GLOBALS.BUILD_STORAGE.save()
	return result

def compile_java(tool: str = "gradle") -> int:
	if tool not in ("gradle", "javac", "ecj"):
		error(f"Java compilation will be cancelled, because tool {tool!r} is not available.")
		return 255
	from time import time
	startup_millis = time()
	target_directory = GLOBALS.MAKE_CONFIG.get_build_path(tool)
	ensure_directory(target_directory)
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("java")

	if not exists(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8")):
		install_components("java")
		if not exists(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8")):
			abort("Component 'java' is required for compilation, nothing to do.")

	classpath_directories = list()
	classpath_directory = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/classpath")
	if not isdir(classpath_directory):
		warn("Not found 'toolchain/classpath', in most cases build will be failed, please install it via tasks.")
	else:
		classpath_directories.append(classpath_directory)
	project_classpath_directory = GLOBALS.MAKE_CONFIG.get_path("classpath")
	if exists(project_classpath_directory):
		classpath_directories.append(project_classpath_directory)

	try:
		java_config = GLOBALS.MAKE_CONFIG.get_config("java")
		if not java_config:
			# Obtain properties from deprecated `gradle` config.
			java_config = GLOBALS.MAKE_CONFIG.get_or_create_config("gradle")
		if len(classpath_directories) > 0:
			additional_config = BaseConfig()
			additional_config.set_value("classpath", classpath_directories)
			java_config.merge_config(additional_config, exclusive_lists=True)
		directories = get_language_directories("java", java_config)
	except RuntimeCodeError as exc:
		error(exc)
		return exc.code

	overall_result = build_java_directories(tool, directories, target_directory)

	GLOBALS.MOD_STRUCTURE.update_build_config_list("javaDirs")
	if len(directories) != 0:
		startup_millis = time() - startup_millis
		if overall_result == 0:
			print(f"Completed java build in {startup_millis:.2f}s!")
		else:
			error(f"Failed java build in {startup_millis:.2f}s with result {overall_result}.")
	return overall_result
