import os
import os.path
import json

from make_config import make_config
from utils import copy_directory


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


projectManager = ProjectManager(make_config)
