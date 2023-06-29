import json
import os
from os.path import abspath, basename, exists, isdir, isfile, join
from typing import Any, Dict, Final, List, Optional, Tuple

from .make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from .shell import abort, warn
from .utils import ensure_not_whitespace, remove_tree
from .workspace import CODE_SETTINGS, CODE_WORKSPACE


class ProjectManager:
	projects: Final[List[str]]; templates: Final[List[str]]

	def __init__(self) -> None:
		self.projects = []
		self.templates = []
		locations = MAKE_CONFIG.get_value("projectLocations", [])
		for location in ["", *locations]:
			path = TOOLCHAIN_CONFIG.get_absolute_path(location)
			if not exists(path) or not isdir(path):
				warn(f"* Not found project location {location}!")
				continue

			for entry in ["", *os.listdir(path)]:
				make_path = join(path, entry, "make.json")
				if exists(make_path) and isfile(make_path):
					self.projects.append(join(location, entry))
				template_path = join(path, entry, "template.json")
				if exists(template_path) and isfile(template_path):
					self.templates.append(join(location, entry))

	def create_project(self, template: str, folder: str, name: Optional[str] = None, author: Optional[str] = None, version: Optional[str] = None, description: Optional[str] = None, clientOnly: bool = False)-> int:
		location = TOOLCHAIN_CONFIG.get_path(folder)
		if exists(location):
			abort(f"Folder '{folder}' already exists!")
		template_path = TOOLCHAIN_CONFIG.get_absolute_path(template)
		if not exists(template_path):
			abort(f"Not found '{template}' template, nothing to do.")
		template_make_path = TOOLCHAIN_CONFIG.get_absolute_path(template + "/template.json")
		if not isfile(template_make_path):
			abort(f"Not found 'template.json' in template '{template}', nothing to do.")

		with open(template_make_path, "r", encoding="utf-8") as make_file:
			template_obj = json.loads(make_file.read())

		if not "info" in template_obj:
			template_obj["info"] = {}
		template_info = template_obj["info"]
		template_info["name"] = ensure_not_whitespace(name, ensure_not_whitespace(
			template_info["name"] if "name" in template_info else None, "Mod"
		))
		template_info["author"] = ensure_not_whitespace(author, ensure_not_whitespace(
			template_info["author"] if "author" in template_info else None, "ICMods"
		))
		template_info["version"] = ensure_not_whitespace(version, ensure_not_whitespace(
			template_info["version"] if "version" in template_info else None, "1.0"
		))
		template_info["description"] = description if description is not None else ensure_not_whitespace(
			template_info["description"] if "description" in template_info else None, "My brand new mod."
		)
		template_info["clientOnly"] = clientOnly if clientOnly is not None else \
			template_info["clientOnly"] if "clientOnly" in template_info else False

		os.makedirs(location)
		from .package import setup_project
		setup_project(template_obj, template_path, location)

		make_path = join(location, "make.json")
		with open(make_path, "w", encoding="utf-8") as make_file:
			make_file.write(json.dumps(template_obj, indent="\t") + "\n")

		if CODE_WORKSPACE.available():
			location = CODE_WORKSPACE.get_toolchain_path(folder)
			if len(CODE_WORKSPACE.get_filtered_list("folders", "path", (location))) == 0:
				self.append_workspace_folder(folder, template_info["name"])

		if CODE_SETTINGS.available():
			exclude = CODE_SETTINGS.json["files.exclude"] if "files.exclude" in CODE_SETTINGS.json else {}
			if not folder.startswith("../"):
				exclude[folder] = True
				CODE_SETTINGS.json["files.exclude"] = exclude
				CODE_SETTINGS.save()

		self.projects.append(folder)
		return self.how_much() - 1

	def remove_project(self, index: Optional[int] = None, folder: Optional[str] = None) -> None:
		if len(self.projects) == 0:
			abort("Not found any project to remove.")

		index, folder = self.get_folder(index, folder)

		if folder == MAKE_CONFIG.current_project:
			self.select_project_folder()

		if CODE_WORKSPACE.available():
			location = CODE_WORKSPACE.get_toolchain_path(folder)
			if len(CODE_WORKSPACE.get_filtered_list("folders", "path", (location))) > 0:
				folders = CODE_WORKSPACE.get_value("folders", [])
				for entry in folders:
					if isinstance(entry, dict) and "path" in entry and entry["path"] == location:
						folders.remove(entry)
				CODE_WORKSPACE.set_value("folders", folders)
				CODE_WORKSPACE.save()

		if CODE_SETTINGS.available():
			exclude = CODE_SETTINGS.json["files.exclude"] if "files.exclude" in CODE_SETTINGS.json else {}
			if folder in exclude:
				del exclude[folder]
				CODE_SETTINGS.json["files.exclude"] = exclude
				CODE_SETTINGS.save()

		remove_tree(TOOLCHAIN_CONFIG.get_absolute_path(folder))
		del self.projects[index]

	def append_workspace_folder(self, folder: str, name: Optional[object] = "Mod") -> None:
		if CODE_WORKSPACE.available():
			folders = CODE_WORKSPACE.get_value("folders", [])
			if len(folders) == 0:
				folders.append({
					"path": CODE_WORKSPACE.get_toolchain_path(),
					"name": "Inner Core Mod Toolchain"
				})
			folders.append({
				"path": CODE_WORKSPACE.get_toolchain_path(folder),
				"name": str(name)
			})
			CODE_WORKSPACE.set_value("folders", folders)
			CODE_WORKSPACE.save()

	def select_project_folder(self, folder: Optional[str] = None) -> None:
		if MAKE_CONFIG.current_project == folder:
			return

		if folder is None:
			TOOLCHAIN_CONFIG.remove_value("currentProject")
		else:
			TOOLCHAIN_CONFIG.set_value("currentProject", folder)
		TOOLCHAIN_CONFIG.save()

		MAKE_CONFIG.__init__(TOOLCHAIN_CONFIG.path)
		if folder is None:
			TOOLCHAIN_CONFIG.__init__(TOOLCHAIN_CONFIG.path)
		else:
			if MAKE_CONFIG.prototype is None:
				raise SystemError()
			TOOLCHAIN_CONFIG.__init__(MAKE_CONFIG.prototype.path, MAKE_CONFIG.prototype)
		MAKE_CONFIG.prototype = TOOLCHAIN_CONFIG if folder is not None else None

	def select_project(self, index: Optional[int] = None, folder: Optional[str] = None) -> None:
		index, folder = self.get_folder(index, folder)

		if folder is not None and CODE_WORKSPACE.available():
			location = CODE_WORKSPACE.get_toolchain_path(folder)
			if len(CODE_WORKSPACE.get_filtered_list("folders", "path", (location))) == 0:
				make_path = TOOLCHAIN_CONFIG.get_absolute_path(folder + "/make.json")
				if not isfile(make_path):
					abort(f"Not found 'make.json' in project '{folder}', nothing to do.")
				with open(make_path, "r", encoding="utf-8") as make_file:
					make_obj = json.loads(make_file.read())
				self.append_workspace_folder(folder, self.resolve_mod_name(folder, make_obj))

		if folder is not None and CODE_SETTINGS.available():
			exclude = CODE_SETTINGS.json["files.exclude"] if "files.exclude" in CODE_SETTINGS.json else {}
			if MAKE_CONFIG.current_project is not None and not MAKE_CONFIG.current_project.startswith("../") and not exists(abspath(MAKE_CONFIG.current_project)):
				exclude[MAKE_CONFIG.current_project] = True
			if not folder.startswith("../"):
				exclude[folder] = False
			CODE_SETTINGS.json["files.exclude"] = exclude
			CODE_SETTINGS.save()

		self.select_project_folder(folder)
		print(f"Project '{folder}' selected.")

	def resolve_mod_name(self, path: str, make_obj: Optional[Dict[Any, Any]] = None) -> str:
		if make_obj is None:
			try:
				make_path = TOOLCHAIN_CONFIG.get_absolute_path(path + "/make.json")
				if isfile(make_path):
					with open(make_path, "r", encoding="utf-8") as make_file:
						make_obj = json.loads(make_file.read())
			except BaseException:
				pass
		return make_obj["info"]["name"] if make_obj is not None and "info" in make_obj and "name" in make_obj["info"] else basename(path)

	def get_shortcut(self, path: str, make_obj: Optional[Dict[Any, Any]] = None) -> str:
		if len(path) == 0:
			return basename(TOOLCHAIN_CONFIG.directory)
		return self.resolve_mod_name(path, make_obj) + " (" + path + ")"

	def get_folder(self, index: Optional[int] = None, folder: Optional[str] = None) -> Tuple[int, str]:
		if index == None:
			if folder == None:
				raise ValueError("Folder index must be specified!")
			else:
				index = next((i for i, x in enumerate(self.projects)
					if x.lower() == folder.lower()
				), -1)

		folder = self.projects[index]
		return index, folder

	def how_much(self) -> int:
		return len(self.projects)

	def require_selection(self, prompt: Optional[str] = None, prompt_when_single: Optional[str] = None, *dont_want_anymore: str) -> Optional[str]:
		from .package import select_project
		if self.how_much() == 1:
			itwillbe = self.projects[0]
			if prompt_when_single is None:
				return itwillbe
			else:
				try:
					if input(prompt_when_single.format(self.get_shortcut(itwillbe)) + " [Y/n] ")[:1].lower() == "n":
						return print("Abort.")
				except KeyboardInterrupt:
					print()
					return print("Abort.")
				return itwillbe
		return select_project(self.projects, prompt, MAKE_CONFIG.current_project, *dont_want_anymore)


PROJECT_MANAGER = ProjectManager()
