import sys
from os.path import exists, isdir, join, basename
import time

from utils import clear_directory, copy_directory
from make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from shell import SelectiveShell, Entry
from project_manager import PROJECT_MANAGER

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
	clear_directory(MAKE_CONFIG.get_path(path) if project else TOOLCHAIN_CONFIG.get_path(path))
	print(f"Completed {basename(path)} cleanup in {int((time.time() - start_time) * 100) / 100}s")

def create_project(return_folder = False):
	if not exists(TOOLCHAIN_CONFIG.get_path("../toolchain-mod")):
		from task import error
		error("Not found ../toolchain-mod template, nothing to do.")

	name = input("Enter project name: ")

	if name == "":
		from task import error
		error("New project will not be created.", 0)

	def_folder = name.replace(":", "-")
	i = 1
	while exists(TOOLCHAIN_CONFIG.get_path(def_folder)):
		def_folder = name.replace(":", "-") + str(i)
		i += 1

	folder = input("Enter project folder [" + def_folder + "]: ")
	if folder == "":
		folder = def_folder
	while exists(TOOLCHAIN_CONFIG.get_path(folder)):
		print(f"""Folder "{folder}" already exists!""")
		folder = input("Enter project folder [" + def_folder + "]: ")
		if folder == "":
			folder = def_folder

	author = input("Enter author name: ")
	version = input("Enter project version [1.0]: ")
	description = input("Enter project description: ")
	is_client = input("It will be client side? [y/N]: ")

	if folder == "":
		folder = def_folder
	if version == "":
		version = "1.0"
	is_client = is_client.lower() == "y"

	index = PROJECT_MANAGER.create_project(
		name,
		folder = folder,
		author = author,
		version = version,
		description = description,
		client = is_client
	)

	return folder if return_folder else index

def setup_launcher_js(make_obj, path):
	with open(join(path, "launcher.js"), "w") as file:
		file.write("""ConfigureMultiplayer({
	name: \"""" + make_obj["info"]["name"] + """\",
	version: \"""" + make_obj["info"]["version"] + """\",
	isClientOnly: """ + ("true" if make_obj["info"]["client"] else "false") + """
});

Launch();
""")

def select_project(variants, prompt = "Which project do you want?", selected = None):
	if prompt is not None:
		print(prompt, end="")
	shell = SelectiveShell(infinite_scroll=True)
	for variant in variants:
		shell.interactables.append(Entry(variant, variant if selected != variant else f"\x1b[7m{variant}\x1b[0m"))
	try:
		shell.loop()
	except KeyboardInterrupt:
		return None
	try:
		print((prompt + " " if prompt is not None else "") + "\x1b[2m" + shell.get_interactable(shell.which()).placeholder() + "\x1b[0m")
	except ValueError:
		pass
	return shell.what()
