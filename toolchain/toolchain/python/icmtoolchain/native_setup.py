import platform
import re
import subprocess
import zipfile
from os import environ, getenv, listdir, makedirs
from os.path import (abspath, basename, dirname, exists, isdir, isfile, join,
                     realpath)
from typing import List, Optional, Union
from urllib.error import URLError

from . import GLOBALS
from .shell import Progress, Shell, abort, confirm, error, warn
from .utils import AttributeZipFile, list_subdirectories, remove_tree

ABIS = {
	"armeabi-v7a": "arm",
	"arm64-v8a": "arm64",
	"x86": "x86",
	"x86_64": "x86_64"
}


def abi_to_arch(abi: str) -> str:
	if abi in ABIS:
		return ABIS[abi]
	raise ValueError(f"Unsupported ABI {abi!r}!")

def search_ndk_subdirectories(dir: str) -> Optional[str]:
	preferred_ndk_versions = [
		"android-ndk-r16b",
		"android-ndk-.*",
		"16(\\.[0-9]*)+",
		"ndk-bundle"
	]
	possible_ndk_dirs = list_subdirectories(dir)
	for ndk_dir_regex in preferred_ndk_versions:
		compiled_pattern = re.compile(ndk_dir_regex)
		for possible_ndk_dir in possible_ndk_dirs:
			if re.findall(compiled_pattern, possible_ndk_dir):
				return possible_ndk_dir

def search_ndk_path(home_dir: str, contains_ndk: bool = False) -> Optional[str]:
	if contains_ndk:
		ndk = search_ndk_subdirectories(home_dir)
		if ndk is not None: return ndk
	try:
		android_tools = environ["ANDROID_SDK_ROOT"]
	except KeyError:
		android_tools = join(home_dir, "Android")
	if exists(android_tools):
		ndk = search_ndk_subdirectories(android_tools)
		if ndk is not None: return ndk
	android_tools = join(android_tools, "ndk")
	if exists(android_tools):
		ndk = search_ndk_subdirectories(android_tools)
		if ndk is not None: return ndk

def get_ndk_path() -> Optional[str]:
	path_from_config = GLOBALS.TOOLCHAIN_CONFIG.get_value("ndkPath")
	if path_from_config:
		path_from_config = GLOBALS.TOOLCHAIN_CONFIG.get_absolute_path(path_from_config)
		if isdir(path_from_config):
			return path_from_config
	# Unix
	try:
		return search_ndk_path(environ["HOME"])
	except KeyError:
		pass
	# Windows
	return search_ndk_path(getenv("LOCALAPPDATA", "."))

def search_for_gcc_executable(ndk_directory: str) -> Optional[str]:
	search_directory = join(realpath(ndk_directory), "bin")
	if isdir(search_directory):
		pattern = re.compile(r"[0-9_A-Za-z]*-linux-android(eabi)*-g\+\+.*")
		for filename in listdir(search_directory):
			if re.match(pattern, filename):
				return abspath(join(search_directory, filename))
		print(f"Searching GCC in {search_directory} with {len(listdir(search_directory))} files...")

def require_compiler_executable(arch: str, install_if_required: bool = False) -> Optional[str]:
	ndk_directory = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/ndk/" + str(arch))
	file = search_for_gcc_executable(ndk_directory)
	if install_if_required:
		install_gcc(arches=arch, reinstall=False)
		file = search_for_gcc_executable(ndk_directory)
		if not file or not isfile(file):
			warn(f"Executable of GCC (abi: {arch}) is not found, trying to reinstall it.")
			if install_gcc(arches=arch, reinstall=True) != 0:
				return None
			file = search_for_gcc_executable(ndk_directory)
			if not file or not isfile(file):
				error("Critical exception occured, installation is not supported anymore!")
				return None
	return file

