import json
import os
import platform
from os.path import (abspath, basename, exists, isdir, isfile, join, realpath,
                     relpath)
from typing import Callable, Final, List, Optional

from .base_config import BaseConfig
from .shell import abort
from .utils import ensure_file_directory

try:
	from hashlib import blake2s as encode
except ImportError:
	from hashlib import md5 as encode


class ToolchainConfig(BaseConfig):
	path: Final[str]; directory: Final[str]

	def __init__(self, path: str, prototype: Optional[BaseConfig] = None) -> None:
		self.path = path
		self.directory = abspath(join(self.path, ".."))
		with open(path, encoding="utf-8") as file:
			self.json = json.load(file)
		BaseConfig.__init__(self, self.json, prototype)
		if not prototype and basename(path) in ("make.json", "toolchain.json"):
			self.upgrade()

	def upgrade(self) -> bool:
		changes = False
		if "global" in self.json:
			global_config = self.get_value("global", dict())
			for entry in global_config:
				self.set_value(entry, global_config[entry])
			self.remove_value("global")
			self.save(); changes |= True
		if "make" in self.json:
			make_config = self.get_value("make", dict())
			if "linkNative" in make_config:
				self.set_value("linkNative", make_config["linkNative"])
			if "excludeFromRelease" in make_config:
				self.set_value("excludeFromRelease", make_config["excludeFromRelease"])
			self.remove_value("make")
			self.save(); changes |= True
		if "gradle" in self.json:
			gradle_config = self.get_value("gradle", dict())
			java_config = self.get_value("java", dict())
			for entry in gradle_config:
				java_config.set_value(entry, gradle_config[entry])
			self.set_value("java", java_config)
			self.remove_value("gradle")
			self.save(); changes |= True
		return changes

	def save(self) -> None:
		ensure_file_directory(self.path)
		with open(self.path, "w", encoding="utf-8") as file:
			file.write(json.dumps(self.json, indent="\t") + "\n")

	def get_path(self, relative_path: str) -> str:
		return abspath(join(self.directory, relative_path))

	def get_absolute_path(self, path: str) -> str:
		relative_path = self.get_path(path)
		if exists(relative_path):
			return relative_path
		path = abspath(path)
		if exists(path):
			return path
		return relative_path

	def get_relative_path(self, path: str) -> str:
		absolute_path = self.get_absolute_path(path)
		return relpath(absolute_path, self.directory)

	def get_paths(self, relative_path: str, filter: Optional[Callable[[str], bool]] = None, locations: Optional[List[str]] = None) -> List[str]:
		if not locations:
			locations = list()
		if len(relative_path) > 0 and relative_path[-1] == "*":
			path = self.get_path(relative_path[:-1])
			if not isdir(path):
				return locations
			for filename in os.listdir(path):
				file = join(path, filename)
				if not filter or filter(file):
					locations.append(file)
		else:
			path = self.get_path(relative_path)
			if not filter or filter(path):
				locations.append(path)
		return locations

	def get_adb(self) -> str:
		try:
			import shutil
			if shutil.which("adb"):
				return "adb"
		except:
			pass
		if platform.system() == "Windows":
			return self.get_path("toolchain/adb/adb.exe")
		return self.get_path("toolchain/adb/adb")

class MakeConfig(ToolchainConfig):
	prototype: ToolchainConfig; current_project: Final[str]; project_unique_name: Final[str]

	def __init__(self, path: str, prototype: ToolchainConfig) -> None:
		if not isfile(path):
			abort(f"Not found {basename(path)!r}, are you sure that selected project exists?")
		self.current_project = prototype.get_value("currentProject")
		ToolchainConfig.__init__(self, path, prototype)
		self.project_unique_name = self.unique_folder_name(self.directory)

	def get_build_path(self, relative_path: str) -> str:
		return self.prototype.get_path(join(
			"toolchain", "build", self.project_unique_name, relative_path
		))

	@staticmethod
	def unique_folder_name(path: str) -> str:
		return basename(path) + "-" + encode(bytes(path, "utf-8")).hexdigest()[-5:]
