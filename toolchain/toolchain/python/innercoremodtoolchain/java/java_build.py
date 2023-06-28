import json
import os
import platform
import subprocess
from os.path import basename, exists, isdir, isfile, join
from typing import Any, Dict, Iterable, List
from zipfile import ZipFile

from ..base_config import BaseConfig
from ..component import install_components, which_installed
from ..hash_storage import BUILD_STORAGE
from ..make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from ..mod_structure import MOD_STRUCTURE
from ..utils import (AttributeZipFile, copy_directory, copy_file,
                     ensure_directory, remove_tree)


def get_classpath_from_directories(directories: Iterable[str]) -> List[str]:
	classpath = []
	for directory in directories:
		if isdir(directory):
			for file in os.listdir(directory):
				file = join(directory, file)
				if isfile(file):
					classpath.append(file)
	return classpath

def rebuild_library_cache(directory: str, library_pathes: Iterable[str], cache_dir: str) -> List[str]:
	directory_name = basename(directory)
	lib_cache_dir = join(cache_dir, "d8_lib_cache", directory_name)
	lib_cache_zip = join(cache_dir, "d8_lib_cache-" + directory_name + ".zip")

	print("Rebuilding library cache:", directory_name)
	remove_tree(lib_cache_dir)
	ensure_directory(lib_cache_dir)

	for archive in library_pathes:
		print("Extracting library classes:", basename(archive))
		with AttributeZipFile(archive, "r") as zip_ref:
			zip_ref.extractall(lib_cache_dir)
	print("Zipping extracted cache", end="\n\n")

	import shutil
	if isfile(lib_cache_zip):
		os.remove(lib_cache_zip)
	shutil.make_archive(lib_cache_zip[:-4], "zip", lib_cache_dir)
	return [lib_cache_zip]

def update_modified_classes(directories: Iterable[str], cache_dir: str) -> Dict[str, Dict[str, Any]]:
	modified_files = {}
	for directory in directories:
		directory_name = basename(directory)
		classes_dir = join(cache_dir, "classes", directory_name, "classes")
		modified_files[directory_name] = {
			"class": BUILD_STORAGE.get_modified_files(classes_dir, (".class")),
			"lib": []
		}
		with open(join(directory, "manifest"), "r") as file:
			manifest = BaseConfig(json.load(file))
		for library_path in manifest.get_value("library-dirs", []):
			library_dir = join(directory, library_path)
			modified_files[directory_name]["lib"] += BUILD_STORAGE.get_modified_files(library_dir, (".jar"))
		if len(modified_files[directory_name]["lib"]) > 0:
			modified_files[directory_name]["lib"] = rebuild_library_cache(
				directory, modified_files[directory_name]["lib"], cache_dir
			)
	return modified_files

def run_d8(directory_name: str, modified_pathes: Dict[str, List[str]], cache_dir: str, debug_build: bool = False) -> int:
	d8_libs = []
	classpath_dir = TOOLCHAIN_CONFIG.get_path("toolchain/classpath")
	if exists(classpath_dir):
		for dirpath, dirnames, filenames in os.walk(classpath_dir):
			for filename in filenames:
				if filename.endswith(".jar"):
					d8_libs += ["--lib", join(dirpath, filename)]

	dex_classes_dir = join(cache_dir, "d8", directory_name)
	jar_dir = join(cache_dir, "classes", directory_name, "libs", directory_name + "-all.jar")
	ensure_directory(dex_classes_dir)

	modified_classes = modified_pathes["class"]
	modified_libs = modified_pathes["lib"]

	print("Dexing libraries")
	result = subprocess.call([
		"java",
		"-cp", TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8/r8.jar"),
		"com.android.tools.r8.D8"
	] + modified_libs + d8_libs + ([
		"--classpath", classpath_dir
	] if exists(classpath_dir) else []) + [
		"--min-api", "19",
		"--lib", jar_dir,
		"--debug" if debug_build else "--release",
		"--intermediate",
		"--output", dex_classes_dir
	])
	if result != 0:
		return result

	print("Dexing classes")
	index = 0
	max_span_size = 128
	while index < len(modified_classes):
		modified_classes_span = modified_classes[index:min(index + max_span_size, len(modified_classes))]
		result = subprocess.call([
			"java",
			"-cp", TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8/r8.jar"),
			"com.android.tools.r8.D8"
		] + modified_classes_span + d8_libs + ([
			"--classpath", classpath_dir
		] if exists(classpath_dir) else []) + [
			"--min-api", "19",
			"--lib", jar_dir,
			"--debug" if debug_build else "--release",
			"--intermediate",
			"--file-per-class",
			"--output", dex_classes_dir
		])
		if result != 0:
			return result
		index += max_span_size
		print(f"Dexing classes: {min(index, len(modified_classes))}/{len(modified_classes)} completed")

	print("Compressing archives")
	dex_classes_dir = join(cache_dir, "d8", directory_name)
	dex_zip_file = join(cache_dir, "d8", directory_name + ".zip")
	with ZipFile(dex_zip_file, "w") as zip_ref:
		for dirpath, dirnames, filenames in os.walk(dex_classes_dir):
			for filename in filenames:
				if filename.endswith(".dex"):
					file = join(dirpath, filename)
					zip_ref.write(file, arcname=file[len(dex_classes_dir) + 1:])

	return result

