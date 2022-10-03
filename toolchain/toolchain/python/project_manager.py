import os
from os.path import join, exists, isfile, isdir, basename, abspath
import json

from utils import clear_directory, ensure_not_whitespace
from make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from workspace import CODE_WORKSPACE, CODE_SETTINGS

class ProjectManager:
	def __init__(self):
		self.projects = []
		self.templates = []
		locations = MAKE_CONFIG.get_value("projectLocations", [])
		for location in ["", *locations]:
			path = TOOLCHAIN_CONFIG.get_absolute_path(location)
			if not exists(path) or not isdir(path):
				print(f"Not found project location {location}!")
				continue
			for entry in ["", *os.listdir(path)]:
				make_path = join(path, entry, "make.json")
				if exists(make_path) and isfile(make_path):
					self.projects.append(join(location, entry))
				template_path = join(path, entry, "template.json")
				if exists(template_path) and isfile(template_path):
					self.templates.append(join(location, entry))

	def create_project(self, template, folder, name = None, author = None, version = None, description = None, clientOnly = False):
		location = TOOLCHAIN_CONFIG.get_path(folder)
		if exists(location):
			from task import error
			error(f"Folder '{folder}' already exists!")
		template_path = TOOLCHAIN_CONFIG.get_absolute_path(template)
		if not exists(template_path):
			from task import error
			error(f"Not found {template} template, nothing to do.")
		template_make_path = TOOLCHAIN_CONFIG.get_absolute_path(template + "/template.json")
		if not exists(template_make_path):
			from task import error
			error(f"Not found template.json in template {template}, nothing to do.")

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
		from package import setup_project
		setup_project(template_obj, template_path, location)

		make_path = join(location, "make.json")
		with open(make_path, "w", encoding="utf-8") as make_file:
			make_file.write(json.dumps(template_obj, indent="\t") + "\n")

		if CODE_WORKSPACE.available():
			location = CODE_WORKSPACE.get_toolchain_path(folder)
			if len(CODE_WORKSPACE.get_filtered_list("folders", "path", [location])) == 0:
				self.append_workspace_folder(folder, template_info["name"])

		if CODE_SETTINGS.available():
			exclude = CODE_SETTINGS.json["files.exclude"] if "files.exclude" in CODE_SETTINGS.json else {}
			if not folder.startswith("../"):
				exclude[folder] = True
				CODE_SETTINGS.json["files.exclude"] = exclude
				CODE_SETTINGS.save()

		self.projects.append(folder)
		return self.how_much() - 1

	def remove_project(self, index = None, folder = None):
		if len(self.projects) == 0:
			from task import error
			error("Not found any project to remove.")

		index, folder = self.get_folder(index, folder)

		if folder == MAKE_CONFIG.current_project:
			self.select_project_folder()

		if CODE_WORKSPACE.available():
			location = CODE_WORKSPACE.get_toolchain_path(folder)
			if len(CODE_WORKSPACE.get_filtered_list("folders", "path", [location])) > 0:
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

		clear_directory(TOOLCHAIN_CONFIG.get_absolute_path(folder))
		del self.projects[index]

	def append_workspace_folder(self, folder, name = "Mod"):
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

	def select_project_folder(self, folder = None):
		if MAKE_CONFIG.current_project == folder:
			return

		if folder is None:
			TOOLCHAIN_CONFIG.remove_value("currentProject")
		else:
			TOOLCHAIN_CONFIG.set_value("currentProject", folder)
		TOOLCHAIN_CONFIG.save()

		MAKE_CONFIG.__init__(TOOLCHAIN_CONFIG.filename)
		if folder is None:
			TOOLCHAIN_CONFIG.__init__(TOOLCHAIN_CONFIG.filename)
		else:
			TOOLCHAIN_CONFIG.__init__(MAKE_CONFIG.prototype.filename, MAKE_CONFIG.prototype)
		MAKE_CONFIG.prototype = TOOLCHAIN_CONFIG if folder is not None else None

	def select_project(self, index = None, folder = None):
		index, folder = self.get_folder(index, folder)

		if folder is not None and CODE_WORKSPACE.available():
			location = CODE_WORKSPACE.get_toolchain_path(folder)
			if len(CODE_WORKSPACE.get_filtered_list("folders", "path", [location])) == 0:
				make_path = TOOLCHAIN_CONFIG.get_absolute_path(folder + "/make.json")
				if not exists(make_path):
					from task import error
					error(f"Not found make.json in project {folder}, nothing to do.")
				with open(make_path, "r", encoding="utf-8") as make_file:
					make_obj = json.loads(make_file.read())
				self.append_workspace_folder(folder, make_obj["info"]["name"] if "info" in make_obj and "name" in make_obj["info"] else basename(folder))

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

	def get_folder(self, index = None, folder = None):
		if index == None:
			if folder == None:
				raise ValueError("Folder index must be specified!")
			else:
				index = next((i for i, x in enumerate(self.projects)
					if x.lower() == folder.lower()
				), -1)

		folder = self.projects[index]
		return index, folder

	def how_much(self):
		return len(self.projects)

	def require_selection(self, prompt = None, prompt_when_single = None, dont_want_anymore = None):
		from package import select_project
		if self.how_much() == 1:
			itwillbe = self.projects[0]
			if prompt_when_single is None:
				return itwillbe
			else:
				if input(prompt_when_single.format(itwillbe) + " [Y/n] ")[:1].lower() == "n":
					return print("Abort.")
				return itwillbe
		if dont_want_anymore is not None:
			who = self.projects.copy()
			who.append(dont_want_anymore)
		else:
			who = self.projects
		raw = select_project(who, prompt, MAKE_CONFIG.current_project)
		return (raw if raw != dont_want_anymore else None)


PROJECT_MANAGER = ProjectManager()
