import os
from os.path import isfile, isdir, join, dirname, getmtime, getsize
from errno import ENOENT
from hashlib import md5
import json

from .make_config import MAKE_CONFIG
from .utils import get_all_files

class HashStorage:
	last_hashes = {}
	hashes = {}

	def __init__(self, file):
		self.file = file
		if isfile(file):
			self.read()

	def read(self):
		with open(self.file, "r") as input:
			self.last_hashes = json.load(input)

	def get_path_hash(self, path, force = False):
		if not force and path in self.hashes:
			return self.hashes[path]

		if isfile(path):
			hash = HashStorage.get_file_hash(path)
		elif isdir(path):
			hash = HashStorage.get_directory_hash(path)
		else:
			raise FileNotFoundError(ENOENT, os.strerror(ENOENT), path)

		self.hashes[path] = hash
		return hash

	@staticmethod
	def do_comparing(path):
		return bytes(str(getsize(path)), "utf-8") if COMPARING_MODE == "size" \
			else bytes(str(getmtime(path)), "utf-8") if COMPARING_MODE == "modify" \
			else open(path, "rb").read() if COMPARING_MODE == "content" else bytes()

	@staticmethod
	def get_directory_hash(directory):
		total = md5()
		for dirpath, dirnames, filenames in os.walk(directory):
			for filename in filenames:
				filepath = join(dirpath, filename)
				total.update(HashStorage.do_comparing(filepath))
		return total.hexdigest()

	@staticmethod
	def get_file_hash(file):
		return md5(HashStorage.do_comparing(file)).hexdigest()

	def get_modified_files(self, path, extensions = (), force = False):
		if not isdir(path):
			raise NotADirectoryError(path)
		return list(filter(
			lambda filepath: self.is_path_changed(filepath, force),
			get_all_files(path, extensions)
		))

	def save(self):
		os.makedirs(dirname(self.file), exist_ok=True)
		with open(self.file, "w") as output:
			output.write(json.dumps({
				**self.last_hashes,
				**self.hashes
			}, indent=None, separators=(",", ":")) + "\n")

	def is_path_changed(self, path, force = False):
		hash = self.get_path_hash(path, force)
		return path not in self.last_hashes \
			or self.last_hashes[path] != hash


COMPARING_MODE = MAKE_CONFIG.get_value("development.comparingMode", "content")
BUILD_STORAGE = HashStorage(MAKE_CONFIG.get_build_path(".buildrc"))
OUTPUT_STORAGE = HashStorage(MAKE_CONFIG.get_build_path(".outputrc"))
