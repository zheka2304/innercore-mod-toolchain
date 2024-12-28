from functools import cmp_to_key
from os.path import basename, exists, isdir, isfile, join, relpath, splitext
from typing import Any, Dict, List, Tuple

from . import GLOBALS, PROPERTIES
from .includes import Includes
from .shell import debug, error, info, warn
from .utils import (RuntimeCodeError, copy_directory, copy_file,
                    ensure_directory, remove_tree, request_typescript,
                    walk_all_files)

VALID_SOURCE_TYPES = ("main", "launcher", "preloader", "instant", "custom", "library")
VALID_RESOURCE_TYPES = ("resource_directory", "gui", "minecraft_resource_pack", "minecraft_behavior_pack")


def build_all_scripts(watch: bool = False) -> int:
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("script_source")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("script_library")

	if request_typescript(only_check=True) and not exists(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/declarations")):
		warn("Not found 'toolchain/declarations', in most cases build will be failed, please install it via tasks.")

	overall_result = 0
	for source in GLOBALS.MAKE_CONFIG.get_value("sources", list()):
		if "source" not in source or "type" not in source:
			error(f"Invalid source json {source!r}, it might contain `source` and `type` properties!")
			overall_result = 1
			continue
		if source["type"] not in VALID_SOURCE_TYPES:
			error(f"Invalid script `type` in source: {source['type']}, it might be one of {VALID_SOURCE_TYPES}.")
			overall_result = 1
		if "language" in source:
			if not source["language"] in ("javascript", "typescript"):
				error(f"Invalid source `language` property: {source['language']}, it should be 'javascript' or 'typescript'!")
				overall_result = 1
	if overall_result != 0:
		return overall_result

	overall_result += build_composite_project() if not watch else watch_composite_project()
	return overall_result

def rebuild_build_target(source, target_path: str) -> str:
	declare = {
		# make.json source type -> build.config source type
		"sourceType": "mod" if source["type"] == "main" else "custom" if source["type"] == "instant" else source["type"]
	}

	if "api" in source and source["type"] != "preloader":
		declare["api"] = source["api"]
	if "optimizationLevel" in source:
		declare["optimizationLevel"] = min(max(int(source["optimizationLevel"]), -1), 9)
	if "sourceName" in source:
		declare["sourceName"] = source["sourceName"]

	target_type = "script_library" if source["type"] == "library" else "script_source"
	return GLOBALS.MOD_STRUCTURE.new_build_target(
		target_type,
		target_path,
		source_type=source["type"],
		declare=declare
	)

def do_sorting(a: Dict[Any, Any], b: Dict[Any, Any]) -> int:
	la = a["type"] == "library"
	lb = b["type"] == "library"
	return 0 if la == lb else -1 if la else 1

def compute_and_capture_changed_scripts() -> Tuple[List[Tuple[str, str, str]], List[Tuple[str, str, str]], List[Tuple[Includes, str, str]], List[Tuple[str, str]]]:
	composite = list()
	computed_composite = list()
	includes = list()
	computed_includes = list()

	for source in sorted(GLOBALS.MAKE_CONFIG.get_value("sources", list()), key=cmp_to_key(do_sorting)):
		make = source["includes"] if "includes" in source else ".includes"
		preffered_language = source["language"] if "language" in source else None

		for source_path in GLOBALS.MAKE_CONFIG.get_paths(source["source"]):
			if not exists(source_path):
				warn(f"* Skipped non-existing source {GLOBALS.MAKE_CONFIG.get_relative_path(source_path)!r}!")
				continue

			# Supports assembling directories, JavaScript and TypeScript
			preffered_typescript = False
			if not isdir(source_path):
				preffered_typescript = source_path.endswith(".ts")
				if not preffered_typescript and not source_path.endswith(".js"):
					warn(f"* Unsupported script {GLOBALS.MAKE_CONFIG.get_relative_path(source_path)!r}, it should be directory with includes or Java/TypeScript file!")
					continue
			else:
				try:
					def walk(file: str) -> None:
						if file.endswith(".ts") and not file.endswith(".d.ts"):
							raise RuntimeError()
					walk_all_files(source_path, walk)
				except RuntimeError:
					preffered_typescript = True

			language = preffered_language or ("typescript" if preffered_typescript else "javascript")
			if language == "typescript" and not request_typescript():
				if preffered_typescript:
					raise RuntimeCodeError(255, f"We cannot compile source {GLOBALS.MAKE_CONFIG.get_relative_path(source_path)!r} without you having Node.js, despite `denyTypeScript` property of your 'toolchain.json' being active. Please disable it and install Node.js to compile TypeScript sources.")
				warn(f"* Source {GLOBALS.MAKE_CONFIG.get_relative_path(source_path)!r} specifies target language as TypeScript, so this script probably uses ESNext capabilities. Build as normal JavaScript files, since `denyTypeScript` property of your 'toolchain.json' is active.")
				language = "javascript"

			# Using template <sourceName>.<extension> -> <sourceName>, e.g. main.js -> main
			if "target" not in source:
				target_path = basename(source_path)
				if isfile(source_path):
					target_path = splitext(target_path)[0]
				target_path += ".js"
			else:
				target_path = source["target"]

			# Preserve output target duplication
			try:
				dot_index = target_path.rindex(".")
				target_path = target_path[:dot_index] + "{}" + target_path[dot_index:]
			except ValueError:
				target_path += "{}"

			destination_path = rebuild_build_target(source, target_path)
			appending_library = GLOBALS.MAKE_CONFIG.get_value("project.compiledLibraries", False) \
				and source["type"] == "library" and preffered_language == "javascript"

			if isdir(source_path):
				include = Includes.invalidate(source_path, make)
				# Computing in any case, tsconfig normalises environment usage
				if include.compute(destination_path, "typescript" if not appending_library else "javascript"):
					includes.append((
						include,
						destination_path,
						"javascript" if appending_library else language
					))
				if not appending_library and GLOBALS.MAKE_CONFIG.get_value("project.useReferences", False) and language == "typescript":
					GLOBALS.WORKSPACE_COMPOSITE.reference(source_path)
				computed_includes.append((
					source_path, destination_path
				))

			elif isfile(source_path):
				if not appending_library:
					if GLOBALS.MAKE_CONFIG.get_value("project.composite", True) and language == "typescript":
						GLOBALS.WORKSPACE_COMPOSITE.coerce(source_path)
					if GLOBALS.BUILD_STORAGE.is_path_changed(source_path) or (
						language == "typescript" and not isfile(
							join(GLOBALS.MAKE_CONFIG.get_build_path("sources"), relpath(source_path, GLOBALS.MAKE_CONFIG.directory))
						)
					):
						composite.append((source_path, destination_path, language))
				computed_composite.append((
					source_path, destination_path, "javascript" if appending_library else language
				))

	return composite, computed_composite, includes, computed_includes

def copy_build_targets(composite: List[Tuple[str, str, str]], includes: List[Tuple[str, str]]) -> None:
	temporary_directory = GLOBALS.MAKE_CONFIG.get_build_path("sources")

	for included in includes:
		temporary_script = join(temporary_directory, basename(included[1]))

		if not isfile(temporary_script) or GLOBALS.BUILD_STORAGE.is_path_changed(temporary_script) or not isfile(included[1]):
			if isfile(temporary_script):
				copy_file(temporary_script, included[1])
			else:
				warn(f"* Not found build target {basename(temporary_script)!r}, maybe it building emitted error or corresponding source is empty.")
				continue

		if not GLOBALS.BUILD_STORAGE.is_path_changed(temporary_script):
			info(f"* Build target {basename(temporary_script)!r} is not changed.")

	for included in composite:
		# Single JavaScript sources when TypeScript is not forced just copies to output without
		# temporary caching; might be breaking change in future.
		if GLOBALS.MAKE_CONFIG.get_value("project.composite", True) and included[2] != "javascript":
			temporary_script = join(temporary_directory, relpath(included[0], GLOBALS.MAKE_CONFIG.directory))
		else:
			temporary_script = included[0]

		if temporary_script == included[0] and isfile(temporary_script) and GLOBALS.BUILD_STORAGE.is_path_changed(temporary_script):
			print(f"Flushing {basename(included[1])!r} from {basename(included[0])!r}")

		if not isfile(temporary_script) or GLOBALS.BUILD_STORAGE.is_path_changed(temporary_script) or not isfile(included[1]):
			if isfile(temporary_script):
				copy_file(temporary_script, included[1])
			else:
				warn(f"* Not found build target {basename(temporary_script)!r}, but it directly included!")
				continue

		if not GLOBALS.BUILD_STORAGE.is_path_changed(temporary_script):
			info(f"* Build target {basename(temporary_script)!r} is not changed.")

	GLOBALS.BUILD_STORAGE.save()

def build_composite_project() -> int:
	overall_result = 0

	composite, computed_composite, includes, computed_includes = compute_and_capture_changed_scripts()

	if request_typescript(only_check=True):
		GLOBALS.WORKSPACE_COMPOSITE.flush()
	for included in includes:
		if not GLOBALS.MAKE_CONFIG.get_value("project.useReferences", False) or included[2] == "javascript":
			overall_result += included[0].build(included[1], included[2])
	if overall_result != 0:
		return overall_result

	if request_typescript(only_check=True) \
		and (GLOBALS.MAKE_CONFIG.get_value("project.composite", True) \
			or GLOBALS.MAKE_CONFIG.get_value("project.useReferences", False)):

		which = list()
		if GLOBALS.MAKE_CONFIG.get_value("project.composite", True):
			which += list(filter(lambda included: included[2] == "typescript", composite))

		no_composite_typescript = len(which) == 0
		if GLOBALS.MAKE_CONFIG.get_value("project.useReferences", False):
			which += list(filter(lambda included: included[2] == "typescript", includes))

		# Quick rebuild means running tsc only on changed directory, which is must be faster
		# than default composite building; but in some cases it also may cause unexpected behavior
		if no_composite_typescript and len(which) == 1 and GLOBALS.MAKE_CONFIG.get_value("project.quickRebuild", True):
			included = which.pop()
			overall_result += included[0].build(included[1], included[2])

		# Recomputed changes doesn't really matter for tsc, since we'll just want to realize
		# which files changed with hashing algorithm and composite building may rebuild everything
		# when tsconfig changes or something unexpected happened, like removing temporary declarations
		if len(which) > 0:
			debug("Rebuilding composite", ", ".join([
				basename(included[1]) for included in which
			]))

			from time import time
			startup_millis = time()
			overall_result += GLOBALS.WORKSPACE_COMPOSITE.build(*(
				["--force"] if PROPERTIES.get_value("release") else list()
			))

			startup_millis = time() - startup_millis
			if overall_result == 0:
				print(f"Completed composite script rebuild in {startup_millis:.2f}s!")
			else:
				error(f"Failed composite script rebuild in {startup_millis:.2f}s with result {overall_result}.")

		if overall_result != 0:
			return overall_result

	copy_build_targets(computed_composite, computed_includes)
	GLOBALS.MOD_STRUCTURE.update_build_config_list("compile")
	return overall_result

def watch_composite_project() -> int:
	if not request_typescript():
		error("* Watching is not supported for legacy JavaScript!")
		return 1
	overall_result = 0

	# Recomputing existing changes before watching, changes here doesn't make sence
	# since it will be recomputed after watching interruption
	compute_and_capture_changed_scripts()
	GLOBALS.WORKSPACE_COMPOSITE.flush()
	GLOBALS.WORKSPACE_COMPOSITE.watch()
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("script_source")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("script_library")
	GLOBALS.WORKSPACE_COMPOSITE.reset()

	composite, computed_composite, includes, computed_includes = compute_and_capture_changed_scripts()

	for included in includes:
		if not GLOBALS.MAKE_CONFIG.get_value("project.useReferences", False) or included[2] == "javascript":
			overall_result += included[0].build(included[1], included[2])
	if overall_result != 0:
		return overall_result

	copy_build_targets(computed_composite, computed_includes)
	GLOBALS.MOD_STRUCTURE.update_build_config_list("compile")
	return overall_result

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
	graphics_groups = GLOBALS.MAKE_CONFIG.get_value("graphics.groups")
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
