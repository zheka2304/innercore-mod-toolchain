import os
import sys
import time
from os.path import basename, exists, isdir, isfile, join, relpath
from typing import IO, Any, Callable, Dict, List, Optional

from .make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from .shell import abort, info, warn
from .utils import (DEVNULL, copy_directory, copy_file, ensure_directory,
                    ensure_file_directory, remove_tree)

registered_tasks: Dict[str, Callable] = {}
locked_tasks: Dict[str, IO[Any]] = {}
descriptioned_tasks: Dict[str, str] = {}


def lock_task(name: str, silent: bool = True) -> None:
	path = TOOLCHAIN_CONFIG.get_path(f"toolchain/temp/lock/{name}.lock")
	ensure_file_directory(path)
	await_message = False

	if exists(path):
		while True:
			try:
				if exists(path):
					os.remove(path)
				break
			except IOError:
				if not await_message:
					await_message = True
					if not silent:
						warn(f"* Task {name} is locked by another process, waiting for it to unlock.")
					if name in locked_tasks:
						abort("Dead lock detected!")
				time.sleep(1.5)

	open(path, "tw").close()
	locked_tasks[name] = open(path, "a")

def unlock_task(name: str) -> None:
	if name in locked_tasks:
		locked_tasks[name].close()
		del locked_tasks[name]
	path = TOOLCHAIN_CONFIG.get_path(f"toolchain/temp/lock/{name}.lock")
	if isfile(path):
		os.remove(path)

def unlock_all_tasks() -> None:
	for name in list(locked_tasks.keys()):
		unlock_task(name)

def task(name: str, locks: Optional[List[str]] = None, description: Optional[str] = None) -> Callable[[Callable[[Optional[List[str]]], int]], Callable[[Optional[List[str]]], int]]:
	if locks is None:
		locks = []

	def decorator(callable: Callable[[Optional[List[str]]], int]):
		def caller(args: Optional[List[str]] = None):
			lock_task(name, silent=False)
			for lock_name in locks:
				lock_task(lock_name, silent=False)
			info(f"> Executing task: {name}")
			task_result = callable(args)
			unlock_task(name)
			for lock_name in locks:
				unlock_task(lock_name)
			return task_result

		registered_tasks[name] = caller
		if description is not None:
			descriptioned_tasks[name] = description
		return caller

	return decorator

@task(
	"compileNativeDebug",
	locks=["native", "cleanup", "push"],
	description="Compiles C++ in single debugging `debugAbi`, changed objects will be compiled."
)
def task_compile_native_debug(args: Optional[List[str]] = None) -> int:
	abi = MAKE_CONFIG.get_value("debugAbi", None)
	if abi is None:
		abi = "armeabi-v7a"
		warn(f"* No `debugAbi` value in 'toolchain.json' config, using '{abi}' as default.")
	from .native.native_build import compile_all_using_make_config
	return compile_all_using_make_config([abi])

@task(
	"compileNativeRelease",
	locks=["native", "cleanup", "push"],
	description="Compiles C++ for everything `abis`."
)
def task_compile_native_release(args: Optional[List[str]] = None) -> int:
	abis = MAKE_CONFIG.get_value("abis", [])
	if abis is None or not isinstance(abis, list) or len(abis) == 0:
		abort(f"No `abis` value in 'toolchain.json' config, nothing will happened.")
	from .native.native_build import compile_all_using_make_config
	return compile_all_using_make_config(abis)

@task(
	"compileJavaDebug",
	locks=["java", "cleanup", "push"],
	description="Compiles Java, changed classes will be packed into dex."
)
def task_compile_java_debug(args: Optional[List[str]] = None) -> int:
	from .java.java_build import compile_all_using_make_config
	return compile_all_using_make_config(debug_build=True)

@task(
	"compileJavaRelease",
	locks=["java", "cleanup", "push"],
	description="Compiles Java without debugging information."
)
def task_compile_java_release(args: Optional[List[str]] = None) -> int:
	from .java.java_build import compile_all_using_make_config
	return compile_all_using_make_config(debug_build=False)

@task(
	"buildScriptsDebug",
	locks=["script", "cleanup", "push"],
	description="Rebuilds changes scripts with excluded declarations."
)
def task_build_scripts_debug(args: Optional[List[str]] = None) -> int:
	from .script_build import build_all_scripts
	return build_all_scripts(debug_build=True)

@task(
	"buildScriptsRelease",
	locks=["script", "cleanup", "push"],
	description="Assembling scripts without excluding debug declarations, everything script hashes will be rebuilded too."
)
def task_build_scripts_release(args: Optional[List[str]] = None) -> int:
	from .hash_storage import BUILD_STORAGE, OUTPUT_STORAGE
	from .script_build import build_all_scripts
	OUTPUT_STORAGE.last_hashes = {}
	BUILD_STORAGE.last_hashes = {}
	return build_all_scripts(debug_build=False)

