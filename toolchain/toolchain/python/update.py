import sys
import os
from os.path import join, exists
import shutil
import urllib.request as request

from utils import copy_directory
from make_config import TOOLCHAIN_CONFIG

def download_and_extract_toolchain(directory):
	import zipfile
	archive = join(directory, "toolchain.zip")

	if not exists(archive):
		url = "https://codeload.github.com/zheka2304/innercore-mod-toolchain/zip/master"
		print("Downloading Inner Core Mod Toolchain: " + url)
		request.urlretrieve(url, archive)
	else: 
		print("'toolchain.zip' already exists in '" + directory + "'")

	print("Extracting into '" + directory + "'")

	with zipfile.ZipFile(archive, "r") as zip_ref:
		zip_ref.extractall(directory)

	timestamp = "unknown"
	try:
		copy_directory(join(directory, "innercore-mod-toolchain-master/toolchain/toolchain"), join(directory, "toolchain/toolchain"))
		shutil.rmtree(join(directory, "innercore-mod-toolchain-master"))
	except Exception as err:
		print(err)
		from task import error
		error("Inner Core Mod Toolchain installation not completed due to above error.", 1)
	finally:
		os.remove(archive)
		if not exists(join(directory, "toolchain")):
			from task import error
			print("Inner Core Mod Toolchain extracted '/toolchain' folder not found.")
			error("Retry operation or extract 'toolchain.zip' manually.", 2)

	print("Installed into '" + directory + "' under '" + timestamp + "' revision.")

def update():
	""" if exists(last_update_path):
		print("Fetching your revision")
		with open(last_update_path, "r", encoding="utf-8") as last_update_file:
			last_update = datetime.strptime(last_update_file.read(), date_format)

		print("Fetching repository latest update")
		response = request.urlopen("https://api.github.com/repos/zheka2304/innercore-mod-toolchain/branches/master")
		last_update_repo = datetime.strptime(json.loads(response.read())["commit"]["commit"]["committer"]["date"], date_format)

		if last_update_repo <= last_update:
			print("You have the latest version.")
			print(f"{last_update_repo} -> {last_update}")
			return 0
	else:
		print("No information was found for your last update.") """

	if input("Download last update? [Y/n]: ").lower() == "n":
		""" if input("Override .commit instead? [y/N]: ").lower() == "y":
			change_timestamp() """
		return 0

	download_and_extract_toolchain(join(TOOLCHAIN_CONFIG.root_dir, ".."))


if __name__ == "__main__":
	update()
