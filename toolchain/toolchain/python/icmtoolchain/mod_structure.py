import json
import os
from os.path import isdir, isfile, join, relpath
from typing import Any, Collection, Dict, Final, List, Optional

from . import GLOBALS
from .shell import warn
from .utils import ensure_directory, ensure_file_directory, remove_tree


class BuildTargetType:
	directory: Final[str]; property: Final[str]

	def __init__(self, directory: str, property: str) -> None:
		self.directory = directory
		self.property = property

class ModStructure:
	directory: Final[str]
	targets: Dict[str, List[Dict[Any, Any]]]
	build_targets: Dict[str, BuildTargetType]
	build_config: Optional[Dict[Any, Any]] = None

	def __init__(self, output_directory: str) -> None:
		self.directory = GLOBALS.MAKE_CONFIG.get_absolute_path(output_directory)
		self.targets = dict()
		self.setup_build_targets()

	def setup_build_targets(self):
		self.build_targets = {
			"resource_directory": BuildTargetType(GLOBALS.MAKE_CONFIG.get_value("target.resource_directory", "resources"), "resources"),
			"gui": BuildTargetType(GLOBALS.MAKE_CONFIG.get_value("target.gui", "gui"), "resources"),
			"minecraft_resource_pack": BuildTargetType(GLOBALS.MAKE_CONFIG.get_value("target.minecraft_resource_pack", "minecraft_packs/resource"), "resources"),
			"minecraft_behavior_pack": BuildTargetType(GLOBALS.MAKE_CONFIG.get_value("target.minecraft_behavior_pack", "minecraft_packs/behavior"), "resources"),

			"script_source": BuildTargetType(GLOBALS.MAKE_CONFIG.get_value("target.source", "source"), "compile"),
			"script_library": BuildTargetType(GLOBALS.MAKE_CONFIG.get_value("target.library", "library"), "compile"),
			"native": BuildTargetType(GLOBALS.MAKE_CONFIG.get_value("target.native", "native"), "nativeDirs"),
			"java": BuildTargetType(GLOBALS.MAKE_CONFIG.get_value("target.java", "java"), "javaDirs"),

			"shared_object": BuildTargetType(GLOBALS.MAKE_CONFIG.get_value("target.shared_object", "so"), "sharedObjects"),
		}

	def cleanup_build_target(self, keyword: str) -> None:
		target_type = self.build_targets[keyword]
		self.targets[keyword] = list()
		if target_type.directory == "":
			return
		directory = join(self.directory, target_type.directory)
		if relpath(directory, self.directory)[:2] == "..":
			warn(f"* Output target {keyword} is not relative to output, it will not be cleaned!")
			return
		if not GLOBALS.PREFERRED_CONFIG.get_value("development.clearOutput", False):
			remove_tree(directory)
		ensure_directory(directory)

	def new_build_target(self, keyword: str, name: str, **properties: Any) -> str:
		target_type = self.build_targets[keyword]
		formatted_name = name.format("")
		if keyword in self.targets:
			targets_by_name = list(map(lambda x: x["name"], self.targets[keyword]))
			index = 0
			while formatted_name in targets_by_name:
				formatted_name = name.format(index)
				index += 1
		else:
			self.targets[keyword] = list()

		target_path = join(self.directory, str(target_type.directory), formatted_name)
		self.targets[keyword].append({
			"name": formatted_name,
			"path": target_path,
			**properties
		})
		return target_path

	def get_all_targets(self, keyword: str, property: Any = None, values: Collection[Any] = ()) -> List[str]:
		targets = list()
		if keyword in self.targets:
			for target in self.targets[keyword]:
				if property is None or property in target and target[property] in values:
					targets.append(target)
		return targets

	def get_target_directories(self, *names: str, filter_unchanged: bool = False) -> List[str]:
		return list(map(lambda name: self.build_targets[name].directory,
			filter(lambda name: name in self.targets \
				and len(self.targets[name]) > 0, names) if filter_unchanged else names
		))

	def create_build_config_list(self, name: str, overrides: Optional[Dict[Any, Any]] = None) -> List[Any]:
		result = list()
		for target_name, target_type in self.build_targets.items():
			if target_type.property == name and target_name in self.targets:
				for target in self.targets[target_name]:
					if "exclude" not in target or not target["exclude"]:
						result.append({
							"path": target_type.directory + "/" + target["name"],
							**(target["declare"] if "declare" in target else dict())
						})
					if overrides is not None and "declare_default" in target:
						for key, value in target["declare_default"].items():
							overrides[key] = value
		return result

	def read_or_create_build_config(self) -> None:
		build_config_file = join(self.directory, "build.config")
		if isfile(build_config_file):
			with open(build_config_file, "r", encoding="utf-8") as build_config:
				try:
					self.build_config = json.loads(build_config.read())
					return
				except json.JSONDecodeError as err:
					warn("* Something went wrong while reading cached build config:", err.msg)
		self.build_config = dict()

	def write_build_config(self) -> None:
		if not self.build_config:
			return
		build_config_path = join(self.directory, "build.config")
		if isdir(build_config_path):
			remove_tree(build_config_path)
			os.remove(build_config_path)
		ensure_file_directory(build_config_path)
		if not GLOBALS.MAKE_CONFIG.has_value("manifest"):
			with open(build_config_path, "w", encoding="utf-8") as file:
				file.write(json.dumps(self.build_config, indent=" " * 2))

	def setup_default_config(self) -> None:
		self.read_or_create_build_config()
		if not isinstance(self.build_config, dict):
			raise SystemError()
		if "defaultConfig" not in self.build_config or not isinstance(self.build_config["defaultConfig"], dict):
			self.build_config["defaultConfig"] = dict()
		default_config = self.build_config["defaultConfig"]
		default_config["readme"] = "this build config is generated automatically by mod development toolchain"
		default_config["api"] = GLOBALS.MAKE_CONFIG.get_value("api", fallback="CoreEngine", accept_prototype=False)
		optimization_level = GLOBALS.MAKE_CONFIG.get_value("optimizationLevel", accept_prototype=False)
		if optimization_level is not None:
			default_config["optimizationLevel"] = min(max(int(optimization_level), -1), 9)
		setup_script = GLOBALS.MAKE_CONFIG.get_value("setupScript", accept_prototype=False)
		if setup_script:
			default_config["setupScript"] = setup_script
		default_config["buildType"] = "develop"
		if "buildDirs" not in self.build_config:
			self.build_config["buildDirs"] = list()
		self.write_build_config()

	def update_build_config_list(self, name) -> None:
		self.setup_default_config()
		if not self.build_config:
			raise SystemError()
		self.build_config[name] = self.create_build_config_list(name, self.build_config["defaultConfig"])
		self.write_build_config()
