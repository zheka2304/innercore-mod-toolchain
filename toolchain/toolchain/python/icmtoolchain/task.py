import os
import shutil
import time
from io import TextIOWrapper
from os.path import basename, exists, isdir, isfile, join, relpath
from typing import Any, Callable, Dict, Final, List, Optional

from . import colorama
from .make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from .shell import abort, confirm, error, info, printc, stringify, warn
from .utils import (DEVNULL, copy_directory, copy_file, ensure_directory,
                    ensure_file_directory, remove_tree)


class Task:
	name: Final[str]
	description: str = ""
	callable: Callable
	locks: Optional[List[str]] = None

	def __init__(self, name: str, description: Optional[str] = None, locks: Optional[List[str]] = None) -> None:
		try:
			if assure_task(name) == self:
				return
		except ValueError:
			pass
		else:
			raise ValueError(f"Task {name!r} already exists.")
		self.name = name
		if description:
			self.description = description
		if locks:
			self.locks = locks

	def execute(self, silent: bool = True, *args, **kwargs) -> Any:
		if not self.callable:
			raise ValueError(f"Task {self.name!r} decorator is not assigned to function yet.")
		self.lock(silent)
		if not silent:
			printc(stringify(f"> Executing task: {self.name}", color=colorama.Style.BRIGHT, reset=colorama.Style.NORMAL, end=""), color=colorama.Fore.LIGHTGREEN_EX, reset=colorama.Fore.RESET)
		result = self.callable.__call__(*args, **kwargs)
		self.unlock()
		return result

	def __call__(self, *args, **kwargs):
		return self.execute(False, *args, **kwargs)

	def lock(self, silent: bool = False) -> None:
		lock_task(self.name, silent)
		if not self.locks:
			return
		locks = iter(self.locks)
		while True:
			try:
				lock_task(next(locks), silent)
			except StopIteration:
				break

	def unlock(self) -> None:
		unlock_task(self.name)
		if not self.locks:
			return
		locks = iter(self.locks)
		while True:
			try:
				unlock_task(next(locks))
			except StopIteration:
				break

TASKS: Final[Dict[str, Task]] = dict()
LOCKS: Final[Dict[str, TextIOWrapper]] = dict()


def assure_task(name: str) -> Task:
	tasks = iter(TASKS)
	while True:
		try:
			task = next(tasks)
		except StopIteration:
			raise ValueError(f"Task {name!r} is not registered.")
		else:
			if task == name:
				return TASKS[task]

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
						warn(f"* Task {name!r} is locked by another process, waiting for it to unlock.")
				time.sleep(1.5)

	if name in LOCKS:
		error("Dead lock detected!")
		unlock_task(name)
	open(path, "tw").close()
	LOCKS[name] = open(path, "a")

def unlock_task(name: str) -> None:
	if name in LOCKS:
		try:
			LOCKS[name].close()
		except IOError:
			pass
		del LOCKS[name]
	path = TOOLCHAIN_CONFIG.get_path(f"toolchain/temp/lock/{name}.lock")
	if isfile(path):
		os.remove(path)

def unlock_all_tasks() -> None:
	tasks = iter(TASKS.values())
	while True:
		try:
			task = next(tasks)
		except StopIteration:
			break
		else:
			task.unlock()
	if len(LOCKS) > 0:
		warn(f"* Locks {', '.join(LOCKS)!r} should be unlocked, but they was not found.")
		for lock in tuple(LOCKS.keys()):
			unlock_task(lock)

def execute_task(name: str, silent: bool = True, *args, **kwargs) -> Any:
	return assure_task(name) \
		.execute(silent=silent, *args, **kwargs)

def task(name: str, description: Optional[str] = None, locks: Optional[List[str]] = None) -> Callable[[Callable], Callable]:
	task = Task(name, description, locks)

	def decorator(callable: Callable) -> Callable:
		task.callable = callable
		TASKS[name] = task
		return task

	return decorator