@task(
	"watchScripts",
	locks=["script", "cleanup", "push"],
	description="Watches to script changes, availabled only for TypeScript."
)
def task_watch_scripts(args: Optional[List[str]] = None) -> int:
	from .script_build import build_all_scripts
	return build_all_scripts(debug_build=True, watch=True)

@task(
	"buildResources",
	locks=["resource", "cleanup", "push"],
	description="Builds resource pathes, like gui and atlases."
)
def task_resources(args: Optional[List[str]] = None) -> int:
	from .script_build import build_all_resources
	return build_all_resources()

@task(
	"buildInfo",
	locks=["cleanup", "push"],
	description="Builds output 'mod.info' file."
)
def task_build_info(args: Optional[List[str]] = None) -> int:
	import json

	from .utils import shortcodes
	with open(MAKE_CONFIG.get_path("output/mod.info"), "w") as info_file:
		info = dict(MAKE_CONFIG.get_value("info", fallback={}))

		if "name" in info:
			info["name"] = shortcodes(info["name"])
		if "version" in info:
			info["version"] = shortcodes(info["version"])
		if "description" in info:
			info["description"] = shortcodes(info["description"])
		if "icon" in info:
			del info["icon"]
		if "instantLaunch" in info:
			info["instantLaunch"] = info["instantLaunch"]

		info_file.write(json.dumps(info, indent="\t") + "\n")
	icon_path = MAKE_CONFIG.get_value("info.icon")
	if icon_path is not None:
		icon_path = MAKE_CONFIG.get_absolute_path(icon_path)
		if isfile(icon_path):
			copy_file(icon_path, MAKE_CONFIG.get_path("output/mod_icon.png"))
		else:
			warn(f"* Icon '{icon_path}' described in 'make.json' not found!")
	return 0

@task(
	"buildAdditional",
	locks=["cleanup", "push"],
	description="Copies additional directories, like assets root."
)
def task_build_additional(args: Optional[List[str]] = None) -> int:
	for additional_dir in MAKE_CONFIG.get_value("additional", fallback=[]):
		if "source" in additional_dir and "targetDir" in additional_dir:
			for additional_path in MAKE_CONFIG.get_paths(additional_dir["source"]):
				if not exists(additional_path):
					warn("* Non-existing additional path: " + additional_path)
					break
				target = MAKE_CONFIG.get_path(join(
					"output",
					additional_dir["targetDir"],
					additional_dir["targetFile"] if "targetFile" in additional_dir else basename(additional_path)
				))
				if isdir(additional_path):
					copy_directory(additional_path, target)
				else:
					copy_file(additional_path, target)
	return 0

@task(
	"pushEverything",
	locks=["push"],
	description="Push everything 'output' directory."
)
def task_push_everything(args: Optional[List[str]] = None) -> int:
	from .device import push
	return push(MAKE_CONFIG.get_path("output"), MAKE_CONFIG.get_value("adb.pushUnchangedFiles", True))

@task(
	"clearOutput",
	locks=["assemble", "push", "native", "java"],
	description="Removes 'output' directory in selected project."
)
def task_clear_output(args: Optional[List[str]] = None) -> int:
	if MAKE_CONFIG.get_value("development.clearOutput", False) or (args is not None and "--clean" in args):
		remove_tree(MAKE_CONFIG.get_path("output"))
	return 0

@task(
	"excludeDirectories",
	locks=["push", "assemble", "native", "java"],
	description="Removes excluded from release assembling directories."
)
def task_exclude_directories(args: Optional[List[str]] = None) -> int:
	for path in MAKE_CONFIG.get_value("excludeFromRelease", []):
		for exclude in MAKE_CONFIG.get_paths(join("output", path)):
			if isdir(exclude):
				remove_tree(exclude)
			elif isfile(exclude):
				os.remove(exclude)
	return 0

@task(
	"buildPackage",
	locks=["push", "assemble", "native", "java"],
	description="Performs release mod assembling, already builded 'output' will be used."
)
def task_build_package(args: Optional[List[str]] = None) -> int:
	import shutil
	output_dir = MAKE_CONFIG.get_path("output")
	name = basename(MAKE_CONFIG.current_project) if MAKE_CONFIG.current_project is not None else "unknown"
	output_dir_root_tmp = MAKE_CONFIG.get_build_path("package")
	output_dir_tmp = join(output_dir_root_tmp, name)
	ensure_directory(output_dir)
	if exists(output_dir_tmp):
		shutil.rmtree(output_dir_tmp)
	output_file_tmp = join(output_dir_root_tmp, "package.zip")
	ensure_file_directory(output_file_tmp)
	output_file = MAKE_CONFIG.get_path(name + ".icmod")
	if isfile(output_file):
		os.remove(output_file)
	if isfile(output_file_tmp):
		os.remove(output_file_tmp)
	shutil.copytree(output_dir, output_dir_tmp)
	shutil.make_archive(output_file_tmp[:-4], "zip", output_dir_root_tmp, name)
	shutil.rmtree(output_dir_tmp)
	os.rename(output_file_tmp, output_file)
	return 0

