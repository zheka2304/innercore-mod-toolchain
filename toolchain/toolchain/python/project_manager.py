import os
from os.path import join, exists, isfile, isdir
import json

from utils import copy_directory, clear_directory
from make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG

class ProjectManager:
	def __init__(self):
		self.projects = []
		locations = MAKE_CONFIG.get_value("projectLocations", [TOOLCHAIN_CONFIG.root_dir])
		for location in locations:
			realpath = join(TOOLCHAIN_CONFIG.root_dir, location)
			if not exists(realpath) or not isdir(realpath):
				print(f"Not found project location {location}!")
				continue
			for next in os.listdir(realpath):
				if next == "toolchain-mod":
					continue
				path = join(realpath, next, "make.json")
				if exists(path) and isfile(path):
					self.projects.append(join(location, next))

	def create_project(self, name, author = "", version = "1.0", description = "", folder = None, client = False):
		if folder == None:
			folder = name.replace(":", "-")

		path = join(TOOLCHAIN_CONFIG.root_dir, folder)
		if exists(path):
			from task import error
			error(f"""Folder "{folder}" already exists!""")
		if not exists(TOOLCHAIN_CONFIG.get_path("../toolchain-mod")):
			from task import error
			error("Not found ../toolchain-mod template, nothing to do.")

		os.makedirs(path)
		copy_directory(TOOLCHAIN_CONFIG.get_path("../toolchain-mod"), path, True)

		make_path = join(path, "make.json")
		with open(make_path, "r", encoding="utf-8") as make_file:
			make_obj = json.loads(make_file.read())

		make_obj["info"]["name"] = name
		make_obj["info"]["author"] = author
		make_obj["info"]["version"] = version
		make_obj["info"]["description"] = description
		make_obj["info"]["client"] = client

		with open(make_path, "w", encoding="utf-8") as make_file:
			make_file.write(json.dumps(make_obj, indent="\t") + "\n")

		vsc_settings_path = TOOLCHAIN_CONFIG.get_path(".vscode/settings.json")
		with open(vsc_settings_path, "r", encoding="utf-8") as vsc_settings_file:
			vsc_settings_obj = json.loads(vsc_settings_file.read())

		vsc_settings_obj["files.exclude"][folder] = True
		self.projects.append(folder)
		with open(vsc_settings_path, "w", encoding="utf-8") as vsc_settings_file:
			vsc_settings_file.write(json.dumps(vsc_settings_obj, indent="\t") + "\n")

		from package import setup_launcher_js
		setup_launcher_js(make_obj, path)

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