@task(
	"compileNativeDebug",
	locks=["native", "cleanup", "push"],
	description="Compiles C++ in single debugging `debugAbi`, changed objects will be compiled."
)
def task_compile_native_debug() -> int:
	abi = MAKE_CONFIG.get_value("debugAbi", None)
	if abi is None:
		abi = "armeabi-v7a"
		warn(f"* No `debugAbi` value in 'toolchain.json' config, using '{abi}' as default.")
	from .native_build import compile_all_using_make_config
	return compile_all_using_make_config([abi])

@task(
	"compileNativeRelease",
	locks=["native", "cleanup", "push"],
	description="Compiles C++ for everything `abis`."
)
def task_compile_native_release() -> int:
	abis = MAKE_CONFIG.get_value("abis", [])
	if abis is None or not isinstance(abis, list) or len(abis) == 0:
		abort(f"No `abis` value in 'toolchain.json' config, nothing will happened.")
	from .native_build import compile_all_using_make_config
	return compile_all_using_make_config(abis)

@task(
	"compileJavaDebug",
	locks=["java", "cleanup", "push"],
	description="Compiles Java, changed classes will be packed into dex."
)
def task_compile_java_debug() -> int:
	from .java_build import compile_all_using_make_config
	return compile_all_using_make_config(debug_build=True)

@task(
	"compileJavaRelease",
	locks=["java", "cleanup", "push"],
	description="Compiles Java without debugging information."
)
def task_compile_java_release() -> int:
	from .java_build import compile_all_using_make_config
	return compile_all_using_make_config(debug_build=False)

@task(
	"buildScriptsDebug",
	locks=["script", "cleanup", "push"],
	description="Rebuilds changes scripts with excluded declarations."
)
def task_build_scripts_debug() -> int:
	from .script_build import build_all_scripts
	return build_all_scripts(debug_build=True)

@task(
	"buildScriptsRelease",
	locks=["script", "cleanup", "push"],
	description="Assembling scripts without excluding debug declarations, everything script hashes will be rebuilded too."
)
def task_build_scripts_release() -> int:
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
def task_watch_scripts() -> int:
	from .script_build import build_all_scripts
	return build_all_scripts(debug_build=True, watch=True)

@task(
	"buildResources",
	locks=["resource", "cleanup", "push"],
	description="Builds resource pathes, like gui and atlases."
)
def task_resources() -> int:
	from .script_build import build_all_resources
	return build_all_resources()

@task(
	"buildInfo",
	locks=["cleanup", "push"],
	description="Builds output 'mod.info' file."
)
def task_build_info() -> int:
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
def task_build_additional() -> int:
	for additional_dir in MAKE_CONFIG.get_value("additional", fallback=[]):
		if "source" in additional_dir and "targetDir" in additional_dir:
			for additional_path in MAKE_CONFIG.get_paths(additional_dir["source"]):
				if not exists(additional_path):
					warn("* Non-existing additional path: " + additional_path)
					break
				from .mod_structure import MOD_STRUCTURE
				target = join(
					MOD_STRUCTURE.directory, additional_dir["targetDir"],
					additional_dir["targetFile"] if "targetFile" in additional_dir else basename(additional_path)
				)
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
def task_push_everything() -> int:
	from .device import push
	from .mod_structure import MOD_STRUCTURE
	return push(MOD_STRUCTURE.directory, MAKE_CONFIG.get_value("adb.pushUnchangedFiles", True))

@task(
	"clearOutput",
	locks=["assemble", "push", "native", "java"],
	description="Removes 'output' directory in selected project."
)
def task_clear_output(force: bool = False) -> int:
	if MAKE_CONFIG.get_value("development.clearOutput", False) or force:
		from .mod_structure import MOD_STRUCTURE
		remove_tree(MOD_STRUCTURE.directory)
	return 0

@task(
	"excludeDirectories",
	locks=["push", "assemble", "native", "java"],
	description="Removes excluded from release assembling directories."
)
def task_exclude_directories() -> int:
	for path in MAKE_CONFIG.get_value("excludeFromRelease", []):
		from .mod_structure import MOD_STRUCTURE
		for exclude in MAKE_CONFIG.get_paths(join(relpath(MOD_STRUCTURE.directory, MAKE_CONFIG.directory), path)):
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
def task_build_package() -> int:
	from .mod_structure import MOD_STRUCTURE
	output_dir = MOD_STRUCTURE.directory
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
def task_launch_horizon() -> int:
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
def stop_horizon() -> int:
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
def task_load_docs() -> int:
	abort("Temporary disabled!")

