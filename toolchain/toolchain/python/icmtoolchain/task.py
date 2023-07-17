import json
import os
import shutil
import time
from io import TextIOWrapper
from os.path import basename, exists, isdir, isfile, join, relpath
from typing import Any, Callable, Dict, Final, List, Optional

from . import GLOBALS, PROPERTIES, colorama
from .make_config import MakeConfig
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
	description="Компилирует нативные папки, используя NDK и линкует объекты."
)
def task_compile_native() -> int:
	if PROPERTIES.get_value("release"):
		abis = GLOBALS.MAKE_CONFIG.get_value("abis", [])
		if abis is None or not isinstance(abis, list) or len(abis) == 0:
			abort(f"No `abis` value in 'toolchain.json' config, nothing will happened.")
	else:
		abi = GLOBALS.MAKE_CONFIG.get_value("debugAbi", None)
		if not abi:
			abi = "armeabi-v7a"
			warn(f"* No `debugAbi` value in 'toolchain.json' config, using '{abi}' as default.")
		abis = [abi]
	from .native_build import compile_all_using_make_config
	return compile_all_using_make_config(abis)

@task(
	"compileJava",
	locks=["java", "cleanup", "push"],
	description="Компилирует жабные папки, используя Gradle, Javac или ECJ."
)
def task_compile_java(tool: str = "gradle") -> int:
	from .java_build import compile_java
	return compile_java(tool)

@task(
	"buildScripts",
	locks=["script", "cleanup", "push"],
	description="Пересобирает скрипты, используя простое слияние файлов или TSC."
)
def task_build_scripts() -> int:
	from .script_build import build_all_scripts
	return build_all_scripts()

@task(
	"watchScripts",
	locks=["script", "cleanup", "push"],
	description="Пересобирает измененные скрипты с помощью TSC мгновенно, прерывание завершит наблюдение."
)
def task_watch_scripts() -> int:
	from .script_build import build_all_scripts
	return build_all_scripts(watch=True)

@task(
	"updateIncludes",
	description="Переопределяет содержимое 'tsconfig.json', основываясь на файлах скриптов."
)
def task_update_includes() -> int:
	from .script_build import (compute_and_capture_changed_scripts,
	                           get_allowed_languages)
	compute_and_capture_changed_scripts(get_allowed_languages())
	GLOBALS.WORKSPACE_COMPOSITE.flush()
	return 0

### RESOURCES & PACKAGE

@task(
	"buildResources",
	locks=["resource", "cleanup", "push"],
	description="Копирует предопределенные ресурсы, состоящие из текстур, внутреигровых паков и прочего."
)
def task_resources() -> int:
	from .script_build import build_all_resources
	return build_all_resources()

@task(
	"buildInfo",
	locks=["cleanup", "push"],
	description="Записывает файл описания 'mod.info' в выходную папку для отображения в менеджере браузера."
)
def task_build_info() -> int:
	from .utils import shortcodes
	with open(GLOBALS.MAKE_CONFIG.get_path(join(GLOBALS.MOD_STRUCTURE.directory, "mod.info")), "w") as info_file:
		info = dict(GLOBALS.MAKE_CONFIG.get_value("info", fallback={}))

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
	icon_path = GLOBALS.MAKE_CONFIG.get_value("info.icon")
	if icon_path is not None:
		icon_path = GLOBALS.MAKE_CONFIG.get_absolute_path(icon_path)
		if isfile(icon_path):
			copy_file(icon_path, GLOBALS.MAKE_CONFIG.get_path("output/mod_icon.png"))
		else:
			warn(f"* Icon '{icon_path}' described in 'make.json' not found!")
	return 0

