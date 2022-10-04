import os
from os.path import join, exists, basename, isfile, normpath, splitext, relpath
import glob
import json
import re
import subprocess

from utils import move_file, copy_file
from make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from hash_storage import build_storage

params_list = {
	"allowJs": False,
	"allowUnusedLabels": False,
	"alwaysStrict":	 False,
	"assumeChangesOnlyAffectDirectDependencies": False,
	"checkJs": False,
	"declaration": False,
	"diagnostics": False,
	"disableSizeLimit":	False,
	"downlevelIteration": False,
	"emitDeclarationOnly": False,
	"experimentalDecorators": False,
	"extendedDiagnostics": False,
	"importHelpers": False,
	"listEmittedFiles":	False,
	"listFiles": False,
	"locale": "en",
	"noEmit": False,
	"noEmitHelpers": False,
	"noEmitOnError": False,
	"noErrorTruncation": False,
	"noFallthroughCasesInSwitch": False,
	"noLib": False,
	"noResolve": False,
	"noStrictGenericChecks": False,
	"noUnusedLocals": False,
	"noUnusedParameters": False,
	"preserveConstEnums": False,
	"preserveSymlinks":	False,
	"pretty": True,
	"removeComments": False,
	"showConfig": False,
	"skipLibCheck": False,
	"sourceMap": False,
	"strict": False,
	"tsBuildInfoFile": ".tsbuildinfo"
}

temp_directory = MAKE_CONFIG.get_build_path("sources")

class Includes:
	def __init__(self, directory, includes_file, debug_build = False):
		self.file = join(directory, includes_file)
		self.includes_file = includes_file
		self.directory = directory
		self.debug_build = debug_build

		self.include = []
		self.exclude = []
		self.params = {}

	def read(self):
		with open(self.file, encoding="utf-8") as includes:
			for line in includes:
				line = line.strip()
				self.decode_line(line)

	def decode_line(self, line):
		if line.startswith("#"): # comment or parameter
			pair = [item.strip() for item in line[1:].strip().split(":")]
			key = pair[0]

			if key in params_list:
				default = params_list[key]

				if len(pair) > 1:
					v = pair[1].lower()
					self.params[key] = v == "true" if v in ["true", "false"] else v
				else:
					self.params[key] = True if isinstance(default, bool) else default

		elif len(line) < 1 or line.startswith("//"):
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

	def create(self):
		with open(self.file, "w") as includes:
			params = ["# " + key + ((": " + str(self.params[key])).lower() if not self.params[key] else "") + "\n" for key in self.params]
			files = [file + "\n" for file in self.include]

			includes.writelines(params)
			includes.write("\n")
			includes.writelines(files)

	@staticmethod
	def create_from_directory(directory, includes_file, debug_build = False):
		includes = Includes(directory, includes_file, debug_build)
		includes.files = [normpath(relpath(file, directory))
			for file in glob.glob(f"{directory}/**/*", recursive=True)]
		includes.params = {}
		includes.create()

		return includes

	@staticmethod
	def create_from_tsconfig(directory, includes_file, debug_build = False):
		with open(join(directory, "tsconfig.json")) as tsconfig:
			config = json.load(tsconfig)

			params = config["compilerOptions"]
			include = config["include"]
			exclude = config["exclude"]

			if "target" in params:
				del params["target"]
			if "lib" in params:
				del params["lib"]
			if "outFile" in params:
				del params["outFile"]

		includes = Includes(directory, includes_file, debug_build)
		includes.include = include
		includes.exclude = exclude
		includes.params = params
		includes.create()

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

	def build(self, target_path, language = "typescript"):
		temp_path = join(temp_directory, basename(target_path))

		result = 0
		if language == "typescript":
			self.create_tsconfig(temp_path)
		if build_storage.is_path_changed(self.directory):
			import datetime

			print(f"Building {basename(target_path)} from {self.includes_file}")

			start_time = datetime.datetime.now()
			result = self.build_source(temp_path, language)
			end_time = datetime.datetime.now()
			diff = end_time - start_time

			print(f"Completed {basename(target_path)} build in {round(diff.total_seconds(), 2)}s with result {result} - {'OK' if result == 0 else 'ERROR'}")
			if result != 0:
				return result
			build_storage.save()
		else:
			print(f"* Build target {basename(target_path)} is not changed")
		copy_file(temp_path, target_path)

		return result

	def get_tsconfig(self):
		return join(self.directory, "tsconfig.json")

	def create_tsconfig(self, temp_path):
		declarations = []
		if exists(TOOLCHAIN_CONFIG.get_path("toolchain/declarations")):
			declarations.extend(glob.glob(
				TOOLCHAIN_CONFIG.get_path("toolchain/declarations/**/*.d.ts"),
				recursive=True
			))
		declarations.extend(glob.glob(
			MAKE_CONFIG.get_build_path("declarations/**/*.d.ts"),
			recursive=True
		))

		current_name = splitext(basename(temp_path))[0]
		for declaration in declarations:
			if declaration.endswith(f"{current_name}.d.ts"):
				declarations.remove(declaration)

		if self.debug_build:
			for excluded in MAKE_CONFIG.get_value("debugIncludesExclude", []):
				if exists(str(excluded).lstrip("/").partition("/")[0]):
					for declaration in glob.glob(excluded, recursive=True):
						if declaration in declarations:
							declarations.remove(declaration)
				else:
					for declaration in glob.glob(TOOLCHAIN_CONFIG.get_path(excluded), recursive=True):
						if declaration in declarations:
							declarations.remove(declaration)

		template = {
			"compilerOptions": {
				"target": "ES5",
				"lib": ["ESNext"],
				"outFile": temp_path,
				"experimentalDecorators": True,
				"declaration": True,
				"downlevelIteration": True,
				"allowJs": True
			},
			"compileOnSave": False,
			"exclude": [
				"**/node_modules/*",
				"dom",
				"webpack"
			] + self.exclude,
			"include": self.include,
		}

		if len(declarations) > 0:
			template["files"] = declarations

		for key, value in self.params.items():
			template["compilerOptions"][key] = value

		with open(self.get_tsconfig(), "w") as tsconfig:
			json.dump(template, tsconfig, indent="\t")
			tsconfig.write("\n")

	def build_source(self, temp_path, language):
		if language.lower() == "typescript":
			command = [
				"tsc",
				"-p", self.get_tsconfig(),
				"--noEmitOnError"
			]
			if self.debug_build:
				command.append("--skipLibCheck")
				command.append("--noResolve")
			result = subprocess.call(command)
		else:
			result = 0

		declaration_path = f"{splitext(temp_path)[0]}.d.ts"
		if isfile(declaration_path):
			move_file(declaration_path, MAKE_CONFIG.get_build_path(
				"declarations/" + basename(declaration_path)
			))

		return result
