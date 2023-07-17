import glob
import json
import os
import platform
import subprocess
from os.path import abspath, dirname, exists, isdir, isfile, join, relpath
from typing import Any, Dict, Final, List

from . import GLOBALS, PROPERTIES
from .base_config import BaseConfig


class WorkspaceNotAvailable(RuntimeError):
	def __init__(self, *args: object) -> None:
		RuntimeError.__init__(self, "Workspace is not available", *args)

class CodeWorkspace(BaseConfig):
	def __init__(self, path: str) -> None:
		if not isfile(path):
			return BaseConfig.__init__(self, {})
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


# The TypeScript Compiler - Version 4.8.3
TSCONFIG: Final[Dict[str, Any]] = {
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
	"jsx": None,
	"jsxFactory": "React.Fragment",
	"jsxImportSource": "react",
	"lib": [],
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
TSCONFIG_TOOLCHAIN: Final[Dict[str, Any]] = {
	"target": "es5", # Most of ES6 not realized in Rhino 1.7.7
	"lib": ["esnext"],
	"module": "none",
	"moduleDetection": "legacy",
	"moduleResolution": "classic",
	"skipDefaultLibCheck": True,
	"composite": True,
	"downlevelIteration": True,
	"experimentalDecorators": True,
	"noEmitOnError": True,
	"stripInternal": True,
	"allowJs": True
}

for key, value in GLOBALS.PREFERRED_CONFIG.get_value("tsconfig", {}).items():
	if value is None:
		del TSCONFIG_TOOLCHAIN[key]
	else:
		TSCONFIG_TOOLCHAIN[key] = value


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
		self.references = []
		self.sources = []

	@staticmethod
	def resolve_declarations() -> List[str]:
		includes = GLOBALS.MAKE_CONFIG.get_value("declarations", [
			"declarations"
		])
		declarations = []
		for filepath in [
			GLOBALS.MAKE_CONFIG.get_absolute_path(include) for include in includes
		]:
			if exists(filepath):
				if isdir(filepath):
					filepath = f"{filepath}/**/*.d.ts"
				declarations.extend(glob.glob(filepath, recursive=True))
		if exists(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/declarations")):
			declarations.extend(glob.glob(
				GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/declarations/**/*.d.ts"),
				recursive=True
			))
		if not PROPERTIES.get_value("release"):
			for excluded in GLOBALS.MAKE_CONFIG.get_value("debugIncludesExclude", []):
				if exists(str(excluded).lstrip("/").partition("/")[0]):
					for declaration in glob.glob(excluded, recursive=True):
						if declaration in declarations:
							declarations.remove(declaration)
				else:
					for declaration in glob.glob(GLOBALS.TOOLCHAIN_CONFIG.get_path(excluded), recursive=True):
						if declaration in declarations:
							declarations.remove(declaration)
		return list(set(declarations))

	def flush(self, **kwargs: Any) -> None:
		from .includes import TEMPORARY_DIRECTORY
		template = {
			"compilerOptions": {
				"outDir": TEMPORARY_DIRECTORY,
				**TSCONFIG_TOOLCHAIN
			},
			"compileOnSave": False,
			"exclude": [
				"dom",
				"webpack"
			] + GLOBALS.MAKE_CONFIG.get_value("development.exclude", []),
			"include": self.sources + GLOBALS.MAKE_CONFIG.get_value("development.include", []),
			**kwargs
		}

		declarations = WorkspaceComposite.resolve_declarations()
		if len(declarations) > 0:
			template["files"] = declarations
		if len(self.references) > 0:
			template["references"] = self.references
		with open(self.get_tsconfig(), "w") as tsconfig:
			tsconfig.write(json.dumps(template, indent="\t") + "\n")

	def build(self, *args: str) -> int:
		return subprocess.call([
			"tsc",
			"--build", self.get_tsconfig(),
			*GLOBALS.MAKE_CONFIG.get_value("development.tsc", []),
			*args
		], shell=platform.system() == "Windows")

	def watch(self, *args: str) -> int:
		try:
			return subprocess.call([
				"tsc",
				"--watch",
				*GLOBALS.MAKE_CONFIG.get_value("development.watch", []),
				*args
			], cwd=dirname(self.get_tsconfig()).replace("/", os.path.sep), shell=platform.system() == "Windows")
		except KeyboardInterrupt:
			return 0
