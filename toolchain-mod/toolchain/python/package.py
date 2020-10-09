import os
from os.path import isdir, join

from make_config import make_config
from utils import clear_directory, copy_directory


def get_path_set(paths, error_sensitive=False):
	directories = []
	for path in paths:
		for directory in make_config.get_paths(path):
			if isdir(directory):
				directories.append(directory)
			else:
				if error_sensitive:
					print(f"declared invalid directory {path}, task will be terminated")
					return None
				else:
					print(f"declared invalid directory {path}, it will be skipped")
	return directories


def get_asset_directories(**kw):
	main_assets = get_path_set(make_config.get_value("assets.main", []), error_sensitive=True)
	if main_assets is not None:
		modified_assets = get_path_set(make_config.get_value("assets.modified", []), error_sensitive=True)
		if modified_assets is not None:
			return main_assets + modified_assets
	return None


def assemble_assets():
	asset_directories = get_asset_directories()
	if asset_directories is None:
		print("some asset directories are invalid")
		return -1

	output_dir = make_config.get_path("output/assets")
	clear_directory(output_dir)
	for asset_dir in asset_directories:
		copy_directory(asset_dir, output_dir)
	return 0


def assemble_additional_directories():
	result = 0
	output_dir = make_config.get_path("output")
	for additional_dir in make_config.get_value("additional", []):
		if "sources" not in additional_dir or "pushTo" not in additional_dir:
			print("invalid formatted additional directory json", additional_dir)
			result = -1
			break
		dst_dir = join(output_dir, additional_dir["pushTo"])
		clear_directory(dst_dir)
		source_directories = get_path_set(additional_dir["sources"], error_sensitive=True)
		if source_directories is None:
			print("some additional directories are invalid")
			result = -1
			break
		for source_dir in source_directories:
			copy_directory(source_dir, dst_dir)
	return result
