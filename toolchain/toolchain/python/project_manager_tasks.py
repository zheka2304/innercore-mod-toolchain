from os.path import exists
from project_manager import projectManager, NameToFolderName


def create_project(returnFolder=False):
    if not exists(projectManager.config.get_path("../toolchain-mod")):
        raise RuntimeError("Not found ../toolchain-mod template, nothing to do.")

    name = input("Enter project name: ")

    if name == "":
        print("New project will not be created.")
        exit(0)

    def_folder = NameToFolderName(name)
    i = 1
    while exists(projectManager.config.get_path(def_folder)):
        def_folder = NameToFolderName(name) + str(i)
        i += 1

    folder = input("Enter project folder [" + def_folder + "]: ")
    while folder != "" and exists(projectManager.config.get_path(folder)):
        print(f"""Folder "{folder}" exist""")
        folder = input("Enter project folder [" + def_folder + "]: ")

    author = input("Enter author name: ")
    version = input("Enter project version [1.0]: ")
    description = input("Enter project description: ")

    if folder == "":
        folder = def_folder

    if version == "":
        version = "1.0"

    i = projectManager.createProject(name,
        folder = folder,
        author = author,
        version = version,
        description = description)

    return folder if returnFolder else i
