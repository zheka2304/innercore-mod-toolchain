import os
import shutil
from glob import glob
from os.path import exists, isdir, isfile, join
from typing import Optional
from urllib import request
from urllib.error import URLError

from . import GLOBALS
from .shell import abort, error, warn
from .utils import AttributeZipFile, merge_directory


def download_toolchain(directory: str) -> None:
	os.makedirs(directory, exist_ok=True)
	archive = join(directory, "toolchain.zip")

	if not exists(archive):
		url = "https://codeload.github.com/zheka2304/innercore-mod-toolchain/zip/deploy"
		print("Downloading Inner Core Mod Toolchain: " + url)
		try:
			request.urlretrieve(url, archive)
		except URLError:
			abort("Check your network connection!")
	else:
		print("'toolchain.zip' already exists in temporary directory.")

def might_be_updated(directory: Optional[str] = None) -> bool:
	"""
	Maintains 'main' component, things are similiar with ordinary components.
	When 'toolchain/bin/.commit' outdated it will be updated.
	"""
	commit_path = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/.commit")
	if not isfile(commit_path):
		return True
	if directory and isfile(join(directory, "toolchain.zip")):
		return True
	try:
		with open(join(commit_path)) as commit_file:
			response = request.urlopen("https://raw.githubusercontent.com/zheka2304/innercore-mod-toolchain/deploy/toolchain/toolchain/bin/.commit")
			return not perform_diff(response.read().decode("utf-8"), commit_file.read())
	except URLError:
		return False
	except BaseException:
		pass
	return True

def perform_diff(a: object, b: object) -> bool:
	return str(a).strip() == str(b).strip()

def extract_toolchain(directory: str) -> None:
	"""
	Which files will be extracted with merging/replacing?
	- toolchain/* in master branch: bin (not bin/r8), python
	- toolchain/*.{sh,bat} will be removed
	- ../.github will be replaced if it exists
	- ../toolchain-sample-mod will be replaced if it exists
	- anything in directory excludes 'toolchain.json' and toolchain if it
	exists on remote, you can disable it by `"updateAcceptReplaceConfiguration": false`
	property in your 'toolchain.json'
	"""
	archive = join(directory, "toolchain.zip")
	with AttributeZipFile(archive, "r") as zip_ref:
		zip_ref.extractall(directory)

	branch = join(directory, "innercore-mod-toolchain-deploy")
	if not exists(branch):
		error("Inner Core Mod Toolchain extracted 'innercore-mod-toolchain-deploy' folder not found.")
		abort("Retry operation or extract 'toolchain.zip' manually.")
	toolchain = GLOBALS.TOOLCHAIN_CONFIG.get_path("..")

	if exists(join(branch, ".github")):
		merge_directory(join(branch, ".github"), join(toolchain, ".github"))
	for filename in os.listdir(branch):
		above = join(branch, filename)
		if not isfile(above):
			continue
		merge_directory(above, join(toolchain, filename))
	accept_squash_and_replace = GLOBALS.TOOLCHAIN_CONFIG.get_value("updateAcceptReplaceConfiguration", True)
	merge_directory(join(branch, "toolchain"), join(toolchain, "toolchain"), accept_squash_and_replace, ["toolchain", "toolchain.json"], True, accept_squash_and_replace)
	merge_directory(join(branch, "toolchain", "toolchain"), join(toolchain, "toolchain", "toolchain"))
	try:
		bashes = glob(join(toolchain, "toolchain", "toolchain", "*.sh"))
		bashes.extend(glob(join(toolchain, "toolchain", "toolchain", "*.bat")))
		for file in bashes:
			if isfile(file):
				os.remove(file)
	except TypeError:
		pass
	if isdir(join(toolchain, "toolchain-sample-mod")) and isdir(join(branch, "toolchain-sample-mod")):
		shutil.rmtree(join(toolchain, "toolchain-sample-mod"))
		shutil.move(join(branch, "toolchain-sample-mod"), join(toolchain, "toolchain-sample-mod"))

	shutil.rmtree(branch, ignore_errors=True)
	os.remove(archive)

def update_toolchain() -> None:
	directory = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/temp")
	if might_be_updated(directory):
		commit_path = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/bin/.commit")
		download_toolchain(directory)
		commit = None
		if isfile(commit_path):
			with open(commit_path) as file:
				commit = file.read().strip()
		extract_toolchain(directory)
		if not isfile(commit_path):
			warn("Successfully installed, but corresponding 'toolchain/bin/.commit' not found, further update will be installed without any prompt.")
		else:
			with open(commit_path) as file:
				branch_commit = file.read().strip()
			if commit:
				print(f"Successfully installed {branch_commit[:7]} above {commit[:7]} revision!")
			else:
				print(f"Successfully installed under {branch_commit[:7]} revision!")
