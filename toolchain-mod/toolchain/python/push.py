import os
import os.path
import subprocess

from make_config import make_config
from glob import glob

from hash_storage import output_storage as storage
from progress_bar import print_progress_bar

# /dev/null
ignore = open(os.devnull, 'w')

def get_push_pack_directory():
	directory = make_config.get_value("make.pushTo")
	if directory is None:
		return None
	if "games/horizon/packs" not in directory:
		ans = input(f"push directory {directory} looks suspicious, it does not belong to horizon packs directory, push will corrupt all contents, allow it only if you know what are you doing (type Y or yes to proceed): ")
		if ans.lower() in ["yes", "y"]:
			return directory
		else:
			print("interpreted as NO, aborting push")
			return None
	return directory


def push(directory, cleanup=False):
	items = glob(directory + "/*")
	changed = [os.path.relpath(path, directory) for path in items if storage.is_path_changed(path)]

	if len(changed) < 1:
		print_progress_bar(1, 1, suffix = 'Complete!', length = 50)
		return 0

	dst_root = get_push_pack_directory()
	if dst_root is None:
		return -1

	result = subprocess.call([make_config.get_adb(), "devices"], stderr=ignore, stdout=ignore)
	if result != 0:
		print("\033[91mno devices/emulators found, try to use task \"Connect to ADB\"\033[0m")
		return result

	dst_root = dst_root.replace("\\", "/")
	if not dst_root.startswith("/"):
		dst_root = "/" + dst_root

	src_root = directory.replace("\\", "/")

	progress = 0
	for filename in changed:
		src = src_root + "/" + filename
		dst = dst_root + "/" + filename
		print_progress_bar(progress, len(changed), suffix = f'Pushing {filename}' + (" " * 20), length = 50)
		subprocess.call([make_config.get_adb(), "shell", "rm", "-r", dst], stderr=ignore, stdout=ignore)
		result = subprocess.call([make_config.get_adb(), "push", src, dst], stderr=ignore, stdout=ignore)
		progress += 1

		if result != 0:
			print(f"failed to push to directory {dst_root} with code {result}")
			return result
	
	print_progress_bar(progress, len(changed), suffix = f'Complete!' + (" " * 20), length = 50)
	storage.save()
	return result


def make_locks(*locks):
	dst = get_push_pack_directory()
	if dst is None:
		return -1

	for lock in locks:
		lock = os.path.join(dst, lock).replace("\\", "/")
		result = subprocess.call([make_config.get_adb(), "shell", "touch", lock])
		if result != 0:
			return result
	return 0
