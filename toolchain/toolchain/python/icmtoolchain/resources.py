import json
import os
from os.path import basename, exists, isdir, isfile, join
from shutil import make_archive

from . import GLOBALS
from .base_config import BaseConfig
from .make_config import ToolchainConfig
from .shell import error, warn
from .utils import (copy_directory, copy_file, ensure_directory, ensure_file,
                    ensure_file_directory, remove_tree, shortcodes)

VALID_RESOURCE_TYPES = ("resource_directory", "gui", "minecraft_resource_pack", "minecraft_behavior_pack")


def build_resources() -> int:
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("resource_directory")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("gui")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("minecraft_resource_pack")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("minecraft_behavior_pack")
	overall_result = 0

	for resource in GLOBALS.MAKE_CONFIG.get_value("resources", fallback=list()):
		if "path" not in resource or "type" not in resource:
			error(f"Skipped invalid resource json {resource}, it might contain `path` and `type` properties!")
			overall_result = 1
			continue

		for source_path in GLOBALS.MAKE_CONFIG.get_paths(resource["path"]):
			if not exists(source_path):
				warn(f"* Skipped non-existing resource {resource['path']!r}!")
				continue

			resource_type = resource["type"]
			if resource_type not in VALID_RESOURCE_TYPES:
				error(f"Invalid resource `type` in resource: {resource_type}, it might be one of {VALID_RESOURCE_TYPES}!")
				overall_result = 1
				continue

			resource_name = resource["target"] if "target" in resource else basename(source_path)
			resource_name += "{}"

			if resource_type in ("resource_directory", "gui"):
				target = GLOBALS.MOD_STRUCTURE.new_build_target(
					resource_type,
					resource_name,
					declare={
						"resourceType": "resource" if resource_type == "resource_directory" else resource_type
					}
				)
			else:
				target = GLOBALS.MOD_STRUCTURE.new_build_target(
					resource_type,
					resource_name,
					exclude=True,
					declare_default={
						"resourcePacksDir": GLOBALS.MOD_STRUCTURE.get_target_directories("minecraft_resource_pack")[0],
						"behaviorPacksDir": GLOBALS.MOD_STRUCTURE.get_target_directories("minecraft_behavior_pack")[0]
					}
				)

			remove_tree(target)
			copy_directory(source_path, target)

	GLOBALS.MOD_STRUCTURE.update_build_config_list("resources")
	return overall_result

def build_pack_graphics() -> int:
	graphics_archive = join(GLOBALS.MOD_STRUCTURE.directory, "graphics.zip")
	if exists(graphics_archive):
		remove_tree(graphics_archive)
	graphics_groups = GLOBALS.MAKE_CONFIG.get_value("pack.graphics")
	if not isinstance(graphics_groups, dict):
		return 0

	graphics_directory = GLOBALS.MAKE_CONFIG.get_build_path("graphics")
	remove_tree(graphics_directory)
	ensure_directory(graphics_directory)

	for name, images in graphics_groups.items():
		offset = 1
		if isinstance(images, str):
			images = [images]
		for image_directory in images:
			for image_path in GLOBALS.MAKE_CONFIG.get_paths(image_directory):
				if not isfile(image_path):
					warn(f"* Skipping graphics image file {basename(image_path)}, cause it does not exists!")
					continue
				copy_file(image_path, join(graphics_directory, f"{name}@{offset}.png"))
				offset += 1

	from shutil import make_archive
	make_archive(graphics_archive[:-4], "zip", graphics_directory)
	print(f"Composed a pack with graphics from {len(graphics_groups.keys())} groups!")
	return 0

