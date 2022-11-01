import os
from os.path import join, exists, basename, isfile, normpath, splitext, relpath
import glob
import json
import re
import subprocess

from .utils import move_file, copy_file
from .make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from .hash_storage import BUILD_STORAGE

# The TypeScript Compiler - Version 4.8.3
TSCONFIG = {
	# JavaScript Support
	"allowJs": False,
	"checkJs": False,
	"maxNodeModuleJsDepth": 0,

	# Interop Constraints
	"allowSyntheticDefaultImports": False,
	"esModuleInterop": False,
	"forceConsistentCasingInFileNames": False,
	"isolatedModules": False,
	"preserveSymlinks": False,

	# Modules
	"allowUmdGlobalAccess": False,
	"baseUrl": None,
	"module": None,
	"moduleResolution": "classic",
	"moduleSuffixes": [],
	"noResolve": False,
	"paths": [],
	"resolveJsonModule": False,
	"rootDir": [],
	"rootDirs": [],
	"typeRoots": [],
	"types": [],

	# Type Checking
	"allowUnreachableCode": None,
	"allowUnusedLabels": None,
	"alwaysStrict": False,
	"exactOptionalPropertyTypes": False,
	"noFallthroughCasesInSwitch": False,
	"noImplicitAny": False,
	"noImplicitOverride": False,
	"noImplicitReturns": False,
	"noImplicitThis": False,
	"noPropertyAccessFromIndexSignature": False,
	"noUncheckedIndexedAccess": False,
	"noUnusedLocals": False,
	"noUnusedParameters": False,
	"strict": False,
	"strictBindCallApply": False,
	"strictFunctionTypes": False,
	"strictNullChecks": False,
	"strictPropertyInitialization": False,
	"useUnknownInCatchVariables": False,

	# Watch and Build Modes
	"assumeChangesOnlyAffectDirectDependencies": False,

	# Backwards Compatibility
	# "charset": "utf8",
	"keyofStringsOnly": False,
	"noImplicitUseStrict": False,
	"noStrictGenericChecks": False,
	# "out": None,
	"suppressExcessPropertyErrors": False,
	"suppressImplicitAnyIndexErrors": False,

	# Projects
	"composite": False,
	"disableReferencedProjectLoad": False,
	"disableSolutionSearching": False,
	"disableSourceOfProjectReferenceRedirect": False,
	"incremental": False,
	"tsBuildInfoFile": ".tsbuildinfo",

	# Emit
	"declaration": False,
	"declarationDir": None,
	"declarationMap": False,
	"downlevelIteration": False,
	"emitBOM": False,
	"emitDeclarationOnly": False,
	"importHelpers": False,
	"importsNotUsedAsValues": "remove",
	"inlineSourceMap": False,
	"inlineSources": False,
	"mapRoot": None,
	"newLine": None,
	"noEmit": False,
	"noEmitHelpers": False,
	"noEmitOnError": False,
	"outDir": None,
	"outFile": None,
	"preserveConstEnums": False,
	"preserveValueImports": False,
	"removeComments": False,
	"sourceMap": False,
	"sourceRoot": False,
	"stripInternal": False,

	# Compiler Diagnostics
	"diagnostics": False,
	"explainFiles": False,
	"extendedDiagnostics": False,
	"generateCpuProfile": "profile.cpuprofile",
	"generateTrace": False,
	"listEmittedFiles": False,
	"listFiles": False,
	"traceResolution": False,

	# Editor Support
	"disableSizeLimit": False,
	"plugins": [],

	# Language and Environment
	"emitDecoratorMetadata": False,
	"experimentalDecorators": False,
	# "jsx": None,
	# "jsxFactory": "React.Fragment",
	# "jsxImportSource": "react",
	"lib": [],
	"moduleDetection": "auto",
	"noLib": False,
	# "reactNamespace": "React",
	"target": "es3",
	"useDefineForClassFields": False,

	# Output Formatting
	"noErrorTruncation": False,
	"preserveWatchOutput": False,
	"pretty": True,

	# Completeness
	"skipDefaultLibCheck": False,
	"skipLibCheck": False
}

# Basic prototype that will be changed when building
TSCONFIG_TOOLCHAIN = {
	"target": "es5", # Most of ES6 not realized in Rhino 1.7.7
	"lib": ["esnext"],
	"module": "none",
	"moduleDetection": "legacy",
	"moduleResolution": "classic",
	"skipDefaultLibCheck": True,
	"allowJs": True,
	"downlevelIteration": True,
	"declaration": True,
	"experimentalDecorators": True,
	"stripInternal": True,
	"noEmitOnError": True
}

for key, value in MAKE_CONFIG.get_value("tsconfig", {}).items():
	TSCONFIG_TOOLCHAIN[key] = value

for key in TSCONFIG_TOOLCHAIN:
	TSCONFIG[key] = TSCONFIG_TOOLCHAIN[key]

# Do NOT include toolchain overrided options
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

for key in TSCONFIG_TOOLCHAIN:
	if key in TSCONFIG_DEPENDENTS:
		del TSCONFIG_DEPENDENTS[key]

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
			dependents = []
			for line in includes:
				line = line.strip()
				self.decode_line(line, dependents)
			for dependent in dependents:
				if (dependent in TSCONFIG_DEPENDENTS and TSCONFIG_DEPENDENTS[dependent] in self.params and self.params[TSCONFIG_DEPENDENTS[dependent]] == True):
					self.params[TSCONFIG_DEPENDENTS[dependent]] = not self.params[TSCONFIG_DEPENDENTS[dependent]]

	def decode_param(self, key, value = None, dependents = []):
		default = TSCONFIG[key]

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
					if key in self.params:
						del self.params[key]
					elif key in TSCONFIG_TOOLCHAIN and key in TSCONFIG:
						self.params[key] = TSCONFIG[key]

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

	def build(self, target_path, language = "typescript"):
		temp_path = join(temp_directory, basename(target_path))

		result = 0
		if language == "typescript":
			self.create_tsconfig(temp_path)
		if BUILD_STORAGE.is_path_changed(self.directory) or not isfile(temp_path):
			import datetime

			print(f"Building {basename(target_path)} from {self.includes_file}")

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
		if isfile(temp_path):
			copy_file(temp_path, target_path)
		else:
			print(f"WARNING: Not found build target {basename(target_path)}, maybe it building emitted error or corresponding source is empty.")

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
				"outFile": temp_path
			},
			"compileOnSave": False,
			"exclude": [
				"dom",
				"webpack"
			] + self.exclude,
			"include": self.include,
		}

		if len(declarations) > 0:
			template["files"] = declarations

		for key, value in TSCONFIG_TOOLCHAIN.items():
			template["compilerOptions"][key] = value

		for key, value in self.params.items():
			template["compilerOptions"][key] = value

		with open(self.get_tsconfig(), "w") as tsconfig:
			tsconfig.write(json.dumps(template, indent="\t") + "\n")

	def build_source(self, temp_path, language):
		if language.lower() == "typescript":
			command = [
				"tsc",
				"--project", self.get_tsconfig()
			]
			if self.debug_build:
				# Do NOT resolve down-level declaration, like android.d.ts if it not included
				command.append("--noResolve")
				 # Do NOT check declarations to resolve conflicts and something else due to --noResolve
				command.append("--skipLibCheck")
			result = subprocess.call(command)
		else:
			result = 0

		declaration_path = f"{splitext(temp_path)[0]}.d.ts"
		if isfile(declaration_path):
			move_file(declaration_path, MAKE_CONFIG.get_build_path(
				"declarations/" + basename(declaration_path)
			))

		return result
