import platform
import re
import struct
import subprocess
import zipfile
from os import environ, getenv, listdir, makedirs
from os.path import (abspath, basename, dirname, exists, isdir, isfile, join,
                     realpath)
from typing import List, Optional, Union
from urllib.error import URLError

from . import GLOBALS
from .shell import Progress, Shell, abort, confirm, error, warn
from .utils import (AttributeZipFile, RuntimeCodeError, iterate_subdirectories,
                    remove_tree)

ABIS = {
	"armeabi-v7a": "arm",
	"arm64-v8a": "arm64",
	"x86": "x86",
	"x86_64": "x86_64"
}

GCC_EXECUTABLES = dict()


def abi_to_arch(abi: str) -> str:
	if abi in ABIS:
		return ABIS[abi]
	raise ValueError(f"Unsupported ABI {abi!r}!")

def search_ndk_subdirectories(directory: str) -> Optional[str]:
	preferred_directory_regexes = [
		r"android-ndk-r\d+\b",
		r"android-ndk-.*",
		r"ndk[/\\]+\d+(\.\d+)+",
		"ndk-bundle"
	]
	for directory_regex in preferred_directory_regexes:
		compiled_pattern = re.compile(directory_regex + "$")
		for subdirectory in iterate_subdirectories(directory):
			if re.search(compiled_pattern, subdirectory):
				return subdirectory

def search_ndk_path(home_directory: str, contains_ndk: bool = False) -> Optional[str]:
	if contains_ndk:
		ndk = search_ndk_subdirectories(home_directory)
		if ndk: return ndk
	try:
		android_tools = environ["ANDROID_SDK_ROOT"]
	except KeyError:
		android_tools = join(home_directory, "Android")
	if exists(android_tools):
		ndk = search_ndk_subdirectories(android_tools)
		if ndk: return ndk
	android_tools = join(android_tools, "ndk")
	if exists(android_tools):
		ndk = search_ndk_subdirectories(android_tools)
		if ndk: return ndk

def get_ndk_path() -> Optional[str]:
	path_from_config = GLOBALS.TOOLCHAIN_CONFIG.get_value("native.ndkPath", GLOBALS.TOOLCHAIN_CONFIG.get_value("ndkPath"))
	if path_from_config and isinstance(path_from_config, str):
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
		files = listdir(search_directory)
		for filename in files:
			if re.match(pattern, filename):
				return abspath(join(search_directory, filename))
		print(f"Searching GCC in {search_directory} with {len(files)} files...")

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

def prepare_compiler_executable(abi: str) -> str:
	arch = abi_to_arch(abi)
	if arch in GCC_EXECUTABLES:
		return GCC_EXECUTABLES[arch]
	executable = require_compiler_executable(arch, install_if_required=True)
	if not executable:
		from .native_build import CODE_FAILED_NO_GCC
		raise RuntimeCodeError(CODE_FAILED_NO_GCC, f"Failed to acquire compiler executable from NDK for ABI {abi!r}!")
	GCC_EXECUTABLES[arch] = executable
	return executable

