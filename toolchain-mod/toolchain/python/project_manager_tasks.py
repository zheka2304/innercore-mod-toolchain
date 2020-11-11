#project_manager_tasks
import os.path
from project_manager import projectManager, NameToFolderName

def create_project(returnFolder = False):
    name = input("Enter project name: ")

    def_folder = NameToFolderName(name)
    i = 1
    while(os.path.exists(projectManager.config.get_path(def_folder))):
        def_folder = NameToFolderName(name) + str(i)
        i += 1

    folder = input("Enter project folder [" + def_folder + "]: ")
    while(folder != "" and os.path.exists(projectManager.config.get_path(folder))):
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

