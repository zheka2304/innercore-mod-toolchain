import json
import os
from errno import ENOENT
from os.path import (basename, dirname, getmtime, getsize, isdir, isfile,
                     islink, join)
from typing import Collection, Dict, Final, List

from .utils import get_all_files

try:
	from hashlib import blake2s as encode
except ImportError:
	from hashlib import md5 as encode

class HashStorage:
	last_hashes: Dict[str, str]
	hashes: Dict[str, str]
	path: Final[str]

	def __init__(self, path: str, comparing_mode: str = "content") -> None:
		self.path = path
		self.hashes = dict()
		self.comparing_mode = comparing_mode
		self.read()

	def read(self) -> None:
		self.last_hashes = dict()
		self.hashes = dict()

		if isfile(self.path):
			with open(self.path, "r") as file:
				try:
					self.last_hashes = json.load(file)
				except json.JSONDecodeError:
					from .shell import warn
					warn(f"* Malformed {basename(self.path)!r}, prebuilt caches will be ignored...")

	def get_path_hash(self, path: str, force: bool = False) -> str:
		encoded = encode(bytes(path, "utf-8")).hexdigest()
		if not force and encoded in self.hashes:
			return self.hashes[encoded]

		if isfile(path) or islink(path):
			hash = HashStorage.get_file_hash(path, comparing_mode=self.comparing_mode)
		elif isdir(path):
			hash = HashStorage.get_directory_hash(path, comparing_mode=self.comparing_mode)
		else:
			raise FileNotFoundError(ENOENT, os.strerror(ENOENT), path)

		self.hashes[encoded] = hash
		return hash

	@staticmethod
	def do_comparing(path: str, /, comparing_mode: str = "content") -> bytes:
		return bytes(str(getsize(path)), "utf-8") if comparing_mode == "size" \
			else bytes(str(getmtime(path)), "utf-8") if comparing_mode == "modify" \
			else open(path, "rb").read() if comparing_mode == "content" else bytes()

	@staticmethod
	def get_directory_hash(directory: str, /, comparing_mode: str = "content") -> str:
		total = encode()
		for dirpath, dirnames, filenames in os.walk(directory):
			for filename in filenames:
				filepath = join(dirpath, filename)
				total.update(HashStorage.do_comparing(filepath, comparing_mode=comparing_mode))
		return total.hexdigest()

	@staticmethod
	def get_file_hash(path: str, /, comparing_mode: str = "content") -> str:
		return encode(HashStorage.do_comparing(path, comparing_mode=comparing_mode)).hexdigest()

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
			}, indent=None, separators=(",", ":"), ensure_ascii=False) + "\n")

	def is_path_changed(self, path: str, force: bool = False) -> bool:
		encoded = encode(bytes(path, "utf-8")).hexdigest()
		hash = self.get_path_hash(path, force)
		return encoded not in self.last_hashes \
			or self.last_hashes[encoded] != hash
