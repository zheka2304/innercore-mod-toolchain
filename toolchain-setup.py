import os
from os.path import join, exists, isfile, isdir
import platform
import shutil
import sys
import subprocess
import urllib.request as request
from urllib.error import URLError
from zipfile import ZipFile, ZipInfo

class AttributeZipFile(ZipFile):
	if sys.version_info < (3, 6):
		def extract(self, member, path = None, pwd = None):
			if not isinstance(member, ZipInfo):
				member = self.getinfo(member)

			if path is None:
				path = os.getcwd()

			targetpath = self._extract_member(member, path, pwd)

			attr = member.external_attr >> 16
			os.chmod(targetpath, attr)
			return targetpath

	else:
		def _extract_member(self, member, targetpath, pwd):
			if not isinstance(member, ZipInfo):
				member = self.getinfo(member)

			targetpath = super()._extract_member(member, targetpath, pwd)

			attr = member.external_attr >> 16
			if attr != 0:
				os.chmod(targetpath, attr)
			return targetpath

def download_and_extract_toolchain(directory):
	os.makedirs(directory, exist_ok=True)
	archive = join(directory, "toolchain.zip")

	readable_name = "current directory" if directory in (".", "") else "'" + directory + "'"
	if exists(join(directory, "toolchain")):
		print("Inner Core Mod Toolchain already installed in " + readable_name + ".")
		print("Newly installed files will be merged with your installation.")
		print("It's handly to restore necessary removed script or template.")
		try:
			if input("Do you want to download it again? [N/y] ")[:1].lower() != "y":
				return print("Abort.")
		except KeyboardInterrupt:
			return print("Abort.")

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
			exit(2)
	else:
		print("'toolchain.zip' already exists in " + readable_name + ".")

	print("Extracting into " + readable_name)
	with AttributeZipFile(archive, "r") as zip_ref:
		zip_ref.extractall(directory)

	commit = "unknown"
	try:
		if isdir(join(directory, "toolchain-mod/toolchain")):
			dirname = "toolchain-mod"
			index = 0
			while exists(join(directory, dirname)):
				index += 1
				dirname = "toolchain-mod-" + str(index)
			shutil.move(join(directory, "toolchain-mod"), join(directory, dirname))
		shutil.copytree(join(directory, "innercore-mod-toolchain-deploy"), directory, dirs_exist_ok=True)
		if isfile(join(directory, "toolchain/toolchain/bin/.commit")):
			with open(join(directory, "toolchain/toolchain/bin/.commit")) as file:
				commit = file.read()
		shutil.rmtree(join(directory, "innercore-mod-toolchain-deploy"))
	except BaseException as err:
		print(err)
		print("Inner Core Mod Toolchain installation not completed due to above error.")
		exit(3)
	finally:
		if not exists(join(directory, "toolchain")):
			print("Inner Core Mod Toolchain extracted 'innercore-mod-toolchain-deploy' folder not found.")
			print("Retry operation or extract 'toolchain.zip' manually.")
			exit(4)
		else:
			os.remove(archive)

	print("Installed into " + readable_name + " under " + commit.strip()[:7] + " revision.")

def print_placeholder(which):
	layer = 0
	while layer < len(which):
		for symbol in which[layer]:
			print("\x1b[", "" if symbol == 0 or symbol == 7 else "7m" if not isinstance(symbol, int) else "7m\x1b[" if symbol == 2 else "48;5;", symbol, "m  " if isinstance(symbol, int) else "", sep="", end="\x1b[0m")
		print()
		layer += 1


if "--help" in sys.argv:
	print("Usage: toolchain-setup.py <options> [directory]")
	print(" " * 2 + "--no-startup: Skip startup stage for configuring author")
	print(" " * 4 + "identity and installing additional components.")
	print(" " * 2 + "--import <folder> [destination]:")
	print(" " * 4 + "Run import after installation completion in specified")
	print(" " * 4 + "location, toolchain destination used by default.")
	print(" " * 2 + "--foreign: Skip startup stage, install components instead.")
	print("Download toolchain deploy branch, run startup script to complete")
	print("components installation and setup defaults.")
	exit(0)

