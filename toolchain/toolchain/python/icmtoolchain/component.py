import os
import shutil
import sys
from os.path import isdir, isfile, join
from typing import Dict, Final, List, Optional
from urllib import request
from urllib.error import URLError

from . import colorama
from .make_config import TOOLCHAIN_CONFIG
from .shell import (Input, InteractiveShell, Interrupt, Notice, Progress,
                    SelectiveShell, Separator, Shell, Switch, abort, stringify,
                    warn)
from .utils import (AttributeZipFile, ensure_file_directory,
                    ensure_not_whitespace)


class Component():
	keyword: Final[str]; name: Final[str]; location: Final[str]
	packurl: Final[Optional[str]]; commiturl: Final[Optional[str]]; branch: Final[Optional[str]]

	def __init__(self, keyword: str, name: str, location: str = "", packurl: Optional[str] = None, commiturl: Optional[str] = None, branch: Optional[str] = None):
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

COMPONENTS: Final[Dict[str, Component]] = {
	"adb": Component("adb", "Android Debug Bridge", "toolchain/adb", branch="adb"),
	"declarations": Component("declarations", "TypeScript Declarations", "toolchain/declarations", branch="includes"),
	"java": Component("java", "Java R8/D8 Compiler", "toolchain/bin/r8", branch="r8"),
	"classpath": Component("classpath", "Java Classpath", "toolchain/classpath", branch="classpath"),
	"cpp": Component("cpp", "C++ GCC Compiler (NDK)", "toolchain/ndk"), # native/native_setup.py
	"stdincludes": Component("stdincludes", "C++ Headers", "toolchain/stdincludes", branch="stdincludes")
}

def get_component_switches(installed_keywords: List[str]) -> List[Switch]:
	return [
		Switch("component:" + key, COMPONENTS[key].name, True if key in installed_keywords else False) for key in COMPONENTS
	]

def resolve_selected_components(interactables: List[Shell.Interactable]) -> List[str]:
	keywords = []
	for interactable in interactables:
		if isinstance(interactable, Switch) and interactable.key is not None and interactable.key.startswith("component:") and interactable.checked:
			keywords.append(interactable.key.partition(":")[2])
	return keywords

def which_installed() -> List[str]:
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

def to_megabytes(bytes_count: int) -> str:
	return f"{(bytes_count / 1048576):.1f}MiB"

def download_component(component: Component, shell: Optional[Shell], progress: Optional[Progress]) -> int:
	if not hasattr(component, "packurl") or component.packurl is None:
		Progress.notify(shell, progress, 0, f"Component '{component.keyword}' property 'packurl' must be defined!")
		return 1
	path = TOOLCHAIN_CONFIG.get_path(f"toolchain/temp/{component.keyword}.zip")
	ensure_file_directory(path)
	if isfile(path):
		# TODO: Checking checksum of already downloaded file...
		return 0
	with request.urlopen(component.packurl) as response:
		with open(path, "wb") as archive:
			downloaded = 0
			while True:
				buffer = response.read(8192)
				if not buffer:
					break
				downloaded += len(buffer)
				if shell is not None and progress is not None:
					progress.seek(0.5, f"Downloading ({to_megabytes(downloaded)})")
					shell.render()
				archive.write(buffer)
	Progress.notify(shell, progress, 1, f"Downloaded {to_megabytes(downloaded)}")
	return 0

def extract_component(component: Component, shell: Optional[Shell], progress: Optional[Progress]) -> int:
	temporary = TOOLCHAIN_CONFIG.get_path("toolchain/temp")
	archive_path = join(temporary, component.keyword + ".zip")
	if not isfile(archive_path):
		Progress.notify(shell, progress, 0, f"Component '{component.keyword}' does not found!")
		return 1
	if shell is not None and progress is not None:
		progress.seek(0.33, f"Extracting to {component.location}")
	extract_to = temporary if hasattr(component, "branch") else join(temporary, component.keyword)
	with AttributeZipFile(archive_path, "r") as archive:
		archive.extractall(extract_to)
	if hasattr(component, "branch") and component.branch is not None:
		extract_to = join(extract_to, "innercore-mod-toolchain-" + component.branch)
	if not isdir(extract_to):
		Progress.notify(shell, progress, 0, f"Component '{component.keyword}' does not contain any content!")
		return 2
	output = TOOLCHAIN_CONFIG.get_path(component.location)
	if isdir(output):
		shutil.rmtree(output, ignore_errors=True)
	elif isfile(output):
		shutil.move(output, output + ".bak")
	os.makedirs(output, exist_ok=True)
	shutil.copytree(extract_to, output, dirs_exist_ok=True)
	Progress.notify(shell, progress, 0.66, "Cleaning up")
	shutil.rmtree(extract_to, ignore_errors=True)
	os.remove(archive_path)
	return 0

def install_components(*keywords: str) -> None:
	if len(keywords) == 0:
		return
	shell = InteractiveShell(lines_per_page=max(len(keywords), 9))
	with shell:
		for keyword in keywords:
			if not keyword in COMPONENTS:
				print(f"Component '{keyword}' not availabled!")
				continue
			if keyword == "cpp":
				continue
			component = COMPONENTS[keyword]
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
		if "cpp" in keywords:
			abis = TOOLCHAIN_CONFIG.get_value("abis", [])
			if not isinstance(abis, list):
				abis = []
			abi = TOOLCHAIN_CONFIG.get_value("debugAbi")
			if abi is None and len(abis) == 0:
				abort("Please describe options `abis` or `debugAbi` in your 'toolchain.json' before installing NDK!")
			if abi is not None and not abi in abis:
				abis.append(abi)
			from .native_setup import abi_to_arch, check_installed, install
			abis = list(filter(
				lambda abi: not check_installed(abi_to_arch(abi)),
				abis
			))
			if len(abis) > 0:
				install([
					abi_to_arch(abi) for abi in abis
				], reinstall=True)
		shell.interactables.append(Interrupt())