def merge_compressed_dexes(directory_name: str, cache_dir: str, debug_build: bool = False) -> int:
	dex_zip_file = join(cache_dir, "d8", directory_name + ".zip")
	output_dex_dir = join(cache_dir, "odex", directory_name)
	remove_tree(output_dex_dir)
	ensure_directory(output_dex_dir)
	print("Merging dex")
	return subprocess.call([
		"java",
		"-cp", TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8/r8.jar"),
		"com.android.tools.r8.D8",
		dex_zip_file,
		"--min-api", "19",
		"--debug" if debug_build else "--release",
		"--intermediate",
		"--output", output_dex_dir
	])

def build_java_directories(directories: Iterable[str], cache_dir: str, classpath: List[str], debug_build: bool = False) -> int:
	ensure_directory(cache_dir)

	targets = setup_gradle_project(cache_dir, directories, classpath)
	gradle_executable = TOOLCHAIN_CONFIG.get_path("toolchain/bin/gradlew")
	if platform.system() == "Windows":
		gradle_executable += ".bat"
	result = subprocess.call([
		gradle_executable,
		"-p", cache_dir, "shadowJar"
	])
	if result != 0:
		return result
	print()

	modified_files = update_modified_classes(directories, cache_dir)
	for target in targets:
		directory_name = basename(target)
		if directory_name in modified_files and (len(modified_files[directory_name]["class"]) > 0 or len(modified_files[directory_name]["lib"]) > 0):
			print(f"\x1b[1m\x1b[92m* Running d8 for {directory_name}\x1b[0m")
			result = run_d8(directory_name, modified_files[directory_name], cache_dir, debug_build)
			if result != 0:
				print(f"Failed to dex {directory_name} with code {result}")
				return result
			result = merge_compressed_dexes(directory_name, cache_dir, debug_build)
			if result != 0:
				print(f"Failed to merge {directory_name} with code {result}")
				return result
			print()
		else:
			print(f"* Directory {directory_name} is not changed")
		output_dex_dir = join(cache_dir, "odex", directory_name)
		for filename in os.listdir(output_dex_dir):
			copy_file(join(output_dex_dir, filename), join(target, filename))

	BUILD_STORAGE.save()
	return result

def build_list(directory: str) -> List[str]:
	dirs = os.listdir(directory)
	if "order.txt" in dirs:
		order = open(join(directory, "order.txt"), "r", encoding="utf-8")
		dirs = order.read().splitlines()
	else:
		dirs = list(filter(lambda name: isdir(join(directory, name)), dirs))
	return dirs

