from glob import glob
import os
from os.path import exists, join, basename, isfile, isdir, relpath
import sys
import json

from utils import copy_directory, copy_file, ensure_directory, get_project_folder_by_name
from base_config import BaseConfig

def load_mod_info(make_obj, directory):
	mod_info = join(directory, "mod.info")
	mod_info_obj = {
		"name": basename(directory if directory != "." else os.getcwd())
	} if not "info" in make_obj else make_obj["info"]
	if not isfile(mod_info):
		make_obj["info"] = mod_info_obj
		return

	with open(mod_info, "r", encoding="utf-8") as mod_info_file:
		mod_info_prototype = json.loads(mod_info_file.read())
		if "name" in mod_info_prototype:
			mod_info_obj["name"] = mod_info_prototype["name"]
		if "version" in mod_info_prototype:
			mod_info_obj["version"] = mod_info_prototype["version"]
		if "author" in mod_info_prototype:
			mod_info_obj["author"] = mod_info_prototype["author"]
		if "description" in mod_info_prototype:
			mod_info_obj["description"] = mod_info_prototype["description"]
		if "instantLaunch" in mod_info_prototype:
			mod_info_obj["instantLaunch"] = mod_info_prototype["instantLaunch"]
	make_obj["info"] = mod_info_obj

def load_build_config(make_obj, source, destination):
	build_config = join(source, "build.config")
	destination_copy_tuples = []
	if not isfile(build_config):
		return destination_copy_tuples

	with open(build_config, "r", encoding="utf-8") as build_config_file:
		build_config_obj = json.loads(build_config_file.read())
		config = BaseConfig(build_config_obj)

		default_config_api = config.get_value("defaultConfig.api")
		if default_config_api is not None or not "api" in make_obj:
			make_obj["api"] = default_config_api if default_config_api is not None else "CoreEngine"
		default_config_optimization_level = config.get_value("defaultConfig.optimizationLevel")
		if default_config_optimization_level is not None:
			make_obj["optimizationLevel"] = default_config_optimization_level
		default_config_setup_script = config.get_value("defaultConfig.setupScript")
		if default_config_setup_script is not None:
			make_obj["setupScript"] = default_config_setup_script
			destination_copy_tuples.append((join(source, default_config_setup_script), join(destination, default_config_setup_script)))

		assets_dir = join(destination, "assets")
		if not "resources" in make_obj:
			make_obj["resources"] = []

		for directory in config.get_filtered_list("resources", "resourceType", ("resource", "gui")):
			if directory["resourceType"] == "resource":
				directory["resourceType"] = "resource_directory"
			path_stripped = directory["path"].strip("/")
			path = join(*path_stripped.split("/"))
			destination_copy_tuples.append((join(source, path), join(assets_dir, path)))
			make_obj["resources"].append({
				"path": "assets/" + path_stripped,
				"type": directory["resourceType"]
			})

		libs = config.get_value("defaultConfig.libraryDir", "lib").strip("/")
		libs_directory = join(source, *libs.split("/"))
		if isdir(libs_directory):
			destination_copy_tuples.append((libs_directory, join(destination, "lib")))
			if not "sources" in make_obj or len(make_obj["sources"]) == 0:
				make_obj["sources"] = [
					{
						"source": "lib/*",
						"type": "library",
						"language": "javascript"
					}
				]
		elif not "sources" in make_obj:
			make_obj["sources"] = []

		for directory in config.get_filtered_list("compile", "sourceType", ("mod", "launcher", "preloader", "instant", "custom", "library")):
			if directory["sourceType"] == "mod":
				directory["sourceType"] = "main"
			toolchain_source = {
				"type": directory["sourceType"],
				"language": "javascript"
			}
			if "api" in directory:
				toolchain_source["api"] = directory["api"]
			if "optimizationLevel" in directory:
				toolchain_source["optimizationLevel"] = directory["optimizationLevel"]
			if "sourceName" in directory:
				toolchain_source["sourceName"] = directory["sourceName"]
			path_stripped = directory["path"].split("/")
			build_dirs = config.get_filtered_list("buildDirs", "targetSource", (directory["path"]))
			if len(build_dirs) > 0:
				toolchain_source["source"] = build_dirs[0]["dir"].strip("/")
				build_path_stripped = toolchain_source["source"].split("/")
				toolchain_source["target"] = directory["path"]
				destination_copy_tuples.append((join(source, *build_path_stripped), join(destination, *build_path_stripped)))
			else:
				toolchain_source["source"] = directory["path"]
				destination_copy_tuples.append((join(source, *path_stripped), join(destination, *path_stripped)))
			make_obj["sources"].append(toolchain_source)

		if not "compile" in make_obj:
			make_obj["compile"] = []

		for directory in config.get_value("javaDirs", []):
			path_stripped = directory["path"].strip("/")
			path = join(source, *path_stripped.split("/"))
			destination_copy_tuples.append((path, join(destination, "java", basename(path))))
			make_obj["compile"].append({
				"source": "java/" + basename(path),
				"type": "java"
			})

		for directory in config.get_value("nativeDirs", []):
			path_stripped = directory["path"].strip("/")
			path = join(source, *path_stripped.split("/"))
			destination_copy_tuples.append((path, join(destination, "native", basename(path))))
			make_obj["compile"].append({
				"source": "native/" + basename(path),
				"type": "native"
			})

		if not "additional" in make_obj or len(make_obj["additional"]) == 0:
			make_obj["additional"] = [
				{
					"source": "assets/root/*",
					"targetDir": "."
				}
			]

	return destination_copy_tuples

