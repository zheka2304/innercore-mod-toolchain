from os.path import exists, splitext, basename, isfile, isdir, join, relpath
from functools import cmp_to_key

from .utils import clear_directory, copy_file, copy_directory, request_typescript
from .make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from .workspace import WORKSPACE_COMPOSITE
from .mod_structure import mod_structure
from .hash_storage import BUILD_STORAGE
from .includes import Includes

VALID_SOURCE_TYPES = ("main", "launcher", "preloader", "instant", "custom", "library")
VALID_RESOURCE_TYPES = ("resource_directory", "gui", "minecraft_resource_pack", "minecraft_behavior_pack")

def get_allowed_languages():
	allowed_languages = []
	if len(MAKE_CONFIG.get_filtered_list("sources", "language", ("typescript"))) > 0 or MAKE_CONFIG.get_value("denyJavaScript", False):
		if request_typescript() == "typescript":
			allowed_languages.append("typescript")
	if not MAKE_CONFIG.get_value("denyJavaScript", False):
		allowed_languages.append("javascript")
	if len(allowed_languages) == 0:
		from .task import error
		error("TypeScript is required, if you want to build legacy JavaScript, change `denyJavaScript` property in your make.json or toolchain.json config.")
	return allowed_languages

def build_all_scripts(debug_build = False, watch = False):
	mod_structure.cleanup_build_target("script_source")
	mod_structure.cleanup_build_target("script_library")

	overall_result = 0
	for source in MAKE_CONFIG.get_value("sources", []):
		if "source" not in source or "language" not in source or "type" not in source:
			print("Skipped invalid source json ", source, ", it might contain `source`, `type` and `language` properties!", sep="")
			overall_result = 1
			continue
		if source["type"] not in VALID_SOURCE_TYPES:
			print("Invalid script `type` in source: ", source["type"], ", it might be one of ", VALID_SOURCE_TYPES, sep="")
			overall_result = 1
	if overall_result != 0:
		return overall_result

	allowed_languages = get_allowed_languages()
	if "typescript" in allowed_languages and not exists(TOOLCHAIN_CONFIG.get_path("toolchain/declarations")):
		print("\x1b[93mNot found toolchain/declarations, in most cases build will be failed, please install it via tasks.\x1b[0m")

	overall_result += build_composite_project(allowed_languages, debug_build) \
		if not watch else watch_composite_project(allowed_languages, debug_build)
	return overall_result

def rebuild_build_target(source, target_path):
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
	return mod_structure.new_build_target(
		target_type,
		target_path,
		source_type=source["type"],
		declare=declare
	)

def do_sorting(a, b):
	la = a["type"] == "library"
	lb = b["type"] == "library"
	return 0 if la == lb else -1 if la else 1

def compute_and_capture_changed_scripts(allowed_languages = ["typescript"], debug_build = False):
	composite = []
	computed_composite = []
	includes = []
	computed_includes = []

	for source in sorted(MAKE_CONFIG.get_value("sources", []), key=cmp_to_key(do_sorting)):
		make = source["includes"] if "includes" in source else ".includes"
		language = source["language"] if "language" in source and source["language"] in allowed_languages else allowed_languages[0]

		for source_path in MAKE_CONFIG.get_paths(source["source"]):
			if not exists(source_path):
				print("* Skipped non-existing source ", source["source"], "!", sep="")
				continue
			if not (isdir(source_path) or source_path.endswith(".js") or source_path.endswith(".ts")):
				continue

			if "target" not in source:
				target_path = basename(source_path)
				if isfile(source_path):
					target_path = splitext(target_path)[0]
				target_path += ".js"
			else:
				target_path = source["target"]
			try:
				dot_index = target_path.rindex(".")
				target_path = target_path[:dot_index] + "{}" + target_path[dot_index:]
			except ValueError:
				target_path += "{}"

			destination_path = rebuild_build_target(source, target_path)
			if isdir(source_path):
				include = Includes.invalidate(source_path, make, debug_build)
				if include.compute(destination_path, language):
					includes.append((include, destination_path, language))
				if MAKE_CONFIG.get_value("project.useReferences", False):
					WORKSPACE_COMPOSITE.reference(source_path)
				computed_includes.append((source_path, destination_path))
			elif isfile(source_path):
				from .includes import temp_directory
				if MAKE_CONFIG.get_value("project.composite", True):
					WORKSPACE_COMPOSITE.coerce(source_path)
				if BUILD_STORAGE.is_path_changed(source_path) or \
						(language == "typescript" and not isfile(
							join(temp_directory, relpath(source_path, MAKE_CONFIG.root_dir))
						)):
					composite.append((source_path, destination_path, language))
				computed_composite.append((source_path, destination_path, language))

	BUILD_STORAGE.save()
	return composite, computed_composite, includes, computed_includes