def check_installation(arches: Union[str, List[str]]) -> bool:
	if not isinstance(arches, list):
		arches = [arches]
	return len(list(filter(
		lambda arch: not isfile(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/ndk/.installed-" + str(arch))),
		arches
	))) == 0

def get_download_ndk_url(revision: str) -> str:
	overriden_url = GLOBALS.TOOLCHAIN_CONFIG.get_value("native.ndkUrl", GLOBALS.TOOLCHAIN_CONFIG.get_value("ndkUrl"))
	if overriden_url and isinstance(overriden_url, str):
		return overriden_url
	pattern_version = re.search(r"\d+", revision)
	requires_architecture = pattern_version and int(pattern_version[0]) >= 11 and int(pattern_version[0]) <= 22
	is_32bit = struct.calcsize("P") == 4
	if is_32bit and (not pattern_version or requires_architecture or int(pattern_version[0]) >= 21):
		raise RuntimeCodeError(255, "Your platform is not supported anymore, you should upgrade to 64 bit for using Android NDK r21e and newer.")
	package_suffix = platform.system()
	if package_suffix == "Windows":
		if is_32bit or requires_architecture:
			package_suffix = "windows-x86" if is_32bit else "windows-x86_64"
		package_suffix = package_suffix or "windows"
	# TODO: Maybe also extract dmg archives from MacOS?
	elif package_suffix == "Darwin":
		package_suffix = "darwin-x86_64" if requires_architecture else "darwin"
	else:
		if is_32bit:
			raise RuntimeCodeError(255, f"Your platform {package_suffix} should be upgraded to 64 bit, otherwise Android NDK cannot be installed.")
		if package_suffix != "Linux":
			warn(f"* Expected platform Windows, MacOS or Linux. Got: {package_suffix}, falling back to Linux.")
		package_suffix = "linux-x86_64" if requires_architecture else "linux"
	return f"https://dl.google.com/android/repository/android-ndk-{revision}-{package_suffix}.zip"

def download_gcc(shell: Optional[Shell] = None, revision: Optional[str] = None) -> Optional[str]:
	from urllib import request
	archive_path = GLOBALS.TOOLCHAIN_CONFIG.get_path(f"toolchain/temp/ndk-{revision}.zip")
	makedirs(dirname(archive_path), exist_ok=True)

	if not isfile(archive_path):
		progress = None
		if shell:
			progress = Progress(text="C++ GCC Compiler (NDK)")
			shell.interactables.append(progress)
			shell.render()
		url = get_download_ndk_url(revision or "r16b")
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
			return download_gcc(shell, revision)
		except OSError as exc:
			Progress.notify(shell, progress, 0, f"#{exc.errno}: {basename(exc.filename)} (security fail)")

	return search_ndk_path(extract_path, contains_ndk=True)

def install_gcc(arches: Union[str, List[str]] = "arm", reinstall: bool = False) -> int:
	if not reinstall and check_installation(arches):
		return 0
	else:
		shell = Shell()
		shell.inline_flushing = True
		ndk_path = get_ndk_path()
		if not ndk_path:
			if not reinstall:
				print(f"Not found valid NDK installation for {arches if isinstance(arches, str) else ', '.join(arches)}.", sep="")
			if reinstall or confirm("Download android-ndk-r16b from Android Repository?", True):
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
			error("Installation interrupted by raised cause above, you are must extract 'toolchain/temp/ndk-r**.zip' manually into toolchain/temp and retry task.")
			return 1
		result = 0

		progress = None
		captured_errors = dict()
		if not isinstance(arches, list):
			arches = [arches]
		for arch in arches:
			progress = None
			if shell:
				progress = Progress(text=f"Installing {arch}")
				shell.interactables.append(progress)
				shell.render()
			output = subprocess.run([
				"python3" if platform.system() != "Windows" else "python",
				join(ndk_path, "build", "tools", "make_standalone_toolchain.py"),
				"--arch", str(arch),
				"--api", "21" if str(arch) == "arm64" else "19",
				"--install-dir", GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/ndk/" + str(arch)),
				"--force"
			], capture_output=True, text=True)
			if output.returncode != 0:
				captured_errors[arch] = output.stderr.strip()
				Progress.notify(shell, progress, 1, f"Installation of {arch} failed with result {str(result)}")
			else:
				open(GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/ndk/.installed-" + str(arch)), "tw").close()
				Progress.notify(shell, progress, 1, f"Successfully installed {arch}")
			result += output.returncode

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
			Progress.notify(shell, progress, 1, f"Installation failed with result {str(result)}")

		if shell:
			shell.render()
			shell.leave()
		if result != 0:
			error("You are must install it manually by running 'toolchain/temp/ndk/build/tools/make_standalone_toolchain.py':")
			for arch in captured_errors:
				error(f"{arch}: {captured_errors[arch]}")
		return result
