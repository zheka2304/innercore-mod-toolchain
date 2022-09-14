import os
from os.path import join, basename, isfile, isdir, getmtime, relpath
import sys
import subprocess
import json
import zipfile
import hashlib

from utils import *
from make_config import make_config
from mod_structure import mod_structure
import platform


def get_classpath_from_directories(directories):
	classpath = []
	for directory in directories:
		if isdir(directory):
			for file in os.listdir(directory):
				file = join(directory, file)
				if isfile(file):
					classpath.append(file)
	return classpath

def rebuild_library_cache(directory, library_files, cache_dir):
	directory_name = basename(directory)
	lib_cache_dir = join(cache_dir, "d8_lib_cache", directory_name)
	lib_cache_zip = join(cache_dir, "d8_lib_cache-" + directory_name + ".zip")

	print("rebuilding library cache:", directory_name)
	clear_directory(lib_cache_dir)
	ensure_directory(lib_cache_dir)

	for lib_file in library_files:
		print("extracting library classes:", basename(lib_file))
		with zipfile.ZipFile(lib_file, "r") as zip_ref:
			zip_ref.extractall(lib_cache_dir)
	print("creating zip...")

	import shutil
	if isfile(lib_cache_zip):
		os.remove(lib_cache_zip)
	shutil.make_archive(lib_cache_zip[:-4], 'zip', lib_cache_dir)
	return [lib_cache_zip]

def update_modified_classes(directories, cache_dir):
	cache_json = {}
	try:
		with open(join(cache_dir, "gradle_classes_cache.json")) as f:
			cache_json = json.load(f)
	except Exception as e:
		pass

	print("recalculating class file hashes...")
	modified_files = {}
	for directory in directories:
		directory_name = basename(directory)
		classes_dir = join(cache_dir, "classes", directory_name, "classes")
		if directory_name not in cache_json:
			cache_json[directory_name] = {}
		modified_timings = cache_json[directory_name]
		modified_files[directory_name] = {
			"class": [],
			"lib": []
		}
		modified_files_for_dir = modified_files[directory_name]["class"]
		for dirpath, dnames, fnames in os.walk(classes_dir):
			for f in fnames:
				if f.endswith(".class"):
					file = str(join(dirpath, f))
					modified_time = int(1000 * getmtime(file))
					hash_factory = hashlib.md5()
					with open(file, "rb") as fp:
						hash_factory.update(fp.read())
					hash = str(hash_factory.digest())
					if file not in modified_timings or modified_timings[file] != hash:
						modified_files_for_dir.append(file)
					modified_timings[file] = hash

		with open(join(directory, "manifest"), "r") as file:
			manifest = json.load(file)

		was_libs_modified = False
		library_files = []
		for library_dir in manifest["library-dirs"]:
			for dirpath, dnames, fnames in os.walk(join(directory, library_dir)):
				for fname in fnames:
					if fname.endswith(".jar"):
						file = join(dirpath, fname)
						library_files.append(file)
						modified_time = int(1000 * getmtime(file))
						key = "lib:" + file
						if key not in modified_timings or modified_timings[key] != modified_time:
							was_libs_modified = True
						modified_timings[key] = modified_time
		if was_libs_modified:
			modified_files[directory_name]["lib"] += rebuild_library_cache(directory, library_files, cache_dir)
	return modified_files, cache_json

def save_modified_classes_cache(cache_json, cache_dir):
    with open(join(cache_dir, "gradle_classes_cache.json"), "w") as f:
        f.write(json.dumps(cache_json))

