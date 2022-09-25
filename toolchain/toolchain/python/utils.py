import os
from os.path import join, exists, abspath, isfile, isdir
import shutil

def ensure_directory(directory):
	if isfile(directory):
		os.remove(directory)
	if not exists(directory):
		os.makedirs(directory)

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
		os.makedirs(destination)
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

def shortcodes(str):
	from datetime import datetime
	date = datetime.now()
	str = str.replace("{datestamp}", date.strftime("%Y%m%d"))
	str = str.replace("{timestamp}", date.strftime("%H%M"))
	return str

def request_typescript():
	if shutil.which("tsc") is not None:
		return "typescript"
	if input("Do you want to enable Typescript and ES6+ support (requires Node.js to build project)? [Y/n]: ").lower() == "n":
		return "javascript"
	print("Updating typescript version")
	os.system("npm install -g typescript")
	return request_typescript()
