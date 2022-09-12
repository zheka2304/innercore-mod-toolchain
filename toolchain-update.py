import os
from os.path import join, exists, isfile, isdir
import sys
import shutil
from datetime import datetime, timezone
import platform


def get_python():
    if platform.system() == "Windows":
        return "python"
    else:
        return "python3"

def indexOf(_list, _value):
	try:
		return _list.index(_value)
	except ValueError:
		return -1

def copytree(src, dst, clear_dst=False, replacement=None, ignore=[], ignore_list=[], ignoreEx=True):
    from glob import glob

    if len(ignore) > 0:
        for i in ignore:
            ignore_list += glob(join(dst, i))

    for item in os.listdir(src):
        s = join(src, item)
        d = join(dst, item)
        if isfile(s) and exists(d) and not replacement:
            continue

        if isdir(s):
            copytree(s, d, clear_dst, replacement, ignore_list=ignore_list, ignoreEx=ignoreEx)
        elif indexOf(ignore_list, d) == -1:
            shutil.copy2(s, d)

def download_and_extract_toolchain(directory):
    from urllib.request import urlretrieve
    import zipfile
    archive = join(directory, 'update.zip')

    if not exists(archive):
        url = "https://codeload.github.com/80LK/innercore-mod-toolchain/zip/master"
        print("downloading toolchain archive from " + url)
        urlretrieve(url, archive)
    else: 
        print("toolchain archive already exists in " + directory)

    print("extracting toolchain to " + directory)

    with zipfile.ZipFile(archive, 'r') as zip_ref:
        zip_ref.extractall(directory)

    try:
        copytree(join(directory, "innercore-mod-toolchain-master/toolchain"), directory, ignore=["toolchain.json", "*/adb/*"])
        shutil.rmtree(join(directory, "innercore-mod-toolchain-master"))
    except Exception as ex: 
        print(ex)
    finally:
        os.remove(archive)
        if not exists(join(directory, "toolchain")):
            print("an error occured while extracting toolchain archive, please, retry the operation")
            exit()


if len(sys.argv) > 1:
    directory = sys.argv[1]
    os.makedirs(directory)
else: 
    directory = '.'

if not exists(join(directory, "toolchain")):
    print("Toolchain not found.")
    exit()

download_and_extract_toolchain(directory)

last_update_path = join(directory, "toolchain", "bin", ".last_update")
with open(last_update_path, "w", encoding="utf-8") as last_update_file:
    last_update_file.write(datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"))

os.remove(join(directory, "toolchain-update.py"))
print("Toolchain successfully updated!")