def run_d8(directory_name, modified_files, cache_dir, output_dex_dir):
	d8_libs = []
	for dirpath, dnames, fnames in os.walk(make_config.get_path("toolchain/classpath")):
		for fname in fnames:
			d8_libs += ["--lib", join(dirpath, fname)]

	dex_classes_dir = join(cache_dir, "d8", directory_name)
	jar_dir = join(cache_dir, "classes", directory_name, "libs", directory_name + "-all.jar")
	ensure_directory(dex_classes_dir)

	modified_classes = modified_files["class"]
	modified_libs = modified_files["lib"]

	print("dexing libraries...")
	result = subprocess.call([
		"java",
		"-cp", make_config.get_path("toolchain/bin/r8.jar"),
		"com.android.tools.r8.D8"
	] + modified_libs + d8_libs + [
		"--min-api", "19",
		"--lib", jar_dir,
		"--classpath", make_config.get_path("toolchain/classpath"),
		"--intermediate",
		"--output", dex_classes_dir
	])
	if result != 0:
		return result

	print("dexing classes...")
	index = 0
	max_span_size = 128
	while index < len(modified_classes):
		modified_classes_span = modified_classes[index:min(index + max_span_size, len(modified_classes))]
		result = subprocess.call([
			"java",
			"-cp", make_config.get_path("toolchain/bin/r8.jar"),
			"com.android.tools.r8.D8"
		] + modified_classes_span + d8_libs + [
			"--min-api", "19",
			"--lib", jar_dir,
			"--classpath", make_config.get_path("toolchain/classpath"),
			"--intermediate",
			"--file-per-class",
			"--output", dex_classes_dir
		])
		if result != 0:
			return result
		index += max_span_size
		print("dexing classes: ", min(index, len(modified_classes)), "/", len(modified_classes), " completed")

	print("compressing changed parts...")
	dex_zip_file = join(cache_dir, "d8", directory_name + ".zip")
	with zipfile.ZipFile(dex_zip_file, 'w') as zip_ref:
		for dirpath, dnames, fnames in os.walk(dex_classes_dir):
			for fname in fnames:
				if fname.endswith(".dex"):
					file = join(dirpath, fname)
					zip_ref.write(file, arcname=file[len(dex_classes_dir) + 1:])

	print("preparing output...")
	ensure_directory(output_dex_dir)
	for fname in os.listdir(output_dex_dir):
		if fname.endswith(".dex"):
			os.remove(fname)

	print("merging dex...")
	return subprocess.call([
		"java",
		"-cp", make_config.get_path("toolchain/bin/r8.jar"),
		"com.android.tools.r8.D8",
		dex_zip_file,
		"--min-api", "19",
		"--debug",
		"--intermediate",
		"--output", output_dex_dir
	])

def build_java_directories(directories, cache_dir, classpath):
	ensure_directory(cache_dir)

	targets = setup_gradle_project(cache_dir, directories, classpath)
	gradle_executable = make_config.get_path("toolchain/bin/gradlew")
	if platform.system() == "Windows":
		gradle_executable += ".bat"
	result = subprocess.call([
		gradle_executable,
		"-p", cache_dir, "shadowJar"
	])
	if result != 0:
		print(f"java compilation failed with code {result}")
		return result

	modified_files, cache_json = update_modified_classes(directories, cache_dir)
	save_modified_classes_cache(cache_json, cache_dir)
	for target in targets:
		directory_name = basename(target)
		if directory_name in modified_files and (len(modified_files[directory_name]["class"]) > 0 or len(modified_files[directory_name]["lib"]) > 0):
			print('\033[1m' + '\033[92m' + f"\nrunning d8 for {directory_name}\n" + '\033[0m')
			result = run_d8(directory_name, modified_files[directory_name], cache_dir, target)
			if result != 0:
				print(f"failed to dex {directory_name} with code {result}")
				return result
		else:
			print(f"skipping folder {directory_name}, it still same")

	save_modified_classes_cache(cache_json, cache_dir)
	print('\033[1m' + '\033[92m' + "\n**** SUCCESS ****\n" + '\033[0m')
	return result

def build_list(working_dir):
	dirs = os.listdir(working_dir)
	if "order.txt" in dirs:
		order = open(join(working_dir, "order.txt"), "r", encoding="utf-8")
		dirs = order.read().splitlines()
	else:
		dirs = list(filter(lambda name: isdir(join(working_dir, name)), dirs))
	return dirs

