import platform
import sys
from typing import (IO, Any, Dict, List, Literal, NoReturn, Optional, Tuple,
                    Type, TypeVar, Union, overload)

try:
	import termios
	import tty
except ImportError:
	import msvcrt

from . import colorama

if platform.system() == "Windows":
	colorama.just_fix_windows_console()


class Shell():
	offset: int = 0; line: int = 0
	stdin: IO[str]; stdout: IO[str]; eof_when_enter: bool = False
	interactables: List['Interactable']

	def __init__(self, stdin: Optional[IO[str]] = None, stdout: Optional[IO[str]] = None) -> None:
		self.stdin = stdin if stdin is not None else sys.stdin
		self.stdout = stdout if stdout is not None else sys.stdout
		self.interactables = []

	def read(self, count: int = 1) -> str:
		return self.stdin.read(count)

	def readline(self, count: int = 1) -> str:
		return self.stdin.readline(count)

	def inputraw(self, count: int = 1) -> str:
		try:
			fd = self.stdin.fileno()
			term_attrs = termios.tcgetattr(fd)
		except NameError:
			return "\0"
		try:
			try:
				tty.setraw(fd)
				key = self.stdin.read(count)
			except NameError:
				key = msvcrt.getwch() # type: ignore
				count -= 1
				while count > 0:
					key += msvcrt.getwch() # type: ignore
					count -= 1
		finally:
			try:
				termios.tcsetattr(fd, termios.TCSADRAIN, term_attrs)
			except NameError:
				pass
		return key

	def input(self, count: int = 1) -> str:
		key = self.inputraw(count)
		if key == "\x03" or key == "\x1a": # Ctrl+C or Ctrl+Z
			raise KeyboardInterrupt()
		return key

	def inputline(self, count: int = 1) -> str:
		buffer = ""
		while count > 0:
			key = self.input()
			if ord(key) in {10, 13}: # Enter
				if count > 1:
					buffer += "\n"
				count -= 1
			else:
				buffer += key
		return buffer

	def write(self, value: str) -> None:
		self.stdout.write(value)
		value = str(value)
		self.line += value.count("\n")
		try:
			where = value.rindex("\n") + 1
			self.offset = len(value[where:])
		except ValueError:
			self.offset += len(value)

	def up(self, count: int = 1) -> None:
		self.write(colorama.Cursor.UP(count))

	def down(self, count: int = 1) -> None:
		self.write(colorama.Cursor.DOWN(count))

	def forward(self, count: int = 1) -> None:
		self.write(colorama.Cursor.FORWARD(count))

	def backward(self, count: int = 1) -> None:
		self.write(colorama.Cursor.BACK(count))

	def clear(self) -> None:
		if self.line > 0:
			buffer = ""
			for offset in range(self.line):
				buffer += colorama.ansi.clear_line()
				if offset < self.line:
					buffer += colorama.ansi.CSI + "F"
			buffer += colorama.ansi.CSI + "G"
			self.write(buffer)
			self.line = 0
		self.offset = 0

	IT = TypeVar("IT", bound='Interactable')
	@overload
	def get_interactable(self, criteria: Optional[Union[int, str]], type: Type[IT]) -> IT: ...
	@overload
	def get_interactable(self, criteria: Optional[Union[int, str]], type: None = None) -> 'Interactable': ...

	def get_interactable(self, criteria: Optional[Union[int, str]], type: Optional[Type[IT]] = None) -> 'Interactable':
		try:
			if isinstance(criteria, int):
				interactable = self.interactables[criteria]
				if type is None or isinstance(interactable, type):
					return interactable
				raise ValueError(f"Criteria {criteria} does not match any interactable!")
		except IndexError:
			pass
		except TypeError:
			pass
		for interactable in self.interactables:
			if interactable.key == criteria and (type is None or isinstance(interactable, type)):
				return interactable
		raise ValueError(f"Criteria {criteria} does not match any interactable!")

	def observe(self, key: str) -> bool:
		if self.eof_when_enter and ord(key) in {10, 13}: # Enter
			raise EOFError()
		return False

	def draw(self, interactable: 'Interactable') -> Any:
		return interactable.render(self, self.offset, self.line)

	def touch(self, interactable: 'Interactable', key: str) -> bool:
		return interactable.observe_key(key)

	def render(self) -> None:
		self.clear()
		self.write("\n")
		for interactable in self.interactables:
			self.draw(interactable)

	def enter(self) -> None:
		self.hide_cursor()
		self.render()

	def loop(self) -> None:
		with self:
			while True:
				try:
					key = self.input(1)
					observed = False
					for interactable in self.interactables:
						observed = self.touch(interactable, key) or observed
					if not observed:
						observed = self.observe(key)
					if observed:
						self.render()
				except EOFError:
					break
				except KeyboardInterrupt as err:
					self.leave()
					raise err

	def leave(self) -> None:
		self.show_cursor()

	def hide_cursor(self) -> None:
		self.write(colorama.ansi.CSI + "?25l")

	def show_cursor(self) -> None:
		self.write(colorama.ansi.CSI + "?25h")

	def scroll_up(self) -> None:
		self.write(colorama.ansi.CSI + "S")

	def scroll_down(self) -> None:
		self.write(colorama.ansi.CSI + "T")

	def __enter__(self) -> 'Shell':
		self.enter()
		return self

	def __exit__(self, type, value, traceback) -> None:
		self.leave()

	@staticmethod
	def notify(shell: Optional['Shell'], message: str) -> None:
		if shell is None:
			printc(message); return
		shell.interactables.append(
			Notice(f"print{len(shell.interactables)}", message)
		)
		shell.render()

	class Interactable:
		key: Optional[str]

		def __init__(self, key: Optional[str] = None) -> None:
			self.key = key

		def observe_key(self, what: str) -> bool:
			return False

		def render(self, shell: 'Shell', offset: int, line: int) -> None:
			pass

		def lines(self, shell: 'Shell') -> int:
			return 0

