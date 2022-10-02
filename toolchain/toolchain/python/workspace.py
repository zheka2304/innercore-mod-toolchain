from os.path import isfile, abspath, relpath, join
import json

from make_config import MakeConfig, MAKE_CONFIG, TOOLCHAIN_CONFIG
from base_config import BaseConfig

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


CODE_WORKSPACE = CodeWorkspace(TOOLCHAIN_CONFIG.get_absolute_path(MAKE_CONFIG.get_value("workspaceFile")))
CODE_SETTINGS = CodeWorkspace(TOOLCHAIN_CONFIG.get_path(".vscode/settings.json"))
