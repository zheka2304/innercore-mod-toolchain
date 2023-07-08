import inspect
import sys
from collections import namedtuple
from types import (BuiltinMethodType, ClassMethodDescriptorType,
                   DynamicClassAttribute)
from typing import Any, Callable, Dict, Final, List, Mapping, Optional, Tuple

from .shell import printc, stringify
from .task import Task

_MAGICS: Final[Tuple[str, ...]] = (
	'__annotations__', '__bases__', '__class__', '__closure__',
	'__code__', '__defaults__', '__dict__', '__doc__', '__file__',
	'__func__', '__globals__', '__kwdefaults__', '__module__',
	'__mro__', '__name__', '__objclass__', '__qualname__',
	'__self__', '__slots__', '__weakref__')

try:
	import pygments
	from pygments.formatters.terminal import TerminalFormatter
	from pygments.lexers.python import PythonLexer

	def highlight(*values: object, sep: Optional[str] = " ", file: Optional[Any] = None):
		printc(pygments.highlight(stringify(*values, sep=sep), PythonLexer(), TerminalFormatter()), end="", file=file)
except ImportError:
	def highlight(*values: object, sep: Optional[str] = " ", file: Optional[Any] = None):
		printc(*values, file=file)

Attribute = namedtuple('Attribute', 'name kind defining_class object type')


def classify_attrs(obj: object) -> List[Attribute]:
	"""
	Return list of attribute-descriptor tuples.

	Extends abilities to classify anything, not just classes,
	with support of searching attribute annotations.

	Based on 'inspect.classify_class_attrs'.
	"""
	cls = obj if inspect.isclass(obj) else type(obj)
	mro = inspect.getmro(cls)
	metamro = inspect.getmro(type(cls))
	metamro = tuple(cls for cls in metamro if cls not in (type, object))
	class_bases = (cls,) + mro
	all_bases = class_bases + metamro
	names = dir(obj)
	for base in mro:
		for k, v in base.__dict__.items():
			if isinstance(v, DynamicClassAttribute):
				names.append(k)
	result = []
	processed = set()

	for name in names:
		homecls, get_obj, dict_obj = None, None, None
		if name not in processed:
			try:
				if name == '__dict__':
					raise Exception("__dict__ is special, don't want the proxy")
				get_obj = getattr(cls, name) if hasattr(cls, name) else getattr(obj, name)
			except Exception:
				pass
			else:
				homecls = getattr(get_obj, "__objclass__", homecls)
				if homecls not in class_bases:
					homecls = None
					last_cls = None
					for srch_cls in class_bases:
						srch_obj = getattr(srch_cls, name, None)
						if srch_obj is get_obj:
							last_cls = srch_cls
					for srch_cls in metamro:
						try:
							srch_obj = srch_cls.__getattr__(cls, name) # type: ignore
						except AttributeError:
							continue
						if srch_obj is get_obj:
							last_cls = srch_cls
					if last_cls is not None:
						homecls = last_cls
		for base in all_bases:
			if name in base.__dict__: # type: ignore
				dict_obj = base.__dict__[name] # type: ignore
				if homecls not in metamro:
					homecls = base
				break
		if homecls is None:
			continue
		result.append(to_attribute(name, get_obj, dict_obj, homecls))
		processed.add(name)
	return result

def to_attribute(name: str, what: object, dict_what: Optional[object] = None, cls: Optional[type] = None):
	what = what if what is not None else dict_what
	dict_what = dict_what if dict_what is not None else what
	if isinstance(dict_what, (staticmethod, BuiltinMethodType)):
		kind = "static method"
		what = dict_what
	elif isinstance(dict_what, (classmethod, ClassMethodDescriptorType)):
		kind = "class method"
		what = dict_what
	elif isinstance(dict_what, property):
		kind = "property"
		what = dict_what
	elif inspect.isroutine(what):
		kind = "method"
	else:
		kind = "data"
	annotation = None
	if cls is not None and hasattr(cls, "__annotations__"):
		annotations = cls.__annotations__
		try:
			if annotations is not None and name in annotations:
				annotation = annotations[name]
		except TypeError:
			pass
	return Attribute(name, kind, cls, what, annotation)

