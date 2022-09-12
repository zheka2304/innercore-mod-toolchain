import os
from os.path import exists, join, basename, isfile, isdir
import sys
import json

from base_config import BaseConfig
import platform

from utils import clear_directory, copy_directory, ensure_directory, copy_file
from setup_commons import init_adb, init_java_and_native, cleanup_if_required
from project_manager import projectManager
from setup import set_last_update


root_files = []

def import_mod_info(make_file, directory):
	global root_files
	root_files.append("mod.info")

	mod_info = join(directory, "mod.info")

	if not exists(mod_info):
		from project_manager_tasks import create_project
		folder = create_project(True)
		projectManager.selectProject(folder = folder)
		return folder

	with open(mod_info, "r", encoding="utf-8") as info_file:
		info_obj = json.loads(info_file.read())
		index = projectManager.createProject(info_obj.get('name', "example-project"),
			author = info_obj.get('author', ""),
			version = info_obj.get('version', "1.0"),
			description = info_obj.get('description', ""))
		projectManager.selectProject(index = index)
		return projectManager.getFolder(index = index)[1]

def import_build_config(make_file, folder, source, destination):
	global root_files
	root_files.append("build.config")

	build_config = join(source, "build.config")
	if not exists(build_config):
		exit("unable to read build.config")
	with open(build_config, "r", encoding="utf-8") as config_file:
		config_obj = json.loads(config_file.read())
		config = BaseConfig(config_obj)
		make_file["info"]["api"] = config.get_value("defaultConfig.api", "CoreEngine")

		src_dir = join(destination, folder)

		# clear assets folder
		assets_dir = join(src_dir, "assets")
		clear_directory(assets_dir)
		os.makedirs(assets_dir)

		# some pre-defined resource folders
		resources = [
			{
				"path": "assets/resource_packs/*",
				"type": "minecraft_resource_pack"
			},
			{
				"path": "assets/behavior_packs/*",
				"type": "minecraft_behavior_pack"
			}
		]

		os.makedirs(join(assets_dir, "resource_packs"))
		os.makedirs(join(assets_dir, "behavior_packs"))

		# import assets
		for res_dir in config.get_filtered_list("resources", "resourceType", ("resource", "gui")):
			if res_dir["resourceType"] == "resource":
				res_dir["resourceType"] = "resource_directory"
			path_stripped = res_dir["path"].strip('/')
			path_parts = path_stripped.split('/')
			path = join(*path_parts)
			copy_directory(join(source, path), join(assets_dir, path), True)
			resources.append({
				"path": "assets/" + path_stripped,
				"type": res_dir["resourceType"]
			})

			root_files.append(path_parts[0])

		make_file["resources"] = resources

		# clear libraries folder and copy libraries from the old project
		libs_dir = join(destination, folder, "lib")
		clear_directory(libs_dir)
		clear_directory(join(destination, folder, "dev"))
		os.makedirs(libs_dir)
		old_libs = config.get_value("defaultConfig.libraryDir", "lib").strip('/')
		old_libs_parts = old_libs.split('/')
		old_libs_dir = join(source, *old_libs_parts)
		if isdir(old_libs_dir):
			root_files.append(old_libs_parts[0])
			copy_directory(old_libs_dir, libs_dir)

		# some pre-defined source folders
		sources = [
			{
				"source": "lib/*",
				"type": "library",
				"language": "javascript"
			},
			{
				"source": "preloader/*",
				"type": "preloader",
				"language": "javascript"
			}
		]

		ensure_directory(join(src_dir, "preloader"))

		# import sources
		for source_dir in config.get_filtered_list("compile", "sourceType", ("mod", "launcher")):
			if source_dir["sourceType"] == "mod": 
				source_dir["sourceType"] = "main"

			sourceObj = {
				"type": source_dir["sourceType"],
				"language": "javascript"
			}

			source_parts = source_dir["path"].split('/')
			root_files.append(source_parts[0])

			build_dirs = config.get_filtered_list("buildDirs", "targetSource", (source_dir["path"]))
			if len(build_dirs) > 0:
				old_build_path = build_dirs[0]["dir"].strip("/")
				old_path_parts = old_build_path.split('/')
				sourceObj["source"] = old_build_path
				sourceObj["target"] = source_dir["path"]
				root_files.append(old_path_parts[0])

				copy_directory(join(source, *old_path_parts), join(src_dir, *old_path_parts), True)

			else:
				sourceObj["source"] = source_dir["path"]
				copy_file(join(source, *source_parts), join(src_dir, *source_parts))

			sources.append(sourceObj)

		make_file["sources"] = sources
		return

def copy_additionals(source, folder, destination):
	global root_files

	files = os.listdir(source)
	for f in files:
		if f in root_files:
			continue
		src = join(source, f)
		dest = join(destination, folder, "assets", "root")

		if isfile(src):
			copy_file(src, join(dest, f))
		elif isdir(src):
			copy_file(src, join(dest, f))

print("running project import script")

destination = sys.argv[1]
source = sys.argv[2]
toolchain_path = join(destination, "toolchain.json")

if not (exists(toolchain_path) and exists(source)):
	exit("invalid arguments passed to import script, usage: \r\n" + ("python" if platform.system() == "Windows" else "python3") + " import.py <destination> <source>")

with open(toolchain_path, "r", encoding="utf-8") as make_file:
	make_obj = json.loads(make_file.read())

if source == '.':
	dirname = basename(os.getcwd())
else:
	dirname = basename(source)

init_adb(make_obj, dirname)

print("importing mod.info")
folder = import_mod_info(make_obj, source)
with open(projectManager.config.get_project_path("make.json"), "r", encoding="utf-8") as make_file:
	make_project_obj = json.loads(make_file.read())

print("importing build.config")
import_build_config(make_project_obj, folder, source, destination)

with open(projectManager.config.get_project_path("make.json"), "w", encoding="utf-8") as make_file:
	make_file.write(json.dumps(make_project_obj, indent=" " * 4))

print("copying additional files and directories")
copy_additionals(source, folder, destination)
print("initializing java and native modules")
init_java_and_native(make_obj, destination)
cleanup_if_required(destination)

with open(toolchain_path, "w", encoding="utf-8") as make_file:
	make_file.write(json.dumps(make_obj, indent=" " * 4))

set_last_update()

print("project successfully imported, please, delete project.back after triple checking that everything is OK")
