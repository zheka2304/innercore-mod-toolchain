

import os
import os.path
import sys
import json
from os import getcwd

from base_config import BaseConfig

from utils import clear_directory, copy_directory, ensure_directory, copy_file
import zipfile

root_files = []

def import_mod_info(make_file, directory):
	global root_files
	root_files.append("mod.info")

	mod_info = os.path.join(directory, "mod.info")
	with open(mod_info, "r", encoding="utf-8") as info_file:
		info_obj = json.loads(info_file.read())
		make_file["global"]["info"] = info_obj
		return
	make_file["global"]["info"] = {}


def import_build_config(make_file, source, destination):
	global root_files
	root_files.append("build.config")

	build_config = os.path.join(source, "build.config")
	with open(build_config, "r", encoding="utf-8") as config_file:
		config_obj = json.loads(config_file.read())
		config = BaseConfig(config_obj)
		make_file["global"]["api"] = config.get_value("defaultConfig.api", "CoreEngine")

		src_dir = os.path.join(destination, "src")
		
		# clear assets folder
		assets_dir = os.path.join(src_dir, "assets")
		clear_directory(assets_dir)
		os.makedirs(assets_dir)

		# some pre-defined resource folders
		resources = [
			{
				"path": "src/assets/resource_packs/*",
				"type": "minecraft_resource_pack"
			},
			{
				"path": "src/assets/behavior_packs/*",
				"type": "minecraft_behavior_pack"
			}
		]

		os.makedirs(os.path.join(assets_dir, "resource_packs"))
		os.makedirs(os.path.join(assets_dir, "behavior_packs"))

		# import assets
		for res_dir in config.get_filtered_list("resources", "resourceType", ("resource", "gui")):
			if res_dir["resourceType"] == "resource":
				res_dir["resourceType"] = "resource_directory"
			path_stripped = res_dir["path"].strip('/')
			path_parts = path_stripped.split('/')
			path = os.path.join(*path_parts)
			copy_directory(os.path.join(source, path), os.path.join(assets_dir, path), True)
			resources.append({
				"path": "src/assets/" + path_stripped,
				"type": res_dir["resourceType"]
			})

			root_files.append(path_parts[0])

		make_file["resources"] = resources

		# clear libraries folder and copy libraries from the old project
		libs_dir = os.path.join(destination, "src", "lib")
		clear_directory(libs_dir)
		clear_directory(os.path.join(destination, "src", "dev"))
		os.makedirs(libs_dir)
		old_libs = config.get_value("defaultConfig.libraryDir", "lib").strip('/')
		old_libs_parts = old_libs.split('/')
		old_libs_dir = os.path.join(source, *old_libs_parts)
		if os.path.isdir(old_libs_dir):
			root_files.append(old_libs_parts[0])
			copy_directory(old_libs_dir, libs_dir)
		

		# some pre-defined source folders
		sources = [
			{
				"source": "src/lib/*",
				"type": "library",
				"language": "javascript"
			},
			{
				"source": "src/preloader/*",
				"type": "preloader",
				"language": "javascript"
			}
		]

		ensure_directory(os.path.join(src_dir, "preloader"))

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
			if(len(build_dirs) > 0):
				old_build_path = build_dirs[0]["dir"].strip("/")
				old_path_parts = old_build_path.split('/')
				sourceObj["source"] = "src/" + old_build_path
				sourceObj["target"] = source_dir["path"]
				root_files.append(old_path_parts[0])

				copy_directory(os.path.join(source, *old_path_parts), os.path.join(src_dir, *old_path_parts), True)
				 
			else:
				sourceObj["source"] = "src/" + source_dir["path"]
				copy_file(os.path.join(source, *source_parts), os.path.join(src_dir, *source_parts))

			sources.append(sourceObj)

		make_file["sources"] = sources
		return
	exit("unable to read build.config")