@task(
	"updateIncludes",
	description="Rebuilds composite 'tsconfig.json' without script building, used mostly to update typings."
)
def task_update_includes() -> int:
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
def task_configure_adb() -> int:
	from . import device
	device.setup_device_connection()
	return 0

@task(
	"newProject",
	description="Interactively creates new project."
)
def task_new_project() -> int:
	from .package import new_project

	index = new_project(MAKE_CONFIG.get_value("defaultTemplate", "../toolchain-mod"))
	if index is None:
		print(); abort()
	print("Successfully completed!")

	from .project_manager import PROJECT_MANAGER
	if not confirm("Select this project?", True):
		return 0
	PROJECT_MANAGER.select_project(index=index)
	return 0

@task(
	"importProject",
	description="Import project by required location into output folder, if output is not specified, 'toolchain/<unique_name>' will be used by default."
)
def task_import_project(path: str = "", target: str = "") -> int:
	from import_project import import_project
	path = import_project(path if len(path) > 0 else None, target if len(target) > 0 else None)
	print("Project successfully imported!")

	from .project_manager import PROJECT_MANAGER
	if not confirm("Select this project?", True):
		return 0
	PROJECT_MANAGER.select_project(folder=relpath(path, TOOLCHAIN_CONFIG.directory))
	return 0

@task(
	"removeProject",
	locks=["cleanup"],
	description="Removes project in interactive mode."
)
def task_remove_project() -> int:
	from .project_manager import PROJECT_MANAGER
	if PROJECT_MANAGER.how_much() == 0:
		abort("Not found any project to remove.")
	print("Selected project will be deleted forever, please think twice before removing anything!")

	who = PROJECT_MANAGER.require_selection("Which project will be deleted?", "Do you really want to delete {}?", "I don't want it anymore")
	if who is None:
		return 0
	if PROJECT_MANAGER.how_much() > 1 and not confirm("Do you really want to delete it?", True):
		return 0

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
def task_select_project(path: str = "") -> int:
	from .project_manager import PROJECT_MANAGER
	if len(path) > 0:
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
		return 1
	try:
		PROJECT_MANAGER.select_project(folder=who)
	except ValueError:
		abort(f"Folder '{who}' not found!")
	return 0

@task(
	"updateToolchain",
	description="Upgrades toolchain by downloading deploy branch, installed components will be upgraded if user accepts it."
)
def task_update_toolchain() -> int:
	from .update import update_toolchain
	update_toolchain()
	from .component import fetch_components, install_components
	upgradable = fetch_components()
	if len(upgradable) > 0:
		info("Found new updates for components: ", ", ".join(upgradable), ".", sep="")
		if not confirm("Do you want to upgrade it?", True):
			return 0
		install_components(*upgradable)
	return 0

@task(
	"componentIntegrity",
	description="Upgrade and install new components, additionally used when startup phase is active."
)
def task_component_integrity() -> int:
	from .component import upgrade
	return upgrade()

@task(
	"cleanup",
	description="Performs project 'output' folder cleanup, if nothing selected everything build cache will be removed."
)
def task_cleanup() -> int:
	from .package import cleanup_relative_directory
	if MAKE_CONFIG.current_project is not None:
		if confirm("Do you want to clear only selected project (everything cache will be cleaned otherwise)?", True, prints_abort=False):
			cleanup_relative_directory("toolchain/build/" + MAKE_CONFIG.get_project_unique_name())
			from .mod_structure import MOD_STRUCTURE
			cleanup_relative_directory(MOD_STRUCTURE.directory, True)
			return 0
	else:
		if not confirm("Do you want to clear all projects cache?", True):
			return 0
	cleanup_relative_directory("toolchain/build")
	return 0
