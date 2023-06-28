import json
import os
import platform
import sys
from os.path import abspath, basename, exists, isdir, isfile, join, realpath
from typing import Callable, Final, List, Optional

from .base_config import BaseConfig

try:
	from hashlib import blake2s as encode
except ImportError:
	from hashlib import md5 as encode


class MakeConfig(BaseConfig):
	path: Final[str]; directory: Final[str]

	def __init__(self, path: str, prototype: Optional[BaseConfig] = None) -> None:
		if not isfile(path):
			from .task import error
			error(f"Not found '{basename(path)}', are you sure that selected project exists?")
		self.path = path
		self.directory = abspath(join(self.path, ".."))
		with open(path, encoding="utf-8") as file:
			self.json = json.load(file)
		if prototype is not None:
			self.upgrade()
		BaseConfig.__init__(self, self.json, prototype)

	def upgrade(self) -> bool:
		changes = False
		if "global" in self.json:
			globalconfig = self.get_value("global", {})
			for entry in globalconfig:
				self.set_value(entry, globalconfig[entry])
			self.remove_value("global")
			self.save(); changes |= True
		if "make" in self.json:
			makeconfig = self.get_value("make", {})
			if "linkNative" in makeconfig:
				self.set_value("linkNative", makeconfig["linkNative"])
			if "excludeFromRelease" in makeconfig:
				self.set_value("excludeFromRelease", makeconfig["excludeFromRelease"])
			self.remove_value("make")
			self.save(); changes |= True
		return changes

	def save(self) -> None:
		with open(self.path, "w", encoding="utf-8") as file:
			file.write(json.dumps(self.json, indent="\t") + "\n")

	def get_absolute_path(self, path: str) -> str:
		relative_path = self.get_path(path)
		return relative_path if exists(relative_path) else abspath(path) if exists(abspath(path)) else relative_path

	def get_path(self, relative_path: str) -> str:
		return abspath(join(self.directory, relative_path))

	def get_paths(self, relative_path: str, filter: Optional[Callable[[str], bool]] = None, locations: Optional[List[str]] = None) -> List[str]:
		if locations is None:
			locations = []
		if len(relative_path) > 0 and relative_path[-1] == "*":
			path = self.get_path(relative_path[:-1])
			if not isdir(path):
				return locations
			for filename in os.listdir(path):
				file = join(path, filename)
				if filter is None or filter(file):
					locations.append(file)
		else:
			path = self.get_path(relative_path)
			if filter is None or filter(path):
				locations.append(path)
		return locations

	def get_adb(self) -> str:
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
	prototype: Optional[MakeConfig]
	current_project: Optional[str]; project_unique_name: Optional[str]

	def __init__(self, path: str) -> None:
		prototype = MakeConfig(path)
		self.current_project = prototype.get_value("currentProject")
		if self.current_project is None and len(prototype.get_value("projectLocations", [])) == 0:
			self.current_project = "."
		if self.current_project is not None:
			make_path = prototype.get_absolute_path(self.current_project + "/make.json")
			if isfile(make_path):
				MakeConfig.__init__(self, make_path, MakeConfig(path))
				self.project_unique_name = self.unique_folder_name(self.directory)
				return
			self.current_project = None
		MakeConfig.__init__(self, path)

	def assure_project_selected(self) -> None:
		if self.current_project is None:
			from .task import registered_tasks
			print("Not found any opened project, nothing to do.")
			registered_tasks["selectProject"]()
			return MAKE_CONFIG.assure_project_selected()

	def get_path(self, relative_path: str) -> str:
		self.assure_project_selected()
		return MakeConfig.get_path(self, relative_path)

	def get_absolute_path(self, path: str) -> str:
		self.assure_project_selected()
		return MakeConfig.get_absolute_path(self, path)

	def get_paths(self, relative_path: str, filter: Optional[Callable[[str], bool]] = None, locations: Optional[List[str]] = None) -> List[str]:
		self.assure_project_selected()
		return MakeConfig.get_paths(self, relative_path, filter, locations)

	def get_build_path(self, relative_path: str) -> str:
		self.assure_project_selected()
		if self.prototype is None:
			raise RuntimeError("ToolchainMakeConfig prototype is 'None', config corrupted!")
		return self.prototype.get_path(join(
			"toolchain", "build", self.get_project_unique_name(), relative_path
		))

	def get_project_unique_name(self) -> str:
		if self.project_unique_name is None:
			raise ValueError("Unique name not found, are you sure that project selected?")
		return self.project_unique_name

	@staticmethod
	def unique_folder_name(path: str) -> str:
		return basename(path) + "-" + encode(bytes(path, "utf-8")).hexdigest()[-5:]


def find_config(path: str, filename: str) -> Optional[ToolchainMakeConfig]:
	working_path = path.split(os.sep)
	while len(working_path) > 1:
		config_path = join(os.sep.join(working_path), filename)
		if isfile(config_path):
			return ToolchainMakeConfig(config_path)
		working_path.pop()

__make = None

# Search for toolchain.json or make.json
for filename in ("toolchain.json", "make.json"):
	__make = find_config(os.getcwd(), filename)
	if __make is None and len(sys.argv[0]) > 0:
		__make = find_config(join(sys.argv[0], ".."), filename)
	if __make is None:
		try:
			__make = find_config(realpath(join(__file__, "..")), filename)
		except NameError:
			pass
	if __make is not None:
		break

if __make is None:
	raise LookupError("Not found 'toolchain.json' or project 'make.json'! Please, make sure that it appears in your working directory or any of it parents.")
__toolchain = MakeConfig(__make.path) \
	if __make.current_project is None else __make.prototype
if __toolchain is None:
	raise RuntimeError("ToolchainMakeConfig prototype is 'None', config corrupted!")
MAKE_CONFIG: Final[ToolchainMakeConfig] = __make
TOOLCHAIN_CONFIG: Final[MakeConfig] = __toolchain
