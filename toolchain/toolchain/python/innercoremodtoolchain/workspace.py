from os.path import exists, isfile, abspath, relpath, join, dirname
import subprocess
import json
import glob
import os

from .make_config import MakeConfig, MAKE_CONFIG, TOOLCHAIN_CONFIG
from .base_config import BaseConfig

class WorkspaceNotAvailable(RuntimeError):
	def __init__(self, *args):
		RuntimeError.__init__(self, "Workspace is not available", *args)

class CodeWorkspace(BaseConfig):
	def __init__(self, filename):
		if not isfile(filename):
			return BaseConfig.__init__(self, {})
		self.filename = filename
		self.root_dir = abspath(join(self.filename, ".."))
		with open(filename, encoding="utf-8") as file:
			self.json = json.load(file)
		BaseConfig.__init__(self, self.json)

	def available(self):
		return hasattr(self, "filename") and isfile(self.filename)

	def get_path(self, relative_path):
		if not self.available():
			raise WorkspaceNotAvailable()
		return MakeConfig.get_path(self, relative_path)

	def get_toolchain_path(self, relative_path = ""):
		if not self.available():
			raise WorkspaceNotAvailable()
		return relpath(TOOLCHAIN_CONFIG.get_path(relative_path), self.root_dir)

	def save(self):
		if not self.available():
			raise WorkspaceNotAvailable()
		return MakeConfig.save(self)

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
TSCONFIG_TOOLCHAIN = {
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

for key, value in MAKE_CONFIG.get_value("tsconfig", {}).items():
	if value is None:
		del TSCONFIG_TOOLCHAIN[key]
	else:
		TSCONFIG_TOOLCHAIN[key] = value

class WorkspaceComposite:
	references = []
	sources = []

	def __init__(self, filename):
		self.filename = filename

	def get_tsconfig(self):
		return MAKE_CONFIG.get_path(self.filename)

	def coerce(self, path):
		path = relpath(path, MAKE_CONFIG.root_dir)
		if path in self.sources:
			return
		self.sources.append(path)

	def reference(self, path, **kwargs):
		path = relpath(path, MAKE_CONFIG.root_dir)
		for ref in self.references:
			if ref.path == path:
				return
		self.references.append({
			"path": path,
			**kwargs
		})

	def reset(self):
		self.references = []
		self.sources = []

	@staticmethod
	def resolve_declarations(debug_build = False):
		declarations = []
		if exists(TOOLCHAIN_CONFIG.get_path("toolchain/declarations")):
			declarations.extend(glob.glob(
				TOOLCHAIN_CONFIG.get_path("toolchain/declarations/**/*.d.ts"),
				recursive=True
			))
		if debug_build:
			for excluded in MAKE_CONFIG.get_value("debugIncludesExclude", []):
				if exists(str(excluded).lstrip("/").partition("/")[0]):
					for declaration in glob.glob(excluded, recursive=True):
						if declaration in declarations:
							declarations.remove(declaration)
				else:
					for declaration in glob.glob(TOOLCHAIN_CONFIG.get_path(excluded), recursive=True):
						if declaration in declarations:
							declarations.remove(declaration)
		return declarations

	def flush(self, debug_build = False, **kwargs):
		from .includes import temp_directory
		template = {
			"compilerOptions": {
				"outDir": temp_directory,
				**TSCONFIG_TOOLCHAIN
			},
			"compileOnSave": False,
			"exclude": [
				"dom",
				"webpack"
			] + MAKE_CONFIG.get_value("development.exclude", []),
			"include": self.sources + MAKE_CONFIG.get_value("development.include", []),
			**kwargs
		}

		declarations = WorkspaceComposite.resolve_declarations(debug_build)
		if len(declarations) > 0:
			template["files"] = declarations
		if len(self.references) > 0:
			template["references"] = self.references
		with open(self.get_tsconfig(), "w") as tsconfig:
			tsconfig.write(json.dumps(template, indent="\t") + "\n")

	def build(self, *args):
		return subprocess.call([
			"tsc",
			"--build", self.get_tsconfig(),
			*MAKE_CONFIG.get_value("development.tsc", []),
			*args
		])

	def watch(self, *args):
		try:
			return subprocess.call([
				"tsc",
				"--watch",
				*MAKE_CONFIG.get_value("development.watch", []),
				*args
			], cwd=dirname(self.get_tsconfig()).replace("/", os.path.sep))
		except KeyboardInterrupt:
			return 0


CODE_WORKSPACE = CodeWorkspace(TOOLCHAIN_CONFIG.get_absolute_path(MAKE_CONFIG.get_value("workspaceFile")))
CODE_SETTINGS = CodeWorkspace(TOOLCHAIN_CONFIG.get_path(".vscode/settings.json"))
WORKSPACE_COMPOSITE = WorkspaceComposite("tsconfig.json")
