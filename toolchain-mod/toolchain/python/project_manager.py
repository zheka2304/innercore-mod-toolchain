import os
import os.path
import json

from make_config import make_config
from utils import copy_directory, clear_directory


def NameToFolderName(str):
    return str.replace(":", "-")

class ProjectManager:
    def __init__(self, config):
        self.config = config
        self.root_dir = config.root_dir
        self.__projects = []
        for _dir in os.listdir(config.root_dir):
            path = os.path.join(config.root_dir,  _dir, "make.json")
            if os.path.exists(path) and os.path.isfile(path):
                self.__projects.append(_dir)
    
    def createProject(self, name, author = "", version = "1.0", description = "", folder = None):
        if folder == None:
            folder = NameToFolderName(name)

        path = os.path.join(self.root_dir, folder)
        if os.path.exists(path):
            raise IOError(f"""Folder "{folder}" exists""")

        os.mkdir(path)
        copy_directory(self.config.get_path("toolchain/simple-project"), path, True)
        
        make_path = os.path.join(path, "make.json")
        with open(make_path, "r", encoding="utf-8") as make_file:
            make_obj = json.loads(make_file.read())
        
        make_obj['info']["name"] = name
        make_obj['info']["author"] = author
        make_obj['info']["version"] = version
        make_obj['info']["description"] = description
        
        with open(make_path, "w", encoding="utf-8") as make_file:
	        make_file.write(json.dumps(make_obj, indent=" " * 4))

        vsc_settings_path = self.config.get_path(".vscode/settings.json")
        with open(vsc_settings_path, "r", encoding="utf-8") as vsc_settings_file:
            vsc_settings_obj = json.loads(vsc_settings_file.read())

        vsc_settings_obj["files.exclude"][folder] = True
        self.__projects.append(folder)
        with open(vsc_settings_path, "w", encoding="utf-8") as vsc_settings_file:
	        vsc_settings_file.write(json.dumps(vsc_settings_obj, indent=" " * 4))

    def getFolder(self, index = None, folder = None):
        if index == None:
            if folder == None:
                raise ValueError("index or folder must be specified")
            else:
                index = next((i for i, x in enumerate(self.__projects) if x.lower() == folder.lower()), -1)
        
        folder = self.__projects[index]

        return [index, folder]

    def removeProject(self, index = None, folder = None):
        if len(self.__projects) == 1:
            raise Exception("Unable to delete a single project")

        index, folder = self.getFolder(index, folder)
        
        if folder == self.config.get_value("currentProject"):
            raise Exception("The current project cannot be deleted")
        
        clear_directory(self.config.get_path(folder))
        del self.__projects[index]

        vsc_settings_path = self.config.get_path(".vscode/settings.json")
        with open(vsc_settings_path, "r", encoding="utf-8") as vsc_settings_file:
            vsc_settings_obj = json.loads(vsc_settings_file.read())

        del vsc_settings_obj["files.exclude"][folder]
        with open(vsc_settings_path, "w", encoding="utf-8") as vsc_settings_file:
	        vsc_settings_file.write(json.dumps(vsc_settings_obj, indent=" " * 4))

    def selectProject(self, index = None, folder = None):
        if len(self.__projects) == 1:
            raise Exception("Only one project created.")

        index, folder = self.getFolder(index, folder)

        vsc_settings_path = self.config.get_path(".vscode/settings.json")
        with open(vsc_settings_path, "r", encoding="utf-8") as vsc_settings_file:
            vsc_settings_obj = json.loads(vsc_settings_file.read())

        vsc_settings_obj["files.exclude"][self.config.get_value("currentProject")] = True
        vsc_settings_obj["files.exclude"][folder] = False

        with open(vsc_settings_path, "w", encoding="utf-8") as vsc_settings_file:
	        vsc_settings_file.write(json.dumps(vsc_settings_obj, indent=" " * 4))

        make_path = self.config.get_path("make.json")
        with open(make_path, "r", encoding="utf-8") as make_file:
	        make_obj = json.loads(make_file.read())

        make_obj['currentProject'] = folder

        with open(make_path, "w", encoding="utf-8") as make_file:
	        make_file.write(json.dumps(make_obj, indent=" " * 4))
        
    def countProjects(self):
        return len(self.__projects)
        
    def printListProjects(self, title = "List of projects"):
        print(title)

        l = self.countProjects()
        i = 0

        id_length = len(str(l))
        print("№".ljust(id_length) + " | Name folder")
        
        while(i < l):
            s = str(i+1).ljust(id_length) + " | " + self.__projects[i]
            print(s)
            i += 1

projectManager = ProjectManager(make_config)