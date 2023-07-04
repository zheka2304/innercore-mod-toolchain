import sys

if "--help" in sys.argv:
	print("Usage: icmtoolchain [options] ... <task> [options]")
	print(" " * 2 + "--help: Just show this message.")
	print(" " * 2 + "--list: See all availabled tasks.")
	print("Executes declared by @task decorator requested tasks.")
	exit(0)

from .task import TASKS

if "--list" in sys.argv:
	print("All availabled tasks:")
	for name, task in TASKS.items():
		print(" " * 2 + name, end="")
		if task.description:
			print(": " + task.description, end="")
		print()
	exit(0)

argv = sys.argv[1:]

from .parser import parse_arguments
from .shell import abort, error, warn

if len(argv) > 0:
	try:
		targets = parse_arguments(argv, TASKS, lambda name, target, callables: warn(f"* No such task: {name}."))
	except (TypeError, ValueError) as err:
		error(" ".join(argv))
		abort(cause=err)
	tasks = iter(targets.items())
	while True:
		try:
			name, callable = next(tasks)
		except StopIteration:
			break
		else:
			try:
				result = callable()
				if result != 0:
					abort(f"* Task {name} failed with result {result}.", code=result)
			except BaseException as err:
				if isinstance(err, SystemExit):
					raise err
				abort(f"* Task {name} failed with unexpected error!", cause=err)
else:
	print("* No tasks to execute.")

from .task import unlock_all_tasks

unlock_all_tasks()
