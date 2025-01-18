import os
import time
from io import TextIOWrapper
from os.path import basename, dirname, exists, isdir, isfile, join, relpath
from typing import Any, Callable, Dict, Final, List, Optional

from . import GLOBALS, PROPERTIES, colorama
from .make_config import MakeConfig
from .shell import abort, confirm, error, info, printc, stringify, warn
from .utils import DEVNULL, ensure_file_directory, remove_tree


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
			printc(stringify(f"> Executing task: {self.name}", color=colorama.Style.BRIGHT, reset=colorama.Style.NORMAL), color=colorama.Fore.LIGHTGREEN_EX, reset=colorama.Fore.RESET)
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

TASKS: Dict[str, Task] = dict()
LOCKS: Dict[str, TextIOWrapper] = dict()


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
	path = GLOBALS.TOOLCHAIN_CONFIG.get_path(f"toolchain/temp/lock/{name}.lock")
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
		error(f"Dead lock {name!r} detected!")
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
	path = GLOBALS.TOOLCHAIN_CONFIG.get_path(f"toolchain/temp/lock/{name}.lock")
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

### JAVASCRIPT, TYPESCRIPT, JAVA, C++

@task(
	"compileNative",
	locks=["native", "cleanup", "push"],
	description="Compiles native folders using NDK and links objects."
)
def task_compile_native() -> int:
	abis = None
	if not PROPERTIES.get_value("release"):
		abi = GLOBALS.MAKE_CONFIG.get_value("native.debugAbi")
		if not abi:
			abi = GLOBALS.MAKE_CONFIG.get_value("debugAbi")
		if abi:
			# TODO: warn("* Property `debugAbi` has been deprecated in favor of configurations, determine your own ABIs via 'debug' rule.")
			abis = [abi]
	if not abis:
		abis = GLOBALS.MAKE_CONFIG.get_list("native.abis")
		if len(abis) == 0:
			abis = GLOBALS.MAKE_CONFIG.get_list("abis")
	if len(abis) == 0:
		abort(f"No `abis` value in 'toolchain.json' config, nothing will happened.")
	from .native_build import compile_native, copy_shared_objects
	result = compile_native(abis)
	if result == 0:
		result = copy_shared_objects(abis)
	return result

@task(
	"compileJava",
	locks=["java", "cleanup", "push"],
	description="Compiles java folders using Gradle, Javac or ECJ."
)
def task_compile_java(tool: Optional[str] = None) -> int:
	from .java_build import compile_java
	if not tool:
		tool = GLOBALS.MAKE_CONFIG.get_value("java.compiler", "gradle")
	if not tool:
		return 1
	if not tool == "gradle" and GLOBALS.MAKE_CONFIG.get_value("java.configurable", False):
		warn("* Project uses configurable Gradle, different tools cannot be applied.")
		tool = "gradle"
	return compile_java(tool)

@task(
	"buildScripts",
	locks=["script", "cleanup", "push"],
	description="Recompiles scripts using simple file concatenation or tsc."
)
def task_build_scripts() -> int:
	if not GLOBALS.MAKE_CONFIG.has_value("manifest"):
		from .script_build import build_all_scripts
		return build_all_scripts()
	return 0

@task(
	"watchScripts",
	locks=["script", "cleanup", "push"],
	description="Recompiles changed scripts instantly using tsc, interruption will end watching."
)
def task_watch_scripts() -> int:
	if not GLOBALS.MAKE_CONFIG.has_value("manifest"):
		from .script_build import build_all_scripts
		return build_all_scripts(watch=True)
	error("* You cannot have scripts to watch because pack structure is being used.")
	return 1

@task(
	"updateIncludes",
	description="Overrides the contents of 'tsconfig.json' based on script files."
)
def task_update_includes() -> int:
	if not GLOBALS.MAKE_CONFIG.has_value("manifest"):
		from .script_build import compute_and_capture_changed_scripts
		compute_and_capture_changed_scripts()
		GLOBALS.WORKSPACE_COMPOSITE.flush()
	return 0

### RESOURCES & PACKAGE

@task(
	"buildResources",
	locks=["resource", "cleanup", "push"],
	description="Copies predefined resources consisting of textures, in-game packs, etc."
)
def task_resources() -> int:
	from .resources import build_pack_graphics, build_resources
	if not GLOBALS.MAKE_CONFIG.has_value("manifest"):
		overall_result = build_resources()
	else:
		overall_result = build_pack_graphics()
	return overall_result

