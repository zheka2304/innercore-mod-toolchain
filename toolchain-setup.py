import sys
import os
from os.path import join, exists, isfile, isdir
import shutil
import urllib.request as request

def copy_directory(src, dst, symlinks = False, ignore = None):
    if not exists(src) or isfile(src):
        raise Exception()
    for item in os.listdir(src):
        s = join(src, item)
        d = join(dst, item)
        if exists(d):
            continue
        if isdir(s):
            shutil.copytree(s, d, symlinks, ignore)
        elif not item in ignore:
            shutil.copy2(s, d)

def download_and_extract_toolchain(directory):
    import zipfile
    archive = join(directory, "toolchain.zip")

    if not exists(archive):
        url = "https://codeload.github.com/zheka2304/innercore-mod-toolchain/zip/master"
        print("Downloading Inner Core Mod Toolchain: " + url)
        request.urlretrieve(url, archive)
    else: 
        print("'toolchain.zip' already exists in '" + directory + "'")

    print("Extracting into '" + directory + "'...")

    with zipfile.ZipFile(archive, "r") as zip_ref:
        zip_ref.extractall(directory)

    timestamp = "unknown"
    try:
        copy_directory(join(directory, "innercore-mod-toolchain-master"), "toolchain", False, ["toolchain-setup.py"])
        shutil.rmtree(join(directory, "innercore-mod-toolchain-master"))
    except Exception as err:
        print(err)
        print("Inner Core Mod Toolchain installation not completed due to above error.")
        exit(1)
    finally:
        os.remove(archive)
        if not exists(join(directory, "toolchain")):
            print("Inner Core Mod Toolchain extracted '/toolchain' folder not found.")
            print("Retry operation or extract 'toolchain.zip' manually.")
            exit(2)

    print("Installed into '" + directory + "' under '" + timestamp + "' revision.")


download_and_extract_toolchain(".")
