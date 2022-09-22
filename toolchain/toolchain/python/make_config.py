import hashlib
import os
from os.path import join, basename, abspath, isfile, isdir
import platform
import json

from base_config import BaseConfig

class MakeConfig(BaseConfig):
	def __init__(self, filename, base = None):
		if not isfile(filename):
			from task import registered_tasks
			print(f"Not found {basename(filename)}, are you sure that selected project exists?")
			registered_tasks["selectProject"]()
			return
		self.filename = filename
		self.root_dir = abspath(join(self.filename, ".."))
		with open(filename, encoding="utf-8") as file:
			self.json = json.load(file)
		BaseConfig.__init__(self, self.json, base)

	def save(self):
		with open(self.filename, "w", encoding="utf-8") as make_file:
			make_file.write(json.dumps(self.json, indent="\t") + "\n")

	def get_path(self, relative_path):
		return abspath(join(self.root_dir, relative_path))

	def get_paths(self, relative_path, filter = None, paths = None):
		if paths is None:
			paths = []
		if len(relative_path) > 0 and relative_path[-1] == "*":
			path = self.get_path(relative_path[:-1])
			if not isdir(path):
				return []
			for filename in os.listdir(path):
				file = join(path, filename)
				if filter is None or filter(file):
					paths.append(file)
		else:
			path = self.get_path(relative_path)
			if filter is None or filter(path):
				paths.append(path)
		return paths

	def get_adb(self):
		try:
			import shutil
			if shutil.which("adb") is not None:
				return "adb"
		except:
			pass
		if platform.system() == "Windows":
			return self.get_path("toolchain/adb/adb.exe")
		return self.get_path("toolchain/adb/adb")

class ToolchainMakeConfig(MakeConfig):
	def __init__(self, filename):
		prototype = MakeConfig(filename)
		self.current_project = prototype.get_value("currentProject", None)
		if self.current_project is not None:
			self.project_unique_name = self.unique_folder_name(self.current_project)
			MakeConfig.__init__(self, join(
				prototype.root_dir, self.current_project, "make.json"
			), MakeConfig(filename))
		else:
			MakeConfig.__init__(self, filename)

	def assure_project_selected(self):
		if self.current_project is None:
			from task import registered_tasks
			print("Not found any opened project, nothing to do.")
			registered_tasks["selectProject"]()
			return MAKE_CONFIG.assure_project_selected()

	def get_path(self, relative_path):
		self.assure_project_selected()
		return MakeConfig.get_path(self, relative_path)

	def get_paths(self, relative_path, filter = None, paths = None):
		self.assure_project_selected()
		return MakeConfig.get_paths(self, relative_path, filter, paths)

	def get_build_path(self, relative_path):
		self.assure_project_selected()
		return self.prototype.get_path(join(
			"toolchain", "build", self.project_unique_name, relative_path
		))

	@staticmethod
	def unique_folder_name(path):
		md5 = hashlib.md5()
		md5.update(bytes(path, "utf-8"))
		return basename(path) + "-" + md5.hexdigest()


# search for toolchain.json
MAKE_CONFIG = None
for i in range(0, 4):
	make_file = join("../" * i, "toolchain.json")
	if isfile(make_file):
		MAKE_CONFIG = ToolchainMakeConfig(make_file)
		break
if MAKE_CONFIG is None:
	raise RuntimeError("Not found toolchain.json!")
TOOLCHAIN_CONFIG = MakeConfig(MAKE_CONFIG.filename) \
	if MAKE_CONFIG.current_project is None else MAKE_CONFIG.prototype
