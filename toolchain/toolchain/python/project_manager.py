import os
from os.path import join, exists, isfile, isdir
import json

from utils import clear_directory, ensure_not_whitespace
from make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG

class ProjectManager:
	def __init__(self):
		self.projects = []
		self.templates = []
		locations = MAKE_CONFIG.get_value("projectLocations", [TOOLCHAIN_CONFIG.root_dir])
		for location in locations:
			realpath = join(TOOLCHAIN_CONFIG.root_dir, location)
			if not exists(realpath) or not isdir(realpath):
				print(f"Not found project location {location}!")
				continue
			for next in [""] + os.listdir(realpath):
				make_path = join(realpath, next, "make.json")
				if exists(make_path) and isfile(make_path):
					self.projects.append(join(location, next))
				template_path = join(realpath, next, "template.json")
				if exists(template_path) and isfile(template_path):
					self.templates.append(join(location, next))

	def create_project(self, template, folder, name = None, author = None, version = None, description = None, clientOnly = False):
		location = TOOLCHAIN_CONFIG.get_path(folder)
		if exists(location):
			from task import error
			error(f"Folder '{folder}' already exists!")
		template_path = TOOLCHAIN_CONFIG.get_path(template)
		if not exists(template_path):
			from task import error
			error(f"Not found {template} template, nothing to do.")
		template_make_path = TOOLCHAIN_CONFIG.get_path(template + "/template.json")
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

		vsc_settings_path = TOOLCHAIN_CONFIG.get_path(".vscode/settings.json")
		with open(vsc_settings_path, "r", encoding="utf-8") as vsc_settings_file:
			vsc_settings_obj = json.loads(vsc_settings_file.read())

		vsc_settings_obj["files.exclude"][folder] = True
		self.projects.append(folder)
		with open(vsc_settings_path, "w", encoding="utf-8") as vsc_settings_file:
			vsc_settings_file.write(json.dumps(vsc_settings_obj, indent="\t") + "\n")

		return self.how_much() - 1

	def remove_project(self, index = None, folder = None):
		if len(self.projects) == 0:
			from task import error
			error("Not found any project to remove.")

		index, folder = self.get_folder(index, folder)

		if folder == MAKE_CONFIG.current_project:
			self.select_project_folder()

		clear_directory(TOOLCHAIN_CONFIG.get_path(folder))
		del self.projects[index]

		vsc_settings_path = TOOLCHAIN_CONFIG.get_path(".vscode/settings.json")
		with open(vsc_settings_path, "r", encoding="utf-8") as vsc_settings_file:
			vsc_settings_obj = json.loads(vsc_settings_file.read())

		del vsc_settings_obj["files.exclude"][folder]
		with open(vsc_settings_path, "w", encoding="utf-8") as vsc_settings_file:
			vsc_settings_file.write(json.dumps(vsc_settings_obj, indent="\t") + "\n")

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

	def select_project(self, index = None, folder =  None):
		index, folder = self.get_folder(index, folder)

		vsc_settings_path = TOOLCHAIN_CONFIG.get_path(".vscode/settings.json")
		with open(vsc_settings_path, "r", encoding="utf-8") as vsc_settings_file:
			vsc_settings_obj = json.loads(vsc_settings_file.read())

		if MAKE_CONFIG.current_project != None:
			vsc_settings_obj["files.exclude"][MAKE_CONFIG.current_project] = True
		vsc_settings_obj["files.exclude"][folder] = False

		with open(vsc_settings_path, "w", encoding="utf-8") as vsc_settings_file:
			vsc_settings_file.write(json.dumps(vsc_settings_obj, indent="\t") + "\n")

		self.select_project_folder(folder)

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
				if input(prompt_when_single.format(itwillbe) + " [Y/n]: ").lower() == "n":
					return None
				return itwillbe
		if dont_want_anymore is not None:
			who = self.projects.copy()
			who.append(dont_want_anymore)
		else:
			who = self.projects
		raw = select_project(who, prompt, MAKE_CONFIG.current_project)
		return (raw if raw != dont_want_anymore else None)


PROJECT_MANAGER = ProjectManager()
