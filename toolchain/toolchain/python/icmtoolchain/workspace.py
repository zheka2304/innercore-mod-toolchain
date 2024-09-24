import json
import os
import platform
import subprocess
from os.path import (abspath, basename, dirname, exists, isdir, isfile, join,
                     relpath, splitext)
from typing import Any, Dict, List

from . import GLOBALS, PROPERTIES
from .base_config import BaseConfig
from .hglob import glob
from .utils import ensure_directory, ensure_file_directory

# The TypeScript Compiler - Version 4.8.3
TSCONFIG: Dict[str, Any] = {
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
	"moduleSuffixes": list(),
	"noResolve": False,
	"paths": list(),
	"resolveJsonModule": False,
	"rootDir": list(),
	"rootDirs": list(),
	"typeRoots": list(),
	"types": list(),

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
	"plugins": list(),

	# Language and Environment
	"emitDecoratorMetadata": False,
	"experimentalDecorators": False,
	"jsx": None,
	"jsxFactory": "React.Fragment",
	"jsxImportSource": "react",
	"lib": list(),
	"moduleDetection": "auto",
	"noLib": False,
	"reactNamespace": "React",
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
TSCONFIG_TOOLCHAIN: Dict[str, Any] = {
	"target": "es5", # Most of ES6 is not realized in Rhino 1.7.7
	"lib": ["es5", "es2015.core", "es2015.generator"],
	"module": "none",
	"skipDefaultLibCheck": True,
	"composite": True,
	"downlevelIteration": True,
	"experimentalDecorators": True,
	"noEmitOnError": True,
	"stripInternal": True,
	"allowJs": True
}


class WorkspaceNotAvailable(RuntimeError):
	def __init__(self, *args: object) -> None:
		RuntimeError.__init__(self, "Workspace is not available", *args)

class CodeWorkspace(BaseConfig):
	def __init__(self, path: str) -> None:
		if not isfile(path):
			return BaseConfig.__init__(self, dict())
		self.path = path
		self.directory = abspath(join(self.path, ".."))
		with open(path, encoding="utf-8") as file:
			self.json = json.load(file)
		BaseConfig.__init__(self, self.json)

	def available(self) -> bool:
		return hasattr(self, "path") and isfile(self.path)

	def get_path(self, relative_path: str) -> str:
		if not self.available():
			raise WorkspaceNotAvailable()
		return abspath(join(self.directory, relative_path))

	def get_toolchain_path(self, relative_path: str = "") -> str:
		if not self.available():
			raise WorkspaceNotAvailable()
		return relpath(GLOBALS.TOOLCHAIN_CONFIG.get_path(relative_path), self.directory)

	def save(self) -> None:
		if not self.available():
			raise WorkspaceNotAvailable()
		with open(self.path, "w", encoding="utf-8") as workspace_file:
			workspace_file.write(json.dumps(self.json, indent="\t") + "\n")


class WorkspaceComposite:
	references: List[Dict[str, Any]]
	sources: List[str]

	def __init__(self, path) -> None:
		self.path = path
		self.reset()

	def get_tsconfig(self) -> str:
		return GLOBALS.MAKE_CONFIG.get_path(self.path)

	def coerce(self, path: str) -> None:
		path = relpath(path, GLOBALS.MAKE_CONFIG.directory)
		if path in self.sources:
			return
		self.sources.append(path)

	def reference(self, path: str, **kwargs: Any) -> None:
		path = relpath(path, GLOBALS.MAKE_CONFIG.directory)
		for ref in self.references:
			if ref["path"] == path:
				return
		self.references.append({
			"path": path,
			**kwargs
		})

	def reset(self) -> None:
		self.references = list()
		self.sources = list()

	@staticmethod
	def resolve_declarations() -> List[str]:
		includes = GLOBALS.MAKE_CONFIG.get_value("declarations", [
			"declarations"
		])
		declarations = list()
		for filepath in [
			GLOBALS.MAKE_CONFIG.get_absolute_path(include) for include in includes
		]:
			if exists(filepath):
				if isdir(filepath):
					filepath = f"{filepath}/**/*.d.ts"
				declarations.extend(glob(filepath, recursive=True))
		if exists(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/declarations")):
			declarations.extend(glob(
				GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/declarations/**/*.d.ts"),
				recursive=True
			))
		if not PROPERTIES.get_value("release"):
			for excluded in GLOBALS.MAKE_CONFIG.get_value("debugIncludesExclude", list()):
				if exists(str(excluded).lstrip("/").partition("/")[0]):
					for declaration in glob(excluded, recursive=True):
						if declaration in declarations:
							declarations.remove(declaration)
				else:
					for declaration in glob(GLOBALS.TOOLCHAIN_CONFIG.get_path(excluded), recursive=True):
						if declaration in declarations:
							declarations.remove(declaration)
		return list(set(declarations))

	def flush(self, **kwargs: Any) -> None:
		template = {
			"compilerOptions": {
				"outDir": GLOBALS.MAKE_CONFIG.get_build_path("sources"),
				**GLOBALS.TSCONFIG_TOOLCHAIN
			},
			"compileOnSave": False,
			"exclude": [
				"dom",
				"dom.iterable",
				"es2015.iterable",
				"scripthost",
				"webworker",
				"webworker.importscripts",
				"webworker.iterable"
			] + GLOBALS.MAKE_CONFIG.get_value("development.exclude", list()),
			"include": self.sources + GLOBALS.MAKE_CONFIG.get_value("development.include", list()),
			**kwargs
		}

		declarations = WorkspaceComposite.resolve_declarations()
		if len(declarations) > 0:
			template["files"] = declarations
		if len(self.references) > 0:
			template["references"] = self.references
		with open(self.get_tsconfig(), "w", encoding="utf-8") as tsconfig:
			tsconfig.write(json.dumps(template, indent="\t") + "\n")

	def build(self, *args: str) -> int:
		return subprocess.call([
			"tsc",
			"--build", self.get_tsconfig(),
			*GLOBALS.MAKE_CONFIG.get_value("development.tsc", list()),
			*args
		], shell=platform.system() == "Windows")

	def watch(self, *args: str) -> int:
		try:
			return subprocess.call([
				"tsc",
				"--watch",
				*GLOBALS.MAKE_CONFIG.get_value("development.watch", list()),
				*args
			], cwd=dirname(self.get_tsconfig()).replace("/", os.path.sep), shell=platform.system() == "Windows")
		except KeyboardInterrupt:
			return 0


def get_idea_project_run_configuration(name: str, path: str):
	relative_path = GLOBALS.PREFERRED_CONFIG.get_relative_path(path)
	relative_path = "$PROJECT_DIR$/" + relative_path if relative_path[:2] != ".." else None
	attribute_independent = "true" if relative_path is None else "false"

	from xml.dom import minidom
	document = minidom.Document()

	component = document.createElement("component")
	component.setAttribute("name", "ProjectRunConfigurationManager")
	configuration = document.createElement("configuration")
	configuration.setAttribute("name", name)
	configuration.setAttribute("default", "false")
	configuration.setAttribute("type", "ShConfigurationType")
	component.appendChild(configuration)

	script_path = document.createElement("option")
	script_path.setAttribute("name", "SCRIPT_PATH")
	script_path.setAttribute("value", relative_path or abspath(path))
	configuration.appendChild(script_path)
	script_options = document.createElement("option")
	script_options.setAttribute("name", "SCRIPT_OPTIONS")
	script_options.setAttribute("value", "")
	configuration.appendChild(script_options)
	independent_script_path = document.createElement("option")
	independent_script_path.setAttribute("name", "INDEPENDENT_SCRIPT_PATH")
	independent_script_path.setAttribute("value", attribute_independent)
	configuration.appendChild(independent_script_path)

	script_working_directory = document.createElement("option")
	script_working_directory.setAttribute("name", "SCRIPT_WORKING_DIRECTORY")
	script_working_directory.setAttribute("value", dirname(relative_path or abspath(path)))
	configuration.appendChild(script_working_directory)
	independent_script_working_directory = document.createElement("option")
	independent_script_working_directory.setAttribute("name", "INDEPENDENT_SCRIPT_WORKING_DIRECTORY")
	independent_script_working_directory.setAttribute("value", attribute_independent)
	configuration.appendChild(independent_script_working_directory)

	interpreter_path = document.createElement("option")
	interpreter_path.setAttribute("name", "INTERPRETER_PATH")
	interpreter_path.setAttribute("value", "")
	configuration.appendChild(interpreter_path)
	interpreter_options = document.createElement("option")
	interpreter_options.setAttribute("name", "INTERPRETER_OPTIONS")
	interpreter_options.setAttribute("value", "")
	configuration.appendChild(interpreter_options)
	independent_interpreter_path = document.createElement("option")
	independent_interpreter_path.setAttribute("name", "INDEPENDENT_INTERPRETER_PATH")
	independent_interpreter_path.setAttribute("value", "true")
	configuration.appendChild(independent_interpreter_path)

	method = document.createElement("method")
	method.setAttribute("v", "2")
	configuration.appendChild(method)
	return component.toprettyxml(indent=" " * 2)

def write_idea_project_run_configurations(name: str, path: str):
	from re import sub
	configurations_path = GLOBALS.PREFERRED_CONFIG.get_path(join(".idea", "runConfigurations"))
	ensure_directory(configurations_path)
	with open(join(configurations_path, sub(r"\W", "_", name) + ".xml"), "w", encoding="utf-8") as wrapper:
		wrapper.write(get_idea_project_run_configuration(name, path + ".bat"))
	with open(join(configurations_path, sub(r"\W", "_", name + " (Unix)") + ".xml"), "w", encoding="utf-8") as wrapper:
		wrapper.write(get_idea_project_run_configuration(name, path + ".sh"))

def get_vscode_build_task(name: str, path: str, icon: str = "run", hidden: bool = False):
	absolute_path = GLOBALS.PREFERRED_CONFIG.get_relative_path(path)
	absolute_path = join(".", absolute_path) if absolute_path[:2] != ".." else abspath(path)
	task = {
		"label": name,
		"icon": {
			"id": icon
		}
	}
	if hidden:
		task["hide"] = True
	task.update({
		"type": "shell",
		"command": f"./{basename(path)}.sh",
		"options": {
			"cwd": dirname(absolute_path)
		}
	})
	task["windows"] = {
		"command": task["command"][:-3].replace("/", "\\") + ".bat",
		"options": {
			"cwd": task["options"]["cwd"].replace("/", "\\")
		}
	}
	task.update({
		"group": {
			"kind": "build",
			"isDefault": True
		},
		"problemMatcher": list()
	})
	return task

def write_vscode_build_tasks(name: str, path: str, icon: str = "run", hidden: bool = False):
	tasks_path = GLOBALS.PREFERRED_CONFIG.get_path(join(".vscode", "tasks.json"))
	ensure_file_directory(tasks_path)

	configuration = None
	if isfile(tasks_path):
		with open(tasks_path, encoding="utf-8") as tasks:
			configuration = json.load(tasks)
	if not isinstance(configuration, dict):
		configuration = {}
		configuration["version"] = "2.0.0"
	if "tasks" not in configuration:
		configuration["tasks"] = list()

	duplicates = list()
	for task in configuration["tasks"]:
		if "command" in task and "options" in task and "cwd" in task["options"]:
			absolute_path = abspath(join(task["options"]["cwd"], splitext(task["command"])[0]))
			if absolute_path == abspath(path):
				duplicates.append(task)
	for task in duplicates:
		configuration["tasks"].remove(task)

	configuration["tasks"].append(get_vscode_build_task(name, path, icon=icon, hidden=hidden))
	with open(tasks_path, "w", encoding="utf-8") as tasks:
		json.dump(configuration, tasks, indent="\t")