@task(
	"buildAdditional",
	locks=["cleanup", "push"],
	description="Копирует дополнительные файлы и папки, помимо основных ресурсов и кода."
)
def task_build_additional() -> int:
	for additional_dir in GLOBALS.MAKE_CONFIG.get_value("additional", fallback=[]):
		if "source" in additional_dir and "targetDir" in additional_dir:
			for additional_path in GLOBALS.MAKE_CONFIG.get_paths(additional_dir["source"]):
				if not exists(additional_path):
					warn("* Non-existing additional path: " + additional_path)
					break
				target = join(
					GLOBALS.MOD_STRUCTURE.directory, additional_dir["targetDir"],
					additional_dir["targetFile"] if "targetFile" in additional_dir else basename(additional_path)
				)
				if isdir(additional_path):
					copy_directory(additional_path, target)
				else:
					copy_file(additional_path, target)
	return 0

@task(
	"clearOutput",
	locks=["assemble", "push", "native", "java"],
	description="Опционально удаляет выходную папку, по умолчанию не имеет эффекта."
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
	description="Удаляет предопределенные конфигом файлы и папки, которые должны быть исключены перед публикацией."
)
def task_exclude_directories() -> int:
	for path in GLOBALS.MAKE_CONFIG.get_value("excludeFromRelease", []):
		for exclude in GLOBALS.MAKE_CONFIG.get_paths(join(relpath(GLOBALS.MOD_STRUCTURE.directory, GLOBALS.MAKE_CONFIG.directory), path)):
			if isdir(exclude):
				remove_tree(exclude)
			elif isfile(exclude):
				os.remove(exclude)
	return 0

@task(
	"buildPackage",
	locks=["push", "assemble", "native", "java"],
	description="Собирает выходную папку проекта в архив, специально для публикации в браузере."
)
def task_build_package() -> int:
	output_dir = GLOBALS.MOD_STRUCTURE.directory
	name = basename(GLOBALS.MAKE_CONFIG.current_project) if GLOBALS.MAKE_CONFIG.current_project is not None else "unknown"
	output_dir_root_tmp = GLOBALS.MAKE_CONFIG.get_build_path("package")
	output_dir_tmp = join(output_dir_root_tmp, name)
	ensure_directory(output_dir)
	if exists(output_dir_tmp):
		shutil.rmtree(output_dir_tmp)
	output_file_tmp = join(output_dir_root_tmp, "package.zip")
	ensure_file_directory(output_file_tmp)
	output_file = GLOBALS.MAKE_CONFIG.get_path(name + ".icmod")
	if isfile(output_file):
		os.remove(output_file)
	if isfile(output_file_tmp):
		os.remove(output_file_tmp)
	shutil.copytree(output_dir, output_dir_tmp)
	shutil.make_archive(output_file_tmp[:-4], "zip", output_dir_root_tmp, name)
	shutil.rmtree(output_dir_tmp)
	os.rename(output_file_tmp, output_file)
	return 0

### CONNECTION

@task(
	"pushEverything",
	locks=["push"],
	description="Отправляет собранную выходную папку на подключенное устройство."
)
def task_push_everything() -> int:
	from .device import push
	return push(GLOBALS.MOD_STRUCTURE.directory, GLOBALS.PREFERRED_CONFIG.get_value("adb.pushUnchangedFiles", True))

@task(
	"launchHorizon",
	description="Запускает лаунчер с предопределенным автозапуском на подключенном устройстве с помощью ADB."
)
def task_launch_horizon() -> int:
	from subprocess import call
	call(GLOBALS.ADB_COMMAND + [
		"shell", "touch",
		"/storage/emulated/0/games/horizon/.flag_auto_launch"
	], stdout=DEVNULL, stderr=DEVNULL)
	call(GLOBALS.ADB_COMMAND + [
		"shell", "touch",
		"/storage/emulated/0/Android/data/com.zheka.horizon/files/horizon/.flag_auto_launch"
	], stdout=DEVNULL, stderr=DEVNULL)
	return call(GLOBALS.ADB_COMMAND + [
		"shell", "monkey",
		"-p", "com.zheka.horizon",
		"-c", "android.intent.category.LAUNCHER", "1"
	], stdout=DEVNULL, stderr=DEVNULL)

@task(
	"stopHorizon",
	description="Завершает процесс лаунчера на подключенном устройстве с помощью ADB."
)
def stop_horizon() -> int:
	from subprocess import call
	return call(GLOBALS.ADB_COMMAND + [
		"shell",
		"am",
		"force-stop",
		"com.zheka.horizon"
	], stdout=DEVNULL, stderr=DEVNULL)