@task(
	"launchHorizon",
	description="Launch Horizon with pack auto-launch."
)
def task_launch_horizon(args: Optional[List[str]] = None) -> int:
	from subprocess import call

	from .device import ADB_COMMAND
	call(ADB_COMMAND + [
		"shell", "touch",
		"/storage/emulated/0/games/horizon/.flag_auto_launch"
	], stdout=DEVNULL, stderr=DEVNULL)
	return call(ADB_COMMAND + [
		"shell", "monkey",
		"-p", "com.zheka.horizon",
		"-c", "android.intent.category.LAUNCHER", "1"
	], stdout=DEVNULL, stderr=DEVNULL)

@task(
	"stopHorizon",
	description="Force stops Horizon via ADB."
)
def stop_horizon(args: Optional[List[str]] = None) -> int:
	from subprocess import call

	from .device import ADB_COMMAND
	return call(ADB_COMMAND + [
		"shell",
		"am",
		"force-stop",
		"com.zheka.horizon"
	], stdout=DEVNULL, stderr=DEVNULL)

@task(
	"loadDocs"
)
def task_load_docs(args: Optional[List[str]] = None) -> int:
	abort("Temporary disabled!")

@task(
	"updateIncludes",
	description="Rebuilds composite 'tsconfig.json' without script building, used mostly to update typings."
)
def task_update_includes(args: Optional[List[str]] = None) -> int:
	from .script_build import (compute_and_capture_changed_scripts,
	                           get_allowed_languages)
	compute_and_capture_changed_scripts(get_allowed_languages(), True)
	from .workspace import WORKSPACE_COMPOSITE
	WORKSPACE_COMPOSITE.flush(True)
	return 0

@task(
	"configureADB",
	description="Interactively configures new ADB connections."
)
def task_configure_adb(args: Optional[List[str]] = None) -> int:
	from . import device
	device.setup_device_connection()
	return 0

@task(
	"newProject",
	description="Interactively creates new project."
)
def task_new_project(args: Optional[List[str]] = None) -> int:
	from .package import new_project

	index = new_project(MAKE_CONFIG.get_value("defaultTemplate", "../toolchain-mod"))
	if index is None:
		print()
		abort()
	print("Successfully completed!")

	from .project_manager import PROJECT_MANAGER
	try:
		if input("Select this project? [Y/n] ")[:1].lower() == "n":
			return 0
	except KeyboardInterrupt:
		pass
	PROJECT_MANAGER.select_project(index=index)
	return 0

@task(
	"importProject",
	description="Import project by required location into output folder, if output is not specified, 'toolchain/<unique_name>' will be used by default."
)
def task_import_project(args: Optional[List[str]] = None) -> int:
	import importlib
	module = importlib.import_module(".import", __package__) # import cannot use name '.import' of course
	path = module.import_project(args[0] if args is not None and len(args) > 0 else None, args[1] if args is not None and len(args) > 1 else None)
	print("Project successfully imported!")

	from .project_manager import PROJECT_MANAGER
	try:
		if input("Select this project? [Y/n] ")[:1].lower() == "n":
			return 0
	except KeyboardInterrupt:
		pass
	PROJECT_MANAGER.select_project(folder=relpath(path, TOOLCHAIN_CONFIG.directory))
	return 0

@task(
	"removeProject",
	locks=["cleanup"],
	description="Removes project in interactive mode."
)
def task_remove_project(args: Optional[List[str]] = None) -> int:
	from .project_manager import PROJECT_MANAGER
	if PROJECT_MANAGER.how_much() == 0:
		abort("Not found any project to remove.")
	print("Selected project will be deleted forever, please think twice before removing anything!")
	who = PROJECT_MANAGER.require_selection("Which project will be deleted?", "Do you really want to delete {}?", "I don't want it anymore")
	if who is None:
		exit(0)

	if PROJECT_MANAGER.how_much() > 1:
		try:
			if input("Do you really want to delete it? [Y/n] ")[:1].lower() == "n":
				print("Abort.")
				return 0
		except KeyboardInterrupt:
			pass

	try:
		location = TOOLCHAIN_CONFIG.get_absolute_path(who)
		PROJECT_MANAGER.remove_project(folder=who)
		from .make_config import ToolchainMakeConfig
		from .package import cleanup_relative_directory
		cleanup_relative_directory("toolchain/build/" + ToolchainMakeConfig.unique_folder_name(location))
	except ValueError:
		abort(f"Folder '{who}' not found!")

	print("Project permanently deleted.")
	return 0

