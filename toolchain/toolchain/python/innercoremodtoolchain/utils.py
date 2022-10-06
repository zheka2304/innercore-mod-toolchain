import os
from os.path import join, exists, abspath, isfile, isdir
import shutil
import sys
from zipfile import ZipFile, ZipInfo

def ensure_directory(directory):
	if isfile(directory):
		os.remove(directory)
	if not exists(directory):
		os.makedirs(directory, exist_ok=True)

def ensure_file_dir(file):
	ensure_directory(abspath(join(file, "..")))

def clear_directory(directory):
	ensure_directory(directory)
	shutil.rmtree(directory)

def copy_file(src, dst):
	ensure_file_dir(dst)
	try:
		shutil.copy(src, dst)
	except shutil.SameFileError:
		pass

def move_file(src, dst):
	ensure_file_dir(dst)
	shutil.move(src, dst)

def copy_directory(path, destination, clear_dst = False, replacement = True, ignore_list = [], relative_path = None):
	ensure_directory(destination)
	if clear_dst:
		clear_directory(destination)
	if not exists(destination):
		os.makedirs(destination, exist_ok=True)
	for filename in os.listdir(path):
		relative_file = join(relative_path, filename) if relative_path is not None else filename
		if filename in ignore_list or relative_file in ignore_list:
			continue
		input = join(path, filename)
		if input in ignore_list:
			continue
		output = join(destination, filename)
		if isfile(input) and exists(output) and not replacement:
			continue
		if isdir(input):
			if isfile(output):
				os.remove(output)
			copy_directory(input, output, clear_dst, replacement, ignore_list, relative_file)
		elif not isdir(output):
			try:
				shutil.copy2(input, output)
			except shutil.SameFileError:
				pass

def merge_directory(src, dst, accept_squash = True, ignore_list = [], only_parent_ignore = False, accept_replace = True):
	if ((isdir(src) and isfile(dst)) or (isdir(dst) and isfile(src))) and accept_squash:
		if isfile(dst + ".bak"):
			os.remove(dst + ".bak")
		elif isdir(dst + ".bak"):
			shutil.rmtree(dst + ".bak")
		shutil.move(dst, dst + ".bak")
	if not isdir(src):
		if not exists(dst):
			shutil.move(src, dst)
		return
	for filename in os.listdir(src):
		if filename in ignore_list:
			continue
		above = join(src, filename)
		behind = join(dst, filename)
		if isfile(above) and (not exists(behind) or (isfile(behind) and accept_replace)):
			if exists(behind):
				os.remove(behind)
			shutil.move(above, behind)
		elif isdir(above) or accept_squash:
			merge_directory(above, behind, accept_squash, ignore_list if not only_parent_ignore else [], only_parent_ignore, accept_replace)

def get_all_files(directory, extensions = ()):
	all_files = []
	for dirpath, dirnames, filenames in os.walk(directory):
		for filename in filenames:
			if len(extensions) == 0:
				all_files.append(abspath(join(dirpath, filename)))
			else:
				for extension in extensions:
					if len(filename) >= len(extension) and filename[-len(extension):] == extension:
						all_files.append(abspath(join(dirpath, filename)))
						break
	return all_files

def ensure_not_whitespace(what, fallback = None):
	return fallback if what is None or len(what) == 0 or what.isspace() else what

def name_to_identifier(name, delimiter = ""):
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

def get_project_folder_by_name(directory, name):
	folder = name_to_identifier(name, "-").strip("-")
	return get_next_filename(directory, folder, "-") if len(folder) > 0 else None

def get_next_filename(directory, name, delimiter = ""):
	buffer_name = name
	buffer_index = 0
	while exists(join(directory, buffer_name)):
		buffer_index += 1
		buffer_name = f"{name}{delimiter}{buffer_index}"
	return buffer_name

def shortcodes(str):
	from datetime import datetime
	date = datetime.now()
	str = str.replace("{datestamp}", date.strftime("%Y%m%d"))
	str = str.replace("{timestamp}", date.strftime("%H%M"))
	return str

def request_typescript():
	if shutil.which("tsc") is not None:
		return "typescript"
	try:
		if input("Do you want to enable TypeScript and ES6+ support (requires Node.js to build project)? [Y/n] ")[:1].lower() == "n":
			return "javascript"
	except KeyboardInterrupt:
		pass
	print("Updating TypeScript globally via npm...")
	os.system("npm install -g typescript")
	return request_typescript()

class AttributeZipFile(ZipFile):
	if sys.version_info < (3, 6):
		def extract(self, member, path = None, pwd = None):
			if not isinstance(member, ZipInfo):
				member = self.getinfo(member)

			if path is None:
				path = os.getcwd()

			targetpath = self._extract_member(member, path, pwd)

			attr = member.external_attr >> 16
			os.chmod(targetpath, attr)
			return targetpath

	else:
		def _extract_member(self, member, targetpath, pwd):
			if not isinstance(member, ZipInfo):
				member = self.getinfo(member)

			targetpath = super()._extract_member(member, targetpath, pwd)

			attr = member.external_attr >> 16
			if attr != 0:
				os.chmod(targetpath, attr)
			return targetpath