def copy_additionals(source, destination):
	global root_files

	files = os.listdir(source)
	for f in files:
		if f in root_files:
			continue
		src = os.path.join(source, f)
		dest = os.path.join(destination, "src", "assets", "root")

		if(os.path.isfile(src)):
			copy_file(src, os.path.join(dest, f))
		elif(os.path.isdir(src)):
			copy_file(src, os.path.join(dest, f))
		

def init_java_and_native(make_file, directory):
	src_dir = os.path.join(directory, "src")

	sample_native_module = os.path.join(src_dir, "native", "sample")
	if not os.path.exists(sample_native_module):
		print("native sample module is unavailable")

	else:
		res = input("Do you want to initialize a new native directory? [y/N]: ")
		if res.lower() == 'y':
			module_name = input("Enter the new native module name [sample]: ")
			if module_name != "":
				os.rename(sample_native_module,
					os.path.join(src_dir, "native", module_name))
		else:
			if(os.path.isdir(sample_native_module)):
				clear_directory(sample_native_module)


	sample_java_archive = os.path.join(src_dir, "java.zip")
	if(not os.path.exists(sample_java_archive)):
		print("java sample module is unavailable")
	else: 
		res = input("Do you want to initialize a new java directory? [y/N]: ")
		if res.lower() == 'y':
			module_name = input("Enter the new java module name [sample]: ")
			if module_name == "":
				module_name = "sample"

			with zipfile.ZipFile(sample_java_archive, 'r') as zip_ref:
				zip_ref.extractall(os.path.join(src_dir))

			os.rename(os.path.join(src_dir, "java", "sample"),
				os.path.join(src_dir, "java", module_name))

			# write info to .classpath
			import xml.etree.ElementTree as etree
			classpath = os.path.join(directory, ".classpath")
			tree = etree.parse(classpath)
			for classpathentry in tree.getroot():
				if(classpathentry.attrib["kind"] == "src"):
					classpathentry.attrib["path"] = "src/java/" + module_name + "/src"

			tree.write(classpath, encoding="utf-8", xml_declaration=True)
			
		else:
			if(os.path.isfile(sample_java_archive)):
				os.remove(sample_java_archive)


def cleanup_if_required(directory):
	res = input("Do you want to clean up the project? [Y/n]: ")
	if res.lower() == 'n':
		return

	to_remove = [
		"toolchain-setup.py",
		"toolchain-import.py",
		"toolchain.zip"
	]
	for f in to_remove:
		path = os.path.join(directory, f)
		if(os.path.exists(path)):
			os.remove(path)



def init_adb(make_file, dirname):
	pack_name = input("Enter your pack directory name [Inner_Core]: ")
	if pack_name == "":
		pack_name = "Inner_Core"

	make_file["make"]["pushTo"] = "storage/emulated/0/games/horizon/packs/" + pack_name + "/innercore/mods/" + dirname


print("running project import script")


destination = sys.argv[1]
source = sys.argv[2]
make_path = os.path.join(destination, "make.json")


if not (os.path.exists(make_path) and os.path.exists(source)):
	exit("invalid arguments passed to import script, usage: \r\npython import.py <destination> <source>")

with open(make_path, "r", encoding="utf-8") as make_file:
	make_obj = json.loads(make_file.read())

if(source == '.'):
	dirname = os.path.basename(os.getcwd())
else:
	dirname = os.path.basename(source)

init_adb(make_obj, dirname)
print("importing mod.info")
import_mod_info(make_obj, source)
print("importing build.config")
import_build_config(make_obj, source, destination)
print("copying additional files and directories")
copy_additionals(source, destination)
print("initializing java and native modules")
init_java_and_native(make_obj, destination)
cleanup_if_required(destination)


with open(make_path, "w", encoding="utf-8") as make_file:
	make_file.write(json.dumps(make_obj, indent=" " * 4))

print("project successfully imported, please, delete project.back after triple checking that everything is OK")