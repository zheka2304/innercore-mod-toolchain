import sys

if "--help" in sys.argv or len(sys.argv) <= 1:
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

from time import time

startup_millis = time()
argv = sys.argv[1:]

from .parser import parse_arguments
from .shell import abort, debug, error, warn

try:
	targets = parse_arguments(argv, TASKS, lambda name, target, callables: warn(f"* No such task: {name}."))
except (TypeError, ValueError) as err:
	error(" ".join(argv))
	abort(cause=err)

anything_performed = False
tasks = iter(targets)
while True:
	try:
		callable = next(tasks)
	except StopIteration:
		break
	else:
		try:
			result = callable.callable()
			if result != 0:
				abort(f"* Task {callable.name} failed with result {result}.", code=result)
		except BaseException as err:
			if isinstance(err, SystemExit):
				raise err
			abort(f"* Task {callable.name} failed with unexpected error!", cause=err)
		anything_performed = True

if not anything_performed:
	debug("* No tasks to execute.")
	exit(0)

from .task import unlock_all_tasks

unlock_all_tasks()
startup_millis = time() - startup_millis
debug(f"* Tasks successfully completed in {startup_millis:.2f}s!")
