import os
from os.path import join, isdir, basename, isfile, normpath, relpath
import glob
import json
import re
import subprocess

from .utils import copy_file
from .workspace import TSCONFIG, TSCONFIG_TOOLCHAIN, WORKSPACE_COMPOSITE
from .make_config import MAKE_CONFIG
from .hash_storage import BUILD_STORAGE

TSCONFIG_DEPENDENTS = {
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

# Exclude toolchain overrided options
for key in TSCONFIG_TOOLCHAIN:
	if key in TSCONFIG_DEPENDENTS:
		del TSCONFIG_DEPENDENTS[key]

temp_directory = MAKE_CONFIG.get_build_path("sources")

class Includes:
	def __init__(self, directory, includes_file, debug_build = False):
		if not isdir(directory):
			raise NotADirectoryError(directory)

		self.directory = directory
		self.includes_file = includes_file
		self.file = join(directory, includes_file)
		self.debug_build = debug_build

		self.include = []
		self.exclude = []
		self.params = {}

	def read(self):
		dependents = []
		with open(self.file, encoding="utf-8") as includes:
			for line in includes:
				self.decode_line(line.strip(), dependents)
		for dependent in dependents:
			if (dependent in TSCONFIG_DEPENDENTS and TSCONFIG_DEPENDENTS[dependent] in self.params and self.params[TSCONFIG_DEPENDENTS[dependent]] == True):
				self.params[TSCONFIG_DEPENDENTS[dependent]] = not self.params[TSCONFIG_DEPENDENTS[dependent]]

	def decode_param(self, key, value = None, dependents = []):
		default = TSCONFIG_TOOLCHAIN[key] if key in TSCONFIG_TOOLCHAIN else TSCONFIG[key]
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
			print("WARNING: Tsc option", key, "not corresponds to any value!")
		elif isinstance(default, bool):
			self.params[key] = not default
			dependents.append(key)
		else:
			self.params = default

	def decode_line(self, line, dependents = []):
		if line.startswith("#") or line.startswith("//"): # comment or parameter
			line = line[2:] if line.startswith("//") else line[1:]
			key, *values = [item.strip() for item in line.split(":", 1)]
			if key in TSCONFIG:
				if not key.startswith("!"):
					self.decode_param(key, values[0] if len(values) > 0 else None, dependents)
				else:
					key = key[1:].strip()
					if key in TSCONFIG_TOOLCHAIN and key in TSCONFIG:
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

	def parse(self):
		with open(self.file, "w") as includes:
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
	def create_from_directory(directory, includes_file, debug_build = False):
		includes = Includes(directory, includes_file, debug_build)
		for dirpath, dirnames, filenames in os.walk(directory):
			for filename in filenames:
				if filename.endswith(".js") or filename.endswith(".ts"):
					includes.include.append(normpath(join(relpath(dirpath, directory), filename)))
		includes.parse()

		return includes

	@staticmethod
	def create_from_tsconfig(directory, includes_file, debug_build = False):
		with open(join(directory, "tsconfig.json")) as tsconfig:
			config = json.load(tsconfig)

			params = config["compilerOptions"] if "compilerOptions" in config else {}
			include = config["include"] if "include" in config else []
			exclude = config["exclude"] if "exclude" in config else []

			if "outFile" in params:
				del params["outFile"]

		includes = Includes(directory, includes_file, debug_build)
		includes.include = include
		includes.exclude = exclude
		includes.params = params
		includes.parse()

		return includes

	@staticmethod
	def invalidate(directory, includes_file, debug_build = False):
		if not isfile(join(directory, includes_file)):
			tsconfig_path = join(directory, "tsconfig.json")
			if isfile(tsconfig_path):
				includes = Includes.create_from_tsconfig(directory, includes_file, debug_build)
			else:
				includes = Includes.create_from_directory(directory, includes_file, debug_build)
		else:
			includes = Includes(directory, includes_file, debug_build)
			includes.read()

		return includes

	def get_tsconfig(self):
		return join(self.directory, "tsconfig.json")

	def create_tsconfig(self, temp_path):
		template = {
			"extends": relpath(WORKSPACE_COMPOSITE.get_tsconfig(), self.directory),
			"compilerOptions": {
				"outFile": temp_path
			},
			"exclude": self.exclude,
			"include": self.include,
		}

		for key, value in self.params.items():
			template["compilerOptions"][key] = value
		with open(self.get_tsconfig(), "w") as tsconfig:
			tsconfig.write(json.dumps(template, indent="\t") + "\n")

	def compute(self, target_path, language = "typescript"):
		temp_path = join(temp_directory, basename(target_path))
		if BUILD_STORAGE.is_path_changed(self.directory) or not isfile(temp_path):
			if language == "typescript":
				print(f"Computing {basename(target_path)} tsconfig from {self.includes_file}")
				self.create_tsconfig(temp_path)
			return True
		return False

	def build(self, target_path, language = "typescript"):
		temp_path = join(temp_directory, basename(target_path))
		result = 0

		if BUILD_STORAGE.is_path_changed(self.directory) or not isfile(temp_path):
			print(f"Building {basename(target_path)} from {self.includes_file}")

			import datetime
			start_time = datetime.datetime.now()
			result = self.build_source(temp_path, language)
			end_time = datetime.datetime.now()
			diff = end_time - start_time

			print(f"Completed {basename(target_path)} build in {round(diff.total_seconds(), 2)}s with result {result} - {'OK' if result == 0 else 'ERROR'}")
			if result != 0:
				return result

			BUILD_STORAGE.is_path_changed(self.directory, True)
			BUILD_STORAGE.save()
		else:
			print(f"* Build target {basename(target_path)} is not changed")

		return result

	def build_source(self, temp_path, language = "typescript"):
		if language.lower() == "typescript":
			command = [
				"tsc",
				"--project", self.get_tsconfig(),
				*MAKE_CONFIG.get_value("development.tsc", [])
			]
			if self.debug_build:
				# Do NOT resolve down-level declaration, like android.d.ts if it not included
				command.append("--noResolve")
				# Do NOT check declarations to resolve conflicts and something else due to --noResolve
				command.append("--skipLibCheck")
			return subprocess.call(command)

		else:
			with open(temp_path, "w", encoding="utf-8") as source:
				first_file = True
				for search_path in self.include:
					for filename in glob.glob(join(self.directory, search_path), recursive=True):
						if not filename in self.exclude and isfile(filename) and filename.endswith(".js"):
							if first_file: first_file = False
							else: source.write("\n\n")
							source.write("// file: " + relpath(filename, self.directory) + "\n\n")
							source.writelines(open(filename, encoding="utf-8").read().strip())
			return 0