@task(
	"configureADB",
	description="Добавляет новое подключение к мобильному устройству по кабелю или сети."
)
def task_configure_adb() -> int:
	from . import device
	device.setup_device_connection()
	return 0

### PROJECTS

@task(
	"newProject",
	description="Создает проект, интерактивно запрашивая название, шаблон и прочие свойства."
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
	description="Конвертирует проект для использования тулчейном, либо создает слияние нескольких проектов."
)
def task_import_project(path: str = "", target: str = "") -> int:
	from import_project import import_project
	path = import_project(path if len(path) > 0 else None, target if len(target) > 0 else None)
	print("Project successfully imported!")

	if not confirm("Select this project?", True):
		return 0
	GLOBALS.PROJECT_MANAGER.select_project(folder=relpath(path, GLOBALS.TOOLCHAIN_CONFIG.directory))
	return 0

@task(
	"removeProject",
	locks=["cleanup"],
	description="Удаляет проект, интерактивно выбранный пользователем."
)
def task_remove_project() -> int:
	if GLOBALS.PROJECT_MANAGER.how_much() == 0:
		abort("Not found any project to remove.")
	print("Selected project will be deleted forever, please think twice before removing anything!")

	who = GLOBALS.PROJECT_MANAGER.require_selection("Which project will be deleted?", "Do you really want to delete {}?", "I don't want it anymore")
	if who is None:
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
		abort(f"Folder '{who}' not found!")

	print("Project permanently deleted.")
	return 0

@task(
	"selectProject",
	locks=["cleanup"],
	description="Выбирает проект из указанной папки, либо запрашивает интерактивную выборку у пользователя."
)
def task_select_project(path: str = "") -> int:
	if len(path) > 0:
		if isfile(path):
			path = join(path, "..")
		where = relpath(path, GLOBALS.TOOLCHAIN_CONFIG.directory)
		if isdir(path):
			if where == ".":
				abort("Requested project path must be reference to mod, not toolchain itself.")
			if not isfile(join(path, "make.json")):
				abort(f"Not found 'make.json' in '{where}', it not belongs to project yet.")
			GLOBALS.PROJECT_MANAGER.select_project_folder(folder=where)
			return 0
		else:
			abort(f"Requested project path '{where}' does not exists.")

	if GLOBALS.PROJECT_MANAGER.how_much() == 0:
		abort("Not found any project to choice.")

	who = GLOBALS.PROJECT_MANAGER.require_selection("Which project do you choice?", "Do you want to select {}?")
	if who is None:
		return 1
	try:
		GLOBALS.PROJECT_MANAGER.select_project(folder=who)
	except ValueError:
		abort(f"Folder '{who}' not found!")
	return 0

### MISCELLANEOUS

@task(
	"updateToolchain",
	description="Обновляет тулчейн, используя ветку разработки; дополнительно проверяет обновления установленных компонентов."
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
	description="Установка дополнительных компонентов для компиляции, либо повторная первоначальная настройка."
)
def task_component_integrity(startup: bool = False) -> int:
	from . import component
	if startup:
		component.startup()
		return 0
	return component.upgrade()

@task(
	"cleanup",
	description="Очищает кеш выбранного проекта, либо все выходные файлы прошлых сборок, забывая измененные файлы."
)
def task_cleanup() -> int:
	from .package import cleanup_relative_directory
	if isinstance(GLOBALS.PREFERRED_CONFIG, MakeConfig):
		if confirm("Do you want to clear only selected project (everything cache will be cleaned otherwise)?", True, prints_abort=False):
			cleanup_relative_directory("toolchain/build/" + GLOBALS.MAKE_CONFIG.project_unique_name)
			cleanup_relative_directory(GLOBALS.MOD_STRUCTURE.directory, True)
			return 0
	else:
		if not confirm("Do you want to clear all projects cache?", True):
			return 0
	cleanup_relative_directory("toolchain/build")
	return 0
