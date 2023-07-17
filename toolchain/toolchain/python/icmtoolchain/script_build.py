from functools import cmp_to_key
from os.path import basename, exists, isdir, isfile, join, relpath, splitext
from typing import Any, Dict, List, Tuple

from . import GLOBALS, PROPERTIES
from .includes import Includes
from .shell import abort, debug, error, info, warn
from .utils import copy_directory, copy_file, remove_tree, request_typescript

VALID_SOURCE_TYPES = ("main", "launcher", "preloader", "instant", "custom", "library")
VALID_RESOURCE_TYPES = ("resource_directory", "gui", "minecraft_resource_pack", "minecraft_behavior_pack")


def get_allowed_languages() -> List[str]:
	allowed_languages = []

	if len(GLOBALS.MAKE_CONFIG.get_filtered_list("sources", "language", ("typescript"))) > 0 or GLOBALS.PREFERRED_CONFIG.get_value("denyJavaScript", False):
		if request_typescript() == "typescript":
			allowed_languages.append("typescript")

	if not GLOBALS.PREFERRED_CONFIG.get_value("denyJavaScript", False):
		allowed_languages.append("javascript")

	if len(allowed_languages) == 0:
		abort("TypeScript is required, if you want to build legacy JavaScript, change `denyJavaScript` property in your 'make.json' or 'toolchain.json' config.")

	return allowed_languages

