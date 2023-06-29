import json
import os
import time
from os.path import basename, exists, isdir, join, relpath
from typing import Any, Dict, List, Optional

from .. import colorama
from .base_config import BaseConfig
from .make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from .project_manager import PROJECT_MANAGER
from .shell import (Entry, Input, Interrupt, Notice, Progress, SelectiveShell,
                    Separator, Shell, Switch, abort, error, select_prompt,
                    stringify, warn)
from .utils import (copy_file, ensure_not_whitespace, get_all_files,
                    get_project_folder_by_name, name_to_identifier,
                    remove_tree)


def get_path_set(locations: List[str], error_sensitive: bool = False) -> Optional[List[str]]:
	directories = []
	for path in locations:
		for directory in MAKE_CONFIG.get_paths(path):
			if isdir(directory):
				directories.append(directory)
			else:
				if error_sensitive:
					error(f"Declared invalid directory {path}, task will be terminated")
					return None
				else:
					warn(f"* Declared invalid directory {path}, it will be skipped")
	return directories

def cleanup_relative_directory(path: str, project: bool = False) -> None:
	start_time = time.time()
	remove_tree(MAKE_CONFIG.get_path(path) if project else TOOLCHAIN_CONFIG.get_path(path))
	print(f"Completed {basename(path)} cleanup in {int((time.time() - start_time) * 100) / 100}s")

def select_template() -> Optional[str]:
	if len(PROJECT_MANAGER.templates) <= 1:
		if len(PROJECT_MANAGER.templates) == 0:
			error("Please, ensure that `projectLocations` property in your 'toolchain.json' contains any folder with 'template.json'.")
			abort("Not found any templates, nothing to do.")
		return PROJECT_MANAGER.templates[0]
	return select_prompt(
		"Which template do you want?",
		*PROJECT_MANAGER.templates,
		fallback=0, returns_what=True
	)

def new_project(template: Optional[str] = "../toolchain-mod") -> Optional[int]:
	if template is None or not exists(TOOLCHAIN_CONFIG.get_absolute_path(template)):
		return new_project(template=select_template())
	template_make_path = TOOLCHAIN_CONFIG.get_absolute_path(template + "/template.json")
	try:
		with open(template_make_path) as template_make:
			template_config = BaseConfig(json.loads(template_make.read()))
	except BaseException as err:
		if len(PROJECT_MANAGER.templates) > 1:
			return new_project(None)
		abort(f"Malformed '{template}/template.json', nothing to do.", cause=err)

	have_template = TOOLCHAIN_CONFIG.get_value("template") is not None
	always_skip_description = TOOLCHAIN_CONFIG.get_value("template.skipDescription", False)
	progress_step = 0.5 if have_template and always_skip_description else 0.33 if have_template or always_skip_description else 0.25
	print("Inner Core Mod Toolchain", end="")

	class NameObserver(Shell.Interactable):
		def __init__(self) -> None:
			Shell.Interactable.__init__(self, "name_observer")

		def observe_key(self, what: str) -> bool:
			input = shell.get_interactable("name", Input)
			self.directory = get_project_folder_by_name(TOOLCHAIN_CONFIG.directory, input.read() or "")
			header = shell.get_interactable("header", Separator)
			header.size = (1 if self.directory is None else 0) + (0 if len(PROJECT_MANAGER.templates) > 1 else 1)
			location = shell.get_interactable("location", Notice)
			location.text = "" if self.directory is None else "It will be in " + self.directory + "\n"
			progress = shell.get_interactable("step", Progress)
			progress.progress = 0 if self.directory is None else progress_step
			progress.text = " " + "Name your creation".center(45) + (" " if self.directory is None else ">")
			shell.blocked_in_page = self.directory is None
			return False

	shell = SelectiveShell()
	shell.interactables.append(Notice("Create new project"))
	if len(PROJECT_MANAGER.templates) > 1:
		shell.interactables += [
			Separator("header"),
			Entry("template", "Choose template")
		]
	else:
		shell.interactables.append(Separator("header", size=2))
	shell.interactables += [
		Input("name", "Name: ", TOOLCHAIN_CONFIG.get_value("template.name", ""), template=template_config.get_value("info.name")),
		Notice("location"),
		NameObserver(),
		Progress("step")
	]
	if not always_skip_description:
		shell.interactables += [
			Input("author", "Author: ", TOOLCHAIN_CONFIG.get_value(
				"template.author", template_config.get_value("info.author", "")
			)),
			Input("version", "Version: ", TOOLCHAIN_CONFIG.get_value(
				"template.version", template_config.get_value("info.version", "1.0")
			)),
			Input("description", "Description: ", TOOLCHAIN_CONFIG.get_value(
				"template.description", template_config.get_value("info.description", "")
			)),
			Switch("client_side", "Client side only", TOOLCHAIN_CONFIG.get_value(
				"template.clientOnly", template_config.get_value("info.clientOnly", False)
			)),
			Separator(),
			Progress(progress=progress_step * 2, text="<" + "Configure details".center(45) + (">" if not have_template else "+"))
		]
	if not have_template:
		shell.interactables += [
			Notice("You can override template by setting up `template`"),
			Notice("property in your 'toolchain.json', it will be automatically"),
			Notice("applied when new project is being created."),
			Notice("Properties are still same 'make.json' property `info`."),
			Separator(),
			Progress(progress=progress_step * (3 if not always_skip_description else 2), text="<" + "Friendly advice".center(45) + "+")
		]

	shell.interactables.append(Interrupt())
	observer = shell.get_interactable("name_observer", NameObserver)
	observer.observe_key("\0")
	try:
		shell.loop()
	except KeyboardInterrupt:
		shell.leave()
		return None
	if shell.what() == "template":
		return new_project(None)
	if not hasattr(observer, "directory") or observer.directory is None:
		abort("Not found 'directory' property in observer!")
	print(f"Copying template '{template}' to '{observer.directory}'")
	return PROJECT_MANAGER.create_project(
		template, observer.directory,
		shell.get_interactable("name", Input).read(),
		shell.get_interactable("author", Input).read(),
		shell.get_interactable("version", Input).read(),
		shell.get_interactable("description", Input).read(),
		shell.get_interactable("client_side", Switch).checked
	)