class InteractiveShell(Shell):
	page_buffer_offset: int = 0; global_buffer_offset: int = 0
	infinite_scroll: bool; lines_per_page: int; implicit_page_indicator: bool
	page: int = 1

	def __init__(self, stdin: Optional[IO[str]] = None, stdout: Optional[IO[str]] = None, infinite_scroll: bool = False, lines_per_page: int = 6, implicit_page_indicator: bool = False) -> None:
		Shell.__init__(self, stdin, stdout)
		self.infinite_scroll = infinite_scroll
		self.lines_per_page = lines_per_page
		self.implicit_page_indicator = implicit_page_indicator

	def observe(self, raw: str) -> bool:
		observed = Shell.observe(self, raw)
		if raw != "\x1b" and raw != "\xe0" and raw != "\x00":
			return observed
		key = self.inputraw(1)
		if raw == "\xe0" or raw == "\x00": # Windows
			if key == "M": # Forward
				self.turn_forward()
			elif key == "K": # Backward
				self.turn_backward()
			else:
				return observed
			return True
		if key != "[": # Unix
			return observed
		joy = self.inputraw(1)
		if joy == "C": # Forward
			self.turn_forward()
		elif joy == "D": # Backward
			self.turn_backward()
		else:
			return observed
		return True

	def turn_forward(self) -> None:
		if self.global_buffer_offset + self.page_buffer_offset >= len(self.interactables):
			if self.infinite_scroll:
				self.global_buffer_offset = self.page_buffer_offset = 0
				self.page = 1
			return

		self.global_buffer_offset += self.page_buffer_offset
		self.page_buffer_offset = 0
		self.page += 1

	def turn_backward(self) -> None:
		index = self.global_buffer_offset
		if index == 0:
			if self.infinite_scroll:
				page = 1
				page_occupied_lines = 0
				page_buffer_offset = 0

				while index < len(self.interactables):
					lines = self.interactables[index].lines(self)
					if lines > self.lines_per_page or lines < 0:
						raise BufferError(f"'{lines}' out of bounds [0, {self.lines_per_page}]")

					if page_occupied_lines + lines > self.lines_per_page:
						page_occupied_lines = page_buffer_offset = 0
						page += 1
						continue

					page_occupied_lines += lines
					page_buffer_offset += 1
					index += 1

				self.global_buffer_offset = index - page_buffer_offset
				self.page_buffer_offset = 0
				self.page = page
			return

		page_occupied_lines = 0
		while index > 0:
			lines = self.interactables[index - 1].lines(self)
			if lines > self.lines_per_page or lines < 0:
				raise BufferError(f"'{lines}' out of bounds [0, {self.lines_per_page}]")

			if page_occupied_lines + lines > self.lines_per_page:
				break

			page_occupied_lines += lines
			index -= 1

		self.global_buffer_offset = index
		self.page_buffer_offset = 0
		self.page -= 1

	def draw(self, interactable: Shell.Interactable, page: int, page_occupied_lines: int) -> Any:
		if isinstance(interactable, InteractiveShell.Interactable):
			return interactable.render(self, self.offset, self.line, page, self.page_buffer_offset, page_occupied_lines)
		return Shell.draw(self, interactable)

	def write_implicit_indicator(self) -> None:
		if self.implicit_page_indicator and (self.global_buffer_offset > 0 or self.global_buffer_offset + self.page_buffer_offset < len(self.interactables)):
			self.write(
				"\n" * (self.lines_per_page + 1 - self.line) +
				(".." if self.global_buffer_offset > 0 else " " * 2)
				+ " " * 45 +
				(".." if self.global_buffer_offset + self.page_buffer_offset < len(self.interactables) else " " * 2)
				+ "\n"
			)

	def render(self) -> None:
		self.clear()
		if len(self.interactables) == 0:
			return
		if self.global_buffer_offset >= len(self.interactables):
			raise IndexError("offset >= count")
		self.write("\n")

		page_occupied_lines = 0
		self.page_buffer_offset = 0

		while self.global_buffer_offset + self.page_buffer_offset < len(self.interactables):
			interactable = self.interactables[self.global_buffer_offset + self.page_buffer_offset]
			lines = interactable.lines(self)
			if lines > self.lines_per_page or lines < 0:
				raise BufferError(f"'{lines}' out of bounds [0, {self.lines_per_page}]")
			if page_occupied_lines + lines > self.lines_per_page:
				break
			self.draw(interactable, self.page, page_occupied_lines)
			page_occupied_lines += lines
			self.page_buffer_offset += 1

		self.write_implicit_indicator()

	def enter(self) -> None:
		self.global_buffer_offset = self.page_buffer_offset = 0
		self.page = 1
		Shell.enter(self)

	def leave(self) -> None:
		self.clear()
		Shell.leave(self)

	class Interactable(Shell.Interactable):
		def __init__(self, key: Optional[str]) -> None:
			Shell.Interactable.__init__(self, key)

		def render(self, shell: 'InteractiveShell', offset: int, line: int, page: int = 0, index: int = -1, lines_before: int = -1) -> Any:
			pass

		def lines(self, shell: 'InteractiveShell') -> int:
			return 0