def build_all_scripts(watch: bool = False) -> int:
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("script_source")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("script_library")

	overall_result = 0
	for source in GLOBALS.MAKE_CONFIG.get_value("sources", []):
		if "source" not in source or "language" not in source or "type" not in source:
			error("Skipped invalid source json ", source, ", it might contain `source`, `type` and `language` properties!", sep="")
			overall_result = 1
			continue

		if source["type"] not in VALID_SOURCE_TYPES:
			error("Invalid script `type` in source: ", source["type"], ", it might be one of ", VALID_SOURCE_TYPES, sep="")
			overall_result = 1

	if overall_result != 0:
		return overall_result

	allowed_languages = get_allowed_languages()
	if "typescript" in allowed_languages and not exists(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/declarations")):
		warn("Not found 'toolchain/declarations', in most cases build will be failed, please install it via tasks.")

	overall_result += build_composite_project(allowed_languages) \
		if not watch else watch_composite_project(allowed_languages)
	return overall_result

def rebuild_build_target(source, target_path: str) -> str:
	declare = {
		# make.json source type -> build.config source type
		"sourceType": "mod" if source["type"] == "main" else source["type"]
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

def compute_and_capture_changed_scripts(allowed_languages: List[str] = ["typescript"]) -> Tuple[List[Tuple[str, str, str]], List[Tuple[str, str, str]], List[Tuple[Includes, str, str]], List[Tuple[str, str]]]:
	composite = []
	computed_composite = []
	includes = []
	computed_includes = []

	for source in sorted(GLOBALS.MAKE_CONFIG.get_value("sources", []), key=cmp_to_key(do_sorting)):
		make = source["includes"] if "includes" in source else ".includes"
		preffered_language = source["language"] if "language" in source else None
		language = preffered_language if preffered_language is not None \
			and source["language"] in allowed_languages else allowed_languages[0]

		for source_path in GLOBALS.MAKE_CONFIG.get_paths(source["source"]):
			if not exists(source_path):
				warn("* Skipped non-existing source '", source["source"], "'!", sep="")
				continue

			# Supports assembling directories, JavaScript and TypeScript
			if not (isdir(source_path) or source_path.endswith(".js") or source_path.endswith(".ts")):
				continue

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
				# Computing in any cases, tsconfig normalizes environment usage
				if include.compute(destination_path, language):
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
				from .includes import TEMPORARY_DIRECTORY
				if not appending_library:
					if GLOBALS.MAKE_CONFIG.get_value("project.composite", True) and language == "typescript":
						GLOBALS.WORKSPACE_COMPOSITE.coerce(source_path)
					if GLOBALS.BUILD_STORAGE.is_path_changed(source_path) or (
						language == "typescript" and not isfile(
							join(TEMPORARY_DIRECTORY, relpath(source_path, GLOBALS.MAKE_CONFIG.directory))
						)
					):
						composite.append((source_path, destination_path, language))
				computed_composite.append((
					source_path, destination_path, "javascript" if appending_library else language
				))

	GLOBALS.BUILD_STORAGE.save()
	return composite, computed_composite, includes, computed_includes

def copy_build_targets(composite: List[Tuple[str, str, str]], includes: List[Tuple[str, str]]) -> None:
	from .includes import TEMPORARY_DIRECTORY

	for included in includes:
		temp_path = join(TEMPORARY_DIRECTORY, basename(included[1]))

		if not isfile(temp_path) or GLOBALS.BUILD_STORAGE.is_path_changed(temp_path) or not isfile(included[1]):
			if isfile(temp_path):
				copy_file(temp_path, included[1])
			else:
				warn(f"* Not found build target '{basename(temp_path)}', maybe it building emitted error or corresponding source is empty.")
				continue

		if not GLOBALS.BUILD_STORAGE.is_path_changed(temp_path):
			info(f"* Build target '{basename(temp_path)}' is not changed.")

	for included in composite:
		# Single JavaScript sources when TypeScript is not forced just copies to output without
		# temporary caching; might be breaking change in future.
		if GLOBALS.MAKE_CONFIG.get_value("project.composite", True) and included[2] != "javascript":
			temp_path = join(TEMPORARY_DIRECTORY, relpath(included[0], GLOBALS.MAKE_CONFIG.directory))
		else:
			temp_path = included[0]

		if temp_path == included[0] and isfile(temp_path) and GLOBALS.BUILD_STORAGE.is_path_changed(temp_path):
			print(f"Flushing '{basename(included[1])}' from '{basename(included[0])}'")

		if not isfile(temp_path) or GLOBALS.BUILD_STORAGE.is_path_changed(temp_path) or not isfile(included[1]):
			if isfile(temp_path):
				copy_file(temp_path, included[1])
			else:
				warn(f"* Not found build target '{basename(temp_path)}', but it directly included!")
				continue

		if not GLOBALS.BUILD_STORAGE.is_path_changed(temp_path):
			info(f"* Build target '{basename(temp_path)}' is not changed.")

	GLOBALS.BUILD_STORAGE.save()

def build_composite_project(allowed_languages: List[str] = ["typescript"]) -> int:
	overall_result = 0

	composite, computed_composite, includes, computed_includes = \
		compute_and_capture_changed_scripts(allowed_languages)

	if "typescript" in allowed_languages:
		GLOBALS.WORKSPACE_COMPOSITE.flush()
	for included in includes:
		if not GLOBALS.MAKE_CONFIG.get_value("project.useReferences", False) or included[2] == "javascript":
			overall_result += included[0].build(included[1], included[2])
	if overall_result != 0:
		return overall_result

	if "typescript" in allowed_languages \
		and (GLOBALS.MAKE_CONFIG.get_value("project.composite", True) \
			or GLOBALS.MAKE_CONFIG.get_value("project.useReferences", False)):

		which = []
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

			import datetime
			start_time = datetime.datetime.now()
			overall_result += GLOBALS.WORKSPACE_COMPOSITE.build(*(
				["--force"] if PROPERTIES.get_value("release") else []
			))
			end_time = datetime.datetime.now()
			diff = end_time - start_time

			print(f"Completed composite rebuild in {round(diff.total_seconds(), 2)}s with result {overall_result} - {'OK' if overall_result == 0 else 'ERROR'}")

		if overall_result != 0:
			return overall_result

	copy_build_targets(computed_composite, computed_includes)
	GLOBALS.MOD_STRUCTURE.update_build_config_list("compile")
	return overall_result

def watch_composite_project(allowed_languages: List[str] = ["typescript"]) -> int:
	if not "typescript" in allowed_languages:
		error("Watching is not supported for legacy JavaScript!")
		return 1
	overall_result = 0

	# Recomputing existing changes before watching, changes here doesn't make sence
	# since it will be recomputed after watching interruption
	compute_and_capture_changed_scripts(allowed_languages)
	GLOBALS.WORKSPACE_COMPOSITE.flush()
	GLOBALS.WORKSPACE_COMPOSITE.watch()
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("script_source")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("script_library")
	GLOBALS.WORKSPACE_COMPOSITE.reset()

	composite, computed_composite, includes, computed_includes = \
		compute_and_capture_changed_scripts(allowed_languages)

	for included in includes:
		if not GLOBALS.MAKE_CONFIG.get_value("project.useReferences", False) or included[2] == "javascript":
			overall_result += included[0].build(included[1], included[2])
	if overall_result != 0:
		return overall_result

	copy_build_targets(computed_composite, computed_includes)
	GLOBALS.MOD_STRUCTURE.update_build_config_list("compile")
	return overall_result

def build_all_resources() -> int:
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("resource_directory")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("gui")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("minecraft_resource_pack")
	GLOBALS.MOD_STRUCTURE.cleanup_build_target("minecraft_behavior_pack")
	overall_result = 0

	for resource in GLOBALS.MAKE_CONFIG.get_value("resources", fallback=[]):
		if "path" not in resource or "type" not in resource:
			error("Skipped invalid source json ", resource, ", it might contain `path` and `type` properties!", sep="")
			overall_result = 1
			continue

		for source_path in GLOBALS.MAKE_CONFIG.get_paths(resource["path"]):
			if not exists(source_path):
				warn("* Skipped non-existing resource ", resource["path"], "!", sep="")
				continue

			resource_type = resource["type"]
			if resource_type not in VALID_RESOURCE_TYPES:
				error("Invalid resource `type` in source: ", resource_type, ", it might be one of ", VALID_RESOURCE_TYPES, sep="")
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