def fetch_component(component: Component) -> bool:
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
		if hasattr(component, "commiturl") and component.commiturl is not None:
			with open(join(output, ".commit")) as commit_file:
				response = request.urlopen(component.commiturl)
				return perform_diff(response.read().decode("utf-8"), commit_file.read())
	except URLError:
		return True
	return False

def perform_diff(a: object, b: object) -> bool:
	return str(a).strip() == str(b).strip()

def fetch_components() -> List[str]:
	upgradable = []
	for keyword in which_installed():
		if not keyword in COMPONENTS:
			warn(f"* Not found component '{keyword}'!")
			continue
		if not fetch_component(COMPONENTS[keyword]):
			upgradable.append(keyword)
	return upgradable

def get_username() -> Optional[str]:
	username = TOOLCHAIN_CONFIG.get_value("template.author")
	if username is not None:
		return username
	try:
		from getpass import getuser
		return ensure_not_whitespace(getuser())
	except ImportError:
		return None

def startup() -> None:
	print("Welcome to Inner Core Mod Toolchain!", end="")
	shell = SelectiveShell()
	shell.interactables += [
		Separator(),
		Notice("Today we're complete your distribution installation."),
		Notice("Just let realize some things before downloading, and"),
		Notice("modding will be started in a few moments."),
		Separator(),
		Progress(progress=0.2, text=" " + "Howdy!".center(45) + ">")
	]
	shell.interactables += [
		Separator(),
		Input("user", "I'll will be ", template=get_username()),
		Notice("Author name identifies you, it will be used as default"),
		Notice("`author` property when you've starting new project."),
		Separator(),
		Progress(progress=0.4, text="<" + "Who are you?".center(45) + ">")
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
	components = get_component_switches(preffered)
	interactables: List[Shell.Interactable] = [
		Notice("Which components will be installed?")
	]
	component = 0
	index = len(interactables)

	while True:
		if index % shell.lines_per_page == shell.lines_per_page - 1:
			interactables.append(Progress(progress=0.6, text="<" + "Configure your toolchain".center(45) + ">"))
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
	shell.interactables.extend(interactables)
	try:
		import shutil
		tsc = shutil.which("tsc") is not None
	except BaseException:
		tsc = False

	shell.interactables += [
		Separator(),
		Switch("typescript", "I'll want to build everything with TypeScript", tsc),
		Switch("composite", "I've allow building separate files with each other", tsc),
		Switch("references", "I'm preffer using few script directories in project", False),
		Separator(),
		Progress(progress=0.8, text="<" + "Composite performance".center(45) + "+")
	]
	shell.interactables.append(Interrupt())
	try:
		shell.loop()
	except KeyboardInterrupt:
		shell.leave()
		print(); return
	print()

	username = ensure_not_whitespace(shell.get_interactable("user", Input).read())
	if username is not None:
		print("Who are you?", stringify(username, color=colorama.Style.DIM, reset=colorama.Style.NORMAL))
		TOOLCHAIN_CONFIG.set_value("template.author", username)

	typescript = shell.get_interactable("typescript", Switch).checked
	if typescript:
		print("You'll want to build everything with TypeScript")
		TOOLCHAIN_CONFIG.set_value("denyJavaScript", typescript)

	composite = shell.get_interactable("composite", Switch).checked
	if not composite:
		print("You've denied building separate files with each other")
		TOOLCHAIN_CONFIG.set_value("project.composite", composite)

	references = shell.get_interactable("references", Switch).checked
	if references:
		print("You're preffer using few script directories in project")
		TOOLCHAIN_CONFIG.set_value("project.useReferences", references)

	TOOLCHAIN_CONFIG.save()

	pending = resolve_selected_components(shell.interactables)
	if len(pending) > 0:
		print("Which components will be installed?", stringify(", ".join(pending), color=colorama.Style.DIM, reset=colorama.Style.NORMAL))
		install_components(*pending)

def upgrade() -> int:
	print("Which components will be upgraded?", end="")
	shell = SelectiveShell(lines_per_page=min(len(COMPONENTS), 9))
	shell.interactables += get_component_switches(which_installed())
	shell.interactables.append(Interrupt())
	try:
		shell.loop()
	except KeyboardInterrupt:
		print(); return 1
	installed = resolve_selected_components(shell.interactables)
	if len(installed) > 0:
		print("Which components will be upgraded?", stringify(", ".join(installed), color=colorama.Style.DIM, reset=colorama.Style.NORMAL))
		install_components(*installed)
	else:
		print("Nothing to perform.")
	return 0


if __name__ == "__main__":
	if "--help" in sys.argv:
		print("Usage: python component.py [options] <components>")
		print(" " * 2 + "--startup: Startup configuration instead of component installation.")
		exit(0)
	if "--startup" in sys.argv or "-s" in sys.argv:
		startup()
	else:
		upgrade()