class SelectiveShell(InteractiveShell):
	page_cursor_offset: int = -1; pending_hover_offset: int = 0
	blocked_in_page: bool = False

	def __init__(self, stdin: Optional[IO[str]] = None, stdout: Optional[IO[str]] = None, infinite_scroll: bool = False, lines_per_page: int = 6, implicit_page_indicator: bool = False) -> None:
		InteractiveShell.__init__(self, stdin, stdout, infinite_scroll, lines_per_page, implicit_page_indicator)
		self.eof_when_enter = True

	def turn_backward(self) -> None:
		if not self.blocked_in_page:
			InteractiveShell.turn_backward(self)
		self.page_cursor_offset += 1
		self.pending_hover_offset = -2

	def turn_forward(self) -> None:
		if not self.blocked_in_page:
			InteractiveShell.turn_forward(self)
		self.page_cursor_offset -= 1
		self.pending_hover_offset = 2

	def turn_up(self) -> None:
		if self.page_cursor_offset > 0 or self.infinite_scroll or self.global_buffer_offset > 0:
			self.pending_hover_offset = -1 if not self.blocked_in_page else -2

	def turn_down(self) -> None:
		if (self.page_cursor_offset < self.page_buffer_offset and self.which() < len(self.interactables) - 1) or self.infinite_scroll:
			self.pending_hover_offset = 1 if not self.blocked_in_page else 2

	def hover_previous(self) -> bool:
		cursor_offset = min(self.page_cursor_offset, self.page_buffer_offset) - 1
		while cursor_offset >= 0:
			try:
				interactable = self.interactables[self.global_buffer_offset + cursor_offset]
			except IndexError:
				cursor_offset -= 1
				continue
			if isinstance(interactable, SelectiveShell.Selectable) and interactable.hoverable():
				self.page_cursor_offset = cursor_offset
				return True
			cursor_offset -= 1
		return False

	def hover_next(self) -> bool:
		cursor_offset = max(self.page_cursor_offset, -1) + 1
		while cursor_offset < self.page_buffer_offset:
			try:
				interactable = self.interactables[self.global_buffer_offset + cursor_offset]
			except IndexError:
				cursor_offset += 1
				continue
			if isinstance(interactable, SelectiveShell.Selectable) and interactable.hoverable():
				self.page_cursor_offset = cursor_offset
				return True
			cursor_offset += 1
		return False

	def touch(self, interactable: Shell.Interactable, key: str) -> bool:
		if isinstance(interactable, SelectiveShell.Selectable):
			try:
				return interactable.observe_key(key, self.interactables.index(interactable) == self.which())
			except ValueError:
				pass
		return InteractiveShell.touch(self, interactable, key)

	def render(self) -> None:
		InteractiveShell.render(self)

		# Changes cursor location to previous one if possible
		if self.pending_hover_offset != 0:
			if self.pending_hover_offset <= -1:
				if not self.hover_previous():

					if self.pending_hover_offset == -1:
						if self.infinite_scroll or self.global_buffer_offset > 0:
							self.page_cursor_offset = self.lines_per_page
							InteractiveShell.turn_backward(self)
							InteractiveShell.render(self)
							if not self.hover_previous():
								self.page_cursor_offset = -1

					elif not self.hover_next() and not self.hovered():
						self.page_cursor_offset = -1

				InteractiveShell.render(self)

			elif self.pending_hover_offset >= 1:
				if not self.hover_next():

					if self.pending_hover_offset == 1:
						self.page_cursor_offset = -1
						InteractiveShell.turn_forward(self)
						InteractiveShell.render(self)
						if not self.hover_next():
							self.page_cursor_offset = -1

					elif not self.hover_previous() and not self.hovered():
						self.page_cursor_offset = -1

				InteractiveShell.render(self)

			self.pending_hover_offset = 0

	def observe(self, raw: str) -> bool:
		if self.eof_when_enter and ord(raw) in {10, 13}: # Enter
			if self.which() == -1:
				return False
			raise EOFError()
		observed = Shell.observe(self, raw)
		if raw != "\x1b" and raw != "\xe0" and raw != "\x00":
			return observed
		key = self.inputraw(1)
		if raw == "\xe0" or raw == "\x00": # Windows
			if key == "H": # Up
				self.turn_up()
			elif key == "P": # Down
				self.turn_down()
			elif key == "M": # Forward
				self.turn_forward()
			elif key == "K": # Backward
				self.turn_backward()
			else:
				return observed
			return True
		if key != "[":
			return observed
		joy = self.inputraw(1) # Unix
		if joy == "A": # Up
			self.turn_up()
		elif joy == "B": # Down
			self.turn_down()
		elif joy == "C": # Forward
			self.turn_forward()
		elif joy == "D": # Backward
			self.turn_backward()
		else:
			return observed
		return True

	def draw(self, interactable: Shell.Interactable, page: int, page_occupied_lines: int) -> Any:
		if isinstance(interactable, SelectiveShell.Selectable):
			return interactable.render(self, self.offset, self.line, page, self.page_buffer_offset, page_occupied_lines, self.page_cursor_offset == self.page_buffer_offset)
		return InteractiveShell.draw(self, interactable, page, page_occupied_lines)

	def enter(self) -> None:
		self.page_cursor_offset = -1
		self.pending_hover_offset = 2
		InteractiveShell.enter(self)

	def hovered(self) -> bool:
		interactable = self.get_interactable(self.which())
		return interactable.hoverable() if isinstance(interactable, SelectiveShell.Selectable) else False

	def which(self) -> int:
		return self.global_buffer_offset + self.page_cursor_offset if self.page_cursor_offset != -1 else -1

	def what(self) -> Optional[str]:
		try:
			return self.interactables[self.which()].key
		except IndexError:
			return None

	class Selectable(InteractiveShell.Interactable):
		def __init__(self, key: Optional[str]) -> None:
			InteractiveShell.Interactable.__init__(self, key)

		def render(self, shell: 'SelectiveShell', offset: int, line: int, page: int = 0, index: int = -1, lines_before: int = -1, at_cursor: Optional[bool] = None) -> Any:
			pass

		def lines(self, shell: 'SelectiveShell') -> int:
			return 0

		def hoverable(self) -> bool:
			return True

		def placeholder(self) -> str:
			return "..."

		def observe_key(self, what: str, at_cursor: Optional[bool] = None) -> bool:
			return False

