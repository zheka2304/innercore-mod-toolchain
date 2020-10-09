import sys
import re
from os import listdir, environ, getenv, makedirs
from os.path import isfile, isdir, join, abspath, exists, dirname
import subprocess

from make_config import make_config
from progress_bar import print_progress_bar
from zipfile import ZipFile
from utils import clear_directory


def list_subdirectories(path, max_depth=5, dirs=None):
	if dirs is None:
		dirs = []
	if not isdir(path):
		return dirs
	dirs.append(path)
	for f in listdir(path):
		file = join(path, f)
		if max_depth > 0 and isdir(file):
			list_subdirectories(file, dirs=dirs, max_depth=max_depth - 1)
	return dirs


def search_ndk_path(home_dir, contains_ndk=False):
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
	path_from_config = make_config.get_value("make.ndkPath")
	if path_from_config is not None:
		return path_from_config
	# linux
	try:
		return search_ndk_path(environ['HOME'])
	except KeyError:
		pass
	# windows
	return search_ndk_path(getenv("LOCALAPPDATA"))



def search_for_gcc_executable(ndk_dir):
	search_dir = join(ndk_dir, "bin")
	if isdir(search_dir):
		pattern = re.compile("[0-9A-Za-z]*-linux-android(eabi)*-g\\+\\+.*")
		for file in listdir(search_dir):
			if re.match(pattern, file):
				return abspath(join(search_dir, file))


def require_compiler_executable(arch, install_if_required=False):
	ndk_dir = make_config.get_path("toolchain/ndk/" + str(arch))
	file = search_for_gcc_executable(ndk_dir)
	if install_if_required:
		install(arch=arch, reinstall=False)
		file = search_for_gcc_executable(ndk_dir)
		if file is None or not isfile(file):
			print("ndk installation is broken, trying to re-install")
			install(arch=arch, reinstall=True)
			file = search_for_gcc_executable(ndk_dir)
			if file is None or not isfile(file):
				print("re-install haven't helped")
				return None
		return file
	else:
		return file


def check_installed(arch):
	return isfile(make_config.get_path("toolchain\\ndk\\.installed-" + str(arch)))


def install(arch="arm", reinstall=False):
	if not reinstall and check_installed(arch):
		print("toolchain for " + arch + " is already installed, installation skipped")
		return True
	else:
		ndk_path = get_ndk_path()
		if ndk_path is None:
			from urllib import request
			print("failed to get ndk path")
			ans = input("download ndk? (Y/N) ")
			if ans.lower() == "y":
				archive_path = make_config.get_path("toolchain\\temp\\ndk.zip")
				makedirs(dirname(archive_path), exist_ok=True)
				
				if not isfile(archive_path):
					url = "https://dl.google.com/android/repository/android-ndk-r16b-windows-x86_64.zip"
					with request.urlopen(url) as response:
						with open(archive_path, 'wb') as f:
							info = response.info()
							length = int(info["Content-Length"])
	
							downloaded = 0
							while True:
								buffer = response.read(8192)
								if not buffer:
									break
								
								downloaded += len(buffer)
								f.write(buffer)
	
								print_progress_bar(downloaded, length, suffix = 'Downloading...' if downloaded < length else "Complete!", length = 50)

				print("extracting ndk...")
				extract_path = make_config.get_path("toolchain\\temp")
				with ZipFile(archive_path, 'r') as archive:
					archive.extractall(extract_path)

				ndk_path = search_ndk_path(extract_path, contains_ndk=True)
			else:
				print("aborting native compilation")
				return False

		print("installing...")
		result = subprocess.call([
			"python",
			join(ndk_path, "build", "tools", "make_standalone_toolchain.py"),
			"--arch", str(arch),
			"--install-dir", make_config.get_path("toolchain\\ndk\\" + str(arch)),
			"--force"
		])

		if result == 0:
			open(make_config.get_path("toolchain\\ndk\\.installed-" + str(arch)), 'tw').close()
			print("removing temp files...")
			clear_directory(make_config.get_path("toolchain\\temp"))
			print("done!")
			return True
		else:
			print("installation failed with result code:", result)
			return False


if __name__ == "__main__":
	if len(sys.argv) >= 2:
		install(arch=sys.argv[1])
	else:
		install()
