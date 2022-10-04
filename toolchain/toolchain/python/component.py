import os
from os.path import join, isfile, isdir
import shutil
import sys
from urllib import request
from urllib.error import URLError

from make_config import TOOLCHAIN_CONFIG
from utils import ensure_file_dir, ensure_not_whitespace, AttributeZipFile
from shell import *

class Component():
	def __init__(self, keyword, name, location = "", packurl = None, commiturl = None, branch = None):
		self.keyword = keyword
		self.name = name
		self.location = location
		if branch is not None:
			self.packurl = "https://codeload.github.com/zheka2304/innercore-mod-toolchain/zip/" + branch
			self.commiturl = "https://raw.githubusercontent.com/zheka2304/innercore-mod-toolchain/" + branch + "/.commit"
			self.branch = branch
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

def which_installed():
	installed = []
	for componentname in COMPONENTS:
		component = COMPONENTS[componentname]
		path = TOOLCHAIN_CONFIG.get_path(component.location)
		if not isdir(path):
			continue
		if component.keyword == "cpp":
			installed.append("cpp")
			continue
		if isfile(join(path, ".commit")) or TOOLCHAIN_CONFIG.get_value("componentInstallationWithoutCommit", False):
			installed.append(component.keyword)
	return installed

def download_component(component, shell, progress):
	if not hasattr(component, "packurl") or component.packurl is None:
		progress.seek(0, f"Component {component.keyword} packurl property must be defined!")
		shell.render()
		return 1
	path = TOOLCHAIN_CONFIG.get_path(f"toolchain/temp/{component.keyword}.zip")
	ensure_file_dir(path)
	if isfile(path):
		return 0
	with request.urlopen(component.packurl) as response:
		with open(path, "wb") as f:
			downloaded = 0
			while True:
				buffer = response.read(8192)
				if not buffer:
					break
				downloaded += len(buffer)
				progress.seek(0.5, f"Downloading ({(downloaded / 1048576):.1f}MiB)")
				shell.render()
				f.write(buffer)
	progress.seek(1, f"Downloaded {(downloaded / 1048576):.1f}MiB")
	shell.render()
	return 0

def extract_component(component, shell, progress):
	temp = TOOLCHAIN_CONFIG.get_path("toolchain/temp")
	archive_path = join(temp, component.keyword + ".zip")
	if not isfile(archive_path):
		progress.seek(0, f"Component {component.keyword} downloaded nothing to extract!")
		shell.render()
		return 1
	progress.seek(0.5, f"Extracting to {component.location}")
	extract_to = temp if hasattr(component, "branch") else join(temp, component.keyword)
	with AttributeZipFile(archive_path, "r") as archive:
		archive.extractall(extract_to)
	if hasattr(component, "branch"):
		extract_to = join(extract_to, "innercore-mod-toolchain-" + component.branch)
	if not isdir(extract_to):
		progress.seek(0, f"Component {component.keyword} does not contain any content!")
		shell.render()
		return 2
	output = TOOLCHAIN_CONFIG.get_path(component.location)
	if isdir(output):
		shutil.rmtree(output, ignore_errors=True)
	elif isfile(output):
		shutil.move(output, output + ".bak")
	os.makedirs(output, exist_ok=True)
	shutil.copytree(extract_to, output, dirs_exist_ok=True)
	progress.seek(1, "Cleaning up")
	shell.render()
	shutil.rmtree(extract_to, ignore_errors=True)
	os.remove(archive_path)
	return 0

def install_components(components):
	if len(components) == 0:
		return
	shell = InteractiveShell(lines_per_page=max(len(components), 9))
	shell.enter()
	for componentname in components:
		if not componentname in COMPONENTS:
			print(f"Not found component {componentname}!")
			continue
		if componentname == "cpp":
			continue
		component = COMPONENTS[componentname]
		progress = Progress(text=component.name)
		shell.interactables.append(progress)
		shell.render()
		if fetch_component(component):
			progress.seek(1)
			shell.render()
			continue
		try:
			if download_component(component, shell, progress) == 0:
				if extract_component(component, shell, progress) == 0:
					progress.seek(1, component.name)
		except URLError:
			continue
		except BaseException as err:
			progress.seek(0, f"{component.keyword}: {err}")
		shell.render()
	if "cpp" in components:
		abis = TOOLCHAIN_CONFIG.get_value("abis", [])
		if not isinstance(abis, list):
			abis = []
		abi = TOOLCHAIN_CONFIG.get_value("debugAbi")
		if abi is None and len(abis) == 0:
			from task import error
			error("Please describe options 'abis' or 'debugAbi' in your toolchain.json before install NDK!")
		if abi is not None and not abi in abis:
			abis.append(abi)
		from native.native_setup import abi_to_arch, check_installed, install
		for arch in abis:
			if not check_installed(abi_to_arch(arch)):
				install(abi_to_arch(arch), reinstall=True)
	shell.interactables.append(Interrupt())

def fetch_component(component):
	output = TOOLCHAIN_CONFIG.get_path(component.location)
	if component.keyword == "cpp":
		return isdir(output)
	if isdir(output):
		if TOOLCHAIN_CONFIG.get_value("componentInstallationWithoutCommit", False):
			return True
		if not isfile(join(output, ".commit")):
			return False
	else:
		return False
	if not hasattr(component, "commiturl"):
		return True
	try:
		with open(join(output, ".commit")) as commit_file:
			response = request.urlopen(component.commiturl)
			return perform_diff(response.read().decode("utf-8"), commit_file.read())
	except BaseException:
		return True

def perform_diff(a, b):
	return str(a).strip() == str(b).strip()

def fetch_components():
	upgradable = []
	for componentname in which_installed():
		if not componentname in COMPONENTS:
			print(f"Not found component {componentname}!")
			continue
		if not fetch_component(COMPONENTS[componentname]):
			upgradable.append(componentname)
	return upgradable

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
	preffered = which_installed()
	if not "declarations" in preffered:
		preffered.append("declarations")
	if not "java" in preffered:
		preffered.append("java")
	try:
		import shutil
		if shutil.which("adb") is None and not "adb" in preffered:
			preffered.append("adb")
	except BaseException:
		pass
	components = put_components(preffered)
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
		shell.leave()
		return print()
	print()
	username = shell.get_interactable("user").read()
	if ensure_not_whitespace(username) is not None:
		print("Who are you?", f"\x1b[2m{username}\x1b[0m")
		TOOLCHAIN_CONFIG.set_value("template.author", username)
		TOOLCHAIN_CONFIG.save()
	installation = resolve_components(shell.interactables)
	if len(installation) > 0:
		print("Which components will be installed? ", "\x1b[2m", ", ".join(installation), "\x1b[0m", sep="")
		install_components(installation)

def foreign():
	print("Which components will be upgraded?", end="")
	shell = SelectiveShell(lines_per_page=min(len(COMPONENTS), 9))
	shell.interactables += put_components(which_installed())
	shell.interactables.append(Interrupt())
	try:
		shell.loop()
	except KeyboardInterrupt:
		shell.leave()
		print()
		return 0
	installation = resolve_components(shell.interactables)
	if len(installation) > 0:
		print("Which components will be upgraded? ", "\x1b[2m", ", ".join(installation), "\x1b[0m", sep="")
		install_components(installation)
	else:
		print("Nothing to perform.")
	return 0


if __name__ == "__main__":
	if "--help" in sys.argv:
		print("Usage: component.py <options> [components]")
		print(" " * 2 + "--startup: Startup configuration instead of component installation.")
		exit(0)
	if "--startup" in sys.argv or "-s" in sys.argv:
		startup()
	else:
		foreign()
