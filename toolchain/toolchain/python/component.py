import os
import sys

from make_config import TOOLCHAIN_CONFIG
from utils import ensure_not_whitespace
from shell import *

class Component():
	def __init__(self, keyword, name, location = "", packurl = None, commiturl = None, branch = None):
		self.keyword = keyword
		self.name = name
		self.location = location
		if branch is not None:
			self.packurl = ""
			self.commiturl = ""
		if packurl is not None:
			self.packurl = packurl
		if commiturl is not None:
			self.commiturl = commiturl

COMPONENTS = {
	"adb": Component("adb", "Android Debug Bridge", "toolchain/adb", branch="adb"),
	"declarations": Component("declarations", "TypeScript Declarations", "toolchain/declarations", branch="includes"),
	"java": Component("java", "Java R8/D8 Compiler", "toolchain/bin/r8", branch="r8"),
	"classpath": Component("classpath", "Java Classpath", "toolchain/classpath", branch="classpath"),
	"cpp": Component("cpp", "C++ GCC Compiler (NDK)", "toolchain/ndk"),
	"stdincludes": Component("stdincludes", "C++ Headers", "toolchain/stdincludes", branch="stdincludes")
}

def put_components(installed = []):
	return [
		Switch("component:" + key, COMPONENTS[key].name, True if key in installed else False) for key in COMPONENTS
	]

def resolve_components(interactables):
	keywords = []
	for interactable in interactables:
		if interactable.key is not None and interactable.key.startswith("component:") and interactable.checked:
			keywords.append(interactable.key.partition(":")[2])
	return keywords

def install_components(components):
	shell = InteractiveShell(lines_per_page=max(len(components), 9))
	for componentname in components:
		if not componentname in COMPONENTS:
			print(f"Not found component {componentname}!")
			continue
		if componentname == "ndk":
			continue
		component = COMPONENTS[componentname]
		print()
	if "ndk" in components:
		print()

def get_username():
	try:
		return os.environ["USER"]
	except KeyError:
		return None

def startup():
	print("Welcome to Inner Core Mod Toolchain!", end="")
	shell = SelectiveShell()
	shell.interactables += [
		Separator(),
		Notice("Today we've complete your distribution installation."),
		Notice("Just let realize some things before downloading, and"),
		Notice("modding will be started in a few moments."),
		Separator(),
		Progress(progress=0.25, text=" " + "Howdy!".center(45) + ">")
	]
	shell.interactables += [
		Separator(),
		Input("user", "I'll will be ", template=get_username()),
		Notice("Author name identifies you, it will be used as default"),
		Notice("`author` property when you're starting new project."),
		Separator(),
		Progress(progress=0.5, text="<" + "Who are you?".center(45) + ">")
	]
	components = put_components(["adb", "declarations", "java"])
	try:
		import shutil
		if shutil.which("adb") is None:
			components.append("adb")
	except BaseException:
		pass
	interactables = [
		Notice("Which components will be installed?")
	]
	component = 0
	index = len(interactables)
	while True:
		if index % shell.lines_per_page == shell.lines_per_page - 1:
			interactables.append(Progress(progress=0.75, text="<" + "Configure your toolchain".center(45) + (
				">" if component < len(components) + 3 else "+"
			)))
			if component == len(components) + 3:
				break
		elif component < len(components) + 3:
			if component < len(components):
				interactables.append(components[component])
			elif component == len(components):
				interactables.append(Separator())
			elif component == len(components) + 1:
				interactables.append(Notice("Any of components above may be installed when it might"))
			elif component == len(components) + 2:
				interactables.append(Notice("be required. Selected will be availabled right now."))
			component += 1
		else:
			required_lines = shell.lines_per_page - ((index + 1) % shell.lines_per_page)
			interactables.append(Separator(size=required_lines))
			index += required_lines - 1
		index += 1
	shell.interactables += [
		*interactables,
		Interrupt()
	]
	try:
		shell.loop()
	except KeyboardInterrupt:
		pass
	print()
	username = shell.get_interactable("user").read()
	if ensure_not_whitespace(username) is not None:
		print("Who are you?", f"\x1b[2m{username}\x1b[0m")
		TOOLCHAIN_CONFIG.set_value("template.author", username)
	installation = resolve_components(shell.interactables)
	if len(installation) > 0:
		print("Which components will be installed?", f"\x1b[2m{', '.join(installation)}\x1b[0m")
		install_components(installation)

def foreign():
	print("Which components will be upgraded?", end="")
	shell = SelectiveShell(lines_per_page=min(len(COMPONENTS), 9))
	shell.interactables += put_components()
	shell.interactables.append(Interrupt())
	try:
		shell.loop()
	except KeyboardInterrupt:
		pass
	installation = resolve_components(shell.interactables)
	if len(installation) > 0:
		print("Which components will be upgraded?", f"\x1b[2m{', '.join(installation)}\x1b[0m")
		install_components(installation)


if __name__ == "__main__":
	if "--help" in sys.argv:
		print("Usage: component.py <options> [components]")
		print(" " * 2 + "--startup: Startup configuration instead of component installation.")
		exit(0)
	if "--startup" in sys.argv or "-s" in sys.argv:
		startup()
	else:
		foreign()