def copy_build_targets(composite, includes):
	from .includes import temp_directory
	for included in includes:
		temp_path = join(temp_directory, basename(included[1]))
		if not isfile(temp_path) or BUILD_STORAGE.is_path_changed(temp_path) or not isfile(included[1]):
			if isfile(temp_path):
				copy_file(temp_path, included[1])
			else:
				print(f"WARNING: Not found build target {basename(temp_path)}, maybe it building emitted error or corresponding source is empty.")
				continue
		if not BUILD_STORAGE.is_path_changed(temp_path):
			print(f"* Build target {basename(temp_path)} is not changed")
	for included in composite:
		if MAKE_CONFIG.get_value("project.composite", True) and included[2] != "javascript":
			temp_path = join(temp_directory, relpath(included[0], MAKE_CONFIG.root_dir))
		else: temp_path = included[0]
		if temp_path == included[0] and isfile(temp_path) and BUILD_STORAGE.is_path_changed(temp_path):
			print(f"Flushing {basename(included[1])} from {basename(included[0])}")
		if not isfile(temp_path) or BUILD_STORAGE.is_path_changed(temp_path) or not isfile(included[1]):
			if isfile(temp_path):
				copy_file(temp_path, included[1])
			else:
				print(f"WARNING: Not found build target {basename(temp_path)}, but it directly included!")
				continue
		if not BUILD_STORAGE.is_path_changed(temp_path):
			print(f"* Build target {basename(temp_path)} is not changed")
	BUILD_STORAGE.save()

def build_composite_project(allowed_languages = ["typescript"], debug_build = False):
	overall_result = 0

	composite, computed_composite, includes, computed_includes = \
		compute_and_capture_changed_scripts(allowed_languages, debug_build)
	if "typescript" in allowed_languages:
		WORKSPACE_COMPOSITE.flush(debug_build)
	if not MAKE_CONFIG.get_value("project.useReferences", False):
		for included in includes:
			overall_result += included[0].build(included[1], included[2])
	if overall_result != 0:
		return overall_result

	if "typescript" in allowed_languages \
		and (MAKE_CONFIG.get_value("project.composite", True) \
			or MAKE_CONFIG.get_value("project.useReferences", False)):
		which = []
		if MAKE_CONFIG.get_value("project.composite", True):
			which += list(filter(lambda included: included[2] == "typescript", composite))
		no_composite_typescript = len(which) == 0
		if MAKE_CONFIG.get_value("project.useReferences", False):
			which += list(filter(lambda included: included[2] == "typescript", includes))
		if no_composite_typescript and len(which) == 1 and MAKE_CONFIG.get_value("project.quickRebuild", True):
			included = which.pop()
			overall_result += included[0].build(included[1], included[2])

		if len(which) > 0:
			print("Rebuilding composite", ", ".join([
				basename(included[1]) for included in which
			]))

			import datetime
			start_time = datetime.datetime.now()
			overall_result += WORKSPACE_COMPOSITE.build(*(
				[] if debug_build else ["--force"]
			))
			end_time = datetime.datetime.now()
			diff = end_time - start_time

			print(f"Completed composite rebuild in {round(diff.total_seconds(), 2)}s with result {overall_result} - {'OK' if overall_result == 0 else 'ERROR'}")
		if overall_result != 0:
			return overall_result

	copy_build_targets(computed_composite, computed_includes)
	mod_structure.update_build_config_list("compile")
	return overall_result

def watch_composite_project(allowed_languages = ["typescript"], debug_build = True):
	if not "typescript" in allowed_languages:
		print("Watching is not supported for legacy JavaScript!")
		return 1
	overall_result = 0

	compute_and_capture_changed_scripts(allowed_languages, debug_build)
	WORKSPACE_COMPOSITE.flush(debug_build)
	WORKSPACE_COMPOSITE.watch()

	mod_structure.cleanup_build_target("script_source")
	mod_structure.cleanup_build_target("script_library")
	WORKSPACE_COMPOSITE.reset()
	composite, computed_composite, includes, computed_includes = \
		compute_and_capture_changed_scripts(allowed_languages, debug_build)

	if not MAKE_CONFIG.get_value("project.useReferences", False):
		for included in includes:
			overall_result += included[0].build(included[1], included[2])
	if overall_result != 0:
		return overall_result

	copy_build_targets(computed_composite, computed_includes)
	mod_structure.update_build_config_list("compile")
	return overall_result

def build_all_resources():
	mod_structure.cleanup_build_target("resource_directory")
	mod_structure.cleanup_build_target("gui")
	mod_structure.cleanup_build_target("minecraft_resource_pack")
	mod_structure.cleanup_build_target("minecraft_behavior_pack")
	overall_result = 0

	for resource in MAKE_CONFIG.get_value("resources", fallback=[]):
		if "path" not in resource or "type" not in resource:
			print("Skipped invalid source json ", resource, ", it might contain `path` and `type` properties!", sep="")
			overall_result = 1
			continue

		for source_path in MAKE_CONFIG.get_paths(resource["path"]):
			if not exists(source_path):
				print("* Skipped non-existing resource ", resource["path"], "!", sep="")
				continue

			resource_type = resource["type"]
			if resource_type not in VALID_RESOURCE_TYPES:
				print("Invalid resource `type` in source: ", resource_type, ", it might be one of ", VALID_RESOURCE_TYPES, sep="")
				overall_result = 1
				continue
			resource_name = resource["target"] if "target" in resource else basename(source_path)
			resource_name += "{}"

			if resource_type in ("resource_directory", "gui"):
				target = mod_structure.new_build_target(
					resource_type,
					resource_name,
					declare={
						"resourceType": "resource" if resource_type == "resource_directory" else resource_type
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
	build_all_scripts(debug_build=True)
