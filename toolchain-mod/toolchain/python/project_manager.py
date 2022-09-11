import os
import os.path
import json

from make_config import make_config

class ProjectManager:
    def __init__(self, config):
        self.config = config
        self.root_dir = config.root_dir
        self.__projects = []
        for _dir in os.listdir(config.root_dir):
            path = os.path.join(config.root_dir,  _dir, "make.json")
            if os.path.exists(path) and os.path.isfile(path):
                self.__projects.append(_dir)
    
    def createProject(self, name, author = "", version = "", description = "", folder = None):
        if folder == None:
            folder = name.replace(":", "-")
        
        os.mkdir()
        print(folder)


projectManager = ProjectManager(make_config)
projectManager.createProject("RecipeTELib 2.0")