@task(
	"buildInfo",
	locks=["cleanup", "push"],
	description="Writes the description file 'mod.info' to output folder for display in mod browser."
)
def task_build_info() -> int:
	requires_manifest = GLOBALS.MAKE_CONFIG.has_value("manifest")
	requires_mod_info = GLOBALS.MAKE_CONFIG.has_value("info")
	if requires_manifest and requires_mod_info:
		error("Properties `info` and `manifest` cannot exist in your 'make.json' at same time!")
		return 1
	from .resources import write_manifest_file, write_mod_info_file
	if requires_manifest:
		return write_manifest_file()
	elif requires_mod_info:
		return write_mod_info_file()
	return 0

@task(
	"buildAdditional",
	locks=["cleanup", "push"],
	description="Copies additional files and directories, besides main resources and code."
)
def task_build_additional() -> int:
	from .resources import build_additional_resources
	return build_additional_resources()

@task(
	"clearOutput",
	locks=["assemble", "push", "native", "java"],
	description="Optionally deletes the output folder; has no effect by default."
)
def task_clear_output(force: bool = False) -> int:
	if GLOBALS.PREFERRED_CONFIG.get_value("development.clearOutput", False) or force:
		remove_tree(GLOBALS.MOD_STRUCTURE.directory)
	if PROPERTIES.get_value("release"):
		from .package import cleanup_relative_directory
		cleanup_relative_directory("toolchain/build/" + GLOBALS.MAKE_CONFIG.project_unique_name)
	return 0

@task(
	"excludeDirectories",
	locks=["push", "assemble", "native", "java"],
	description="Deletes predefined config files and directories that should be excluded prior to publication."
)
def task_exclude_directories() -> int:
	for path in GLOBALS.MAKE_CONFIG.get_value("excludeFromRelease", list()):
		for exclude in GLOBALS.MAKE_CONFIG.get_paths(join(relpath(GLOBALS.MOD_STRUCTURE.directory, GLOBALS.MAKE_CONFIG.directory), path)):
			if isdir(exclude):
				remove_tree(exclude)
			elif isfile(exclude):
				os.remove(exclude)
	return 0

@task(
	"buildPackage",
	locks=["push", "assemble", "native", "java"],
	description="Assembles project's output folder into an archive, specifically for publishing in a mod browser."
)
def task_build_package() -> int:
	from .resources import build_package
	return build_package()

### CONNECTION

@task(
	"pushEverything",
	locks=["push"],
	description="Sends assembled output folder to a connected device."
)
def task_push_everything() -> int:
	from .device import push
	return push(GLOBALS.MOD_STRUCTURE.directory, GLOBALS.PREFERRED_CONFIG.get_value("adb.pushUnchangedFiles", True))

@task(
	"launchApplication",
	description="Starts launcher with predefined autostart setting on a connected device using ADB."
)
def task_monkey_launcher() -> int:
	from subprocess import run
	run(GLOBALS.ADB_COMMAND + [
		"shell", "input",
		"keyevent", "KEYCODE_WAKEUP"
	], stdout=DEVNULL, stderr=DEVNULL)
	try:
		process = run(GLOBALS.ADB_COMMAND + [
			"shell", "monkey",
			"-p", "com.zheka.horizon",
			"-c", "android.intent.category.LAUNCHER", "1"
		], check=True, capture_output=True, text=True)
		successful = False
		for line in process.stdout.splitlines():
			if line[:15] == "Events injected":
				successful = True
				break
		if not successful:
			raise RuntimeError()
		run(GLOBALS.ADB_COMMAND + [
			"shell", "touch",
			"/storage/emulated/0/games/horizon/.flag_auto_launch"
		], stdout=DEVNULL, stderr=DEVNULL)
		run(GLOBALS.ADB_COMMAND + [
			"shell", "touch",
			"/storage/emulated/0/Android/data/com.zheka.horizon/files/horizon/.flag_auto_launch"
		], stdout=DEVNULL, stderr=DEVNULL)
	except BaseException:
		try:
			process = run(GLOBALS.ADB_COMMAND + [
				"shell", "monkey",
				"-p", "com.zhekasmirnov.innercore",
				"-c", "android.intent.category.LAUNCHER", "1"
			], check=True, capture_output=True, text=True)
			successful = False
			for line in process.stdout.splitlines():
				if line[:15] == "Events injected":
					successful = True
					break
			if not successful:
				raise RuntimeError()
		except BaseException:
			warn("* Horizon is not installed, nothing to launch.")
	return 0

@task(
	"stopApplication",
	description="Terminates launcher process on a connected device using ADB."
)
def task_stop_launcher() -> int:
	from subprocess import CalledProcessError, run
	try:
		run(GLOBALS.ADB_COMMAND + [
			"shell", "am",
			"force-stop", "com.zheka.horizon"
		], check=True, stdout=DEVNULL, stderr=DEVNULL)
		run(GLOBALS.ADB_COMMAND + [
			"shell", "am",
			"force-stop", "com.zhekasmirnov.innercore"
		], check=True, stdout=DEVNULL, stderr=DEVNULL)
	except CalledProcessError as err:
		return err.returncode
	return 0

