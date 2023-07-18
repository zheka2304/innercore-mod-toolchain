import os
import platform
import re
import shutil
import subprocess
from os.path import abspath, exists, isdir, isfile, islink, join
from typing import (Any, Callable, Iterable, List, Literal, Optional, Union,
                    overload)
from zipfile import ZipFile, ZipInfo

from . import GLOBALS
from .shell import confirm, info

DEVNULL = open(os.devnull, "w")


def ensure_directory(directory: str) -> None:
	"""
	Ensures that specified path is directory,
	removes existing file if it exists.
	"""
	if isfile(directory) or islink(directory):
		os.remove(directory)
	if not exists(directory):
		os.makedirs(directory, exist_ok=True)

def ensure_file_directory(file: str) -> None:
	"""
	Ensures that specified file parent directory is exists,
	removes existing file if it exists.
	"""
	ensure_directory(abspath(join(file, "..")))

def remove_tree(directory: str) -> None:
	"""
	Removes existing files, directories and links recursive.
	"""
	if not exists(directory):
		return
	if isfile(directory) or islink(directory):
		os.remove(directory); return
	shutil.rmtree(directory, ignore_errors=True)

def copy_file(source: str, destination: str) -> None:
	"""
	Copies source file to destination file or directory,
	non-existing parent folders will be created.
	"""
	ensure_file_directory(destination)
	try:
		shutil.copy(source, destination)
	except shutil.SameFileError:
		pass

def move_tree(source: str, destination: str) -> None:
	"""
	Moves source file or directory to destination,
	which will be removed if already exists.
	"""
	ensure_file_directory(source)
	remove_tree(destination)
	shutil.move(source, destination)

def copy_directory(source: str, destination: str, clear_destination: bool = False, replacement: bool = True, ignore_list: Optional[Iterable[str]] = None, relative_path: Optional[str] = None) -> None:
	# TODO: Replace with shutil.copytree?
	if clear_destination:
		remove_tree(destination)
	ensure_directory(destination)
	if not exists(destination):
		os.makedirs(destination, exist_ok=True)
	for filename in os.listdir(source):
		relative_file = join(relative_path, filename) if relative_path else filename
		input = join(source, filename)
		if ignore_list:
			if filename in ignore_list or relative_file in ignore_list:
				continue
			if input in ignore_list:
				continue
		output = join(destination, filename)
		if isfile(input) and exists(output) and not replacement:
			continue
		if isdir(input):
			if isfile(output):
				os.remove(output)
			copy_directory(input, output, clear_destination, replacement, ignore_list, relative_file)
		elif not isdir(output):
			try:
				shutil.copy2(input, output)
			except shutil.SameFileError:
				pass

def merge_directory(source: str, destination: str, accept_squash: bool = True, ignore_list: Optional[Iterable[str]] = None, only_parent_ignore: bool = False, accept_replace: bool = True) -> None:
	"""
	Moves source file or directory to destination, optionally squashing
	or removes already existing files with same type.
	"""
	if ((isdir(source) and isfile(destination)) or (isdir(destination) and isfile(source))) and accept_squash:
		if isfile(destination + ".bak"):
			os.remove(destination + ".bak")
		elif isdir(destination + ".bak"):
			shutil.rmtree(destination + ".bak")
		shutil.move(destination, destination + ".bak")
	if not isdir(source):
		if not exists(destination):
			ensure_file_directory(destination)
			shutil.move(source, destination)
		return
	for filename in os.listdir(source):
		if ignore_list and filename in ignore_list:
			continue
		above = join(source, filename)
		behind = join(destination, filename)
		if isfile(above) and (not exists(behind) or (isfile(behind) and accept_replace)):
			if exists(behind):
				os.remove(behind)
			ensure_file_directory(behind)
			shutil.move(above, behind)
		elif isdir(above) or accept_squash:
			merge_directory(above, behind, accept_squash, ignore_list if not only_parent_ignore else list(), only_parent_ignore, accept_replace)

def walk_all_files(directories: Union[Iterable[str], str], then: Callable[[str], Any], extensions: Iterable[str] = ()) -> None:
	"""
	Recursively walks over directory contents and filters outputs
	if any extension provided in collection.
	"""
	def walk_files(directory: str):
		if isdir(directory):
			for dirpath, dirnames, filenames in os.walk(directory):
				for filename in filenames:
					has_extensions = False
					for extension in extensions:
						has_extensions = True
						if len(filename) >= len(extension) and filename[-len(extension):] == extension:
							then(join(dirpath, filename))
							break
					if not has_extensions:
						then(join(dirpath, filename))

	if isinstance(directories, str):
		walk_files(directories)
	else:
		for directory in directories:
			walk_files(directory)

def get_all_files(directories: Union[Iterable[str], str], extensions: Iterable[str] = ()) -> List[str]:
	"""
	Recursively walks over directories contents and filters results
	if any extension provided in collection.
	"""
	files = list()
	walk_all_files(directories, lambda filename: files.append(filename), extensions)
	return files

