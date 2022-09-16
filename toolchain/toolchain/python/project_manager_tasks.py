from os.path import exists, join

from shell import SelectionShell
from project_manager import projectManager

def create_project(returnFolder = False):
	if not exists(projectManager.config.get_path("../toolchain-mod")):
		raise RuntimeError("Not found ../toolchain-mod template, nothing to do.")

	name = input("Enter project name: ")

	if name == "":
		print("New project will not be created.")
		exit(0)

	def_folder = name.replace(":", "-")
	i = 1
	while exists(projectManager.config.get_path(def_folder)):
		def_folder = name.replace(":", "-") + str(i)
		i += 1

	folder = input("Enter project folder [" + def_folder + "]: ")
	if folder == "":
		folder = def_folder
	while exists(projectManager.config.get_path(folder)):
		print(f"""Folder "{folder}" already exists!""")
		folder = input("Enter project folder [" + def_folder + "]: ")
		if folder == "":
			folder = def_folder

	author = input("Enter author name: ")
	version = input("Enter project version [1.0]: ")
	description = input("Enter project description: ")
	is_client = input("It will be client side? [y/N]: ")

	if folder == "":
		folder = def_folder
	if version == "":
		version = "1.0"
	is_client = is_client.lower() is "y"

	index = projectManager.create_project(
		name,
		folder = folder,
		author = author,
		version = version,
		description = description,
		client = is_client
	)

	return folder if returnFolder else index

def setup_launcher_js(make_obj, path):
	with open(join(path, "launcher.js"), "w") as file:
		file.write("""ConfigureMultiplayer({
	name: \"""" + make_obj["info"]["name"] + """\",
	version: \"""" + make_obj["info"]["version"] + """\",
	isClientOnly: """ + ("true" if make_obj["info"]["client"] else "false") + """
});

Launch();
""")

def select_project(variants, prompt = "Which project do you want?", selected = None):
	shell = SelectionShell(prompt)
	for variant in variants:
		shell.variant(variant, variant if selected != variant else f"\x1b[92m{variant}\x1b[0m")
	try:
		shell.loop()
	except KeyboardInterrupt:
		return None
	return shell.what()