def setup_gradle_project(cache_dir, directories, classpath):
	file = open(join(cache_dir, "settings.gradle"), "w", encoding="utf-8")
	file.writelines(["include ':%s'\nproject(':%s').projectDir = file('%s')\n" % (basename(item), basename(item), item.replace("\\", "\\\\")) for item in directories])
	file.close()

	targets = []
	for directory in directories:
		target_dir = mod_structure.new_build_target("java", basename(directory))
		clear_directory(target_dir)
		ensure_directory(target_dir)
		copy_file(join(directory, "manifest"), join(target_dir, "manifest"))
		targets.append(target_dir)

		with open(join(directory, "manifest"), "r", encoding="utf-8") as file:
			manifest = json.load(file)

		source_dirs = manifest["source-dirs"]
		library_dirs = manifest["library-dirs"]
		build_dir = join(cache_dir, "classes")
		dex_dir = target_dir
		ensure_directory(build_dir)
		ensure_directory(dex_dir)

		if make_config.get_value("gradle.keepLibraries", True):
			for library_dir in library_dirs:
				src_dir = join(directory, library_dir)
				if isdir(src_dir):
					copy_directory(src_dir, join(dex_dir, library_dir), clear_dst=True)

		if make_config.get_value("gradle.keepSources", False):
			for source_dir in source_dirs:
				src_dir = join(directory, source_dir)
				if isdir(src_dir):
					copy_directory(src_dir, join(dex_dir, source_dir), clear_dst=True)

		write_build_gradle(directory, classpath, build_dir, source_dirs, library_dirs)
	return targets

def write_build_gradle(directory, classpath, build_dir, source_dirs, library_dirs):
	with open(join(directory, "build.gradle"), "w", encoding="utf-8") as build_file:
		build_file.write("""plugins {
	id 'com.github.johnrengelman.shadow' version '5.2.0'
	id "java"
}

dependencies { 
	""" + ("""compile fileTree('""" + "', '".join([path.replace("\\", "\\\\") for path in library_dirs]) + """') { include '*.jar' }""" if len(library_dirs) > 0 else "") + """
}

sourceSets {
	main {
		java {
			srcDirs = ['""" + "', '".join([path.replace("\\", "\\\\") for path in source_dirs]) + """']
			buildDir = \"""" + join(build_dir, "${project.name}").replace("\\", "\\\\") + """\"
		}
		resources {
			srcDirs = []
		}
		compileClasspath += files('""" + "', '".join([path.replace("\\", "\\\\") for path in classpath]) + """')
	}
}
""")

def cleanup_gradle_scripts(directories):
	for path in directories:
		gradle_script = join(path, "build.gradle")
		if isfile(gradle_script):
			os.remove(gradle_script)

def compile_all_using_make_config():
	import time
	start_time = time.time()

	overall_result = 0
	cache_dir = make_config.get_path("toolchain/build/gradle")
	ensure_directory(cache_dir)

	directories = []
	directory_names = []
	for directory in make_config.get_project_filtered_list("compile", prop="type", values=("java",)):
		if "source" not in directory:
			print("skipped invalid java directory json", directory, file=sys.stderr)
			overall_result = -1
			continue

		for path in make_config.get_project_paths(directory["source"]):
			if not isdir(path):
				print("skipped non-existing java directory path", directory["source"], file=sys.stderr)
				overall_result = -1
				continue
			directories.append(path)

	if overall_result != 0:
		print("failed to get java directories", file=sys.stderr)
		return overall_result

	if len(directories) > 0:
		classpath_directories = [make_config.get_path("toolchain/classpath")] + make_config.get_value("gradle.classpath", [])
		overall_result = build_java_directories(directories, cache_dir, get_classpath_from_directories(classpath_directories))
		if overall_result != 0:
			print(f"failed, clearing compiled directories {directories} ...")
			for directory_name in directory_names:
				clear_directory(make_config.get_project_path("output/" + directory_name))
	cleanup_gradle_scripts(directories)
	mod_structure.update_build_config_list("javaDirs")

	print(f"completed java build in {int((time.time() - start_time) * 100) / 100}s with result {overall_result} - {'OK' if overall_result == 0 else 'ERROR'}")
	return overall_result


if __name__ == '__main__':
	compile_all_using_make_config()