def list_subdirectories(path: str, max_depth: int = 5, directories: Optional[List[str]] = None) -> List[str]:
	"""
	Recursively walks over directories and collects subdirectories
	into passed or new list until maximum depth exceed.
	"""
	if not directories:
		directories = list()
	if not isdir(path):
		return directories
	directories.append(path)
	for filename in os.listdir(path):
		subpath = join(path, filename)
		if max_depth > 0 and isdir(subpath):
			list_subdirectories(subpath, max_depth - 1, directories)
	return directories

@overload 
def ensure_not_whitespace(what: Optional[str], fallback: None = None) -> Optional[str]: ...
@overload 
def ensure_not_whitespace(what: Optional[str], fallback: str) -> str: ...

def ensure_not_whitespace(what: Optional[str], fallback: Optional[str] = None) -> Optional[str]:
	"""
	Ensures that passed stroke is not none and contains any
	non-whitespace characters or returns fallback instead.
	"""
	return fallback if not what or len(what) == 0 or what.isspace() else what

def name_to_identifier(name: str, delimiter: str = "") -> str:
	"""
	Parses written name to identifier with alphabetic and decimal symbols.
	"""
	previous_char_lower = False
	previous_chars_upper = 0
	identifier = ""
	for char in name:
		if char.isalpha() or char.isdecimal():
			if (char.isupper() and previous_char_lower) or (char.islower() and previous_chars_upper > 1):
				identifier += delimiter
			identifier += char.lower()
		elif len(delimiter) > 0 and not identifier.endswith(delimiter):
			identifier += delimiter
		previous_char_lower = char.islower()
		previous_chars_upper = previous_chars_upper + 1 if char.isupper() else 0
	return identifier

def get_project_folder_by_name(directory: str, name: str) -> Optional[str]:
	"""
	Returns project name, which contains only alphabetic and decimal symbols.
	Fails if shrinked source is empty, e.g. name is whitespace or symbols.
	"""
	folder = name_to_identifier(name, "-").strip("-")
	return get_next_filename(directory, folder, "-") if len(folder) > 0 else None

def get_next_filename(directory: str, name: str, delimiter: str = "") -> str:
	"""
	Recursive checking existing pathes, counting additional postfix, which
	is separated from provided name with delimiter.
	"""
	buffer_name = name
	buffer_index = 0
	while exists(join(directory, buffer_name)):
		buffer_index += 1
		buffer_name = f"{name}{delimiter}{buffer_index}"
	return buffer_name

def shortcodes(source: str) -> str:
	"""
	- {datestamp} -> 20231201
	- {timestamp} -> 1745
	"""
	from datetime import datetime
	date = datetime.now()
	source = source.replace("{datestamp}", date.strftime("%Y%m%d"))
	source = source.replace("{timestamp}", date.strftime("%H%M"))
	return source

def request_typescript() -> Literal["javascript", "typescript"]:
	"""
	Utility to check and install tsc with npm.
	"""
	if shutil.which("tsc"):
		return "typescript"
	if not confirm("Do you want to enable TypeScript and ES6+ support (requires Node.js to build project)?", True):
		return "javascript"
	info("Updating TypeScript globally via npm...")
	os.system("npm install -g typescript")
	return request_typescript()

def request_tool(name: str) -> Optional[str]:
	path = GLOBALS.TOOLCHAIN_CONFIG.get_value(f"tools.{name}")
	if path:
		path = GLOBALS.TOOLCHAIN_CONFIG.get_absolute_path(path)
		if exists(path):
			return path
	path = shutil.which(name)
	if not path:
		return None
	return abspath(path)

def request_executable_version(executable: Union[str, List[str]]) -> float:
	pattern_version = re.compile(r"\d+\.\d+")
	if isinstance(executable, str):
		executable = [executable]
	result = subprocess.run(executable + [
		"--version"
	], text=True, capture_output=True)
	if result.returncode == 0 and result.stdout:
		result = pattern_version.search(result.stdout)
		if result:
			return float(result.group())
	result = subprocess.run(executable + [
		"-version"
	], text=True, capture_output=True)
	if result.returncode == 0 and result.stdout:
		result = pattern_version.search(result.stdout)
		if result:
			return float(result.group())
	return 0.0

class AttributeZipFile(ZipFile):
	def _extract_member(self, member: Union[ZipInfo, str], targetpath: str, pwd: Optional[str]) -> str:
		if not isinstance(member, ZipInfo):
			member = self.getinfo(member)

		targetpath = super()._extract_member(member, targetpath, pwd) # type: ignore

		attr = member.external_attr >> 16
		if platform.system() == "Windows":
			attr |= 0o0000200 | 0o0000020 # issues/17
		if attr != 0:
			os.chmod(abspath(targetpath), attr)
		return targetpath
