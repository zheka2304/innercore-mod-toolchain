import sys
import os
from os.path import join, exists
import json
from datetime import datetime, timezone
import shutil
import urllib.request as request

import utils
from make_config import make_config

date_format = "%Y-%m-%dT%H:%M:%SZ"
last_update_path = make_config.get_path("toolchain/bin/.last_update")

def change_timestamp(stamp = datetime.now(timezone.utc).strftime(date_format)):
	with open(last_update_path, "w", encoding="utf-8") as last_update_file:
		last_update_file.write(stamp)

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
		utils.copy_directory(join(directory, "innercore-mod-toolchain-master/toolchain/toolchain"), join(directory, "toolchain/toolchain"))
		timestamp = datetime.now(timezone.utc).strftime(date_format)
		change_timestamp(timestamp)
		shutil.rmtree(join(directory, "innercore-mod-toolchain-master"))
	except Exception as err:
		print(err, file=sys.stderr)
		print("Inner Core Mod Toolchain installation not completed due to above error.", file=sys.stderr)
		exit(1)
	finally:
		os.remove(archive)
		if not exists(join(directory, "toolchain")):
			print("Inner Core Mod Toolchain extracted '/toolchain' folder not found.")
			print("Retry operation or extract 'toolchain.zip' manually.")
			exit(2)

	print("Installed into '" + directory + "' under '" + timestamp + "' revision.")

def update():
	if exists(last_update_path):
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
		print("No information was found for your last update.")

	if input("Download last update? [Y/n]: ").lower() == "n":
		if input("Change timestamp instead? [y/N]: ").lower() == "y":
			change_timestamp()
		return 0

	download_and_extract_toolchain(join(make_config.root_dir, ".."))


if __name__ == "__main__":
	update()
