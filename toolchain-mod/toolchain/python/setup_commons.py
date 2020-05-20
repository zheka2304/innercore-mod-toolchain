import os

from utils import clear_directory, copy_directory, ensure_directory, copy_file
import zipfile


def init_java_and_native(make_file, directory):
    compile_dirs = []

    src_dir = os.path.join(directory, "src")

    sample_native_module = os.path.join(src_dir, "native", "sample")
    if not os.path.exists(sample_native_module):
        print("native sample module is unavailable")

    else:
        res = input("Do you want to initialize a new native directory? [y/N]: ")
        if res.lower() == 'y':
            module_name = input("Enter the new native module name [sample]: ")
            if module_name != "":
                os.rename(sample_native_module,
                    os.path.join(src_dir, "native", module_name))
        else:
            if(os.path.isdir(sample_native_module)):
                clear_directory(sample_native_module)


    sample_java_archive = os.path.join(src_dir, "java.zip")
    if(not os.path.exists(sample_java_archive)):
        print("java sample module is unavailable")
    else: 
        res = input("Do you want to initialize a new java directory? [y/N]: ")
        if res.lower() == 'y':
            module_name = input("Enter the new java module name [sample]: ")
            if module_name == "":
                module_name = "sample"

            with zipfile.ZipFile(sample_java_archive, 'r') as zip_ref:
                zip_ref.extractall(os.path.join(src_dir))

            os.rename(os.path.join(src_dir, "java", "sample"),
                os.path.join(src_dir, "java", module_name))

            # write info to .classpath
            import xml.etree.ElementTree as etree
            classpath = os.path.join(directory, ".classpath")
            tree = etree.parse(classpath)
            for classpathentry in tree.getroot():
                if(classpathentry.attrib["kind"] == "src"):
                    classpathentry.attrib["path"] = "src/java/" + module_name + "/src"

            tree.write(classpath, encoding="utf-8", xml_declaration=True)
            
        else:
            if(os.path.isfile(sample_java_archive)):
                os.remove(sample_java_archive)


def ensure_typescript():
    print("Updating typescript version")
    os.system("npm install -g typescript")


def get_language():
    if get_language.language == "":
        res = input("Do you want to enable Typescript and ES6+ support (requires node.js to build project)? [Y/n]")
        if res.lower() == "n": 
            get_language.language = "javascript"
        else:
            get_language.language = "typescript"
            ensure_typescript()

    return get_language.language
get_language.language = ""


def cleanup_if_required(directory):
    res = input("Do you want to clean up the project? [Y/n]: ")
    if res.lower() == 'n':
        return

    to_remove = [
        "toolchain-setup.py",
        "toolchain-import.py",
        "toolchain.zip"
    ]
    for f in to_remove:
        path = os.path.join(directory, f)
        if(os.path.exists(path)):
            os.remove(path)


def init_adb(make_file, dirname):
    pack_name = input("Enter your pack directory name [Inner_Core]: ")
    if pack_name == "":
        pack_name = "Inner_Core"

    make_file["make"]["pushTo"] = "storage/emulated/0/games/horizon/packs/" + pack_name + "/innercore/mods/" + dirname



