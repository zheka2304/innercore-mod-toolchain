from os.path import basename, exists, isfile, join

from . import GLOBALS
from .shell import error, warn
from .utils import copy_directory, copy_file, ensure_directory, remove_tree

VALID_RESOURCE_TYPES = ("resource_directory", "gui", "minecraft_resource_pack", "minecraft_behavior_pack")


def build_resources() -> int:
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("resource_directory")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("gui")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("minecraft_resource_pack")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("minecraft_behavior_pack")
	overall_result = 0

	for resource in GLOBALS.MAKE_CONFIG.get_value("resources", fallback=list()):
		if "path" not in resource or "type" not in resource:
			error("Skipped invalid source json ", resource, ", it might contain `path` and `type` properties!", sep="")
			overall_result = 1
			continue

		for source_path in GLOBALS.MAKE_CONFIG.get_paths(resource["path"]):
			if not exists(source_path):
				warn(f"* Skipped non-existing resource {resource['path']}!", sep="")
				continue

			resource_type = resource["type"]
			if resource_type not in VALID_RESOURCE_TYPES:
				error(f"Invalid resource `type` in source: {resource_type}, it might be one of {VALID_RESOURCE_TYPES}.", sep="")
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