@task(
	"configureADB",
	description="Adds a new connection to a mobile device/emulator via cable or network."
)
def task_configure_adb() -> int:
	from . import device
	device.setup_device_connection()
	return 0

### PROJECTS

@task(
	"newProject",
	description="Creates a project, prompting interactive input for name, template, and other properties."
)
def task_new_project() -> int:
	from .package import new_project

	index = new_project(GLOBALS.PREFERRED_CONFIG.get_value("defaultTemplate", "../toolchain-mod"))
	if index is None:
		print(); abort()
	print("Successfully completed!")

	if not confirm("Select this project?", True):
		return 0
	GLOBALS.PROJECT_MANAGER.select_project(index=index)
	return 0

@task(
	"importProject",
	description="Converts a project for utilization with toolchains or creates a merge of several projects."
)
def task_import_project(path: str = "", target: str = "") -> int:
	from .import_project import import_project
	path = import_project(path if len(path) > 0 else None, target if len(target) > 0 else None)
	print("Project successfully imported!")

	if not confirm("Select this project?", True):
		return 0
	GLOBALS.PROJECT_MANAGER.select_project(folder=relpath(path, GLOBALS.TOOLCHAIN_CONFIG.directory))
	return 0

@task(
	"removeProject",
	locks=["cleanup"],
	description="Removes a project, selected interactively by user."
)
def task_remove_project() -> int:
	if GLOBALS.PROJECT_MANAGER.how_much() == 0:
		abort("Not found any project to remove.")
	print("Selected project will be deleted forever, please think twice before removing anything!")

	who = GLOBALS.PROJECT_MANAGER.require_selection("Which project will be deleted?", "Do you really want to delete {}?", "I don't want it anymore")
	if not who:
		print("Nothing will happen.")
		return 0
	if GLOBALS.PROJECT_MANAGER.how_much() > 1 and not confirm("Do you really want to delete it?", True):
		return 0

	try:
		location = GLOBALS.TOOLCHAIN_CONFIG.get_absolute_path(who)
		GLOBALS.PROJECT_MANAGER.remove_project(folder=who)
		from .make_config import MakeConfig
		from .package import cleanup_relative_directory
		cleanup_relative_directory("toolchain/build/" + MakeConfig.unique_folder_name(location))
	except ValueError:
		abort(f"Folder {who!r} not found!")

	print("Project permanently deleted.")
	return 0

@task(
	"selectProject",
	description="Selects a project from a specified folder or requests interactive pickings from user."
)
def task_select_project(path: str = "") -> int:
	if len(path) > 0:
		where = GLOBALS.TOOLCHAIN_CONFIG.get_absolute_path(path)
		if isfile(where) and basename(where) == "make.json":
			where = dirname(where)
		if isdir(where):
			if where == GLOBALS.TOOLCHAIN_CONFIG.directory:
				abort("Requested path must be reference to project, not toolchain itself.")
			if not isfile(join(where, "make.json")):
				abort(f"Not found 'make.json' in {path!r}, it not belongs to project yet.")
			GLOBALS.PROJECT_MANAGER.select_project(folder=path)
			return 0
		else:
			abort(f"Requested project path {path!r} does not exists.")

	if GLOBALS.PROJECT_MANAGER.how_much() == 0:
		abort("Not found any project to choice.")

	who = GLOBALS.PROJECT_MANAGER.require_selection("Which project do you choice?", "Do you want to select {}?")
	if not who:
		GLOBALS.PROJECT_MANAGER.unselect_project()
		return 0
	try:
		GLOBALS.PROJECT_MANAGER.select_project(folder=who)
	except ValueError:
		abort(f"Folder {who!r} not found!")
	return 0

@task(
	"ensureProjectExists",
	description="Ensures that selected project is opened and exists."
)
def task_ensure_project_exists() -> int:
	if isinstance(GLOBALS.PREFERRED_CONFIG, MakeConfig):
		return 0
	if GLOBALS.PROJECT_MANAGER.how_much() == 0:
		abort("Not found any project to choice.")

	who = GLOBALS.PROJECT_MANAGER.require_selection("Which project do you choice to continue?", "Do you want to select {} to continue?")
	if not who:
		print("Nothing will happen.")
		return 1
	try:
		GLOBALS.PROJECT_MANAGER.select_project(folder=who)
	except ValueError:
		abort(f"Folder {who!r} not found!")
	return 0

### MISCELLANEOUS

