import json
import os
from errno import ENOENT
from os.path import dirname, getmtime, getsize, isdir, isfile, join
from typing import Collection, Dict, Final, List

from .make_config import MAKE_CONFIG
from .utils import get_all_files

try:
	from hashlib import blake2s as encode
except ImportError:
	from hashlib import md5 as encode


class HashStorage:
	last_hashes: Dict[str, str]
	hashes: Dict[str, str]
	path: Final[str]

	def __init__(self, path: str) -> None:
		self.path = path
		if isfile(path):
			self.read()
		self.last_hashes = {}
		self.hashes = {}

	def read(self) -> None:
		with open(self.path, "r") as file:
			self.last_hashes = json.load(file)

	def get_path_hash(self, path: str, force: bool = False) -> str:
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
	def do_comparing(path: str) -> bytes:
		return bytes(str(getsize(path)), "utf-8") if COMPARING_MODE == "size" \
			else bytes(str(getmtime(path)), "utf-8") if COMPARING_MODE == "modify" \
			else open(path, "rb").read() if COMPARING_MODE == "content" else bytes()

	@staticmethod
	def get_directory_hash(directory: str) -> str:
		total = encode()
		for dirpath, dirnames, filenames in os.walk(directory):
			for filename in filenames:
				filepath = join(dirpath, filename)
				total.update(HashStorage.do_comparing(filepath))
		return total.hexdigest()

	@staticmethod
	def get_file_hash(path: str) -> str:
		return encode(HashStorage.do_comparing(path)).hexdigest()

	def get_modified_files(self, path: str, extensions: Collection[str] = (), force: bool = False) -> List[str]:
		if not isdir(path):
			raise NotADirectoryError(path)
		return list(filter(
			lambda filepath: self.is_path_changed(filepath, force),
			get_all_files(path, extensions)
		))

	def save(self) -> None:
		os.makedirs(dirname(self.path), exist_ok=True)
		with open(self.path, "w") as file:
			file.write(json.dumps({
				**self.last_hashes,
				**self.hashes
			}, indent=None, separators=(",", ":")) + "\n")

	def is_path_changed(self, path: str, force: bool = False) -> bool:
		hash = self.get_path_hash(path, force)
		encoded = encode(bytes(path, "utf-8")).hexdigest()
		return encoded not in self.last_hashes \
			or self.last_hashes[encoded] != hash


COMPARING_MODE = MAKE_CONFIG.get_value("development.comparingMode", "content")
BUILD_STORAGE = HashStorage(MAKE_CONFIG.get_build_path(".buildrc"))
OUTPUT_STORAGE = HashStorage(MAKE_CONFIG.get_build_path(".outputrc"))
