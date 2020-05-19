import glob
import os
import os.path
import sys
import json

from fancy_output import *
from make_config import make_config
from mod_structure import mod_structure
from utils import ensure_file_dir, clear_directory, copy_file, copy_directory
from os.path import *


COMPILER_OPTIONS = {
    "strict": False,
    "nocheck": False,
    "declarations": False,
    "decorators": True,
    "skipLibCheck": True
}


def build_source(source_path, target_path):
    tsconfig_path = join(source_path, "tsconfig.json")

    if isfile(join(source_path, ".includes")):
        params = read_params_from_includes(source_path)
        files = read_files_from_includes(source_path)
    elif not isfile(tsconfig_path):
        params = COMPILER_OPTIONS.copy()
        files = [file for file in glob.glob(
            f"{source_path}/**/*", recursive=True)]
    else:
        # if there isn't .includes but there is tsconfig.json
        build_tsconfig(tsconfig_path)
        with open(tsconfig_path) as tsconfig:
            config = json.load(tsconfig)
            library_path = normpath(
                join(source_path, config["compilerOptions"]["outFile"]))

            copy_file(library_path, target_path)
            declaration_path = f"{splitext(library_path)[0]}.d.ts"

            if(isfile(declaration_path)):
                copy_file(declaration_path, join(make_config.get_path(
                    "toolchain/build/typescript-headers"), basename(declaration_path)))
        return

    # decode params
    params["checkJs"] = not params.pop("nocheck")
    params["declaration"] = params.pop("declarations")
    params["experimentalDecorators"] = params.pop("decorators")

    # actually there is two directories with *.d.ts files: toolchain/jslibs (for default headers) & toolchain/build/typescript-headers (for additional libraries)
    headers = glob.glob(relpath(make_config.get_path(
        "toolchain/**/*.d.ts"), source_path), recursive=True)

    template = {
        "compilerOptions": {
            "target": "ES5",
            "lib": ["ESNext"],
            "allowJs": True,
            "downlevelIteration": True,
            "outFile": target_path
        },
        "exclude": [
            "**/node_modules/*",
            "dom"
        ],
        "include": files,
        "files": headers
    }

    for key, value in params.items():
        template["compilerOptions"][key] = value

    with open(tsconfig_path, "w") as tsconfig:
        json.dump(template, tsconfig, indent="\t")

    build_tsconfig(tsconfig_path)


def build_script(source_path, target_path):
    if (isfile(source_path)):
        copy_file(source_path, target_path)
    else:
        build_source(source_path, target_path)


def build_tsconfig(tsconfig_path):
    os.system(f'tsc -p "{tsconfig_path}"')


def read_params_from_includes(source_path):
    includes_path = join(source_path, ".includes")
    params = COMPILER_OPTIONS.copy()

    with open(includes_path, encoding="utf-8") as includes:
        for line in includes:
            line = line.strip()

            if line.startswith("#"):
                line = line[1:].strip()
                if line in params:
                    params[line] = True

    return params


def read_files_from_includes(source_path):
    includes_path = join(source_path, ".includes")
    with open(includes_path, encoding="utf-8") as includes:
        files = []
        for line in includes:
            line = line.strip()

            if len(line) == 0 or line.startswith("#") or line.startswith("//"):
                continue

            if line.endswith("/."):
                search_path = join(
                    source_path, line[:-2], ".") + "/**/*"
            else:
                search_path = join(source_path, line)
            for file in glob.glob(search_path, recursive=True):
                file = normpath(file)
                if file not in files:
                    files.append(relpath(
                        file, source_path).replace("\\", "/"))
    return files


def build_all_scripts():
    overall_result = 0

    # FIXME: декларации создаются после компиляции мода, следовательно не указываются в tsconfig.json у мода
    # clear_directory(make_config.get_path("toolchain/build/typescript-headers"))

    mod_structure.cleanup_build_target("script_source")
    mod_structure.cleanup_build_target("script_library")
    for item in make_config.get_value("sources", fallback=[]):
        _source = item["source"]
        _target = item["target"] if "target" in item else None
        _type = item["type"]
        _language = item["language"]

        if _type not in ("main", "launcher", "library", "preloader"):
            print_err(f"skipped invalid source with type {_type}")
            overall_result = 1
            continue

        for source_path in make_config.get_paths(_source):
            if not exists(source_path):
                print_err(f"skipped non-existing source path {_source}")
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
                target_path = target_path[:dot_index] + \
                    "{}" + target_path[dot_index:]
            except ValueError:
                target_path += "{}"

            print_info(
                f"building {_language} {_type} from {_source} {'to ' + _target if _target is not None else '' }")
            tsconfig_path = build_script(source_path, mod_structure.new_build_target(
                target_type,
                target_path,
                source_type=_type,
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
            if not exists(source_path):
                print("skipped non-existing resource path",
                      resource["path"], file=sys.stderr)
                overall_result = 1
                continue
            resource_type = resource["type"]
            if resource_type not in ("resource_directory", "gui", "minecraft_resource_pack", "minecraft_behavior_pack"):
                print("skipped invalid resource with type",
                      resource_type, file=sys.stderr)
                overall_result = 1
                continue
            resource_name = resource["target"] if "target" in resource else basename(
                source_path)
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