def is_builtin(attribute: Attribute) -> bool:
	return _MAGICS.__contains__(attribute.name) \
		or getattr(type(attribute.object), "__module__", None) == "typing" \
			or ((attribute.kind != "data" or (attribute.name[:2] == "__" and attribute.name[-2:] == "__")) \
       and inspect.getmodule(attribute.defining_class) is sys.modules["builtins"])

def dump_instance_or_type(what: object, stack: int = 0, *, exclude_builtins: bool = True, recursive: bool = True, sort_by_kinds: bool = True, inter_subclasses: bool = True, limit_depth: int = 3) -> None:
	if getattr(type(what), "__module__", None) == "typing" or inspect.isclass(what):
		return
	attributes = classify_attrs(what)
	if exclude_builtins:
		attributes = list(filter(lambda attribute: not is_builtin(attribute), attributes))
	if sort_by_kinds:
		attributes.sort(key=lambda attribute: attribute.kind)
	intered = False
	if inter_subclasses:
		mro = inspect.getmro(type(what) if not inspect.isclass(what) else what)
		if len(mro) > 1:
			defines = set()
			attributes.sort(key=lambda attribute: (
				defines.add(attribute.defining_class), mro.index(attribute.defining_class)))
			if len(defines) > 1:
				intered = True
	altertype = None
	for attribute in attributes:
		if intered and attribute.defining_class != altertype:
			highlight(" " * (4 * stack) + attribute.defining_class.__qualname__ + ":")
			altertype = attribute.defining_class
		dump_attribute(attribute, stack + (1 if intered else 0), exclude_builtins=exclude_builtins, recursive=recursive, sort_by_kinds=sort_by_kinds, inter_subclasses=inter_subclasses, limit_depth=limit_depth)

def dump_attribute(what: Attribute, stack: int = 0, *, exclude_builtins: bool = True, recursive: bool = True, sort_by_kinds: bool = True, inter_subclasses: bool = True, limit_depth: int = 3) -> None:
	if stack > limit_depth:
		return
	prefix = "@staticmethod " if what.kind == "static method" \
		else "@classmethod " if what.kind == "class method" else ""
	if what.kind == "data" or what.kind == "property":
		annotation = what.type if what.type is not None else type(what.object) if what.object is not None else None
		annotation = (": {}" if len(what.name) > 0 else "{}").format(annotation.__qualname__) if annotation is not None else ""
		try:
			try:
				from pprint import pformat
				representation = pformat(what.object, 4, compact=True, sort_dicts=False)
				if stack > 0:
					representation = representation.splitlines()
					representation = ("\n" + " " * (4 * stack)).join(representation)
			except (ValueError, ImportError):
				representation = repr(what.object)
			highlight(" " * (4 * stack) + prefix + what.name + annotation, "=", representation)
		except (ValueError, TypeError):
			highlight(" " * (4 * stack) + prefix + what.name + annotation)
	else:
		try:
			try:
				func = what.object.__func__
			except AttributeError:
				func = what.object
			highlight(" " * (4 * stack) + prefix + what.name + str(inspect.signature(func)))
		except (ValueError, TypeError):
			highlight(" " * (4 * stack) + prefix + what.name + '("""built-in""")')
		return
	if what.kind != "property" and recursive:
		dump_instance_or_type(what.object, stack + 1, exclude_builtins=exclude_builtins, recursive=recursive, sort_by_kinds=sort_by_kinds, inter_subclasses=inter_subclasses, limit_depth=limit_depth)

def dump(what: object, stack: int = 0, name: str = "", *, exclude_builtins: bool = True, recursive: bool = True, sort_by_kinds: bool = True, inter_subclasses: bool = True, limit_depth: int = 3) -> None:
	attribute = to_attribute(name, what, cls=getattr(what, "__objclass__", None))
	if exclude_builtins and is_builtin(attribute):
		return
	dump_attribute(attribute, stack, exclude_builtins=exclude_builtins, recursive=recursive, sort_by_kinds=sort_by_kinds, inter_subclasses=inter_subclasses, limit_depth=limit_depth)

def parse_argument_value(what: str, target: type, default: Any) -> Any:
	try:
		try:
			return type(default).__call__(what)
		except BaseException:
			pass
		return target.__call__(what)
	except BaseException:
		pass
	return what

