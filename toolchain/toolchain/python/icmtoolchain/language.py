from os.path import isdir
from typing import Callable, Dict

from .base_config import BaseConfig
from .shell import warn
from .utils import RuntimeCodeError


def get_language_directories(compile_type: str, properties_merger: Callable, language_config: BaseConfig) -> Dict[str, BaseConfig]:
	from . import GLOBALS

	directories = language_config.get_list("directories", config=True)
	if len(directories) == 0:
		# Obtain directories from deprecated `compile` property.
		directories = GLOBALS.MAKE_CONFIG.get_filtered_list("compile", "type", (compile_type), config=True)
	configurables = dict()
	if len(directories) == 0:
		return configurables
	language_config.remove_value("directories")

	for directory in directories:
		config = None

		if isinstance(directory, BaseConfig):
			directory.prototype = config
			config = directory
			if directory.has_value("path"):
				directory = directory.get_value("path")
			elif directory.has_value("source"):
				directory = directory.get_value("source")
		if not isinstance(directory, str):
			raise RuntimeCodeError(1, f"Wrong declared {compile_type} directory {directory!r}, it should be path string or object with `path` property!")

		for flattened_directory in GLOBALS.MAKE_CONFIG.get_paths(directory):
			absolute_directory = GLOBALS.MAKE_CONFIG.get_absolute_path(flattened_directory)
			if not isdir(absolute_directory):
				warn(f"* Skipped non-existing {compile_type} directory {directory!r}!")
				continue
			if absolute_directory in configurables:
				warn(f"* Duplicated {compile_type} directory {directory!r}, overriding existing properties...")

			config = properties_merger(config, language_config)
			config.set_value("directory", GLOBALS.MAKE_CONFIG.get_relative_path(flattened_directory))
			configurables[absolute_directory] = config

	return configurables
