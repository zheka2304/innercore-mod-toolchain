import os
import os.path
import sys
import json
from os import getcwd

from base_config import BaseConfig

from utils import clear_directory, copy_directory, ensure_directory, copy_file
import zipfile

from setup_commons import init_java_and_native, get_language, cleanup_if_required, init_adb



def setup_mod_info(make_file, default_name):
    name = input("Enter project name [" + default_name + "]: ")
    author = input("Enter author name: ")
    version = input("Enter project version [1.0]: ")
    description = input("Enter project description: ")

    if name == "":
        name = default_name

    if version == "":
        version = "1.0"

    make_file["global"]["info"] = {
        "name": name,
        "author": author,
        "version": version,
        "description": description
    }


def init_directories(make_file, directory):
    assets_dir = os.path.join(directory, "src", "assets")
    clear_directory(assets_dir)
    os.makedirs(os.path.join(assets_dir, "gui"))
    os.makedirs(os.path.join(assets_dir, "res", "items-opaque"))
    os.makedirs(os.path.join(assets_dir, "res", "terran-atlas"))
    libs_dir = os.path.join(directory, "src", "lib")
    clear_directory(libs_dir)
    os.makedirs(libs_dir)
    os.makedirs(os.path.join(directory, "src", "preloader"))
    os.makedirs(os.path.join(assets_dir, "resource_packs"))
    os.makedirs(os.path.join(assets_dir, "behavior_packs"))
    with(open(os.path.join(directory, "src", "dev", "header.js"), "w", encoding="utf-8")) as file:
        file.write("")
    make_file["sources"][0]["language"] = get_language()



print("running project setup script")

destination = sys.argv[1]
make_path = os.path.join(destination, "make.json")

if not (os.path.exists(make_path)):
    exit("invalid arguments passed to import script, usage: \r\npython setup.py <destination>")

with open(make_path, "r", encoding="utf-8") as make_file:
    make_obj = json.loads(make_file.read())

if destination == '.':
    dirname = os.path.basename(os.getcwd())
else: 
    dirname = os.path.basename(destination)


init_adb(make_obj, dirname)
print("initializing mod.info")
setup_mod_info(make_obj, dirname)
print("initializing required directories")
init_directories(make_obj, destination)
print("initializing java and native modules")
init_java_and_native(make_obj, destination)
cleanup_if_required(destination)


with open(make_path, "w", encoding="utf-8") as make_file:
    make_file.write(json.dumps(make_obj, indent=" " * 4))

print("project successfully set up")