import os
import os.path
import subprocess

from make_config import make_config
import glob

# /dev/null
ignore = open(os.devnull, 'w')


def get_push_pack_directory():
    directory = make_config.get_value("make.pushTo")
    if directory is None:
        return None
    if "games/horizon/packs" not in directory:
        ans = input(
            f"push directory {directory} looks suspicious, it does not belong to horizon packs directory, push will corrupt all contents, allow it only if you know what are you doing (type Y or yes to proceed): ")
        if ans.lower() in ["yes", "y"]:
            return directory
        else:
            print("interpreted as NO, aborting push")
            return None
    return directory


def stop_horizon():
    return subprocess.call([make_config.get_adb(), "shell", "am", "force-stop", "com.zheka.horizon"])


def push(src, cleanup=False):
    dst = get_push_pack_directory()
    if dst is None:
        return -1
    result = stop_horizon()

    if result != 0:
        from fancy_output import print_err
        print_err("no devices/emulators found")
        print_err("connect to ADB first")
        return result

#   if cleanup:
#       result = subprocess.call([make_config.get_adb(), "shell", "rm", "-r", dst])
#       if result != 0:
#           print(f"failed to cleanup directory {dst} with code {result}")
#           return result
    dst = dst.replace("\\", "/")
    if dst[0] != "/":
        dst = "/" + dst

    src_push = src.replace("\\", "/")
#   if src_push[-1] != "/":
#       src_push += "/"
#   src_push += "."

    subprocess.call([make_config.get_adb(), "shell", "rm",
                     "-r", dst], stderr=ignore, stdout=ignore)

    files = [file[len(src_push) + 1:].replace("\\", "/")
             for file in glob.glob(f"{src_push}/**/*", recursive=True)]
    file_count = len(files)
    result = 0

    progress = 0
    for file in files:
        source = os.path.join(src_push, file)
        destination = os.path.join(dst, file).replace("\\", "/")

        result += subprocess.call([make_config.get_adb(), "push", source,
                                   destination], stdout=ignore, stderr=subprocess.STDOUT)

        progress += 1
        percent = int(100 * (progress / file_count))

        bar = f"|{'█' * percent}{' ' * (100 - percent)}| {percent}%"
        print(bar, end="\r")

        if file == files[-1]:
            print()


    if result != 0:
        print(f"failed to push to directory {dst} with code {result}")
    return result


def make_locks(*locks):
    dst = get_push_pack_directory()
    if dst is None:
        return -1
    stop_horizon()
    for lock in locks:
        lock = os.path.join(dst, lock).replace("\\", "/")
        result = subprocess.call(
            [make_config.get_adb(), "shell", "touch", lock])
        if result != 0:
            return result
    return 0
