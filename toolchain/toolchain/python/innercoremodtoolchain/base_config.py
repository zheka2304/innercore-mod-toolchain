class BaseConfig:
	def __init__(self, json, base = None):
		self.json = json
		self.prototype = base

	def get_value(self, name, fallback = None, accept_prototype = True):
		rawname = name.split(".")
		value = self.json
		while len(rawname) > 0 and len(rawname[0]) > 0:
			key = rawname.pop(0)
			if key in value:
				value = value[key]
			elif accept_prototype and self.prototype is not None:
				return self.prototype.get_value(name, fallback)
			else:
				return fallback
		return value

	def set_value(self, name, what):
		rawname = name.split(".")
		value = self.json
		while len(rawname) > 1 and len(rawname[0]) > 0:
			key = rawname.pop(0)
			if not key in value:
				value[key] = {}
			value = value[key]
		if len(rawname[0]) > 0:
			value[rawname.pop()] = what

	def remove_value(self, name):
		rawname = name.split(".")
		value = self.json
		while len(rawname) > 1 and len(rawname[0]) > 0:
			key = rawname.pop(0)
			if not key in value:
				return
			value = value[key]
		if len(rawname[0]) > 0:
			del value[rawname.pop()]
			if value != self.json and len(value) == 0:
				self.remove_value(name.rsplit(".", 1)[0])

	def get_config(self, name, not_none = False):
		value = self.get_value(name)
		if isinstance(value, dict):
			return BaseConfig(value)
		else:
			return BaseConfig({}) if not_none else None

	def get_filtered_list(self, name, prop, values):
		value = self.get_value(name)
		filtered = []
		if isinstance(value, list):
			for obj in value:
				if isinstance(obj, dict) and prop in obj and obj[prop] in values:
					filtered.append(obj)
		return filtered
