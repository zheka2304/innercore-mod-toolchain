import os
from os.path import join, relpath
import subprocess
import glob

from make_config import make_config
from hash_storage import output_storage
from progress_bar import print_progress_bar

devnull = open(os.devnull, "w")

def get_push_pack_directory():
	directory = join(make_config.get_value("pushTo"), "innercore", "mods", make_config.get_value("currentProject"))
	if directory is None:
		return None
	if "games/horizon/packs" not in directory:
		ans = input(f"Push directory {directory} looks suspicious, it does not belong to horizon packs directory, push will corrupt all contents, allow it only if you know what are you doing [y/N]: ")
		if ans.lower() == "y":
			return directory
		else:
			print("Aborting push.")
			return None
	return directory

def push(directory, cleanup = False, pushUnchanged = False):
	if not pushUnchanged:
		raws = glob(directory + "/*")
		items = [relpath(path, directory) for path in raws if output_storage.is_path_changed(path)]
	else:
		items = [os.path.relpath(path, directory) for path in glob(directory + "/*")]

	if len(items) < 1:
		print_progress_bar(1, 1, suffix = "Complete!", length = 50)
		return 0

	dst_root = get_push_pack_directory()
	if dst_root is None:
		return -1

	result = subprocess.call([
		make_config.get_adb(),
		"devices"
	], stderr=devnull, stdout=devnull)
	if result != 0:
		print("\x1b[91mNo devices/emulators found, try to use task \"Connect to ADB\"\x1b[0m")
		return result

	dst_root = dst_root.replace("\\", "/")
	if not dst_root.startswith("/"):
		dst_root = "/" + dst_root

	src_root = directory.replace("\\", "/")

	progress = 0
	for filename in items:
		src = src_root + "/" + filename
		dst = dst_root + "/" + filename
		print_progress_bar(progress, len(items), suffix = f"Pushing {filename}" + (" " * 20), length = 50)
		subprocess.call([
			make_config.get_adb(),
			"shell", "rm", "-r", dst
		], stderr=devnull, stdout=devnull)
		result = subprocess.call([
			make_config.get_adb(),
			"push", src, dst
		], stderr=devnull, stdout=devnull)
		progress += 1

		if result != 0:
			print(f"Failed to push to directory {dst_root} with code {result}")
			return result

	print_progress_bar(progress, len(items), suffix = "Complete!" + (" " * 20), length = 50)
	output_storage.save()
	return result

def make_locks(*locks):
	dst = get_push_pack_directory()
	if dst is None:
		return -1

	for lock in locks:
		lock = join(dst, lock).replace("\\", "/")
		result = subprocess.call([
			make_config.get_adb(),
			"shell", "touch", lock
		])
		if result != 0:
			return result
	return 0