@task(
	"selectProject",
	locks=["cleanup"],
	description="Selects project by specified location, otherwise interactive project selection will be shown to explore availabled projects specified in 'projectLocations' property."
)
def task_select_project(args: Optional[List[str]] = None) -> int:
	from .project_manager import PROJECT_MANAGER
	if args is not None and len(args) > 0 and len(args[0]) > 0:
		path = args[0]
		if isfile(path):
			path = join(path, "..")
		where = relpath(path, TOOLCHAIN_CONFIG.directory)
		if isdir(path):
			if where == ".":
				abort("Requested project path must be reference to mod, not toolchain itself.")
			if not isfile(join(path, "make.json")):
				abort(f"Not found 'make.json' in '{where}', it not belongs to project yet.")
			PROJECT_MANAGER.select_project_folder(folder=where)
			return 0
		else:
			abort(f"Requested project path '{where}' does not exists.")

	if PROJECT_MANAGER.how_much() == 0:
		abort("Not found any project to choice.")

	who = PROJECT_MANAGER.require_selection("Which project do you choice?", "Do you want to select {}?")
	if who is None:
		exit(0)
	try:
		PROJECT_MANAGER.select_project(folder=who)
	except ValueError:
		abort(f"Folder '{who}' not found!")
	return 0

@task(
	"updateToolchain",
	description="Upgrades toolchain by downloading deploy branch, installed components will be upgraded if user accepts it."
)
def task_update_toolchain(args: Optional[List[str]] = None) -> int:
	from .update import update_toolchain
	update_toolchain()
	from .component import fetch_components, install_components
	upgradable = fetch_components()
	if len(upgradable) > 0:
		info("Found new updates for components: ", ", ".join(upgradable), ".", sep="")
		try:
			if input("Do you want to upgrade it? [Y/n] ")[:1].lower() == "n":
				print("Abort.")
				return 0
		except KeyboardInterrupt:
			pass
		install_components(*upgradable)
	return 0

@task(
	"componentIntegrity",
	description="Upgrade and install new components, additionally used when startup phase is active."
)
def task_component_integrity(args: Optional[List[str]] = None) -> int:
	from .component import upgrade
	return upgrade()

@task(
	"cleanup",
	description="Performs project 'output' folder cleanup, if nothing selected everything build cache will be removed."
)
def task_cleanup(args: Optional[List[str]] = None) -> int:
	from .package import cleanup_relative_directory
	if MAKE_CONFIG.current_project is not None:
		try:
			if input("Do you want to clear only selected project (everything cache will be cleaned otherwise)? [Y/n] ")[:1].lower() == "n":
				cleanup_relative_directory("toolchain/build")
				return 0
		except KeyboardInterrupt:
			pass
		cleanup_relative_directory("toolchain/build/" + MAKE_CONFIG.get_project_unique_name())
		cleanup_relative_directory("output", True)
		return 0
	else:
		try:
			if input("Do you want to clear all projects cache? [Y/n] ")[:1].lower() == "n":
				print("Abort.")
				return 0
		except KeyboardInterrupt:
			pass
	cleanup_relative_directory("toolchain/build")
	return 0


if __name__ == "__main__":
	if "--help" in sys.argv:
		print("Usage: task.py <tasks> @ [arguments]")
		print(" " * 2 + "--help: Just show this message.")
		print(" " * 2 + "--list: See all availabled tasks.")
		print("Executes declared by @task annotation required tasks.")
		exit(0)

	if "--list" in sys.argv:
		print("All availabled tasks:")
		for name in registered_tasks:
			print(" " * 2 + name, end="")
			print(": " + descriptioned_tasks[name] if name in descriptioned_tasks else "")
		exit(0)

	argv = sys.argv[1:]

	# Anything after "@" passes as global arguments
	if "@" in argv:
		where = argv.index("@")
		args = argv[where + 1:]
		argv = argv[:where]
	else:
		args = None

	if len(argv) > 0:
		for task_name in argv:
			if task_name in registered_tasks:
				try:
					result = registered_tasks[task_name](args)
					if result != 0:
						abort("__task__", f"* Task {task_name} failed with result {result}.", code=result)
				except BaseException as err:
					if isinstance(err, SystemExit):
						raise err
					abort("__task__", f"* Task {task_name} failed with unexpected error!", cause=err)
			else:
				warn(f"* No such task: {task_name}.")
	else:
		abort("__task__", "* No tasks to execute.")

	unlock_all_tasks()
