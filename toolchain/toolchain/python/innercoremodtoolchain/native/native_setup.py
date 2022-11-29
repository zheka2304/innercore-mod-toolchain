import sys
from os import listdir, environ, getenv, makedirs
from os.path import isfile, isdir, join, abspath, dirname
import platform
import subprocess
import re
import zipfile

from ..make_config import TOOLCHAIN_CONFIG
from ..shell import Notice, Progress, Shell
from ..utils import clear_directory, AttributeZipFile

def abi_to_arch(abi):
	abi_map = {
		"armeabi-v7a": "arm",
		"arm64-v8a": "arm64",
		"x86": "x86",
		"x86_64": "x86_64"
	}
	if abi in abi_map:
		return abi_map[abi]
	return None

def list_subdirectories(path, max_depth = 5, dirs = None):
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

def search_ndk_path(home_dir, contains_ndk = False):
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

def get_ndk_path():
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
	return search_ndk_path(getenv("LOCALAPPDATA"))

def search_for_gcc_executable(ndk_dir):
	search_dir = join(ndk_dir, "bin")
	if isdir(search_dir):
		pattern = re.compile("[0-9A-Za-z]*-linux-android(eabi)*-g\\+\\+.*")
		for file in listdir(search_dir):
			if re.match(pattern, file):
				return abspath(join(search_dir, file))

def require_compiler_executable(arch, install_if_required = False):
	ndk_dir = TOOLCHAIN_CONFIG.get_path("toolchain/ndk/" + str(arch))
	file = search_for_gcc_executable(ndk_dir)
	if install_if_required:
		install(arches=arch, reinstall=False)
		file = search_for_gcc_executable(ndk_dir)
		if file is None or not isfile(file):
			print("NDK installation for " + arch + " is broken, trying to re-install.")
			install(arches=arch, reinstall=True)
			file = search_for_gcc_executable(ndk_dir)
			if file is None or not isfile(file):
				print("Reinstallation doesn't help, please, retry setup manually.")
				return None
	return file

def check_installed(arches):
	if not isinstance(arches, list):
		arches = [arches]
	return len(list(filter(
		lambda arch: not isfile(TOOLCHAIN_CONFIG.get_path("toolchain/ndk/.installed-" + str(arch))),
		arches
	))) == 0

def download(shell):
	from urllib import request
	archive_path = TOOLCHAIN_CONFIG.get_path("toolchain/temp/ndk.zip")
	makedirs(dirname(archive_path), exist_ok=True)

	if not isfile(archive_path):
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
					progress.seek(downloaded / length, f"Downloading ({(downloaded / 1048576):.1f}/{(length / 1048576):.1f}MiB)")
					shell.render()
					f.write(buffer)
		progress.seek(1, f"Downloaded {(length / 1024):.1f}MiB")
		shell.render()

	progress = Progress(text="Extracting NDK/GCC")
	shell.interactables.append(progress)
	shell.render()
	extract_path = TOOLCHAIN_CONFIG.get_path("toolchain/temp")
	try:
		with AttributeZipFile(archive_path, "r") as archive:
			archive.extractall(extract_path)
		progress.seek(1, "Extracted into toolchain/temp")
	except OSError as exc:
		progress.seek(0, f"#{exc.errno}: {exc.filename}")
		try:
			clear_directory(TOOLCHAIN_CONFIG.get_path("toolchain/temp"))
		except OSError:
			progress.seek(0, f"#{exc.errno}: {exc.filename} (security fail)")
	except zipfile.BadZipFile as exc:
		try:
			clear_directory(TOOLCHAIN_CONFIG.get_path("toolchain/temp"))
			return download(shell)
		except OSError as exc:
			progress.seek(0, f"#{exc.errno}: {exc.filename} (security fail)")
			shell.render()
	shell.render()

	return search_ndk_path(extract_path, contains_ndk=True)

def install(arches = "arm", reinstall = False):
	if not reinstall and check_installed(arches):
		return 0
	else:
		shell = Shell()
		ndk_path = get_ndk_path()
		if ndk_path is None:
			if not reinstall:
				print("Not found valid NDK installation for ", arches, ".", sep="")
			try:
				if reinstall or input("Download android-ndk-r16b-x86_64? [N/y] ")[:1].lower() == "y":
					shell.enter()
					ndk_path = download(shell)
				else:
					from ..task import error
					error("Abort.", 1)
			except KeyboardInterrupt:
				from ..task import error
				error("Abort.", 1)
		else:
			shell.enter()

		if ndk_path is None:
			shell.leave()
			print("Installation interrupted by raised cause above, you're must extract toolchain/temp/ndk.zip manually into toolchain/temp and retry task.")
			return 1
		result = 0

		if not isinstance(arches, list):
			arches = [arches]
		for arch in arches:
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
				progress.seek(0.5, f"Installation of {str(arch)} failed with result {str(result)}")
				shell.render()
			else:
				progress.seek(1, f"Successfully installed {str(arch)}")
				shell.render()

		if result == 0:
			progress = Progress(progress=0.9, text=f"Removing temporary files")
			shell.render()
			try:
				clear_directory(TOOLCHAIN_CONFIG.get_path("toolchain/temp"))
				progress.seek(1, "C++ GCC Compiler (NDK)")
			except OSError as exc:
				progress.seek(0, f"#{exc.errno}: {exc.filename}")
		else:
			progress.seek(0.5, f"Installation failed with result {str(result)}")

		shell.render()
		shell.leave()
		if result != 0:
			print("You're must install it manually by running toolchain/temp/../build/tools/make_standalone_toolchain.py, or re-extracting ndk.")
		return result


if __name__ == "__main__":
	if "--help" in sys.argv:
		print("Usage: native/native-setup.py [arch/arches]")
		exit(0)
	if len(sys.argv) >= 2:
		install(sys.argv[1])
	else:
		install()
