import os
from os.path import join, exists
import json
import urllib.request as request
from datetime import datetime, timezone

import utils
from make_config import make_config


date_format = "%Y-%m-%dT%H:%M:%SZ"
last_update_path = make_config.get_path("toolchain/bin/.last_update")

def set_last_update():
    with open(last_update_path, "w", encoding="utf-8") as last_update_file:
        last_update_file.write(datetime.now(timezone.utc).strftime(date_format))

def download_and_extract_toolchain(directory):
    import zipfile
    archive = join(directory, 'toolchain.zip')

    if not exists(archive):
        url = "https://codeload.github.com/zheka2304/innercore-mod-toolchain/zip/master"
        print("downloading toolchain archive from " + url)
        request.urlretrieve(url, archive)
    else: 
        print("toolchain archive already exists in " + directory)

    print("extracting toolchain to " + directory)

    with zipfile.ZipFile(archive, 'r') as zip_ref:
        zip_ref.extractall(directory)

    try:
        utils.copy_directory(join(directory, "innercore-mod-toolchain-master/toolchain"), directory, ignore = ["toolchain.json", "*/adb/*"], ignoreEx = True)
        utils.clear_directory(join(directory, "innercore-mod-toolchain-master"))
    except Exception as ex: 
        print(ex)
    finally:
        os.remove(archive)
        if not exists(join(directory, "toolchain")):
            print("an error occured while extracting toolchain archive, please, retry the operation")
            exit()

def update():
    print("Getting information about your latest update...")

    if exists(last_update_path):
        with open(last_update_path, "r", encoding="utf-8") as last_update_file:
            last_update = datetime.strptime(last_update_file.read(), date_format)

        print("Getting information about public latest update...")
        response = request.urlopen("https://api.github.com/repos/zheka2304/innercore-mod-toolchain/branches/master")
        last_update_repo = datetime.strptime(json.loads(response.read())['commit']['commit']['committer']['date'], date_format)

        if last_update_repo <= last_update:
            print("You have the latest version.")
            return 0
    else:
        print("No information was found for your last update.")

    d = input("Download last update? [Y/n]: ")
    if d.lower() == "n":
        return 0

    download_and_extract_toolchain(make_config.root_dir)

    set_last_update()

    print("Update installed!")


if __name__ == '__main__':
    update()
