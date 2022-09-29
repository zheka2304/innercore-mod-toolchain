import os
from os.path import join, exists, isfile, isdir, basename
from platform import platform
import shutil
import sys
import subprocess
import urllib.request as request
from urllib.error import URLError

def copy_directory(src, dst, symlinks = False, ignore = None):
	if not exists(src) or isfile(src):
		raise Exception()
	for item in os.listdir(src):
		s = join(src, item)
		d = join(dst, item)
		if exists(d):
			continue
		if isdir(s):
			shutil.copytree(s, d, symlinks, ignore)
		elif not item in ignore:
			shutil.copy2(s, d)

def download_and_extract_toolchain(directory):
	import zipfile
	archive = join(directory, "toolchain.zip")

	if not exists(archive):
		url = "https://codeload.github.com/zheka2304/innercore-mod-toolchain/zip/deploy"
		print("Downloading Inner Core Mod Toolchain: " + url)
		try:
			request.urlretrieve(url, archive)
		except URLError:
			print("Check your network connection!")
			exit(1)
		except BaseException as err:
			print(err)
			print("Inner Core Mod Toolchain installation not completed due to above error.")
			exit(1)
	else:
		print("'toolchain.zip' already exists in '" + directory + "'")

	print("Extracting into '" + directory + "'...")

	with zipfile.ZipFile(archive, "r") as zip_ref:
		zip_ref.extractall(directory)

	commit = "unknown"
	try:
		copy_directory(join(directory, "innercore-mod-toolchain-deploy"), "toolchain")
		if isfile(join(directory, "toolchain/toolchain/bin/.commit")):
			with open(join(directory, "toolchain/toolchain/bin/.commit")) as file:
				commit = file.readline()
		shutil.rmtree(join(directory, "innercore-mod-toolchain-deploy"))
	except BaseException as err:
		print(err)
		print("Inner Core Mod Toolchain installation not completed due to above error.")
		exit(2)
	finally:
		os.remove(archive)
		if not exists(join(directory, "toolchain")):
			print("Inner Core Mod Toolchain extracted '/toolchain' folder not found.")
			print("Retry operation or extract 'toolchain.zip' manually.")
			exit(3)

	print("Installed into '" + directory + "' under '" + commit + "' revision.")


if "--help" in sys.argv:
	print("Usage: toolchain-setup.py <options> [directory]")
	print(" " * 2 + "--no-startup: Skip startup stage for configuring author")
	print(" " * 4 + "identity and installling additional components.")
	print(" " * 2 + "--import <folder> [destination]:")
	print(" " * 4 + "Run import after installation completion in specified")
	print(" " * 4 + "location, toolchain destination used by default.")
	print(" " * 2 + "--foreign: Skip startup stage, install components instead.")
	print("Download toolchain deploy branch, run startup script to complete")
	print("components installation and setup defaults.")
	exit(0)

location = sys.argv[len(sys.argv) - 1] if len(sys.argv) > 1 and not sys.argv[len(sys.argv) - 1].startswith("--") else "."
download_and_extract_toolchain(location)

if "--foreign" in sys.argv:
	subprocess.run(
		"python" if platform() == "Windows" else "python3",
		"toolchain/toolchain/python/component.py"
	)
elif not "--no-startup" in sys.argv:
	subprocess.run(
		"python" if platform() == "Windows" else "python3",
		"toolchain/toolchain/python/component.py",
		"--startup"
	)
if "--import" in sys.argv:
	where = sys.argv.index("--import")
	if len(sys.argv) < where + 1 and not sys.argv[where + 1].startswith("--"):
		print("Not found import path, nothing will happened.")
		exit(1)
	folder = sys.argv[where + 1]
	if len(sys.argv) < where + 2 and not sys.argv[where + 2].startswith("--"):
		location = sys.argv[where + 2]
	else:
		location = join(location, "toolchain")
	subprocess.run(
		"python" if platform() == "Windows" else "python3",
		"toolchain/toolchain/python/import.py",
		join(location, basename(folder)), folder
	)
