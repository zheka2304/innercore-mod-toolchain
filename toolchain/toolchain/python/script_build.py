import sys
from os.path import exists, splitext, basename, isfile, isdir, join
from functools import cmp_to_key

from utils import clear_directory, copy_file, copy_directory
from make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from mod_structure import mod_structure
from includes import Includes

def build_source(source_path, target_path, language, includes_file):
	includes = Includes.invalidate(source_path, includes_file)
	return includes.build(target_path, language)

def build_all_scripts():
	mod_structure.cleanup_build_target("script_source")
	mod_structure.cleanup_build_target("script_library")

	if not exists(TOOLCHAIN_CONFIG.get_path("toolchain/declarations")):
		print("\x1b[93mNot found toolchain/declarations, in most cases build will be failed, please install it via tasks.\x1b[0m")

	return build_all_make_scripts()

def libraries_first(a, b):
	la = a["type"] == "library"
	lb = b["type"] == "library"
	return 0 if la == lb else -1 if la else 1

def build_all_make_scripts(only_tsconfig_rebuild = False):
	overall_result = 0
	sources = MAKE_CONFIG.get_value("sources", fallback=[])
	sources = sorted(sources, key=cmp_to_key(libraries_first))

	for item in sources:
		_source = item["source"]
		_target = item["target"] if "target" in item else None
		_type = item["type"]
		_includes = item["includes"] if "includes" in item else ".includes"

		if _type not in ("main", "launcher", "preloader", "instant", "custom", "library"):
			print(f"Skipped invalid source with type {_type}")
			overall_result = 1
			continue

		for source_path in MAKE_CONFIG.get_paths(_source):
			if not exists(source_path):
				print(f"Skipped non existing source {_source}")
				overall_result = 1
				continue

			target_type = "script_library" if _type == "library" else "script_source"
			target_path = _target if _target is not None else f"{splitext(basename(source_path))[0]}.js"

			# translate make.json source type to build.config source type
			declare = {
				"sourceType": "mod" if _type == "main" else _type
			}

			if "api" in item and _type != "preloader":
				declare["api"] = item["api"]
			if "optimizationLevel" in item:
				declare["optimizationLevel"] = item["optimizationLevel"]
			if "sourceName" in item:
				declare["sourceName"] = item["sourceName"]

			try:
				dot_index = target_path.rindex(".")
				target_path = target_path[:dot_index] + "{}" + target_path[dot_index:]
			except ValueError:
				target_path += "{}"

			if not only_tsconfig_rebuild:
				destination_path = mod_structure.new_build_target(
					target_type,
					target_path,
					source_type=_type,
					declare=declare
				)
			mod_structure.update_build_config_list("compile")
			if not only_tsconfig_rebuild:
				if isfile(source_path):
					copy_file(source_path, destination_path)
				else:
					overall_result += build_source(
						source_path, destination_path,
						item["language"] if "language" in item else "javascript",
						_includes
					)
			elif isdir(source_path):
				from includes import temp_directory
				includes = Includes.invalidate(source_path, _includes)
				includes.create_tsconfig(join(temp_directory, basename(target_path)))

	return overall_result

def build_all_resources():
	mod_structure.cleanup_build_target("resource_directory")
	mod_structure.cleanup_build_target("gui")
	mod_structure.cleanup_build_target("minecraft_resource_pack")
	mod_structure.cleanup_build_target("minecraft_behavior_pack")
	overall_result = 0

	for resource in MAKE_CONFIG.get_value("resources", fallback=[]):
		if "path" not in resource or "type" not in resource:
			print("Skipped invalid source json", resource, file=sys.stderr)
			overall_result = 1
			continue
		for source_path in MAKE_CONFIG.get_paths(resource["path"]):
			if not exists(source_path):
				print("Skipped non existing resource", resource["path"], file=sys.stderr)
				overall_result = 1
				continue
			resource_type = resource["type"]
			if resource_type not in ("resource_directory", "gui", "minecraft_resource_pack", "minecraft_behavior_pack"):
				print("Skipped invalid resource with type", resource_type, file=sys.stderr)
				overall_result = 1
				continue
			resource_name = resource["target"] if "target" in resource else basename(source_path)
			resource_name += "{}"

			if resource_type in ("resource_directory", "gui"):
				target = mod_structure.new_build_target(
					resource_type,
					resource_name,
					declare={
						"resourceType": "resource_directory" if resource_type == "resource" else resource_type
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


if __name__ == "__main__":
	build_all_resources()
	build_all_scripts()
