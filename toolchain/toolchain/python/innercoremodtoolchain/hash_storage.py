import os
from os.path import isfile, isdir, join, dirname, getmtime, getsize
from errno import ENOENT
import json

from .make_config import MAKE_CONFIG
from .utils import get_all_files

try:
	from hashlib import blake2s as encode
except ImportError:
	from hashlib import md5 as encode

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
		encoded = encode(bytes(path, "utf-8")).hexdigest()
		if not force and encoded in self.hashes:
			return self.hashes[encoded]

		if isfile(path):
			hash = HashStorage.get_file_hash(path)
		elif isdir(path):
			hash = HashStorage.get_directory_hash(path)
		else:
			raise FileNotFoundError(ENOENT, os.strerror(ENOENT), path)

		self.hashes[encoded] = hash
		return hash

	@staticmethod
	def do_comparing(path):
		return bytes(str(getsize(path)), "utf-8") if COMPARING_MODE == "size" \
			else bytes(str(getmtime(path)), "utf-8") if COMPARING_MODE == "modify" \
			else open(path, "rb").read() if COMPARING_MODE == "content" else bytes()

	@staticmethod
	def get_directory_hash(directory):
		total = encode()
		for dirpath, dirnames, filenames in os.walk(directory):
			for filename in filenames:
				filepath = join(dirpath, filename)
				total.update(HashStorage.do_comparing(filepath))
		return total.hexdigest()

	@staticmethod
	def get_file_hash(file):
		return encode(HashStorage.do_comparing(file)).hexdigest()

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
		encoded = encode(bytes(path, "utf-8")).hexdigest()
		return encoded not in self.last_hashes \
			or self.last_hashes[encoded] != hash


COMPARING_MODE = MAKE_CONFIG.get_value("development.comparingMode", "content")
BUILD_STORAGE = HashStorage(MAKE_CONFIG.get_build_path(".buildrc"))
OUTPUT_STORAGE = HashStorage(MAKE_CONFIG.get_build_path(".outputrc"))
