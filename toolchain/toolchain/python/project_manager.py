import os
from os.path import join, exists, isfile
import json

from utils import copy_directory, clear_directory
from make_config import make_config, MakeConfig

class ProjectManager:
	def __init__(self, config):
		self.config = config
		self.root_dir = config.root_dir
		self.__projects = []
		locations = config.get_value("projectLocations", [config.root_dir])
		for location in locations:
			realpath = join(config.root_dir, location)
			if not exists(realpath):
				print(f"Not found project location {location}!")
				continue
			for next in os.listdir(realpath):
				if next == "toolchain-mod":
					continue
				path = join(realpath, next, "make.json")
				if exists(path) and isfile(path):
					self.__projects.append(join(location, next))

	def create_project(self, name, author = "", version = "1.0", description = "", folder = None, client = False):
		if folder == None:
			folder = name.replace(":", "-")

		path = join(self.root_dir, folder)
		if exists(path):
			raise IOError(f"""Folder "{folder}" already exists!""")
		if not exists(self.config.get_path("../toolchain-mod")):
			raise RuntimeError("Not found ../toolchain-mod template, nothing to do.")

		os.makedirs(path)
		copy_directory(self.config.get_path("../toolchain-mod"), path, True)

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

		vsc_settings_path = self.config.get_path(".vscode/settings.json")
		with open(vsc_settings_path, "r", encoding="utf-8") as vsc_settings_file:
			vsc_settings_obj = json.loads(vsc_settings_file.read())

		vsc_settings_obj["files.exclude"][folder] = True
		self.__projects.append(folder)
		with open(vsc_settings_path, "w", encoding="utf-8") as vsc_settings_file:
			vsc_settings_file.write(json.dumps(vsc_settings_obj, indent="\t") + "\n")

		from project_manager_tasks import setup_launcher_js
		setup_launcher_js(make_obj, path)

		return self.how_much() - 1

	def remove_project(self, index = None, folder = None):
		if len(self.__projects) == 0:
			raise RuntimeError("Not found any project to remove.")

		index, folder = self.get_folder(index, folder)

		if folder == self.config.get_value("currentProject"):
			self.select_project_folder()

		clear_directory(self.config.get_path(folder))
		del self.__projects[index]

		vsc_settings_path = self.config.get_path(".vscode/settings.json")
		with open(vsc_settings_path, "r", encoding="utf-8") as vsc_settings_file:
			vsc_settings_obj = json.loads(vsc_settings_file.read())

		del vsc_settings_obj["files.exclude"][folder]
		with open(vsc_settings_path, "w", encoding="utf-8") as vsc_settings_file:
			vsc_settings_file.write(json.dumps(vsc_settings_obj, indent="\t") + "\n")

	def select_project_folder(self, folder = None):
		self.config.currentProject = folder
		if folder is None:
			del self.config.project_dir
			del self.config.project_make
		else:
			self.config.project_dir = join(self.root_dir, self.config.currentProject)
			self.config.project_make = MakeConfig(join(self.config.project_dir, "make.json"))

		make_path = self.config.get_path("toolchain.json")

		with open(make_path, "r", encoding="utf-8") as make_file:
			make_obj = json.loads(make_file.read())

		if folder is None:
			del make_obj["currentProject"]
		else:
			make_obj["currentProject"] = folder

		with open(make_path, "w", encoding="utf-8") as make_file:
			make_file.write(json.dumps(make_obj, indent="\t") + "\n")

	def select_project(self, index = None, folder =  None):
		index, folder = self.get_folder(index, folder)

		vsc_settings_path = self.config.get_path(".vscode/settings.json")
		with open(vsc_settings_path, "r", encoding="utf-8") as vsc_settings_file:
			vsc_settings_obj = json.loads(vsc_settings_file.read())

		last_project = self.config.get_value("currentProject")
		if last_project != None:
			vsc_settings_obj["files.exclude"][last_project] = True
		vsc_settings_obj["files.exclude"][folder] = False

		with open(vsc_settings_path, "w", encoding="utf-8") as vsc_settings_file:
			vsc_settings_file.write(json.dumps(vsc_settings_obj, indent="\t") + "\n")

		self.select_project_folder(folder)

	def get_folder(self, index = None, folder = None):
		if index == None:
			if folder == None:
				raise ValueError("Folder index must be specified!")
			else:
				index = next((i for i, x in enumerate(self.__projects)
					if x.lower() == folder.lower()
				), -1)

		folder = self.__projects[index]

		return index, folder

	def how_much(self):
		return len(self.__projects)

	def require_selection(self, prompt = None, promptWhenSingle = None, dontWantAnymore = None):
		from project_manager_tasks import select_project
		if self.how_much() == 1:
			itwillbe = self.__projects[0]
			if promptWhenSingle is None:
				return itwillbe
			else:
				if input(promptWhenSingle.format(itwillbe) + " [Y/n]: ").lower() == "n":
					return None
				return itwillbe
		if dontWantAnymore is not None:
			who = self.__projects.copy()
			who.append(dontWantAnymore)
		else:
			who = self.__projects
		raw = select_project(who, prompt, self.config.currentProject)
		return (raw if raw != dontWantAnymore else None)


projectManager = ProjectManager(make_config)