class Separator(Shell.Interactable):
	size: int

	def __init__(self, key: Optional[str] = "separator", size: int = 1) -> None:
		Shell.Interactable.__init__(self, key)
		self.size = size

	def render(self, shell: Shell, offset: int, line: int) -> None:
		shell.write("\n" * self.size)

	def lines(self, shell: Shell) -> int:
		return self.size

class Notice(Shell.Interactable):
	text: Optional[str]

	def __init__(self, key: Optional[str], text: Optional[str] = None) -> None:
		Shell.Interactable.__init__(self, key)
		self.text = text if text is not None else key

	def render(self, shell: Shell, offset: int, line: int) -> None:
		shell.write(str(self.text) + "\n")

	def lines(self, shell: Shell) -> int:
		return str(self.text).count("\n") + 1

class Entry(SelectiveShell.Selectable):
	text: Optional[str]; arrow: Optional[str]

	def __init__(self, key: Optional[str], text: Optional[str] = None, arrow: Optional[str] = "> ") -> None:
		SelectiveShell.Selectable.__init__(self, key)
		self.text = text if text is not None else key
		self.arrow = arrow

	def get_arrow(self, at_cursor: Optional[bool] = None) -> str:
		return "" if at_cursor is None else \
			str(self.arrow) if at_cursor else " " * len(str(self.arrow))

	def render(self, shell: SelectiveShell, offset: int, line: int, page: int = 0, index: int = -1, lines_before: int = -1, at_cursor: Optional[bool] = None) -> None:
		shell.write(self.get_arrow(at_cursor) + str(self.text) + "\n")

	def placeholder(self) -> str:
		return str(self.text).partition("\n")[0]

	def lines(self, shell: SelectiveShell) -> int:
		return str(self.text).count("\n") + 1