def copy_tuple_directories(tuples, source, destination):
	ignore_list = [".dex", "make.json", "mod_icon.png", "mod.info", "build.config", "assets/root"]
	for path, output in tuples:
		if path == output:
			continue
		if isfile(path) and (not exists(output) or isfile(output)):
			if exists(output):
				print("Replacing", basename(output))
			copy_file(path, output)
		elif isdir(path) and (not exists(output) or isdir(output)):
			if exists(output):
				print("Merging", basename(output))
			copy_directory(path, output)
		else:
			print("Destination and input", basename(path), "pathes conflicts!")
		ignore_list.append(relpath(path, source))
	mod_icon = join(source, "mod_icon.png")
	if exists(mod_icon) and isfile(mod_icon):
		copy_file(mod_icon, join(destination, "mod_icon.png"))
	for file in glob(join(source, "*.md")):
		if exists(file) and isfile(file):
			relative_path = relpath(file, source)
			copy_file(file, join(destination, relative_path))
			ignore_list.append(relative_path)
	git = join(source, "LICENSE")
	if exists(git) and isfile(git):
		copy_file(git, join(destination, "LICENSE"))
		ignore_list.append("LICENSE")
	git = join(source, ".gitignore")
	if exists(git) and isfile(git):
		copy_file(git, join(destination, ".gitignore"))
	git = join(source, ".git")
	if exists(git) and isdir(git):
		copy_directory(git, join(destination, ".git"))
		ignore_list.append(".git")
	github = join(source, ".github")
	if exists(github) and isdir(github):
		copy_directory(github, join(destination, ".github"))
		ignore_list.append(".github")
	additional_path = join(destination, "assets", "root")
	copy_directory(source, additional_path, ignore_list=ignore_list)
	for dirpath, dirnames, filenames in os.walk(additional_path, False):
		for dirname in dirnames:
			directory = join(dirpath, dirname)
			if len(os.listdir(directory)) == 0:
				os.rmdir(directory)
	if len(os.listdir(additional_path)) == 0:
		os.removedirs(additional_path)

def merge_json(left, right):
	if not isinstance(right, dict):
		return right
	for key in right:
		if isinstance(left[key], list) and isinstance(right[key], list):
			left[key].extend(right[key])
			continue
		left[key] = merge_json(left[key], right[key])
	return right

def import_project(path = None, destination = None):
	if path is None:
		print("Specify absolute or relative path to toolchain folder that must be imported as project, it may be Inner Core mod or already exists Mod Toolchain folder.")
		try:
			path = input("Which directory will be imported? ")
		except KeyboardInterrupt:
			print("Abort.")
			exit(0)
	destination_may_changed = destination is None
	if destination_may_changed:
		from make_config import TOOLCHAIN_CONFIG
		toolchain = TOOLCHAIN_CONFIG.root_dir
		destination = join(toolchain, get_project_folder_by_name(toolchain, basename(path)))

	if exists(path) and isfile(path):
		path = join(path, "..")
	if not isdir(path):
		print("Input path not exists or specified!")
		exit(1)
	if exists(destination) and isfile(destination):
		print("Destination path is file!")
		exit(2)
	if not (isfile(join(path, "build.config")) or isfile(join(path, "make.json"))):
		print("Not found build.config or make.json entry to import, nothing to do!")
		exit(3)
	print(f"Importing '{path}' into {basename(destination)}")
	make_obj = {}

	if destination_may_changed:
		make = join(path, "make.json")
		if exists(make) and isfile(make):
			print("Reading make.json to resolve destination")
			with open(make, "r", encoding="utf-8") as make_file:
				make_obj = json.loads(make_file.read())

		print("Resolving mod.info to resolve destination")
		load_mod_info(make_obj, path)

		potential_name = make_obj["info"]["name"] if "info" in make_obj and "name" in make_obj["info"] else None
		if potential_name is not None:
			potential_name = get_project_folder_by_name(toolchain, potential_name)
			if potential_name != basename(destination):
				destination = join(toolchain, potential_name)
				print(f"Output directory changed to {potential_name}")

	make_project = join(destination, "make.json")
	if isfile(make_project):
		print("Reading output make.json")
		with open(make_project, "r", encoding="utf-8") as make_file:
			make_obj = json.loads(make_file.read())

	if not destination_may_changed or isfile(make_project):
		make = join(path, "make.json")
		if exists(make) and isfile(make):
			print("Merging with existing make.json")
			with open(make, "r", encoding="utf-8") as make_file:
				make_obj = merge_json(make_obj, json.loads(make_file.read()))

		print("Resolving mod.info")
		load_mod_info(make_obj, path)

	print("Resolving build.config")
	tuples = load_build_config(make_obj, path, destination)

	print("Flushing make.json")
	ensure_directory(destination)
	with open(make_project, "w", encoding="utf-8") as make_file:
		make_file.write(json.dumps(make_obj, indent="\t") + "\n")

	try:
		if destination == path and input("Do you want to copy reassigned directories in directory itself? [N/y] ")[:1].lower() != "y":
			print("Abort.")
			exit(0)
	except KeyboardInterrupt:
		print("Abort.")
		exit(0)

	print("Copying files and directories")
	copy_tuple_directories(tuples, path, destination)

	return destination


if __name__ == "__main__":
	if "--help" in sys.argv:
		print("Usage: import.py <path> [destination]")
		print("Performs conversion between mod.info, build.config and make.json,")
		print("merges directories if few configurations exists.")
		exit(0)

	import_project(sys.argv[1] if len(sys.argv) > 1 else None, sys.argv[2] if len(sys.argv) > 2 else None)
	print("Project successfully imported!")
