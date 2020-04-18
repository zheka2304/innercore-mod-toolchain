import sys
import os
import re
import os.path
import subprocess

from make_config import make_config


def list_subdirectories(path, max_depth=5, dirs=None):
    if dirs is None:
        dirs = []
    dirs.append(path)
    for f in os.listdir(path):
        file = os.path.join(path, f)
        if max_depth > 0 and os.path.isdir(file):
            list_subdirectories(file, dirs=dirs, max_depth=max_depth - 1)
    return dirs


def search_ndk_path(home_dir):
    preferred_ndk_versions = [
        "android-ndk-r16b",
        "android-ndk-.*",
        "ndk-bundle"
    ]
    possible_ndk_dirs = list_subdirectories(os.path.join(home_dir, "Android"))
    for ndk_dir_regex in preferred_ndk_versions:
        compiled_pattern = re.compile(ndk_dir_regex)
        for possible_ndk_dir in possible_ndk_dirs:
            if re.findall(compiled_pattern, possible_ndk_dir):
                return possible_ndk_dir


def get_ndk_path():
    path_from_config = make_config.get_value("make.ndkPath")
    if path_from_config is not None:
        return path_from_config
    # linux
    try:
        return search_ndk_path(os.environ['HOME'])
    except KeyError:
        pass
    # windows
    return search_ndk_path(os.getenv("LOCALAPPDATA"))


def search_for_gcc_executable(ndk_dir):
    search_dir = os.path.join(ndk_dir, "bin")
    if os.path.isdir(search_dir):
        pattern = re.compile("[0-9A-Za-z]*-linux-android(eabi)*-g\\+\\+.*")
        for file in os.listdir(search_dir):
            if re.match(pattern, file):
                return os.path.abspath(os.path.join(search_dir, file))


def require_compiler_executable(arch, install_if_required=False):
    ndk_dir = make_config.get_path("toolchain/ndk/" + str(arch))
    file = search_for_gcc_executable(ndk_dir)
    if install_if_required:
        install(arch=arch, reinstall=False)
        if file is None or not os.path.isfile(file):
            print("ndk installation is broken, trying to re-install")
            install(arch=arch, reinstall=True)
            file = search_for_gcc_executable(ndk_dir)
            if file is None or not os.path.isfile(file):
                print("re-install haven't helped")
                return None
        return file
    else:
        return file


def check_installed(arch):
    return os.path.isfile(make_config.get_path("toolchain\\ndk\\.installed-" + str(arch)))


def install(arch="arm", reinstall=False):
    if not reinstall and check_installed(arch):
        print("toolchain for " + arch + " is already installed, installation skipped")
        return True
    else:
        ndk_path = get_ndk_path()
        if ndk_path is None:
            print("failed to get ndk path")

        result = subprocess.call([
            "python",
            os.path.join(os.path.join(ndk_path, "build\\tools\\make_standalone_toolchain.py")),
            "--arch", str(arch),
            "--install-dir", make_config.get_path("toolchain\\ndk\\" + str(arch)),
            "--force"
        ])

        if result == 0:
            open(make_config.get_path("toolchain\\ndk\\.installed-" + str(arch)), 'tw').close()
            return True
        else:
            print("installation failed with result code:", result)
            return False


if __name__ == "__main__":
    if len(sys.argv) >= 2:
        install(arch=sys.argv[1])
    else:
        install()