class Switch(Entry):
	checked_arrow: Optional[str]; hover_arrow: Optional[str]
	checked: bool

	def __init__(self, key: Optional[str], text: Optional[str] = None, checked: bool = False, arrow: Optional[str] = "> ", checked_arrow: Optional[str] = "* ", hover_arrow: Optional[str] = ">*") -> None:
		Entry.__init__(self, key, text, arrow)
		self.checked_arrow = checked_arrow
		self.checked = checked
		self.hover_arrow = hover_arrow

	def get_arrow(self, at_cursor: Optional[bool] = None) -> str:
		return str(self.hover_arrow) if at_cursor and self.checked else \
			str(self.arrow) if at_cursor else str(self.checked_arrow) if self.checked else " " * len(str(self.arrow))

	def observe_key(self, what: str, at_cursor: Optional[bool] = None) -> bool:
		if at_cursor and ord(what) in {10, 13}:
			self.checked = not self.checked
			return True
		return Entry.observe_key(self, what)

class Input(Entry):
	hint: Optional[str]; template: Optional[str]; maximum_length: int
	hovered: bool = False

	def __init__(self, key: Optional[str], hint: Optional[str] = None, text: Optional[str] = "", arrow: Optional[str] = "> ", template: Optional[str] = None, maximum_length: int = 40) -> None:
		Entry.__init__(self, key, text, arrow)
		self.hint = hint
		self.template = template
		self.maximum_length = maximum_length

	def render(self, shell: SelectiveShell, offset: int, line: int, page: int = 0, index: int = -1, lines_before: int = -1, at_cursor: Optional[bool] = None) -> None:
		text = str(self.text) if len(str(self.text)) > 0 or self.hovered else "..." if self.template is None else self.template
		shell.write(self.get_arrow(at_cursor) + (self.hint if self.hint is not None else "") + (text if self.hovered else stringify(text, color=colorama.Style.DIM, reset=colorama.Style.NORMAL)) + (stringify(" ", color=7, reset=colorama.Style.RESET_ALL) if self.hovered else "") + "\n")

	def read(self) -> Optional[str]:
		return self.template if not self.hovered and len(str(self.text)) == 0 and self.template is not None else self.text

	def observe_key(self, what: str, at_cursor: Optional[bool] = None) -> bool:
		if at_cursor:
			if ord(what) in {10, 13}:
				self.hovered = not self.hovered
				return True
			if self.hovered:
				if what in ("\x7f", "\x08"): # backspace
					if self.text is not None and len(self.text) > 0:
						self.text = self.text[::-1][1:][::-1]
					else:
						self.hovered = False
				elif what.isprintable() and len(str(self.text) + what) <= self.maximum_length:
					if self.text is None:
						self.text = ""
					self.text += what
				return True
		return Entry.observe_key(self, what)