def build_additional_resources(push_directly: bool = False) -> int:
	overall_result = 0

	for additional_dir in GLOBALS.MAKE_CONFIG.get_value("additional", fallback=list()):
		if "source" not in additional_dir or "targetDir" not in additional_dir:
			error(f"Skipped invalid additional resource json {additional_dir}, it might contain `source` and `targetDir` properties!")
			overall_result += 1
			continue
		for additional_path in GLOBALS.MAKE_CONFIG.get_paths(additional_dir["source"]):
			if not exists(additional_path):
				warn(f"* Skipped non-existing additional resource {additional_path!r}!")
				break
			target = join(
				GLOBALS.MOD_STRUCTURE.directory, additional_dir["targetDir"],
				additional_dir["targetFile"] if "targetFile" in additional_dir else basename(additional_path)
			)
			if isdir(additional_path):
				copy_directory(additional_path, target)
			else:
				copy_file(additional_path, target)

	return overall_result

def write_mod_info_file() -> int:
	info_file = join(GLOBALS.MOD_STRUCTURE.directory, "mod.info")
	with open(GLOBALS.MAKE_CONFIG.get_path(info_file), "w", encoding="utf-8") as info_file:
		info = GLOBALS.MAKE_CONFIG.get_config("info") or BaseConfig()
		if info.has_value("name"):
			info.set_value("name", shortcodes(info.get_value("name")))
		if info.has_value("version"):
			info.set_value("version", shortcodes(info.get_value("version")))
		if info.has_value("description"):
			info.set_value("description", shortcodes(info.get_value("description")))
		info.remove_value("icon")
		info_file.write(json.dumps(info.json, indent="\t", ensure_ascii=False) + "\n")

	optional_icon_path = GLOBALS.MAKE_CONFIG.get_value("info.icon")
	icon_path = GLOBALS.MAKE_CONFIG.get_absolute_path(optional_icon_path or "mod_icon.png")
	if isfile(icon_path):
		output_info_path = join(GLOBALS.MOD_STRUCTURE.directory, "mod_icon.png")
		copy_file(icon_path, output_info_path)
	elif optional_icon_path:
		warn(f"* Icon {icon_path!r} described in 'make.json' is not found!")
	return 0

def write_manifest_file() -> int:
	manifest_relative_path = GLOBALS.MAKE_CONFIG.get_value("manifest")
	manifest_file = GLOBALS.MAKE_CONFIG.get_path(manifest_relative_path)
	if not isfile(manifest_file):
		error(f"Manifest file {manifest_relative_path} does not exist, aborting!")
		return 1
	manifest = ToolchainConfig(manifest_file)
	if manifest.has_value("pack"):
		manifest.set_value("pack", shortcodes(manifest.get_value("pack")))
	if manifest.has_value("packVersion"):
		manifest.set_value("packVersion", shortcodes(manifest.get_value("packVersion")))
	if manifest.has_value("description"):
		description = manifest.get_value("description")
		if isinstance(description, dict):
			for key, value in description.items():
				description[key] = shortcodes(value)
		else:
			manifest.set_value("description", shortcodes(description))
	output_manifest_path = join(GLOBALS.MOD_STRUCTURE.directory, "manifest.json")
	with open(output_manifest_path, "w", encoding="utf-8") as manifest_file:
		manifest_file.write(json.dumps(manifest.json, indent="\t", ensure_ascii=False) + "\n")
	return 0

def build_package() -> int:
	requires_manifest = GLOBALS.MAKE_CONFIG.has_value("manifest")
	name = basename(GLOBALS.MAKE_CONFIG.current_project)
	output_directory = GLOBALS.MAKE_CONFIG.get_build_path("package")

	output_package_directory = join(output_directory, name)
	remove_tree(output_package_directory)

	output_temporary_file = join(output_directory, "package.zip")
	ensure_file_directory(output_temporary_file)

	output_file = GLOBALS.MAKE_CONFIG.get_path(name + ".zip" if requires_manifest else name + ".icmod")
	ensure_file(output_file)
	remove_tree(output_temporary_file)
	copy_directory(GLOBALS.MOD_STRUCTURE.directory, output_package_directory)
	make_archive(output_temporary_file[:-4], "zip", output_directory, name)

	remove_tree(output_package_directory)
	os.rename(output_temporary_file, output_file)
	return 0
