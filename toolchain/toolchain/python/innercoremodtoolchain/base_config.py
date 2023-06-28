from typing import (Any, Dict, Iterable, Iterator, List, Optional, Set, Tuple,
                    Union)


class BaseConfig:
	json: Dict[Any, Any]; prototype: Optional['BaseConfig']

	def __init__(self, json: Dict[Any, Any], base: Optional['BaseConfig'] = None) -> None:
		self.json = json
		self.prototype = base

	def get_value(self, name: str, fallback: Any = None, accept_prototype: bool = True) -> Any:
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

	def get_filtered_list(self, name: str, property: str, *values: Any) -> List[Any]:
		value = self.get_value(name)
		filtered = []
		if isinstance(value, list):
			for obj in value:
				if isinstance(obj, dict) and property in obj and obj[property] in values:
					filtered.append(obj)
		return filtered

	def set_value(self, name: str, what: Any) -> None:
		rawname = name.split(".")
		value = self.json
		while len(rawname) > 1 and len(rawname[0]) > 0:
			key = rawname.pop(0)
			if not key in value:
				value[key] = {}
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

	def get_config(self, name: str) -> Optional['BaseConfig']:
		value = self.get_value(name)
		if isinstance(value, dict):
			return BaseConfig(value)

	def get_or_create_config(self, name: str) -> 'BaseConfig':
		config = self.get_config(name)
		if config is None:
			self.set_value(name, {})
		config = self.get_config(name)
		if config is None:
			raise RuntimeError(f"Property '{name}' should be created, but it still does not exists!")
		return config