class Progress(Shell.Interactable):
	text: Optional[str]; weight: int
	progress: float

	def __init__(self, key: Optional[str] = "progress", progress: float = 0.0, weight: int = 49, text: Optional[str] = None) -> None:
		Shell.Interactable.__init__(self, key)
		self.progress = progress
		self.weight = weight
		self.text = text

	def render(self, shell: Shell, offset: int, line: int) -> None:
		text = (str(self.text) if self.text is not None else str(int(self.progress * 100)) + "%").center(self.weight)
		size = int(self.weight * self.progress)
		shell.write(stringify(text[:size], color=7, reset=colorama.Style.RESET_ALL) + stringify(text[size:self.weight], color=colorama.Style.DIM, reset=colorama.Style.NORMAL) + "\n")

	def seek(self, progress: float, text: Optional[str] = None) -> None:
		self.progress = progress
		if text is not None:
			self.text = text

	def lines(self, shell: Shell) -> int:
		return (str(self.text).count("\n") if self.text is not None else 0) + 1

	@staticmethod
	def notify(shell: Optional[Shell], progress: Optional['Progress'], percent: float, message: str) -> None:
		if shell is None or progress is None:
			Shell.notify(shell, message); return
		progress.seek(percent, message)
		shell.render()

class Interrupt(InteractiveShell.Interactable):
	occupied_page: bool

	def __init__(self, key: Optional[str] = "interrupt", occupied_page: bool = True) -> None:
		InteractiveShell.Interactable.__init__(self, key)
		self.ocuppied_page = occupied_page

	def render(self, shell: InteractiveShell, offset: int, line: int, page: int = 0, index: int = -1, lines_before: int = -1) -> NoReturn:
		raise EOFError()

	def lines(self, shell: InteractiveShell) -> int:
		return shell.lines_per_page if self.ocuppied_page else 0

class Debugger(SelectiveShell.Selectable):
	def __init__(self, key: Optional[str] = "debugger") -> None:
		SelectiveShell.Selectable.__init__(self, key)

	def render(self, shell: SelectiveShell, offset: int, line: int, page: int = 0, index: int = -1, lines_before: int = -1, at_cursor: Optional[bool] = None) -> None:
		shell.write(f"Page {page}:{shell.global_buffer_offset}, offset {offset}/{shell.page_buffer_offset}, cursor {shell.page_cursor_offset}\n")

	def hoverable(self) -> bool:
		return False

def select_prompt_internal(prompt: Optional[str] = None, *variants: Optional[str], fallback: Optional[int] = None) -> Tuple[Optional[int], Optional[Any]]:
	if prompt is not None:
		printc(prompt, end="")
	shell = SelectiveShell(infinite_scroll=True, implicit_page_indicator=True)
	for variant in variants:
		if variant is not None:
			shell.interactables.append(Entry(variant))
	try:
		shell.loop()
		result = shell.which()
	except KeyboardInterrupt:
		result = fallback
	try:
		interactable = shell.get_interactable(result)
	except ValueError:
		return None, None
	try:
		if isinstance(interactable, SelectiveShell.Selectable):
			printc((prompt + " " if prompt is not None else "") + stringify(interactable.placeholder(), color=colorama.Style.DIM, reset=colorama.Style.NORMAL))
	except ValueError:
		pass
	return result, interactable

@overload
def select_prompt(prompt: Optional[str] = None, *variants: Optional[str], fallback: Optional[int] = None, returns_what: Literal[False] = False) -> Optional[int]: ...
@overload
def select_prompt(prompt: Optional[str] = None, *variants: Optional[str], fallback: Optional[int] = None, returns_what: Literal[True] = True) -> Optional[str]: ...

def select_prompt(prompt: Optional[str] = None, *variants: Optional[str], fallback: Optional[int] = None, returns_what: bool = False) -> Optional[Union[str, int]]:
	if returns_what:
		interactable = select_prompt_internal(prompt, *variants, fallback=fallback)[1]
		return interactable.key if interactable is not None else None
	return select_prompt_internal(prompt, *variants, fallback=fallback)[0]

