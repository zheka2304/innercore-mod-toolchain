import os
import os.path
import json

from make_config import make_config
from utils import ensure_directory, clear_directory, ensure_file_dir


class BuildTargetType:
	def __init__(self, directory=None, list_property=None, **kw):
		self.directory = directory
		self.list_property = list_property


BUILD_TARGETS = {
	"resource_directory": BuildTargetType(directory="resources", list_property="resources"),
	"gui": BuildTargetType(directory="gui", list_property="resources"),
	"minecraft_resource_pack": BuildTargetType(directory="minecraft_packs/resource", list_property="resources"),
	"minecraft_behavior_pack": BuildTargetType(directory="minecraft_packs/behavior", list_property="resources"),

	"script_source": BuildTargetType(directory="source", list_property="compile"),
	"script_library": BuildTargetType(directory="library", list_property="compile"),
	"native": BuildTargetType(directory="native", list_property="nativeDirs"),
	"java": BuildTargetType(directory="java", list_property="javaDirs")
}


class ModStructure:
	def __init__(self, output_directory):
		self.directory = make_config.get_path(output_directory)
		self.targets = {}
		self.build_config = None

	def cleanup_build_target(self, target_type_name):
		target_type = BUILD_TARGETS[target_type_name]
		self.targets[target_type_name] = []
		directory = os.path.join(self.directory, target_type.directory)
		clear_directory(directory)
		ensure_directory(directory)

	def new_build_target(self, target_type_name, name, **properties):
		target_type = BUILD_TARGETS[target_type_name]
		formatted_name = name.format("")
		if target_type_name in self.targets:
			targets_by_name = list(map(lambda x: x["name"], self.targets[target_type_name]))
			index = 0
			while formatted_name in targets_by_name:
				formatted_name = name.format(index)
				index += 1
		else:
			self.targets[target_type_name] = []

		target_path = os.path.join(self.directory, target_type.directory, formatted_name)
		self.targets[target_type_name].append({"name": formatted_name, "path": target_path, **properties})
		return target_path

	def get_all_targets(self, target_type, prop=None, values=()):
		targets = []
		if target_type in self.targets:
			for target in self.targets[target_type]:
				if prop is None or prop in target and target[prop] in values:
					targets.append(target)
		return targets

	def get_target_directories(self, *names, filter_unchanged=False):
		return list(map(lambda name: BUILD_TARGETS[name].directory, filter(lambda name: name in self.targets and len(self.targets[name]) > 0, names) if filter_unchanged else names))

	def create_build_config_list(self, list_name, default_overrides=None):
		result = []
		for target_name, target_type in BUILD_TARGETS.items():
			if target_type.list_property == list_name and target_name in self.targets:
				for target in self.targets[target_name]:
					if "exclude" not in target or not target["exclude"]:
						result.append({"path": target_type.directory + "/" + target["name"], **(target["declare"] if "declare" in target else {})})
					if default_overrides is not None and "declare_default" in target:
						for key, value in target["declare_default"].items():
							default_overrides[key] = value
		return result

	def read_or_create_build_config(self):
		build_config_file = os.path.join(self.directory, "build.config")
		if os.path.isfile(build_config_file):
			with open(build_config_file, "r", encoding="utf-8") as build_config:
				try:
					self.build_config = json.loads(build_config.read())
					return
				except json.JSONDecodeError as e:
					print("error occurred while reading cached build config:", e)
		self.build_config = {}

	def write_build_config(self):
		if self.build_config is None:
			return
		build_config_file = os.path.join(self.directory, "build.config")
		if os.path.isdir(build_config_file):
			clear_directory(build_config_file)
			os.remove(build_config_file)
		ensure_file_dir(build_config_file)
		with open(build_config_file, "w", encoding="utf-8") as build_config:
			build_config.write(json.dumps(self.build_config, indent=" " * 4))

	def setup_default_config(self):
		self.read_or_create_build_config()
		if "defaultConfig" not in self.build_config or not isinstance(self.build_config["defaultConfig"], dict):
			self.build_config["defaultConfig"] = {}
		default_config = self.build_config["defaultConfig"]
		default_config["readme"] = "this build config is generated automatically by mod development toolchain"
		default_config["api"] = make_config.get_value("global.api", fallback="CoreEngine")
		default_config["buildType"] = "develop"
		self.write_build_config()

	def update_build_config_list(self, list_name):
		self.setup_default_config()
		self.build_config[list_name] = self.create_build_config_list(list_name, default_overrides=self.build_config["defaultConfig"])
		self.write_build_config()


mod_structure = ModStructure("output")


