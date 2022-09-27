import os
from os.path import exists, isdir, join, basename, relpath
import time

from utils import clear_directory, copy_directory, copy_file, get_all_files, get_project_folder_by_name, name_to_identifier
from make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from shell import Input, Interrupt, Notice, Progress, SelectiveShell, Entry, Separator, Shell, Switch
from project_manager import PROJECT_MANAGER

def get_path_set(pathes, error_sensitive = False):
	directories = []
	for path in pathes:
		for directory in MAKE_CONFIG.get_paths(path):
			if isdir(directory):
				directories.append(directory)
			else:
				if error_sensitive:
					print(f"Declared invalid directory {path}, task will be terminated")
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

def new_project(template = "../toolchain-mod"):
	if not exists(TOOLCHAIN_CONFIG.get_path(template)):
		from task import error
		error(f"Not found {template} template, nothing to do.")
	shell = SelectiveShell()

	have_template = TOOLCHAIN_CONFIG.get_value("template") is not None
	always_skip_description = TOOLCHAIN_CONFIG.get_value("template.skipDescription", False)
	progress_step = 0.5 if have_template and always_skip_description else 0.33 if have_template or always_skip_description else 0.25
	print("Inner Core Mod Toolchain", end="")

	class NameObserver(Shell.Interactable):
		def __init__(self):
			Shell.Interactable.__init__(self, "name_observer")

		def observe_key(self, what):
			input = shell.get_interactable("name")
			self.directory = get_project_folder_by_name(TOOLCHAIN_CONFIG.root_dir, input.text)
			header = shell.get_interactable("header")
			header.size = 2 if self.directory is None else 1
			location = shell.get_interactable("location")
			location.text = "" if self.directory is None else "It will be in " + self.directory + "\n"
			progress = shell.get_interactable("step")
			progress.progress = 0 if self.directory is None else progress_step
			progress.text = " " + "Specify name".center(45) + (" " if self.directory is None else ">")
			return self.directory is None

	shell.interactables += [
		Notice("Create new project"),
		Separator("header", size=2),
		# Entry("template", "Choose template"),
		Input("name", "Name: ", TOOLCHAIN_CONFIG.get_value("template.name", "")),
		Notice("location", ""),
		NameObserver(),
		Progress("step")
	]
	if not always_skip_description:
		shell.interactables += [
			Input("author", "Author: ", TOOLCHAIN_CONFIG.get_value("template.author", "")),
			Input("version", "Version: ", TOOLCHAIN_CONFIG.get_value("template.version", "1.0")),
			Input("description", "Description: ", TOOLCHAIN_CONFIG.get_value("template.description", "")),
			Switch("client_side", "Client side only", TOOLCHAIN_CONFIG.get_value("template.clientOnly", False)),
			Separator(),
			Progress(progress=progress_step * 2, text="<" + "Configure details".center(45) + ">")
		]
	if not have_template:
		shell.interactables += [
			Notice("You can override template by setting up `template`"),
			Notice("property in your toolchain.json, it will be automatically"),
			Notice("applied when new project is being created."),
			Notice("Properties are still same make.json `info` property."),
			Separator(),
			Progress(progress=progress_step * (3 if not always_skip_description else 2), text="<" + "Set up notice".center(45) + ">")
		]

	shell.interactables.append(Interrupt())
	observer = shell.get_interactable("name_observer")
	observer.observe_key(None)
	try:
		shell.loop()
	except KeyboardInterrupt:
		return None
	if not hasattr(observer, "directory") or observer.directory is None:
		from task import error
		error("Not found `directory` property in observer!")
	print(f"Copying template '{template}' to '{observer.directory}'")
	return PROJECT_MANAGER.create_project(
		template, observer.directory,
		shell.get_interactable("name").text,
		shell.get_interactable("author").text,
		shell.get_interactable("version").text,
		shell.get_interactable("description").text,
		shell.get_interactable("client_side").checked
	)

def resolve_make_format_map(make_obj, path):
	make_obj_info = make_obj["info"] if "info" in make_obj else {}
	identifier = name_to_identifier(basename(path))
	while len(identifier) > 0 and identifier[0].isdecimal():
		identifier = identifier[1:]
	package_prefix = name_to_identifier(make_obj_info["author"]) if "author" in make_obj_info else "icmods"
	while len(package_prefix) > 0 and package_prefix[0].isdecimal():
		package_prefix = package_prefix[1:]
	package_suffix = name_to_identifier(make_obj_info["name"]) if "name" in make_obj_info else identifier
	while len(package_suffix) > 0 and package_suffix[0].isdecimal():
		package_suffix = package_suffix[1:]
	return {
		"identifier": identifier if len(identifier) > 0 else "whoami",
		"package_suffix": package_suffix if len(package_suffix) > 0 else "mod",
		"package_prefix": package_prefix,
		"name": "Mod",
		"author": "ICMods",
		"version": "1.0",
		"description": "My brand new mod.",
		"clientOnly": False,
		**make_obj_info
	}

def setup_project(make_obj, template, path):
	makemap = resolve_make_format_map(make_obj, path)
	dirmap = { template: "" }
	for dirpath, dirnames, filenames in os.walk(template):
		for dirname in dirnames:
			dir = join(dirpath, dirname)
			dirmap[dir] = relpath(dir, template)
			try:
				dirmap[dir] = dirmap[dir].format_map(makemap)
			except BaseException:
				print(f"Source {dirmap[dir]} contains malformed name!")
			os.mkdir(join(path, dirmap[dir]))
		for filename in filenames:
			if dirpath == template and filename == "template.json":
				continue
			file = join(path, join(dirmap[dirpath], filename))
			copy_file(join(dirpath, filename), file)
	for source in get_all_files(path, extensions=(".json", ".js", ".ts", "manifest", ".java", ".cpp")):
		with open(source, "r") as source_file:
			lines = source_file.readlines()
		for index in range(len(lines)):
			try:
				lines[index] = lines[index].format_map(makemap)
			except BaseException:
				pass
		with open(source, "w") as source_file:
			source_file.writelines(lines)

def setup_launcher_js(make_obj, path):
	with open(join(path, "launcher.js"), "w") as file:
		file.write("""ConfigureMultiplayer({
	name: \"""" + make_obj["info"]["name"] + """\",
	version: \"""" + make_obj["info"]["version"] + """\",
	isClientOnly: """ + ("true" if "clientOnly" in make_obj["info"] and make_obj["info"]["clientOnly"] else "false") + """
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
