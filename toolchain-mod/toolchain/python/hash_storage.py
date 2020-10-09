from os.path import isfile, isdir, join, relpath, dirname, basename
from os import walk, remove, strerror, makedirs
from errno import ENOENT
import json
from hashlib import md5
from make_config import make_config

class HashStorage:
	last_hashes = {}
	hashes = {}
	def __init__(self, file):
		self.file = file
		if isfile(file):
			with open(file, "r") as input:
				self.last_hashes = json.load(input)

	def get_path_hash(self, path):
		key = self.path_to_key(path)
		if key in self.hashes:
			return self.hashes[key]

		if isfile(path):
			hash = HashStorage.get_file_hash(path)
		elif isdir(path):
			hash = HashStorage.get_directory_hash(path)
		else:
			raise FileNotFoundError(ENOENT, strerror(ENOENT), path)

		self.hashes[key] = hash
		return hash

	@staticmethod
	def get_directory_hash(directory):
		total = md5()
		for root, _, files in walk(directory):
			for names in files:
				filepath = join(root, names)
				total.update(open(filepath,'rb').read())
				"""
				with open(filepath, "rb") as f:
					for chunk in iter(lambda: f.read(4096), b""):
						total.update(chunk)
				"""
		return total.hexdigest()

	@staticmethod
	def get_file_hash(file):
		return md5(open(file, "rb").read()).hexdigest()

	def save(self):
		makedirs(dirname(self.file), exist_ok=True)
		with open(self.file, "w") as output:
			json.dump(self.hashes, output, indent="\t")

	def is_path_changed(self, path):
		key = self.path_to_key(path)
		hash = self.get_path_hash(path)
		return key not in self.last_hashes or self.last_hashes[key] != hash

	def path_to_key(self, path):
		# return relpath(path, self.file)
		return md5(path.encode("utf-8")).hexdigest()

	def clear(self):
		remove(self.file)
		return


build_storage = HashStorage(make_config.get_path("toolchain/build/project/.buildhashes"))
output_storage = HashStorage(make_config.get_path("toolchain/build/project/.outputhashes"))