def parse_argument(argv: List[str], mappings: Mapping[str, inspect.Parameter]) -> Optional[Tuple[str, Any]]:
	argument = argv[0]
	buffer = argument.lstrip("-")
	whitespace = len(argument) - len(buffer)

	if whitespace > 2:
		raise ValueError(f"Argument '{argument}' should starts with '-' or '--'.")

	if whitespace == 1:
		if len(buffer) == 0:
			raise ValueError(f"Short argument can not be empty.")
		name = buffer[:1]
		buffer = buffer[1:]
		parameter = mappings.get(name)
		if not parameter:
			# Just searching for first argument prefix, additionally, type checking must be implemented in near future.
			parameters = iter(mappings.values())
			while True:
				try:
					parameter = next(parameters)
				except StopIteration:
					raise TypeError("Short argument '{name}' should be considered from parameters, not found any association.")
				else:
					if parameter.name[:1] != name:
						continue
					name = parameter.name
					break
		argv.pop(0)
		# Is not last argument in row of shorts, so value always should be boolean.
		if len(buffer) > 0 and buffer[:1] != "=":
			argv.insert(0, f"-{buffer}")
			return name, True
		name += buffer
	else:
		argv.pop(0)
		# Just enclosing delimiter, normally, it must be consumed by argument.
		if len(buffer) == 0:
			return
		name = buffer

	name, separator, buffer = name.partition("=")

	parameter = mappings.get(name)
	if parameter:
		target = parameter.annotation
		default = parameter.default
	else:
		target = type(None)
		default = None

	value = None
	if len(separator) > 0:
		value = parse_argument_value(buffer, target, default)
	elif len(argv) > 0:
		possibility = argv[0]
		if possibility[:2] != "--":
			value = parse_argument_value(possibility, target, default)
			argv.pop(0)
	if value is None:
		value = True

	return name, value

def parse_callable_arguments(argv: List[str], callable: Callable, signature: inspect.Signature, bind_wrapped: bool = False) -> Callable:
	parameters = signature.parameters
	linked_positionals = dict()
	positionals, keywords = list(), dict()
	values = iter(parameters.values())

	while True:
		try:
			if len(argv) == 0:
				raise StopIteration()
			argument = argv[0]
			if len(argument) > 0 and argument[:1] != "-":
				# Nothing to parse here anymore, next argument is not option.
				raise StopIteration()
			if len(argument) == 0:
				argv.pop(0)
				continue
		except StopIteration:
			try:
				parameter = next(values)
			except StopIteration:
				break
			else:
				if parameter.kind != inspect.Parameter.POSITIONAL_ONLY:
					# Normally, no more positional arguments will be availabled.
					break
				value = linked_positionals.get(parameter.name)
				if not value and parameter.default is inspect.Parameter.empty:
					raise TypeError('missing a required argument: {arg!r}'.format(arg=parameter.name)) from None
				positionals.append(value)
		else:
			parsed = parse_argument(argv, parameters)
			if not parsed:
				continue
			name, value = parsed
			parameter = parameters.get(name)
			if parameter and parameter.kind == inspect.Parameter.POSITIONAL_ONLY:
				linked_positionals[name] = value
				continue
			keywords[name] = value

	positionals = tuple(positionals)

	def bind() -> Tuple[tuple, dict]:
		bounds = signature.bind(*positionals, **keywords)
		bounds.apply_defaults()
		return bounds.args, bounds.kwargs

	if not bind_wrapped:
		positionals, keywords = bind()

	def wrapped() -> Any:
		if bind_wrapped:
			args, kwargs = bind()
			return callable(*args, **kwargs)
		return callable(*positionals, **keywords)

	return wrapped

def parse_arguments(argv: List[str], mappings: Mapping[str, Task], fallback: Optional[Callable[[str, Callable, dict], None]] = None) -> Dict[str, Callable]:
	callables = dict()

	while True:
		try:
			if len(argv) == 0:
				raise StopIteration()
			argument = argv.pop(0)
		except StopIteration:
			return callables
		else:
			if argument[:1] == "-":
				# TODO: Parsing globals should be considered here.
				continue
			task = mappings.get(argument)
			contains = task is not None
			task = task if task else lambda *args, **kwargs: None
			signature = inspect.signature(task.callable if contains else task)
			target = parse_callable_arguments(argv, task, signature)
			if contains:
				callables[argument] = target
			# Mapping is not availabled, fallback resulted arguments as-is.
			elif fallback:
				fallback(argument, target, callables)
