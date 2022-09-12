import os
import os.path


def ensure_directory(directory):
	if not os.path.exists(directory):
		os.makedirs(directory)

def ensure_file_dir(file):
	ensure_directory(os.path.abspath(os.path.join(file, "..")))

def clear_directory(directory):
	import shutil
	ensure_directory(directory)
	shutil.rmtree(directory)

def copy_file(src, dst):
	import shutil
	ensure_file_dir(dst)
	shutil.copy(src, dst)

def move_file(src, dst):
	import shutil
	ensure_file_dir(dst)
	shutil.move(src, dst)

def indexOf(_list, _value):
	try:
		return _list.index(_value)
	except ValueError:
		return -1

def copy_directory(src, dst, clear_dst=False, replacement=True, ignore=[], ignore_list=[], ignoreEx=False):
	ensure_directory(dst)
	if clear_dst:
		clear_directory(dst)

	if not os.path.exists(dst):
		os.mkdir(dst)
	from glob import glob

	if len(ignore) > 0:
		for i in ignore:
			ignore_list += glob(os.path.join(dst, i))

	import shutil
	for item in os.listdir(src):
		s = os.path.join(src, item)
		d = os.path.join(dst, item)
		if os.path.isfile(s) and os.path.exists(d) and not replacement:
			continue

		if os.path.isdir(s):
			copy_directory(s, d, clear_dst, replacement, ignore_list=ignore_list, ignoreEx=ignoreEx)
		elif indexOf(ignore_list, d) == -1:
			shutil.copy2(s, d)

def get_all_files(directory, extensions=()):
	all_files = []
	for root, _, files in os.walk(directory):
		for file in files:
			if len(extensions) == 0:
				all_files.append(os.path.abspath(os.path.join(root, file)))
			else:
				for extension in extensions:
					if len(file) >= len(extension) and file[-len(extension):] == extension:
						all_files.append(os.path.abspath(os.path.join(root, file)))
						break
	return all_files

def relative_path(directory, file):
	directory = os.path.abspath(directory)
	file = os.path.abspath(file)
	if len(file) >= len(directory) and file[:len(directory)] == directory:
		file = file[len(directory):]
		while len(file) > 0 and file[0] in ("\\", "/"):
			file = file[1:]
		if len(file) == 0:
			raise RuntimeError("file and directory are the same")
		return file
	else:
		raise RuntimeError("file is not in a directory: file=" + file + " dir=" + directory)

def shortcodes(str):
	from datetime import datetime
	date = datetime.now()
	str = str.replace("{datestamp}", date.strftime("%Y%m%d"))
	str = str.replace("{timestamp}", date.strftime("%H%M"))
	return str
