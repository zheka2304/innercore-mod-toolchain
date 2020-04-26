import shutil
import os
import os.path
import sys

from distutils.dir_util import copy_tree
from subprocess import call
import platform


def get_python():
    if platform.system() == "Windows":
        return "python"
    else:
        return "python3"


def copytree(src, dst, symlinks=False, ignore=None):
    if not os.path.exists(src) or os.path.isfile(src):
        raise Exception()
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.exists(d):
            continue
        if os.path.isdir(s):
            shutil.copytree(s, d, symlinks, ignore)
        else:
            shutil.copy2(s, d)


def download_and_extract_toolchain(directory):
    import urllib.request
    import zipfile
    archive = os.path.join(directory, 'toolchain.zip')

    if not os.path.exists(archive):
        url = "https://codeload.github.com/zheka2304/innercore-mod-toolchain/zip/master"
        print("downloading toolchain archive from " + url)
        urllib.request.urlretrieve(url, archive)
    else: 
        print("toolchain archive already exists in " + directory)

    print("extracting toolchain to " + directory)

    with zipfile.ZipFile(archive, 'r') as zip_ref:
        zip_ref.extractall(directory)

    try:
        copytree(os.path.join(directory, "innercore-mod-toolchain-master/toolchain-mod"), directory)
        shutil.rmtree(os.path.join(directory, "innercore-mod-toolchain-master"))
    except Exception as ex: 
        pass
    finally:
        if not os.path.exists(os.path.join(directory, "toolchain")):
            print("an error occured while extracting toolchain archive, please, retry the operation")
            os.remove(archive)
            exit()


if(len(sys.argv) > 1):
    directory = sys.argv[1]
    os.makedirs(directory)
else: 
    directory = '.'

download_and_extract_toolchain(directory)

setup_script = os.path.join(directory, "toolchain", "python", "setup.py")
call(get_python() + " " + setup_script + " " + directory + " " + os.path.join(directory, "project.back"), shell=True)