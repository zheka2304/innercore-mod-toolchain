import glob
import os
import os.path
import sys
import json

from make_config import make_config
from mod_structure import mod_structure
from utils import ensure_file_dir, clear_directory, copy_file, copy_directory, move_file
from os.path import join, exists, splitext, basename, isfile
from includes import Includes

def build_source(source_path, target_path):
	includes = Includes.invalidate(source_path)
	return includes.build(target_path)


def build_all_scripts():
	mod_structure.cleanup_build_target("script_source")
	mod_structure.cleanup_build_target("script_library")
	overall_result = 0

	from functools import cmp_to_key

	def libraries_first(a, b):
		la = a["type"] == "library"
		lb = b["type"] == "library"

		if la == lb:
			return 0
		elif la:
			return -1
		else:
			return 1

	sources = make_config.get_value("sources", fallback=[])
	sources = sorted(sources, key=cmp_to_key(libraries_first))

	for item in sources:
		_source = item["source"]
		_target = item["target"] if "target" in item else None
		_type = item["type"]
		_language = item["language"]

		if _type not in ("main", "launcher", "library", "preloader"):
			print(f"skipped invalid source with type {_type}")
			overall_result = 1
			continue

		for source_path in make_config.get_paths(_source):
			if not exists(source_path):
				print(f"skipped non-existing source path {_source}")
				overall_result = 1
				continue

			target_type = "script_library" if _type == "library" else "script_source"
			target_path = _target if _target is not None else f"{splitext(basename(source_path))[0]}.js"

			# translate make.json source type to build.config source type
			declare = {
				"sourceType": {
					"main": "mod",
					"launcher": "launcher",
					"preloader": "preloader",
					"library": "library"
				}[_type]
			}

			if "api" in item:
				declare["api"] = item["api"]

			try:
				dot_index = target_path.rindex(".")
				target_path = target_path[:dot_index] + "{}" + target_path[dot_index:]
			except ValueError:
				target_path += "{}"

			destination_path = mod_structure.new_build_target(
				target_type,
				target_path,
				source_type=_type,
				declare=declare
			)
			mod_structure.update_build_config_list("compile")

			if (isfile(source_path)):
				copy_file(source_path, destination_path)
			else:
				overall_result += build_source(source_path, destination_path)

	return overall_result


def build_all_resources():
	mod_structure.cleanup_build_target("resource_directory")
	mod_structure.cleanup_build_target("gui")
	mod_structure.cleanup_build_target("minecraft_resource_pack")
	mod_structure.cleanup_build_target("minecraft_behavior_pack")
	overall_result = 0
	
	for resource in make_config.get_value("resources", fallback=[]):
		if "path" not in resource or "type" not in resource:
			print("skipped invalid source json", resource, file=sys.stderr)
			overall_result = 1
			continue
		for source_path in make_config.get_paths(resource["path"]):
			if not exists(source_path):
				print("skipped non-existing resource path", resource["path"], file=sys.stderr)
				overall_result = 1
				continue
			resource_type = resource["type"]
			if resource_type not in ("resource_directory", "gui", "minecraft_resource_pack", "minecraft_behavior_pack"):
				print("skipped invalid resource with type", resource_type, file=sys.stderr)
				overall_result = 1
				continue
			resource_name = resource["target"] if "target" in resource else basename(source_path)
			resource_name += "{}"

			if resource_type in ("resource_directory", "gui"):
				target = mod_structure.new_build_target(
					resource_type,
					resource_name,
					declare={
						"resourceType": {"resource_directory": "resource", "gui": "gui"}[resource_type]
					}
				)
			else:
				target = mod_structure.new_build_target(
					resource_type,
					resource_name,
					exclude=True,
					declare_default={
						"resourcePacksDir": mod_structure.get_target_directories("minecraft_resource_pack")[0],
						"behaviorPacksDir": mod_structure.get_target_directories("minecraft_behavior_pack")[0]
					}
				)
			clear_directory(target)
			copy_directory(source_path, target)
	mod_structure.update_build_config_list("resources")
	return overall_result


if __name__ == '__main__':
	build_all_resources()
	build_all_scripts()