def check_installation(arches: Union[str, List[str]]) -> bool:
	if not isinstance(arches, list):
		arches = [arches]
	return len(list(filter(
		lambda arch: not isfile(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/ndk/.installed-" + str(arch))),
		arches
	))) == 0

def download_gcc(shell: Optional[Shell] = None) -> Optional[str]:
	from urllib import request
	archive_path = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/temp/ndk.zip")
	makedirs(dirname(archive_path), exist_ok=True)

	if not isfile(archive_path):
		progress = None
		if shell:
			progress = Progress(text="C++ GCC Compiler (NDK)")
			shell.interactables.append(progress)
			shell.render()
		url = "https://dl.google.com/android/repository/android-ndk-r16b-" + ("windows" if platform.system() == "Windows" else "linux") + "-x86_64.zip"
		try:
			with request.urlopen(url) as response:
				with open(archive_path, "wb") as f:
					info = response.info()
					length = int(info["Content-Length"])
					downloaded = 0
					while True:
						buffer = response.read(8192)
						if not buffer:
							break
						downloaded += len(buffer)
						if shell and progress:
							progress.seek(downloaded / length, f"Downloading ({(downloaded / 1048576):.1f}/{(length / 1048576):.1f}MiB)")
							shell.render()
						f.write(buffer)
		except URLError:
			Progress.notify(shell, progress, 0, "Check your network connection")
			return None
		Progress.notify(shell, progress, 1, f"Downloaded {(length / 1024):.1f}MiB")

	progress = None
	if shell:
		progress = Progress(text="Extracting NDK/GCC")
		shell.interactables.append(progress)
		shell.render()
	extract_path = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/temp")
	makedirs(extract_path, exist_ok=True)
	try:
		with AttributeZipFile(archive_path, "r") as archive:
			archive.extractall(extract_path)
		Progress.notify(shell, progress, 1, "Extracted into toolchain/temp")
	except OSError as exc:
		Progress.notify(shell, progress, 0, f"#{exc.errno}: {basename(exc.filename)}")
		try:
			remove_tree(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/temp"))
		except OSError:
			Progress.notify(shell, progress, 0, f"#{exc.errno}: {basename(exc.filename)} (security fail)")
	except zipfile.BadZipFile as exc:
		try:
			remove_tree(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/temp"))
			return download_gcc(shell)
		except OSError as exc:
			Progress.notify(shell, progress, 0, f"#{exc.errno}: {basename(exc.filename)} (security fail)")

	return search_ndk_path(extract_path, contains_ndk=True)

def install_gcc(arches: Union[str, List[str]] = "arm", reinstall: bool = False) -> int:
	if not reinstall and check_installation(arches):
		return 0
	else:
		shell = Shell()
		ndk_path = get_ndk_path()
		if not ndk_path:
			if not reinstall:
				print(f"Not found valid NDK installation for {arches if isinstance(arches, str) else ', '.join(arches)}.", sep="")
			if reinstall or confirm("Download android-ndk-r16b-x86_64?", True):
				if shell:
					shell.enter()
				ndk_path = download_gcc(shell)
			else:
				abort()
		elif shell:
			shell.enter()

		if not ndk_path:
			if shell:
				shell.leave()
			error("Installation interrupted by raised cause above, you are must extract 'toolchain/temp/ndk.zip' manually into toolchain/temp and retry task.")
			return 1
		result = 0

		progress = None
		if not isinstance(arches, list):
			arches = [arches]
		for arch in arches:
			progress = None
			if shell:
				progress = Progress(text=f"Installing {str(arch)}")
				shell.interactables.append(progress)
				shell.render()
			result += subprocess.call([
				"python3" if platform.system() != "Windows" else "python",
				join(ndk_path, "build", "tools", "make_standalone_toolchain.py"),
				"--arch", str(arch),
				"--api", "19",
				"--install-dir", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/ndk/" + str(arch)),
				"--force"
			])
			open(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/ndk/.installed-" + str(arch)), "tw").close()
			if result != 0:
				Progress.notify(shell, progress, 0.5, f"Installation of {str(arch)} failed with result {str(result)}")
			else:
				Progress.notify(shell, progress, 1, f"Successfully installed {str(arch)}")

		if result == 0:
			progress = None
			if shell:
				progress = Progress(progress=0.9, text=f"Removing temporary files")
				shell.interactables.append(progress)
				shell.render()
			try:
				remove_tree(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/temp"))
				if progress:
					progress.seek(1, "C++ GCC Compiler (NDK)")
			except OSError as exc:
				Progress.notify(shell, progress, 0, f"#{exc.errno}: {basename(exc.filename)}")
		else:
			Progress.notify(shell, progress, 0.5, f"Installation failed with result {str(result)}")

		if shell:
			shell.render()
			shell.leave()
		if result != 0:
			print("You are must install it manually by running 'toolchain/temp/../build/tools/make_standalone_toolchain.py', or reextracting NDK.")
		return result