location = sys.argv[len(sys.argv) - 1] if len(sys.argv) > 1 and not sys.argv[len(sys.argv) - 1].startswith("--") else "."
download_and_extract_toolchain(location)

if platform.system() != "Windows":
	print()
	print_placeholder([
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 124, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 196, 160, 196, 196, 196, 196, 0, 0, 0, 0, 0, 0, 196, 160, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 196, 196, 196, 196, 160, 0, 0, 0, 0, 196, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 196, 196, 196, 196, 0, 0, 0, 196, 196, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 160, 196, 196, 160, 196, 160, 160, 0, 160, 0, 0, 196, 196, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 160, 196, 196, 196, 196, 0, 0, 160, 196, 196, 196, 0, 220, 0, 160, 196, 0, 196, 196, 0, 0, 0, 0, 0],
		[0, 0, 0, 160, 196, 196, 196, 196, 196, 0, 0, 0, 226, 220, 196, 196, 196, 214, 220, 0, 196, 160, 196, 196, 196, 0, 0, 0, 0],
		[0, 0, 196, 196, 196, 160, 0, 196, 196, 196, 202, 208, 220, 226, 226, 202, 202, 196, 226, 226, 196, 196, 196, 196, 196, 0, 0, 0, 160],
		[0, 196, 196, 0, 0, 160, 196, 196, 196, 196, 196, 208, 214, 214, 214, 220, 2, 214, 220, 226, 196, 196, 0, 160, 196, 0, 0, 0, 196],
		[160, 160, 0, 0, 160, 196, 160, 172, 202, 214, 214, 2, 2, 7, 7, 7, 2, 7, 2, 214, 196, 196, 0, 0, 196, 0, 0, 0, 196],
		[0, 0, 0, 0, 0, 0, 0, 0, 226, 226, 2, 7, 7, 7, 7, 7, 7, 7, 7, 2, 214, 196, 0, 0, 0, 160, 0, 160, 196],
		[0, 0, 0, 160, 196, 0, 0, 166, 208, 226, 2, 7, 7, 7, 7, 7, 7, 7, 7, 2, 220, 208, 226, 0, 196, 196, 0, 196, 196],
		[0, 0, 0, 196, 196, 0, 196, 196, 214, 226, 7, 7, " I", "nn", "er", " C", "or", "e ", 7, 7, 214, 226, 226, 124, 196, 196, 0, 196, 160],
		[0, 0, 196, 196, 196, 160, 196, 196, 214, 2, 7, 7, " M", "od", 7, 7, 7, 7, 7, 7, 2, 226, 208, 196, 196, 0, 196, 196, 0],
		[0, 0, 196, 196, 0, 196, 196, 214, 220, 2, 7, 7, " T", "oo", "lc", "ha", "in", 7, 7, 7, 2, 214, 196, 196, 196, 196, 196, 196, 0],
		[0, 160, 196, 0, 196, 196, 124, 226, 220, 2, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 214, 196, 202, 0, 196, 196, 0, 0]
	])
print()

if "--foreign" in sys.argv:
	subprocess.run([
		"python" if platform.system() == "Windows" else "python3",
		"component.py"
	], cwd=join(location, "toolchain\\toolchain\\python") if platform.system() == "Windows" else join(location, "toolchain/toolchain/python"))
elif not "--no-startup" in sys.argv:
	subprocess.run([
		"python" if platform.system() == "Windows" else "python3",
		"component.py", "--startup"
	], cwd=join(location, "toolchain\\toolchain\\python") if platform.system() == "Windows" else join(location, "toolchain/toolchain/python"))
if "--import" in sys.argv:
	where = sys.argv.index("--import")
	if len(sys.argv) < where + 1 or sys.argv[where + 1].startswith("--"):
		print("Not found import path, nothing will happened.")
		exit(5)
	folder = sys.argv[where + 1]
	subprocess.run([
		"python" if platform.system() == "Windows" else "python3",
		"import.py", folder
	], cwd=join(location, "toolchain\\toolchain\\python") if platform.system() == "Windows" else join(location, "toolchain/toolchain/python"))
