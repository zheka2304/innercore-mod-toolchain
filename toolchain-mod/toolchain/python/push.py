import os
import os.path
import subprocess

from make_config import make_config


def get_push_pack_directory():
    directory = make_config.get_value("make.pushTo")
    if directory is None:
        return None
    if "games/horizon/packs" not in directory:
        ans = input(f"push directory {directory} looks suspicious, it does not belong to horizon packs directory, push will corrupt all contents, allow it only if you know what are you doing (type Y or yes to proceed): ")
        if ans.lower() in ["yes", "y"]:
            return directory
        else:
            print("interpreted as NO, aborting push")
            return None
    return directory


def stop_horizon():
    subprocess.call(["adb", "shell", "am", "force-stop", "com.zheka.horizon"])


def push(src, relative_directory, src_relative=False, cleanup=False):
    dst = get_push_pack_directory()
    if dst is None:
        return -1
    stop_horizon()
    dst = os.path.join(dst, relative_directory)
    if cleanup:
        result = subprocess.call(["adb", "shell", "rm", "-r", dst])
        if result != 0:
            print(f"failed to cleanup directory {dst} with code {result}")
            return result
    dst = dst.replace("\\", "/")
    if dst[0] != "/":
        dst = "/" + dst

    src_push = (os.path.join(src, relative_directory) if src_relative else src).replace("\\", "/")
    if src_push[-1] != "/":
        src_push += "/"
    src_push += "."
    cmd = ["adb", "push", src_push, dst]
    result = subprocess.call(cmd)
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
        result = subprocess.call(["adb", "shell", "touch", lock])
        if result != 0:
            return result
    return 0


def push_set_of_paths(path_set, relative_directory, src_relative=False, cleanup=False):
    push_result = 0
    for path in path_set:
        for directory in make_config.get_paths(path):
            if os.path.isdir(directory):
                push_result = push(directory, relative_directory, src_relative=src_relative, cleanup=cleanup)
                cleanup = False
                if push_result != 0:
                    print("failed to push directory", directory)
                    break
            else:
                print("failed to locate directory", path)
                push_result = -1
                break
    return push_result