def resolve_make_format_map(make_obj: Dict[Any, Any], path: str) -> Dict[Any, Any]:
	make_obj_info = make_obj["info"] if "info" in make_obj else {}
	identifier = name_to_identifier(basename(path))
	while len(identifier) > 0 and identifier[0].isdecimal():
		identifier = identifier[1:]
	package_prefix = name_to_identifier(make_obj_info["author"]) if "author" in make_obj_info else "icmods"
	while len(package_prefix) > 0 and package_prefix[0].isdecimal():
		package_prefix = package_prefix[1:]
	package_suffix = name_to_identifier(make_obj_info["name"]) if "name" in make_obj_info else identifier
	while len(package_suffix) > 0 and package_suffix[0].isdecimal():
		package_suffix = package_suffix[1:]
	return {
		"identifier": ensure_not_whitespace(identifier, "whoami"),
		"packageSuffix": ensure_not_whitespace(package_suffix, "mod"),
		"packagePrefix": package_prefix,
		**make_obj_info,
		"clientOnly": "true" if "clientOnly" in make_obj_info and make_obj_info["clientOnly"] else "false"
	}

def setup_project(make_obj: Dict[Any, Any], template: str, path: str) -> None:
	makemap = resolve_make_format_map(make_obj, path)
	dirmap = { template: "" }
	for dirpath, dirnames, filenames in os.walk(template):
		for dirname in dirnames:
			dir = join(dirpath, dirname)
			dirmap[dir] = relpath(dir, template)
			try:
				dirmap[dir] = dirmap[dir].format_map(makemap)
			except BaseException:
				warn(f"* Source '{dirmap[dir]}' contains malformed name!")
			os.mkdir(join(path, dirmap[dir]))
		for filename in filenames:
			if dirpath == template and filename == "template.json":
				continue
			file = join(path, join(dirmap[dirpath], filename))
			copy_file(join(dirpath, filename), file)
	for source in get_all_files(path, extensions=(".json", ".js", ".ts", "manifest", ".java", ".cpp")):
		with open(source, "r") as source_file:
			lines = source_file.readlines()
		for index in range(len(lines)):
			try:
				lines[index] = lines[index].format_map(makemap)
			except BaseException:
				pass
		with open(source, "w") as source_file:
			source_file.writelines(lines)

def select_project(variants: List[str], prompt: Optional[str] = "Which project do you want?", selected: Optional[str] = None, *additionals: str) -> Optional[str]:
	if prompt is not None:
		print(prompt, end="")
	shell = SelectiveShell(infinite_scroll=True, implicit_page_indicator=True)
	binding = {}
	for variant in variants:
		if not variant in binding:
			binding[variant] = PROJECT_MANAGER.get_shortcut(variant)
	names = list(binding.keys())
	names.sort()
	for variant in names:
		shell.interactables.append(Entry(variant, binding[variant][:59] if selected != variant else stringify(binding[variant][:59], color=7, reset=colorama.Style.RESET_ALL)))
	for variant in additionals:
		shell.interactables.append(Entry(variant))
	try:
		shell.loop()
	except KeyboardInterrupt:
		shell.leave()
		print()
		return None
	try:
		what = shell.what()
		if what is None or what in additionals:
			print()
			return print("Abort.")
		print((prompt + " " if prompt is not None else "") + stringify(what, color=colorama.Style.DIM, reset=colorama.Style.NORMAL))
		return what
	except ValueError:
		return None
