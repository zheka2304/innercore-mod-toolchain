import os
from os.path import join, exists, isfile, isdir
import shutil
from urllib import request
from urllib.error import URLError
from utils import AttributeZipFile

from make_config import TOOLCHAIN_CONFIG
from utils import merge_directory

def download_toolchain(directory):
	os.makedirs(directory, exist_ok=True)
	archive = join(directory, "toolchain.zip")

	if not exists(archive):
		url = "https://codeload.github.com/zheka2304/innercore-mod-toolchain/zip/deploy"
		print("Downloading Inner Core Mod Toolchain: " + url)
		try:
			request.urlretrieve(url, archive)
		except URLError:
			from task import error
			error("Check your network connection!", 1)
		except BaseException as err:
			print(err)
			error("Inner Core Mod Toolchain installation not completed due to above error.", 2)
	else:
		print("'toolchain.zip' already exists in temporary directory.")

def might_be_updated(directory = None):
	commit_path = TOOLCHAIN_CONFIG.get_path("toolchain/bin/.commit")
	if not isfile(commit_path):
		return True
	if directory is not None and isfile(join(directory, "toolchain.zip")):
		return True
	try:
		with open(join(commit_path)) as commit_file:
			response = request.urlopen("https://raw.githubusercontent.com/zheka2304/innercore-mod-toolchain/deploy/toolchain/toolchain/bin/.commit")
			return not perform_diff(response.read().decode("utf-8"), commit_file.read())
	except URLError:
		return False
	except BaseException as err:
		print(err)
		return True

def perform_diff(a, b):
	return str(a).strip() == str(b).strip()

def extract_toolchain(directory):
	archive = join(directory, "toolchain.zip")
	with AttributeZipFile(archive, "r") as zip_ref:
		zip_ref.extractall(directory)

	branch = join(directory, "innercore-mod-toolchain-deploy")
	if not exists(branch):
		print("Inner Core Mod Toolchain extracted 'innercore-mod-toolchain-deploy' folder not found.")
		from task import error
		error("Retry operation or extract 'toolchain.zip' manually.", 3)
	toolchain = TOOLCHAIN_CONFIG.get_path("..")

	if exists(join(branch, ".github")):
		merge_directory(join(branch, ".github"), join(toolchain, ".github"))
	for filename in os.listdir(branch):
		above = join(branch, filename)
		if not isfile(above):
			continue
		merge_directory(above, join(toolchain, filename))
	accept_squash_and_replace = TOOLCHAIN_CONFIG.get_value("updateAcceptReplaceConfiguration", True)
	merge_directory(join(branch, "toolchain"), join(toolchain, "toolchain"), accept_squash_and_replace, ["toolchain", "toolchain.json"], True, accept_squash_and_replace)
	merge_directory(join(branch, "toolchain/toolchain"), join(toolchain, "toolchain/toolchain"))
	if isdir(join(toolchain, "toolchain-sample-mod")) and isdir(join(branch, "toolchain-sample-mod")):
		shutil.rmtree(join(toolchain, "toolchain-sample-mod"))
		shutil.move(join(branch, "toolchain-sample-mod"), join(toolchain, "toolchain-sample-mod"))

	shutil.rmtree(branch, ignore_errors=True)
	os.remove(archive)

def update_toolchain():
	directory = TOOLCHAIN_CONFIG.get_path("toolchain/temp")
	if might_be_updated(directory):
		commit_path = TOOLCHAIN_CONFIG.get_path("toolchain/bin/.commit")
		download_toolchain(directory)
		commit = None
		if isfile(commit_path):
			with open(commit_path) as file:
				commit = file.read().strip()
		extract_toolchain(directory)
		if not isfile(commit_path):
			print("Successfully installed! But corresponding 'toolchain/bin/.commit' not found, futher update will be installed without any prompt.")
		else:
			with open(commit_path) as file:
				branch_commit = file.read().strip()
			if commit is not None:
				print(f"Successfully installed {branch_commit[:7]} above {commit[:7]} revision!")
			else:
				print(f"Successfully installed under {branch_commit[:7]} revision!")


if __name__ == "__main__":
	update_toolchain()
