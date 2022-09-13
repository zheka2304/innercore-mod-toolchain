import os
from os.path import join, basename, exists
import json
import sys
import platform

from setup_commons import init_adb, init_directories, init_java_and_native, cleanup_if_required
from project_manager_tasks import setup_launcher_js
from update import set_last_update


def setup_mod_info(make_file=None):
	from project_manager import projectManager
	from project_manager_tasks import create_project
	projectManager.selectProject(index = create_project())


print("running project setup script")

destination = sys.argv[1]
make_path = join(destination, "make.json")

if not exists(make_path):
	exit("invalid arguments passed to import script, usage: \r\n" + ("python" if platform.system() == "Windows" else "python3") + " setup.py <destination>")

with open(make_path, "r", encoding="utf-8") as make_file:
	make_obj = json.loads(make_file.read())

if destination == '.':
	dirname = basename(os.getcwd())
else: 
	dirname = basename(destination)

init_adb(make_obj, dirname)
print("initializing project and mod.info")
setup_mod_info(make_obj)
print("initializing required directories")
init_directories(destination)
print("initializing java and native modules")
init_java_and_native(make_obj, destination)
setup_launcher_js(make_obj, destination)
cleanup_if_required(destination)

with open(make_path, "w", encoding="utf-8") as make_file:
	make_file.write(json.dumps(make_obj, indent=" " * 4))

set_last_update()
print("project successfully set up")
