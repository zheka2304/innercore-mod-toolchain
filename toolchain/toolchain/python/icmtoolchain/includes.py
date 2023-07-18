import glob
import json
import os
import platform
import re
import subprocess
from os.path import basename, isdir, isfile, join, normpath, relpath
from typing import Any, Dict, Final, List

from . import GLOBALS, PROPERTIES
from .shell import debug, error, info, warn
from .utils import ensure_file_directory
from .workspace import TSCONFIG

# Will be excluded with toolchain overriden options
TSCONFIG_DEPENDENTS: Dict[str, Any] = {
	"allowSyntheticDefaultImports": "esModuleInterop",
	"alwaysStrict": "strict",
	"noImplicitAny": "strict",
	"noImplicitThis": "strict",
	"strictBindCallApply": "strict",
	"strictFunctionTypes": "strict",
	"strictNullChecks": "strict",
	"strictPropertyInitialization": "strict",
	"incremental": "composite",
	"declaration": "composite"
}


class Includes:
	directory: Final[str]; includes: Final[str]; path: Final[str]
	include: List[str]; exclude: List[str]; params: Dict[str, Any]

	def __init__(self, directory: str, includes_path: str) -> None:
		if not isdir(directory):
			raise NotADirectoryError(directory)
		self.directory = directory
		self.includes = includes_path
		self.path = join(directory, includes_path)
		self.include = list()
		self.exclude = list()
		self.params = dict()

	def read(self) -> None:
		dependents = list()
		with open(self.path, encoding="utf-8") as includes:
			for line in includes:
				self.decode_line(line.strip(), dependents)
		for dependent in dependents:
			if (dependent in GLOBALS.TSCONFIG_DEPENDENTS and GLOBALS.TSCONFIG_DEPENDENTS[dependent] in self.params and self.params[GLOBALS.TSCONFIG_DEPENDENTS[dependent]] == True):
				self.params[GLOBALS.TSCONFIG_DEPENDENTS[dependent]] = not self.params[GLOBALS.TSCONFIG_DEPENDENTS[dependent]]

	def decode_param(self, key: str, value: Any, dependents: List[str]) -> None:
		default = GLOBALS.TSCONFIG_TOOLCHAIN[key] if key in GLOBALS.TSCONFIG_TOOLCHAIN else TSCONFIG[key]
		if value is not None:
			if value.lower() in ["true", "false"]:
				self.params[key] = value.lower() == "true"
			elif default is None:
				self.params[key] = value
			elif isinstance(default, list):
				self.params[key] = [next.strip() for next in value.split(",")]
			elif isinstance(default, int):
				self.params[key] = int(value)
			else:
				self.params[key] = value
		elif default is None:
			warn(f"* Option {key} not corresponds to any default value!")
		elif isinstance(default, bool):
			self.params[key] = not default
			dependents.append(key)
		else:
			self.params = default

	def decode_line(self, line: str, dependents: List[str]) -> None:
		if line.startswith("#") or line.startswith("//"): # comment or parameter
			line = line[2:] if line.startswith("//") else line[1:]
			key, *values = [item.strip() for item in line.split(":", 1)]
			if key in TSCONFIG:
				if not key.startswith("!"):
					self.decode_param(key, values[0] if len(values) > 0 else None, dependents)
				else:
					key = key[1:].strip()
					if key in GLOBALS.TSCONFIG_TOOLCHAIN and key in TSCONFIG:
						self.params[key] = TSCONFIG[key]
					elif key in self.params:
						del self.params[key]
		elif len(line) == 0:
			return
		elif line.startswith("!"):
			line = line[1:].strip()
			search_path = (join(self.directory, line[:-2], ".") + "/**/*") \
				if line.endswith("/.") else join(self.directory, line)
			for file in glob.glob(search_path, recursive=True):
				file = normpath(file)
				if file not in self.include:
					self.exclude.append(relpath(file, self.directory).replace("\\", "/"))
		else:
			search_path = re.sub(r"\.$", "**/*", line) if line.endswith("/.") else line
			self.include.append(search_path.replace("\\", "/"))

	def parse(self) -> None:
		with open(self.path, "w") as includes:
			for key, value in self.params.items():
				if value is None:
					includes.write("# !" + key + "\n")
					continue
				includes.write("# " + key + ": ")
				if isinstance(value, bool):
					includes.write("true" if value == True else "false")
				elif isinstance(value, list):
					includes.write(", ".join(value))
				else:
					includes.write(value)
				includes.write("\n")
			if len(self.params) > 0:
				includes.write("\n")
			includes.writelines([
				file + "\n" for file in self.include
			])
			includes.writelines([
				"!" + file + "\n" for file in self.exclude
			])

	@staticmethod
	def create_from_directory(directory: str, includes_path: str) -> 'Includes':
		includes = Includes(directory, includes_path)
		for dirpath, dirnames, filenames in os.walk(directory):
			for filename in filenames:
				if filename.endswith(".js") or filename.endswith(".ts"):
					includes.include.append(normpath(join(relpath(dirpath, directory), filename)))
		includes.parse(); return includes

	@staticmethod
	def create_from_tsconfig(directory: str, includes_path: str) -> 'Includes':
		with open(join(directory, "tsconfig.json")) as tsconfig:
			config = json.load(tsconfig)
			params = config["compilerOptions"] if "compilerOptions" in config else dict()
			include = config["include"] if "include" in config else list()
			exclude = config["exclude"] if "exclude" in config else list()
			if "outFile" in params: del params["outFile"]

		includes = Includes(directory, includes_path)
		includes.include = include
		includes.exclude = exclude
		includes.params = params
		includes.parse(); return includes

	@staticmethod
	def invalidate(directory: str, includes_path: str) -> 'Includes':
		if not isfile(join(directory, includes_path)):
			tsconfig_path = join(directory, "tsconfig.json")
			if isfile(tsconfig_path):
				includes = Includes.create_from_tsconfig(directory, includes_path)
			else:
				includes = Includes.create_from_directory(directory, includes_path)
		else:
			includes = Includes(directory, includes_path)
			includes.read()
		return includes

	def get_tsconfig(self) -> str:
		return join(self.directory, "tsconfig.json")

	def create_tsconfig(self, temporary_path: str) -> None:
		template = {
			"extends": relpath(GLOBALS.WORKSPACE_COMPOSITE.get_tsconfig(), self.directory),
			"compilerOptions": {
				"outFile": temporary_path
			},
			"exclude": self.exclude,
			"include": self.include,
		}

		for key, value in self.params.items():
			template["compilerOptions"][key] = value
		with open(self.get_tsconfig(), "w") as tsconfig:
			tsconfig.write(json.dumps(template, indent="\t") + "\n")

	def compute(self, target_path: str, language: str = "typescript") -> bool:
		temp_path = join(GLOBALS.MAKE_CONFIG.get_build_path("sources"), basename(target_path))
		if GLOBALS.BUILD_STORAGE.is_path_changed(self.directory) or not isfile(temp_path):
			if language == "typescript":
				debug(f"Computing {basename(target_path)!r} tsconfig from {self.includes!r}")
				self.create_tsconfig(temp_path)
			return True
		return False

	def build(self, target_path: str, language: str = "typescript") -> int:
		temporary_path = join(GLOBALS.MAKE_CONFIG.get_build_path("sources"), basename(target_path))
		overall_result = 0

		from time import time
		if GLOBALS.BUILD_STORAGE.is_path_changed(self.directory) or not isfile(temporary_path):
			debug(f"Building {basename(target_path)!r} from {self.includes!r}")

			startup_millis = time()
			overall_result = self.build_source(temporary_path, language)

			startup_millis = time() - startup_millis
			if overall_result == 0:
				print(f"Completed {basename(target_path)!r} flushing in {startup_millis:.2f}s!")
			else:
				error(f"Failed {basename(target_path)!r} flushing in {startup_millis:.2f}s with result {overall_result}.")
				return overall_result

			GLOBALS.BUILD_STORAGE.is_path_changed(self.directory, True)
			GLOBALS.BUILD_STORAGE.save()
		else:
			info(f"* Build target {basename(target_path)} is not changed.")

		return overall_result

	def build_source(self, temporary_path: str, language: str = "typescript") -> int:
		ensure_file_directory(temporary_path)

		if language.lower() == "typescript":
			command = [
				"tsc",
				"--project", self.get_tsconfig(),
				*GLOBALS.PREFERRED_CONFIG.get_value("development.tsc", list())
			]
			if not PROPERTIES.get_value("release"):
				# Do NOT resolve down-level declaration, like 'android.d.ts' if it not included
				command.append("--noResolve")
				# Do NOT check declarations to resolve conflicts and something else due to --noResolve
				command.append("--skipLibCheck")
			return subprocess.call(command, shell=platform.system() == "Windows")

		else:
			with open(temporary_path, "w", encoding="utf-8") as source:
				first_file = True
				for search_path in self.include:
					for filepath in glob.glob(join(self.directory, search_path), recursive=True):
						filename = relpath(filepath, self.directory)
						if not filename in self.exclude and filename.endswith(".js") and isfile(filepath):
							if first_file: first_file = False
							else: source.write("\n\n")
							source.write("// file: " + filename + "\n\n")
							source.writelines(open(filepath, encoding="utf-8").read().strip())

		return 0
