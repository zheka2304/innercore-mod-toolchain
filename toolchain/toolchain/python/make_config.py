import os
from os.path import join, basename, abspath, isfile, isdir
import json
import platform

from base_config import BaseConfig

class MakeConfig(BaseConfig):
	def __init__(self, filename):
		if not isfile(filename):
			raise RuntimeError(f"Not found {basename(filename)}, are you sure that project exists?")
		self.filename = filename
		self.root_dir = abspath(join(self.filename, ".."))
		with open(filename, encoding="utf-8") as file:
			self.json = json.load(file)
		BaseConfig.__init__(self, self.json)

	def get_root_dir(self):
		return self.root_dir

	def get_path(self, relative_path):
		return abspath(join(self.root_dir, relative_path))

	def get_paths(self, relative_path, filter=None, paths=None):
		if paths is None:
			paths = []
		if len(relative_path) > 0 and relative_path[-1] == "*":
			path = self.get_path(relative_path[:-1])
			if not isdir(path):
				return []
			for f in os.listdir(path):
				file = join(path, f)
				if filter is None or filter(file):
					paths.append(file)
		else:
			path = self.get_path(relative_path)
			if filter is None or filter(path):
				paths.append(path)
		return paths

class ToolchainConfig(MakeConfig):
	def __init__(self, filename):
		MakeConfig.__init__(self, filename)
		self.currentProject = self.get_value('currentProject', None)
		if self.currentProject != None:
			self.project_dir = join(self.root_dir, self.currentProject)
			self.project_make = MakeConfig(join(self.project_dir, "make.json"))

	def assure_project_selected(self):
		if not hasattr(self, "project_dir"):
			raise RuntimeError("Not found any opened project, nothing to do.")

	def get_project_value(self, name, fallback=None):
		self.assure_project_selected()
		return self.project_make.get_value(name, fallback)

	def get_project_config(self, name, not_none=False):
		self.assure_project_selected()
		return self.project_make.get_config(name, not_none)

	def get_project_filtered_list(self, name, prop, values):
		self.assure_project_selected()
		return self.project_make.get_filtered_list(name, prop, values)

	def get_project_path(self, relative_path):
		self.assure_project_selected()
		return self.project_make.get_path(relative_path)

	def get_project_paths(self, relative_path, filter=None, paths=None):
		self.assure_project_selected()
		return self.project_make.get_paths(relative_path, filter, paths)

	def get_adb(self):
		if platform.system() == "Windows":
			return self.get_path("toolchain/adb/adb.exe")
		return self.get_path("toolchain/adb/adb")


# search for toolchain.json
make_config = None
for i in range(0, 4):
	make_file = join("../" * i, "toolchain.json")
	if isfile(make_file):
		make_config = ToolchainConfig(make_file)
		break
if make_config is None:
	raise RuntimeError("Not found toolchain.json!")
