import os
import os.path
import sys
import glob

from make_config import make_config
from mod_structure import mod_structure
from utils import ensure_directory, ensure_file_dir, clear_directory, copy_file, copy_directory


def build_includes_dir(directory, target):
    files = []
    with open(os.path.join(directory, ".includes"), encoding="utf-8") as includes:
        duplicate_allowed = False
        for line in includes:
            line = line.strip()
            if line == "#dup":
                duplicate_allowed = True
            if line == "#nodup":
                duplicate_allowed = False
            if len(line) == 0 or line.startswith("#") or line.startswith("//"):
                continue
            if line.endswith("/."):
                search_path = os.path.join(directory, line[:-2], ".") + "/**/*"
            else:
                search_path = os.path.join(directory, line)
            for file in glob.glob(search_path, recursive=True):
                file = os.path.normpath(file)
                if duplicate_allowed or file not in files:
                    files.append(file)

    path_offset = len(os.path.normpath(directory))
    with open(target, "w", encoding="utf-8") as target_file:
        for path in files:
            if os.path.basename(path) == ".includes":
                continue
            with open(path, "r", encoding="utf-8") as file:
                target_file.write(f"\n// included from: {path[path_offset:]}\n")
                target_file.write(file.read())
                target_file.write("\n\n")
    return 0


def build_script(source, target):
    if os.path.isfile(source):
        ensure_file_dir(target)
        copy_file(source, target)
        return 0
    else:
        if os.path.isfile(os.path.join(source, ".includes")):
            return build_includes_dir(source, target)


def build_all_scripts():
    overall_result = 0

    mod_structure.cleanup_build_target("script_source")
    mod_structure.cleanup_build_target("script_library")
    for source in make_config.get_value("sources", fallback=[]):
        if "source" not in source or "type" not in source:
            print("skipped invalid source json", source, file=sys.stderr)
            overall_result = 1
            continue

        for source_path in make_config.get_paths(source["source"]):
            if not os.path.exists(source_path):
                print("skipped non-existing source path", source["source"], file=sys.stderr)
                overall_result = 1
                continue
            source_type = source["type"]
            if source_type not in ("main", "launcher", "library", "preloader"):
                print("skipped invalid source with type", source_type, file=sys.stderr)
                overall_result = 1
                continue
            target_type = "script_library" if source_type == "library" else "script_source"
            source_name = source["target"] if "target" in source else os.path.basename(source_path)
            try:
                dot_index = source_name.rindex(".")
                source_name = source_name[:dot_index] + "{}" + source_name[dot_index:]
            except ValueError:
                source_name += "{}"
            declare = {
                "sourceType": {"main": "mod", "launcher": "launcher", "preloader": "preloader", "library": "library"}[source_type]
            }
            if "api" in source:
                declare["api"] = source["api"]
            overall_result = build_script(source_path, mod_structure.new_build_target(
                target_type,
                source_name,
                source_type=source_type,
                declare=declare
            ))

    mod_structure.update_build_config_list("compile")
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
            if not os.path.exists(source_path):
                print("skipped non-existing resource path", resource["path"], file=sys.stderr)
                overall_result = 1
                continue
            resource_type = resource["type"]
            if resource_type not in ("resource_directory", "gui", "minecraft_resource_pack", "minecraft_behavior_pack"):
                print("skipped invalid resource with type", resource_type, file=sys.stderr)
                overall_result = 1
                continue
            resource_name = resource["target"] if "target" in resource else os.path.basename(source_path)
            resource_name += "{}"

            if resource_type in ("resource_directory", "gui"):
                target = mod_structure.new_build_target(
                    resource_type,
                    resource_name,
                    declare={
                        "type": {"resource_directory": "resource", "gui": "gui"}[resource_type]
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
