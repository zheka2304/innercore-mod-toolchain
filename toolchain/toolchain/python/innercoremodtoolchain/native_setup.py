import platform
import re
import subprocess
import sys
import zipfile
from os import environ, getenv, listdir, makedirs
from os.path import abspath, basename, dirname, isdir, isfile, join
from typing import List, Optional, Union

from .make_config import TOOLCHAIN_CONFIG
from .shell import Progress, Shell, abort, error, warn
from .utils import AttributeZipFile, remove_tree


def abi_to_arch(abi: str) -> str:
	abi_map = {
		"armeabi-v7a": "arm",
		"arm64-v8a": "arm64",
		"x86": "x86",
		"x86_64": "x86_64"
	}
	if abi in abi_map:
		return abi_map[abi]
	raise ValueError(f"Unsupported ABI '{abi}'!")

def list_subdirectories(path: str, max_depth: int = 5, dirs: Optional[List[str]] = None) -> List[str]:
	if dirs is None:
		dirs = []
	if not isdir(path):
		return dirs
	dirs.append(path)
	for filename in listdir(path):
		file = join(path, filename)
		if max_depth > 0 and isdir(file):
			list_subdirectories(file, dirs=dirs, max_depth=max_depth - 1)
	return dirs

def search_ndk_path(home_dir: str, contains_ndk: bool = False) -> Optional[str]:
	preferred_ndk_versions = [
		"android-ndk-r16b",
		"android-ndk-.*",
		"ndk-bundle"
	]
	possible_ndk_dirs = list_subdirectories(home_dir if contains_ndk else join(home_dir, "Android"))
	for ndk_dir_regex in preferred_ndk_versions:
		compiled_pattern = re.compile(ndk_dir_regex)
		for possible_ndk_dir in possible_ndk_dirs:
			if re.findall(compiled_pattern, possible_ndk_dir):
				return possible_ndk_dir

def get_ndk_path() -> Optional[str]:
	path_from_config = TOOLCHAIN_CONFIG.get_value("ndkPath")
	if path_from_config is not None:
		path_from_config = TOOLCHAIN_CONFIG.get_absolute_path(path_from_config)
		if isdir(path_from_config):
			return path_from_config
	# Unix
	try:
		return search_ndk_path(environ["HOME"])
	except KeyError:
		pass
	# Windows
	return search_ndk_path(getenv("LOCALAPPDATA", "."))

def search_for_gcc_executable(ndk_dir: str) -> Optional[str]:
	search_dir = join(ndk_dir, "bin")
	if isdir(search_dir):
		pattern = re.compile("[0-9A-Za-z]*-linux-android(eabi)*-g\\+\\+.*")
		for file in listdir(search_dir):
			if re.match(pattern, file):
				return abspath(join(search_dir, file))

def require_compiler_executable(arch: str, install_if_required: bool = False) -> Optional[str]:
	ndk_dir = TOOLCHAIN_CONFIG.get_path("toolchain/ndk/" + str(arch))
	file = search_for_gcc_executable(ndk_dir)
	if install_if_required:
		install(arches=arch, reinstall=False)
		file = search_for_gcc_executable(ndk_dir)
		if file is None or not isfile(file):
			warn("NDK installation for '" + arch + "' is broken, trying to re-install.")
			install(arches=arch, reinstall=True)
			file = search_for_gcc_executable(ndk_dir)
			if file is None or not isfile(file):
				error("Reinstallation doesn't help, please, retry setup manually.")
				return None
	return file

def check_installed(arches: Union[str, List[str]]) -> bool:
	if not isinstance(arches, list):
		arches = [arches]
	return len(list(filter(
		lambda arch: not isfile(TOOLCHAIN_CONFIG.get_path("toolchain/ndk/.installed-" + str(arch))),
		arches
	))) == 0