def confirm(prompt: str, fallback: bool, prints_abort: bool = True) -> bool:
	try:
		if input(prompt + (" [Y/n] " if fallback else " [N/y] ")).lower()[:1] == ("n" if fallback else "y"):
			if prints_abort and fallback:
				print("Abort.")
			return not fallback
	except KeyboardInterrupt:
		print()
	if prints_abort and not fallback:
		print("Abort.")
	return fallback

def link(text: str, url: Optional[str] = None) -> str:
	return f"{colorama.ansi.OSC}8;;{url if url is not None else text}{colorama.ansi.BEL}{text}{colorama.ansi.OSC}8;;{colorama.ansi.BEL}"

def image(base64: str, options: Optional[Dict[str, object]] = None) -> str:
	returnValue = colorama.ansi.OSC + "1337;File=inline=1"
	if options is not None:
		if "width" in options:
			returnValue += ";width=" + str(options["width"])
		if "height" in options:
			returnValue += ";height=" + str(options["height"])
		if "preserveAspectRatio" in options and options["preserveAspectRatio"] == False:
			returnValue += ";preserveAspectRatio=0"
	return returnValue + ":" + base64 + colorama.ansi.BEL

def printc(*values: object, color: Optional[Union[int, str]] = None, reset: Optional[Union[int, str]] = None, sep: Optional[str] = " ", end: Optional[str] = "\n", file: Optional[Any] = None, flush: bool = False):
	if color is not None:
		if isinstance(color, int):
			color = colorama.ansi.code_to_chars(color)
		print(color, end="", file=file, flush=flush)
	print(*values, end=end if reset is None else "", sep=sep, file=file, flush=flush)
	if reset is not None:
		if isinstance(reset, int):
			reset = colorama.ansi.code_to_chars(reset)
		print(reset, end=end, file=file, flush=flush)

def debug(*values: object, sep: Optional[str] = " ", end: Optional[str] = "\n", file: Optional[Any] = None, flush: bool = False) -> None:
	printc(*values, color=colorama.Style.DIM, reset=colorama.Style.NORMAL, sep=sep, end=end, file=file, flush=flush)

def info(*values: object, sep: Optional[str] = " ", end: Optional[str] = "\n", file: Optional[Any] = None, flush: bool = False) -> None:
	printc(*values, color=colorama.Fore.LIGHTGREEN_EX, reset=colorama.Fore.RESET, sep=sep, end=end, file=file, flush=flush)

def warn(*values: object, sep: Optional[str] = " ", end: Optional[str] = "\n", file: Optional[Any] = None, flush: bool = False) -> None:
	printc(*values, color=colorama.Fore.LIGHTYELLOW_EX, reset=colorama.Fore.RESET, sep=sep, end=end, file=file, flush=flush)

def error(*values: object, sep: Optional[str] = " ", end: Optional[str] = "\n", file: Optional[Any] = None, flush: bool = False) -> None:
	printc(*values, color=colorama.Fore.LIGHTRED_EX, reset=colorama.Fore.RESET, sep=sep, end=end, file=file, flush=flush)

class StringBuffer:
	value: str = ""
	def write(self, data: str) -> None: self.value += data

def stringify(*values: object, color: Optional[Union[int, str]] = None, reset: Optional[Union[int, str]] = None, sep: Optional[str] = " ", end: Optional[str] = "\n") -> str:
	buffer = StringBuffer()
	printc(*values, color=color, reset=reset, sep=sep, end=end, file=buffer)
	return buffer.value

def abort(*values: object, sep: Optional[str] = " ", code: int = 400, cause: Optional[BaseException] = None) -> NoReturn:
	if cause is not None:
		from traceback import print_exception
		buffer = StringBuffer()
		print_exception(cause.__class__, cause, cause.__traceback__, 5, buffer)
		error(buffer.value)
	if len(values) != 0:
		error(*values, sep=sep)
	elif cause is None:
		print("Abort.")
	try:
		from .task import unlock_all_tasks
		unlock_all_tasks()
	except IOError:
		pass
	exit(code)


if __name__ == "__main__":
	shell = Shell()
	while True:
		try:
			key = shell.input(1)
		except KeyboardInterrupt:
			break
		print(ord(key), " :: ", str(key.encode("unicode-escape"))[2:][::-1][1:][::-1].replace("\\\\", "\\"), sep="")
