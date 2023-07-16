import os
from os.path import isfile, join, realpath


def find_configuration(path: str, filename: str):
	working_path = path.split(os.sep)
	while len(working_path):
		config_path = join(os.sep.join(working_path), filename)
		if isfile(config_path):
			return config_path
		working_path.pop()

def request_make_config(toolchain_config):
	selected_project = toolchain_config.get_value("currentProject")
	if selected_project:
		preferred_config = toolchain_config.get_absolute_path(join(selected_project, "make.json"))
	else:
		preferred_config = find_configuration(os.getcwd(), "make.json")
	if not preferred_config or not isfile(preferred_config):
		return None
	from .make_config import MakeConfig
	return MakeConfig(preferred_config, toolchain_config)

class Globals:
	@property
	def ADB_COMMAND(self):
		if not hasattr(self, "adb_command"):
			from .device import get_adb_command
			self.adb_command = get_adb_command()
		return self.adb_command

	@property
	def BUILD_STORAGE(self):
		if not hasattr(self, "build_storage"):
			from .hash_storage import HashStorage
			self.build_storage = HashStorage(self.MAKE_CONFIG.get_build_path(".buildrc"), \
				    self.MAKE_CONFIG.get_value("development.comparingMode", "content"))
		return self.build_storage

	@property
	def OUTPUT_STORAGE(self):
		if not hasattr(self, "output_storage"):
			from .hash_storage import HashStorage
			self.output_storage = HashStorage(self.MAKE_CONFIG.get_build_path(".outputrc"), \
				     self.MAKE_CONFIG.get_value("development.comparingMode", "content"))
		return self.output_storage

	@property
	def TOOLCHAIN_CONFIG(self):
		if not hasattr(self, "toolchain_config"):
			toolchain_config = find_configuration(os.getcwd(), "toolchain.json")
			if not toolchain_config:
				toolchain_config = find_configuration(realpath(join(__file__, "..")), "toolchain.json")
			if toolchain_config:
				from .make_config import ToolchainConfig
				self.toolchain_config = ToolchainConfig(toolchain_config)
			elif hasattr(self, "make_config"):
				self.toolchain_config = self.MAKE_CONFIG.prototype
		if not self.toolchain_config:
			from .make_config import ToolchainConfig
			self.toolchain_config = ToolchainConfig(realpath(join(__file__, "..", "..")))
		return self.toolchain_config

	@property
	def MAKE_CONFIG(self):
		if not hasattr(self, "make_config"):
			make_config = request_make_config(self.TOOLCHAIN_CONFIG)
			if not make_config:
				from .task import execute_task
				if execute_task("selectProject") == 0:
					make_config = request_make_config(self.TOOLCHAIN_CONFIG)
			if not make_config:
				from .shell import abort
				abort("Not found any opened project, nothing to do.")
			self.make_config = make_config
		return self.make_config

	@MAKE_CONFIG.deleter
	def MAKE_CONFIG(self):
		if not hasattr(self, "make_config"):
			return
		self.make_config.save()
		del self.make_config

	@property
	def PREFERRED_CONFIG(self):
		if hasattr(self, "make_config"):
			return self.MAKE_CONFIG
		make_config = request_make_config(self.TOOLCHAIN_CONFIG)
		if make_config:
			self.make_config = make_config
			return self.MAKE_CONFIG
		return self.TOOLCHAIN_CONFIG

	@property
	def MOD_STRUCTURE(self):
		if not hasattr(self, "mod_structure"):
			from .mod_structure import ModStructure
			self.mod_structure = ModStructure("output")
		return self.mod_structure

	@property
	def PROJECT_MANAGER(self):
		if not hasattr(self, "project_manager"):
			from .project_manager import ProjectManager
			self.project_manager = ProjectManager()
		return self.project_manager

	@property
	def CODE_WORKSPACE(self):
		if not hasattr(self, "code_workspace"):
			from .workspace import CodeWorkspace
			self.code_workspace = CodeWorkspace(self.TOOLCHAIN_CONFIG.get_absolute_path(self.PREFERRED_CONFIG.get_value("workspaceFile", "toolchain.code-workspace")))
		return self.code_workspace

	@property
	def CODE_SETTINGS(self):
		if not hasattr(self, "code_settings"):
			from .workspace import CodeWorkspace
			self.code_settings = CodeWorkspace(self.TOOLCHAIN_CONFIG.get_path(".vscode/settings.json"))
		return self.code_settings

	@property
	def WORKSPACE_COMPOSITE(self):
		if not hasattr(self, "workspace_composite"):
			from .workspace import WorkspaceComposite
			self.workspace_composite = WorkspaceComposite("tsconfig.json")
		return self.workspace_composite

GLOBALS = Globals()
