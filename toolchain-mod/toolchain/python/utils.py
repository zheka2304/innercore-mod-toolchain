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


def copy_directory(src, dst, clear_dst=False):
	ensure_directory(dst)
	if clear_dst:
		clear_directory(dst)
	from distutils.dir_util import copy_tree
	copy_tree(src, dst)


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

