
import sys
import os
import subprocess
import json

from utils import *
from make_config import make_config
from mod_structure import mod_structure


def get_classpath_from_directories(directories):
	classpath = []
	for directory in directories:
		if os.path.isdir(directory):
			for file in os.listdir(directory):
				file = os.path.join(directory, file)
				if os.path.isfile(file):
					classpath.append(file)
	return classpath


def build_java_directories(directories, cache_dir, classpath):
	ensure_directory(cache_dir)

	setup_gradle_project(cache_dir, directories, classpath)
	gradle_executable = make_config.get_path("toolchain/bin/gradlew.bat")
	result = subprocess.call([gradle_executable, "-p", cache_dir, "shadowJar"])
	if result != 0:
		print(f"java compilation failed with code {result}")
		return result
	result = subprocess.call([gradle_executable, "-p", cache_dir, "dex"])
	if result != 0:
		print(f"dex failed with code {result}")
		return result
	print('\033[1m' + '\033[92m' + "\n****SUCCESS****\n" + '\033[0m')
	return result


def build_list(working_dir):
	dirs = os.listdir(working_dir)
	if "order.txt" in dirs:
		order = open(os.path.join(working_dir, "order.txt"), "r", encoding="utf-8")
		dirs = order.read().splitlines()
	else:
		dirs = list(filter(lambda name: os.path.isdir(os.path.join(working_dir, name)), dirs))
	return dirs


def setup_gradle_project(cache_dir, directories, classpath):
	file = open(os.path.join(cache_dir, "settings.gradle"), "w", encoding="utf-8")
	file.writelines(["include ':%s'\nproject(':%s').projectDir = file('%s')\n" % (os.path.basename(item), os.path.basename(item), item.replace("\\", "\\\\")) for item in directories])
	file.close()

	for directory in directories:
		target_dir = mod_structure.new_build_target("java", os.path.basename(directory))
		clear_directory(target_dir)
		ensure_directory(target_dir)
		copy_file(os.path.join(directory, "manifest"), os.path.join(target_dir, "manifest"))

		with open(os.path.join(directory, "manifest"), "r", encoding="utf-8") as file:
			manifest = json.load(file)

		source_dirs = manifest["source-dirs"]
		library_dirs = manifest["library-dirs"]
		build_dir = os.path.join(cache_dir, os.path.basename(target_dir), "classes")
		dex_dir = target_dir
		ensure_directory(build_dir)
		ensure_directory(dex_dir)

		if make_config.get_value("make.gradle.keepLibraries", True):
			for library_dir in library_dirs:
				src_dir = os.path.join(directory, library_dir)
				if os.path.isdir(src_dir):
					copy_directory(src_dir, os.path.join(dex_dir, library_dir), clear_dst=True)

		if make_config.get_value("make.gradle.keepSources", False):
			for source_dir in source_dirs:
				src_dir = os.path.join(directory, source_dir)
				if os.path.isdir(src_dir):
					copy_directory(src_dir, os.path.join(dex_dir, source_dir), clear_dst=True)

		with open(os.path.join(directory, "build.gradle"), "w", encoding="utf-8") as build_file:
			build_file.write("""
				plugins {
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
							buildDir = \"""" + os.path.join(build_dir, "${project.name}").replace("\\", "\\\\") + """\"
						}
						resources {
							srcDirs = []
						}
						compileClasspath += files('""" + "', '".join([path.replace("\\", "\\\\") for path in classpath]) + """')
					}
				}
		
				tasks.register("dex") {
					javaexec { 
						main = "-jar";
						args = [
							\"""" + make_config.get_path("toolchain/bin/dx.jar").replace("\\", "\\\\") + """\",
							"--dex",
							"--multi-dex",
							"--output=\\\"""" + os.path.join(dex_dir, ".").replace("\\", "\\\\") + """\\\"",
							\"""" + os.path.join(build_dir, "${project.name}", "libs", "${project.name}-all.jar").replace("\\", "\\\\") + """\"
						]
					} 
				}
			""")


def cleanup_gradle_scripts(directories):
	for path in directories:
		gradle_script = os.path.join(path, "build.gradle")
		if os.path.isfile(gradle_script):
			os.remove(gradle_script)


def compile_all_using_make_config():
	import time
	start_time = time.time()

	overall_result = 0
	cache_dir = make_config.get_path("toolchain/build/gradle")
	ensure_directory(cache_dir)

	directories = []
	directory_names = []
	for directory in make_config.get_filtered_list("compile", prop="type", values=("java",)):
		if "source" not in directory:
			print("skipped invalid java directory json", directory, file=sys.stderr)
			overall_result = -1
			continue

		for path in make_config.get_paths(directory["source"]):
			if not os.path.isdir(path):
				print("skipped non-existing java directory path", directory["source"], file=sys.stderr)
				overall_result = -1
				continue
			directories.append(path)

	if overall_result != 0:
		print("failed to get java directories", file=sys.stderr)
		return overall_result

	if len(directories) > 0:
		classpath_directories = [make_config.get_path("toolchain/classpath")] + make_config.get_value("make.gradle.classpath", [])
		overall_result = build_java_directories(directories, cache_dir, get_classpath_from_directories(classpath_directories))
		if overall_result != 0:
			print(f"failed, clearing compiled directories {directories} ...")
			for directory_name in directory_names:
				clear_directory(make_config.get_path("output/" + directory_name))
	cleanup_gradle_scripts(directories)
	mod_structure.update_build_config_list("javaDirs")

	print(f"completed java build in {int((time.time() - start_time) * 100) / 100}s with result {overall_result} - {'OK' if overall_result == 0 else 'ERROR'}")
	return overall_result


if __name__ == '__main__':
	compile_all_using_make_config()
