import sys

if "--help" in sys.argv:
	print("Usage: icmtoolchain <tasks> @ [arguments]")
	print(" " * 2 + "--help: Just show this message.")
	print(" " * 2 + "--list: See all availabled tasks.")
	print("Executes declared by @task annotation required tasks.")
	exit(0)

from .task import descriptioned_tasks, registered_tasks

if "--list" in sys.argv:
	print("All availabled tasks:")
	for name in registered_tasks:
		print(" " * 2 + name, end="")
		if name in descriptioned_tasks:
			print(": " + descriptioned_tasks[name], end="")
		print()
	exit(0)

argv = sys.argv[1:]

# Anything after "@" passes as global arguments
if "@" in argv:
	where = argv.index("@")
	args = argv[where + 1:]
	argv = argv[:where]
else:
	args = None

from .shell import abort, warn

if len(argv) > 0:
	for task_name in argv:
		if task_name in registered_tasks:
			try:
				result = registered_tasks[task_name](args)
				if result != 0:
					abort(f"* Task {task_name} failed with result {result}.", code=result)
			except BaseException as err:
				if isinstance(err, SystemExit):
					raise err
				abort(f"* Task {task_name} failed with unexpected error!", cause=err)
		else:
			warn(f"* No such task: {task_name}.")
else:
	print("* No tasks to execute.")

from .task import unlock_all_tasks

unlock_all_tasks()