@task(
	"configureIde",
	description="Configures tasks in most useful IDEs for mods to use from the interface."
)
def task_configure_ide() -> int:
	from .workspace import (flush_compound_tasks, flush_shell_tasks,
	                        flush_vscode_compound_task, flush_vscode_shell_task)

	flush_shell_tasks("Select Project", "folder-opened", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/select-project"), focus=True)
	flush_vscode_shell_task("Select Project by Active File", "repo-force-push", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/select-project"), hidden=True, globbing="**/*", options=("${fileWorkspaceFolder}", ))
	flush_shell_tasks("Push", "rocket", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/push"))
	flush_shell_tasks("Assemble Mod for Release", "archive", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/assemble-release"))

	flush_shell_tasks("Build (No push)", "debug-all", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/build-all"), hidden=True)
	flush_compound_tasks("Build", "debug-all", ("Build (No push)", "Push"))
	flush_vscode_compound_task("Build by Active File", "debug-all", ("Select Project by Active File", "Build"), hidden=True, globbing="**/*")

	flush_shell_tasks("Build Scripts and Resources (No push)", "debug-alt", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/build-scripts-and-resources"), hidden=True)
	flush_compound_tasks("Build Scripts and Resources", "debug-alt", ("Build Scripts and Resources (No push)", "Push"))
	flush_vscode_compound_task("Build Scripts and Resources by Active File", "debug-alt", ("Select Project by Active File", "Build Scripts and Resources"), hidden=True, globbing="**/*")

	flush_shell_tasks("Build Java (No push)", "run-above", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/compile-java"), hidden=True)
	flush_compound_tasks("Build Java", "run-above", ("Build Java (No push)", "Push"))
	flush_vscode_compound_task("Build Java by Active File", "run-above", ("Select Project by Active File", "Build Java"), hidden=True, globbing="**/*")

	flush_shell_tasks("Build Native (No push)", "run", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/compile-native"), hidden=True)
	flush_compound_tasks("Build Native", "run", ("Build Native (No push)", "Push"))
	flush_vscode_compound_task("Build Native by Active File", "run", ("Select Project by Active File", "Build Native"), hidden=True, globbing="**/*")

	flush_shell_tasks("Watch Scripts (No push)", "debug-coverage", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/watch-scripts"), hidden=True)
	flush_compound_tasks("Watch Scripts", "debug-coverage", ("Watch Scripts (No push)", "Push"))
	flush_vscode_compound_task("Watch Scripts by Active File", "debug-coverage", ("Select Project by Active File", "Watch Scripts"), hidden=True, globbing="**/*")

	flush_shell_tasks("Configure ADB", "device-mobile", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/configure-adb"), focus=True)
	flush_shell_tasks("New Project", "new-folder", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/new-project"), focus=True)
	flush_shell_tasks("Import Project", "repo-pull", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/import-project"), focus=True)
	flush_shell_tasks("Remove Project", "root-folder-opened", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/remove-project"), focus=True)
	flush_shell_tasks("Rebuild Declarations", "milestone", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/rebuild-declarations"), hidden=True)
	flush_vscode_compound_task("Rebuild Declarations by Active File", "milestone", ("Select Project by Active File", "Rebuild Declarations"), hidden=True, globbing="**/*")
	flush_shell_tasks("Check for Updates", "cloud", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/update-toolchain"), focus=True)
	flush_shell_tasks("Reinstall Components", "package", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/component-integrity"), focus=True)
	flush_shell_tasks("Invalidate Caches", "flame", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/python/cleanup"), focus=True)

	return 0

@task(
	"updateToolchain",
	description="Updates the toolchain using a development branch; additionally verifies updates for installed components."
)
def task_update_toolchain() -> int:
	from .update import update_toolchain
	update_toolchain()
	from .component import fetch_components, install_components
	upgradable = fetch_components()
	if len(upgradable) > 0:
		info("Found new updates for components: ", ", ".join(upgradable), ".", sep="")
		if not confirm("Do you want to upgrade them?", True):
			return 0
		install_components(*upgradable)
	return 0

@task(
	"componentIntegrity",
	description="Installs additional components required for compilation or performs a initial setup."
)
def task_component_integrity(startup: bool = False) -> int:
	from . import component
	if startup:
		component.startup()
		return 0
	return component.upgrade()

@task(
	"cleanup",
	description="Clears cache of a selected project or all output files from previous builds, forgetting modified files."
)
def task_cleanup() -> int:
	from .package import cleanup_relative_directory
	if isinstance(GLOBALS.PREFERRED_CONFIG, MakeConfig):
		if confirm("Do you want to clear selected project cache?", True):
			cleanup_relative_directory("toolchain/build/" + GLOBALS.MAKE_CONFIG.project_unique_name)
			cleanup_relative_directory(GLOBALS.MOD_STRUCTURE.directory, True)
		return 0
	if not confirm("Do you want to clear all projects cache?", True):
		return 0
	cleanup_relative_directory("toolchain/build")
	return 0
