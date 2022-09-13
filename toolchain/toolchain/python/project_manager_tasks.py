from os.path import exists, join
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
    isClient = input("It will be client side [y/N]: ")

    if folder == "":
        folder = def_folder

    if version == "":
        version = "1.0"

    if isClient.lower() == "y":
        isClient = True
    else:
        isClient = False

    i = projectManager.createProject(name,
        folder = folder,
        author = author,
        version = version,
        description = description,
        client = isClient)

    return folder if returnFolder else i

def setup_launcher_js(make_obj, path):
    with open(join(path, "launcher.js"), 'w') as file:
        file.write("""ConfigureMultiplayer({
    name: \"""" + make_obj["info"]["name"] + """\",
    version: \"""" + make_obj["info"]["version"] + """\",
    isClientOnly: """ + ("true" if make_obj["info"]["client"] else "false") + """
});

Launch();
""")
