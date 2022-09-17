import os
from os.path import join, isdir, isfile
import utils

def ensure_typescript():
	print("Updating typescript version")
	os.system("npm install -g typescript")

def get_language():
	if get_language.language == "":
		res = input("Do you want to enable Typescript and ES6+ support (requires node.js to build project)? [Y/n]")
		if res.lower() == "n":
			get_language.language = "javascript"
		else:
			get_language.language = "typescript"
			ensure_typescript()

	return get_language.language
get_language.language = ""

def cleanup_if_required(directory):
	res = input("Do you want to clean up the toolchain? [Y/n]: ")
	if res.lower() == "n":
		return

	to_remove = [
		"toolchain-sample-mod",
		"toolchain-setup.py",
		"toolchain.zip"
	]
	for filename in to_remove:
		path = join(directory, filename)
		if isfile(path):
			os.remove(path)
		elif isdir:
			utils.clear_directory(path)
