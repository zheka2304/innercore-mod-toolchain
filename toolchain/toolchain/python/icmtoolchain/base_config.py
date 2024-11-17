import re
from typing import Any, Dict, List, Optional


class BaseConfig:
	json: Dict[Any, Any]
	prototype: Optional['BaseConfig']

	def __init__(self, json: Dict[Any, Any], base: Optional['BaseConfig'] = None) -> None:
		self.json = json
		self.prototype = base

	def has_value(self, name: str, accept_prototype: bool = False) -> bool:
		rawname = name.split(".")
		value = self.json
		while len(rawname) > 0 and len(rawname[0]) > 0:
			key = rawname.pop(0)
			if key in value:
				value = value[key]
				continue
			elif accept_prototype and self.prototype:
				return self.prototype.has_value(name)
			return False
		return value is not None

	def get_value(self, name: str, fallback: Any = None, accept_prototype: bool = True) -> Any:
		rawname = name.split(".")
		value = self.json
		while len(rawname) > 0 and len(rawname[0]) > 0:
			key = rawname.pop(0)
			if key in value:
				value = value[key]
				continue
			elif accept_prototype and self.prototype:
				return self.prototype.get_value(name, fallback)
			return fallback
		return value

	def set_value(self, name: str, what: Any) -> None:
		rawname = name.split(".")
		value = self.json
		while len(rawname) > 1 and len(rawname[0]) > 0:
			key = rawname.pop(0)
			if not key in value:
				value[key] = dict()
			value = value[key]
		if len(rawname[0]) > 0:
			value[rawname.pop()] = what

	def remove_value(self, name: str) -> bool:
		rawname = name.split(".")
		value = self.json
		while len(rawname) > 1 and len(rawname[0]) > 0:
			key = rawname.pop(0)
			if not key in value:
				return False
			value = value[key]
		removed = False
		if len(rawname[0]) > 0:
			try:
				del value[rawname.pop()]
				removed = True
			except KeyError:
				pass
			if value != self.json and len(value) == 0:
				removed |= self.remove_value(name.rsplit(".", 1)[0])
		return removed

	def iterate_entries(self, filter: Optional[str | re.Pattern[str]] = None, recursive: bool = False, *, json: Optional[Dict[Any, Any]] = None, relative_key: Optional[str] = None):
		if not json:
			json = self.json
		if filter and isinstance(filter, str):
			filter = re.compile(filter)
		for property in json:
			key = relative_key + "." + property if relative_key else property
			if not filter or re.search(filter, property):
				yield key, json[property]
			if recursive and isinstance(json[property], dict):
				for subkey, subvalue in self.iterate_entries(filter, recursive, json=json[property], relative_key=key):
					yield subkey, subvalue

	def get_config(self, name: str) -> Optional['BaseConfig']:
		value = self.get_value(name)
		if isinstance(value, dict):
			return BaseConfig(value)

	def get_list(self, name: str, config: bool = False) -> List[Any]:
		value = self.get_value(name)
		result = list()
		if isinstance(value, list) or isinstance(value, set):
			for children in value:
				result.append(
					BaseConfig(children) if config and isinstance(children, dict) else children
				)
		return result

	def get_filtered_list(self, name: str, property: str, *values: Any) -> List[Any]:
		value = self.get_value(name)
		filtered = list()
		if isinstance(value, list) or isinstance(value, set):
			for children in value:
				if isinstance(children, dict) and property in children and children[property] in values:
					filtered.append(children)
		return filtered

	def get_or_create_config(self, name: str) -> 'BaseConfig':
		config = self.get_config(name)
		if config is None:
			self.set_value(name, dict())
		config = self.get_config(name)
		if config is None:
			raise RuntimeError(f"Property {name!r} should be created, but it still does not exists.")
		return config
