import os
from os.path import join, exists, isfile, isdir
import sys
import shutil
from subprocess import call
import platform


def get_python():
    if platform.system() == "Windows":
        return "python"
    else:
        return "python3"

def copytree(src, dst, symlinks=False, ignore=None):
    if not exists(src) or isfile(src):
        raise Exception()
    for item in os.listdir(src):
        s = join(src, item)
        d = join(dst, item)
        if exists(d):
            continue
        if isdir(s):
            shutil.copytree(s, d, symlinks, ignore)
        else:
            shutil.copy2(s, d)

def download_and_extract_toolchain(directory):
    from urllib.request import urlretrieve
    import zipfile
    archive = join(directory, 'toolchain.zip')

    if not exists(archive):
        url = "https://codeload.github.com/zheka2304/innercore-mod-toolchain/zip/master"
        print("downloading toolchain archive from " + url)
        urlretrieve(url, archive)
    else: 
        print("toolchain archive already exists in " + directory)

    print("extracting toolchain to " + directory)

    with zipfile.ZipFile(archive, 'r') as zip_ref:
        zip_ref.extractall(directory)

    try:
        copytree(join(directory, "innercore-mod-toolchain-master/toolchain"), directory)
        shutil.rmtree(join(directory, "innercore-mod-toolchain-master"))
    except Exception as ex: 
        pass
    finally:
        if not exists(join(directory, "toolchain")):
            print("an error occured while extracting toolchain archive, please, retry the operation")
            os.remove(archive)
            exit()


if len(sys.argv) > 1:
    directory = sys.argv[1]
    os.makedirs(directory)
else: 
    directory = '.'

download_and_extract_toolchain(directory)
setup_script = join(directory, "toolchain", "python", "setup.py")

call([
    get_python(),
    setup_script,
    directory,
    join(directory, "project.back")
], shell=True)
