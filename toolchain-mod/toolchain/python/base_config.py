import json
import os
import os.path


class BaseConfig:
	def __init__(self, _json):
		self.json = _json

	def get_value(self, name, fallback=None):
		name = name.split(".")
		value = self.json
		while len(name) > 0 and len(name[0]) > 0:
			key = name.pop(0)
			if key in value:
				value = value[key]
			else:
				return fallback
		return value

	def get_config(self, name, not_none=False):
		value = self.get_value(name)
		if isinstance(value, dict):
			return BaseConfig(value)
		else:
			return BaseConfig({}) if not_none else None

	def get_filtered_list(self, name, prop, values):
		value = self.get_value(name)
		if isinstance(value, list):
			filtered = []
			for obj in value:
				if isinstance(obj, dict) and prop in obj and obj[prop] in values:
					filtered.append(obj)
			return filtered
		else:
			return []