def setup_gradle_project(cache_dir: str, directories: Iterable[str], classpath: List[str]) -> List[str]:
	file = open(join(cache_dir, "settings.gradle"), "w", encoding="utf-8")
	file.writelines([
		"include \":%s\"\nproject(\":%s\").projectDir = file(\"%s\")\n"
			% (basename(item), basename(item), item.replace("\\", "\\\\")) for item in directories
	])
	file.close()

	targets = []
	for directory in directories:
		target_dir = MOD_STRUCTURE.new_build_target("java", basename(directory))
		remove_tree(target_dir)
		ensure_directory(target_dir)
		targets.append(target_dir)

		with open(join(directory, "manifest"), "r", encoding="utf-8") as file:
			manifest = BaseConfig(json.load(file))

		source_dirs = manifest.get_value("source-dirs", [])
		library_dirs = manifest.get_value("library-dirs", [])
		build_dir = join(cache_dir, "classes")
		dex_dir = target_dir
		ensure_directory(build_dir)
		ensure_directory(dex_dir)

		if manifest.get_value("keepLibraries", MAKE_CONFIG.get_value("gradle.keepLibraries", True)):
			for library_dir in library_dirs:
				src_dir = join(directory, library_dir)
				if isdir(src_dir):
					copy_directory(src_dir, join(dex_dir, library_dir), clear_destination=True)
			manifest.remove_value("keepLibraries")

		if manifest.get_value("keepSources", MAKE_CONFIG.get_value("gradle.keepSources", False)):
			for source_dir in source_dirs:
				src_dir = join(directory, source_dir)
				if isdir(src_dir):
					copy_directory(src_dir, join(dex_dir, source_dir), clear_destination=True)
			manifest.remove_value("keepSources")

		with open(join(target_dir, "manifest"), "w", encoding="utf-8") as file:
			file.write(json.dumps(manifest.json))

		write_build_gradle(directory, classpath, build_dir, source_dirs, library_dirs)
	return targets

def write_build_gradle(directory: str, classpath: List[str], build_dir: str, source_dirs: Iterable[str], library_dirs: List[str]) -> None:
	with open(join(directory, "build.gradle"), "w", encoding="utf-8") as build_file:
		build_file.write("""plugins {
	id "com.github.johnrengelman.shadow" version "5.2.0"
	id "java"
}

dependencies {
	""" + ("""compile fileTree(\"""" + "\", \"".join([
			path.replace("\\", "\\\\") for path in library_dirs
		])
		+ """\") { include \"*.jar\" }""" if len(library_dirs) > 0 else "") + """
}

sourceSets {
	main {
		java {
			srcDirs = [\"""" + "\", \"".join([
				path.replace("\\", "\\\\") for path in source_dirs
			]) + """\"]
			buildDir = \"""" + join(build_dir, "${project.name}").replace("\\", "\\\\") + """\"
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

def cleanup_gradle_scripts(directories: Iterable[str]) -> None:
	for path in directories:
		gradle_script = join(path, "build.gradle")
		if isfile(gradle_script):
			os.remove(gradle_script)

def compile_all_using_make_config(debug_build: bool = False) -> int:
	from time import time
	start_time = time()

	overall_result = 0
	cache_dir = MAKE_CONFIG.get_build_path("gradle")
	ensure_directory(cache_dir)
	MOD_STRUCTURE.cleanup_build_target("java")

	directories = []
	for directory in MAKE_CONFIG.get_filtered_list("compile", "type", ("java")):
		if "source" not in directory:
			print("Skipped invalid java directory json", directory)
			overall_result += 1
			continue

		for path in MAKE_CONFIG.get_paths(directory["source"]):
			if not isdir(path):
				print("Skipped non existing java directory path", directory["source"])
				overall_result += 1
				continue
			directories.append(path)

	if overall_result != 0:
		print("Cancelling compilation, because one of folders broken.")
		return overall_result

	if len(directories) > 0:
		if not exists(TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8")):
			install_components("java")
			if not exists(TOOLCHAIN_CONFIG.get_path("toolchain/bin/r8")):
				from ..task import error
				error("Component 'java' required for compilation, nothing to do.")
		classpath_dir = TOOLCHAIN_CONFIG.get_path("toolchain/classpath")
		if not exists(classpath_dir):
			print("\x1b[93mNot found 'toolchain/classpath', in most cases build will be failed, please install it via tasks.\x1b[0m")
		classpath_directories = ([
			classpath_dir
		] if exists(classpath_dir) else []) + MAKE_CONFIG.get_value("gradle.classpath", [])
		try:
			overall_result = build_java_directories(directories, cache_dir, get_classpath_from_directories(classpath_directories), debug_build)
		except KeyboardInterrupt:
			overall_result = 1
		if overall_result != 0:
			print(f"Java compilation failed with code '{overall_result}', removing temporary files...")
			for directory in directories:
				remove_tree(MAKE_CONFIG.get_path("output/" + directory))

	cleanup_gradle_scripts(directories)
	MOD_STRUCTURE.update_build_config_list("javaDirs")
	print(f"Completed java build in {int((time() - start_time) * 100) / 100}s with result {overall_result} - {'OK' if overall_result == 0 else 'ERROR'}")
	return overall_result


if __name__ == "__main__":
	compile_all_using_make_config(debug_build=True)
