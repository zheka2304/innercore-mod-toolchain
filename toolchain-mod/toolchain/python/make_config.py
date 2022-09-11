import json
import os
import os.path

from base_config import BaseConfig

# toolchain config
class MakeConfig(BaseConfig):
	def __init__(self, filename):
		self.filename = filename
		self.root_dir = os.path.abspath(os.path.join(self.filename, ".."))
		with open(filename, encoding="utf-8") as file:
			self.json = json.load(file)
		BaseConfig.__init__(self, self.json)

	def get_root_dir(self):
		return self.root_dir

	def get_path(self, relative_path):
		return os.path.abspath(os.path.join(self.root_dir, relative_path))

	def get_paths(self, relative_path, filter=None, paths=None):
		if paths is None:
			paths = []
		if len(relative_path) > 0 and relative_path[-1] == "*":
			path = self.get_path(relative_path[:-1])
			if not os.path.isdir(path):
				return []
			for f in os.listdir(path):
				file = os.path.join(path, f)
				if filter is None or filter(file):
					paths.append(file)
		else:
			path = self.get_path(relative_path)
			if filter is None or filter(path):
				paths.append(path)
		return paths

class ToolchainConfig(MakeConfig):
	def __init__(self, filename):
		MakeConfig.__init__(self, filename)
		self.project_dir = self.root_dir + "/" + self.get_value('currentProject')
		self.project_make = MakeConfig(self.project_dir + "/make.json")
	
	def get_project_value(self, name, fallback=None):
		return self.project_make.get_value(name, fallback)

	def get_project_config(self, name, not_none=False):
		return self.project_make.get_config(name, not_none)
		
	def get_project_filtered_list(self, name, prop, values):
		return self.project_make.get_filtered_list(name, prop, values)
	
	def get_project_path(self, relative_path):
		return self.project_make.get_path(relative_path)
	
	def get_project_paths(self, relative_path, filter=None, paths=None):
		return self.project_make.get_paths(relative_path, filter, paths)

	def get_adb(self):
		return self.get_path("toolchain/adb/adb")


# search for make.json
make_config = None
for i in range(0, 4):
	make_file = os.path.join("../" * i, "make.json")
	if os.path.isfile(make_file):
		make_config = ToolchainConfig(make_file)
		break
if make_config is None:
	raise RuntimeError("failed to find make.json")

if __name__ == '__main__':
	print(make_config.get_value("native"))
