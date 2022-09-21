import sys
from os.path import isdir, join, basename
import time

from utils import clear_directory, copy_directory
from make_config import MAKE_CONFIG

def get_path_set(pathes, error_sensitive = False):
	directories = []
	for path in pathes:
		for directory in MAKE_CONFIG.get_paths(path):
			if isdir(directory):
				directories.append(directory)
			else:
				if error_sensitive:
					print(f"Declared invalid directory {path}, task will be terminated", file=sys.stderr)
					return None
				else:
					print(f"Declared invalid directory {path}, it will be skipped")
	return directories

def get_asset_directories(**kw):
	main_assets = get_path_set(MAKE_CONFIG.get_value("assets.main", []), error_sensitive=True)
	if main_assets is not None:
		modified_assets = get_path_set(MAKE_CONFIG.get_value("assets.modified", []), error_sensitive=True)
		if modified_assets is not None:
			return main_assets + modified_assets
	return None

def assemble_assets():
	asset_directories = get_asset_directories()
	if asset_directories is None:
		print("Some asset directories are invalid, nothing will happened")
		return -1

	output_dir = MAKE_CONFIG.get_path("output/assets")
	clear_directory(output_dir)
	for asset_dir in asset_directories:
		copy_directory(asset_dir, output_dir)
	return 0

def assemble_additional_directories():
	result = 0
	output_dir = MAKE_CONFIG.get_path("output")
	for additional_dir in MAKE_CONFIG.get_value("additional", []):
		if "sources" not in additional_dir or "pushTo" not in additional_dir:
			print("Invalid formatted additional directory json", additional_dir)
			result = -1
			break
		dst_dir = join(output_dir, additional_dir["pushTo"])
		clear_directory(dst_dir)
		source_directories = get_path_set(additional_dir["sources"], error_sensitive=True)
		if source_directories is None:
			print("Some additional directories are invalid, nothing will happened")
			result = -1
			break
		for source_dir in source_directories:
			copy_directory(source_dir, dst_dir)
	return result

def cleanup_relative_directory(path, project = False):
	start_time = time.time()
	clear_directory(MAKE_CONFIG.get_project_path(path) if project else MAKE_CONFIG.get_path(path))
	print(f"Completed {basename(path)} cleanup in {int((time.time() - start_time) * 100) / 100}s")