def download(shell: Optional[Shell] = None) -> Optional[str]:
	from urllib import request
	archive_path = TOOLCHAIN_CONFIG.get_path("toolchain/temp/ndk.zip")
	makedirs(dirname(archive_path), exist_ok=True)

	if not isfile(archive_path):
		progress = None
		if shell is not None:
			progress = Progress(text="C++ GCC Compiler (NDK)")
			shell.interactables.append(progress)
			shell.render()
		url = "https://dl.google.com/android/repository/android-ndk-r16b-" + ("windows" if platform.system() == "Windows" else "linux") + "-x86_64.zip"
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
					if shell is not None and progress is not None:
						progress.seek(downloaded / length, f"Downloading ({(downloaded / 1048576):.1f}/{(length / 1048576):.1f}MiB)")
						shell.render()
					f.write(buffer)
		Progress.notify(shell, progress, 1, f"Downloaded {(length / 1024):.1f}MiB")

	progress = None
	if shell is not None:
		progress = Progress(text="Extracting NDK/GCC")
		shell.interactables.append(progress)
		shell.render()
	extract_path = TOOLCHAIN_CONFIG.get_path("toolchain/temp")
	makedirs(extract_path, exist_ok=True)
	try:
		with AttributeZipFile(archive_path, "r") as archive:
			archive.extractall(extract_path)
		Progress.notify(shell, progress, 1, "Extracted into toolchain/temp")
	except OSError as exc:
		Progress.notify(shell, progress, 0, f"#{exc.errno}: {basename(exc.filename)}")
		try:
			remove_tree(TOOLCHAIN_CONFIG.get_path("toolchain/temp"))
		except OSError:
			Progress.notify(shell, progress, 0, f"#{exc.errno}: {basename(exc.filename)} (security fail)")
	except zipfile.BadZipFile as exc:
		try:
			remove_tree(TOOLCHAIN_CONFIG.get_path("toolchain/temp"))
			return download(shell)
		except OSError as exc:
			Progress.notify(shell, progress, 0, f"#{exc.errno}: {basename(exc.filename)} (security fail)")

	return search_ndk_path(extract_path, contains_ndk=True)

def install(arches: Union[str, List[str]] = "arm", reinstall: bool = False) -> int:
	if not reinstall and check_installed(arches):
		return 0
	else:
		shell = Shell()
		ndk_path = get_ndk_path()
		if ndk_path is None:
			if not reinstall:
				print("Not found valid NDK installation for '", arches, "'.", sep="")
			try:
				if reinstall or input("Download android-ndk-r16b-x86_64? [N/y] ")[:1].lower() == "y":
					if shell is not None:
						shell.enter()
					ndk_path = download(shell)
				else:
					abort()
			except KeyboardInterrupt:
				abort()
		elif shell is not None:
			shell.enter()

		if ndk_path is None:
			if shell is not None:
				shell.leave()
			error("Installation interrupted by raised cause above, you're must extract 'toolchain/temp/ndk.zip' manually into toolchain/temp and retry task.")
			return 1
		result = 0

		progress = None
		if not isinstance(arches, list):
			arches = [arches]
		for arch in arches:
			progress = None
			if shell is not None:
				progress = Progress(text=f"Installing {str(arch)}")
				shell.interactables.append(progress)
				shell.render()
			result += subprocess.call([
				"python3" if platform.system() != "Windows" else "python",
				join(ndk_path, "build", "tools", "make_standalone_toolchain.py"),
				"--arch", str(arch),
				"--api", "19",
				"--install-dir", TOOLCHAIN_CONFIG.get_path("toolchain/ndk/" + str(arch)),
				"--force"
			])
			open(TOOLCHAIN_CONFIG.get_path("toolchain/ndk/.installed-" + str(arch)), "tw").close()
			if result != 0:
				Progress.notify(shell, progress, 0.5, f"Installation of {str(arch)} failed with result {str(result)}")
			else:
				Progress.notify(shell, progress, 1, f"Successfully installed {str(arch)}")

		if result == 0:
			progress = None
			if shell is not None:
				progress = Progress(progress=0.9, text=f"Removing temporary files")
				shell.interactables.append(progress)
				shell.render()
			try:
				remove_tree(TOOLCHAIN_CONFIG.get_path("toolchain/temp"))
				if progress is not None:
					progress.seek(1, "C++ GCC Compiler (NDK)")
			except OSError as exc:
				Progress.notify(shell, progress, 0, f"#{exc.errno}: {basename(exc.filename)}")
		else:
			Progress.notify(shell, progress, 0.5, f"Installation failed with result {str(result)}")

		if shell is not None:
			shell.render()
			shell.leave()
		if result != 0:
			print("You're must install it manually by running 'toolchain/temp/../build/tools/make_standalone_toolchain.py', or re-extracting NDK.")
		return result


if __name__ == "__main__":
	if "--help" in sys.argv:
		print("Usage: native/native-setup.py [arch/arches]")
		exit(0)
	if len(sys.argv) >= 2:
		install(sys.argv[1])
	else:
		install()
