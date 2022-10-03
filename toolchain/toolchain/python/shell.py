import sys
try:
	import termios
	import tty
except ImportError:
	import msvcrt

from ansi_escapes import *

class Shell():
	offset = 0
	line = 0

	def __init__(self, stdin = sys.stdin, stdout = sys.stdout):
		self.stdin = stdin
		self.stdout = stdout
		self.eof_when_enter = False
		self.interactables = []

	def read(self, count = 1):
		return self.stdin.read(count)

	def readline(self, count = 1):
		return self.stdin.readline(count)

	def input_raw(self, count = 1):
		try:
			fd = self.stdin.fileno()
			term_attrs = termios.tcgetattr(fd)
		except NameError:
			pass
		try:
			try:
				tty.setraw(fd)
				key = self.stdin.read(count)
			except NameError:
				key = msvcrt.getwch()
				count -= 1
				while count > 0:
					key += msvcrt.getwch()
					count -= 1
		finally:
			try:
				termios.tcsetattr(fd, termios.TCSADRAIN, term_attrs)
			except NameError:
				pass
		return key

	def input(self, count = 1):
		key = self.input_raw(count)
		if key == "\x03" or key == "\x1a": # Ctrl+C or Ctrl+Z
			raise KeyboardInterrupt()
		return key

	def inputline(self, count = 1):
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

	def write(self, value):
		self.stdout.write(value)
		value = str(value)
		self.line += value.count("\n")
		try:
			where = value.rindex("\n") + 1
			self.offset = len(value[where:])
		except ValueError:
			self.offset += len(value)

	def up(self, count):
		self.write(cursor_up(count))

	def down(self, count):
		self.write(cursor_down(count))

	def right(self, count):
		self.write(cursor_forward(count))

	def left(self, count):
		self.write(cursor_backward(count))

	def clear(self):
		if self.line > 0:
			self.stdout.write(erase_lines(self.line + 1))
			self.line = 0
		self.offset = 0

	def get_interactable(self, criteria):
		try:
			return self.interactables[criteria]
		except IndexError:
			pass
		except TypeError:
			pass
		for interactable in self.interactables:
			if interactable.key == criteria:
				return interactable
		raise ValueError(criteria)

	def observe(self, key):
		if self.eof_when_enter and ord(key) in {10, 13}: # Enter
			raise EOFError()
		return False

	def draw(self, interactable):
		return interactable.render(self, self.offset, self.line)

	def touch(self, interactable, key):
		return interactable.observe_key(key)

	def render(self):
		self.clear()
		self.write("\n")
		for interactable in self.interactables:
			self.draw(interactable)

	def enter(self):
		self.hide_cursor()
		self.render()

	def loop(self):
		self.enter()
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
		self.leave()

	def leave(self):
		self.show_cursor()

	def hide_cursor(self):
		self.write(CURSOR_HIDE)

	def show_cursor(self):
		self.write(CURSOR_SHOW)

	class Interactable():
		def __init__(self, key):
			self.key = key

		def observe_key(self, what):
			return False

		def render(self, shell, offset, line):
			pass

		def lines(self, shell):
			return 0

class InteractiveShell(Shell):
	page_buffer_offset = 0
	global_buffer_offset = 0
	page = 1

	def __init__(self, stdin = sys.stdin, stdout = sys.stdout, infinite_scroll = False, lines_per_page = 6):
		Shell.__init__(self, stdin, stdout)
		self.infinite_scroll = infinite_scroll
		self.lines_per_page = lines_per_page

	def observe(self, raw):
		observed = Shell.observe(self, raw)
		if raw != "\x1b" and raw != "\xe0":
			return observed
		key = self.input_raw(1)
		if raw == "\xe0":
			if key == "M": # Right
				self.turn_forward()
			elif key == "K": # Left
				self.turn_backward()
			else:
				return observed
			return True
		if key != "[":
			return observed
		joy = self.input_raw(1)
		if joy == "C": # Right
			self.turn_forward()
		elif joy == "D": # Left
			self.turn_backward()
		else:
			return observed
		return True

	def turn_forward(self):
		if self.global_buffer_offset + self.page_buffer_offset >= len(self.interactables):
			if self.infinite_scroll:
				self.global_buffer_offset = self.page_buffer_offset = 0
				self.page = 1
			return
		self.global_buffer_offset += self.page_buffer_offset
		self.page_buffer_offset = 0
		self.page += 1

	def turn_backward(self):
		index = self.global_buffer_offset
		if index == 0:
			if self.infinite_scroll:
				page = 1
				page_occupied_lines = 0
				page_buffer_offset = 0
				while index < len(self.interactables):
					lines = self.interactables[index].lines(self)
					if lines > self.lines_per_page or lines < 0:
						raise BufferError()
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
				raise BufferError()
			if page_occupied_lines + lines > self.lines_per_page:
				break
			page_occupied_lines += lines
			index -= 1
		self.global_buffer_offset = index
		self.page_buffer_offset = 0
		self.page -= 1

	def draw(self, interactable, page, page_occupied_lines):
		if isinstance(interactable, InteractiveShell.Interactable):
			return interactable.render(self, self.offset, self.line, page, self.page_buffer_offset, page_occupied_lines)
		return Shell.draw(self, interactable)

	def render(self):
		self.clear()
		if len(self.interactables) == 0:
			return
		if self.global_buffer_offset >= len(self.interactables):
			raise IndexError()
		self.write("\n")
		page_occupied_lines = 0
		self.page_buffer_offset = 0
		while self.global_buffer_offset + self.page_buffer_offset < len(self.interactables):
			interactable = self.interactables[self.global_buffer_offset + self.page_buffer_offset]
			lines = interactable.lines(self)
			if lines > self.lines_per_page or lines < 0:
				raise BufferError()
			if page_occupied_lines + lines > self.lines_per_page:
				break
			self.draw(interactable, self.page, page_occupied_lines)
			page_occupied_lines += lines
			self.page_buffer_offset += 1

	def enter(self):
		self.global_buffer_offset = self.page_buffer_offset = 0
		self.page = 1
		Shell.enter(self)

	def leave(self):
		self.clear()
		Shell.leave(self)

	class Interactable(Shell.Interactable):
		def __init__(self, key):
			Shell.Interactable.__init__(self, key)

		def render(self, shell, offset, line, page = 0, index = -1, lines_before = -1):
			pass

class SelectiveShell(InteractiveShell):
	page_cursor_offset = -1
	pending_hover_offset = 0
	blocked_in_page = False

	def __init__(self, stdin = sys.stdin, stdout = sys.stdout, infinite_scroll = False, lines_per_page = 6):
		InteractiveShell.__init__(self, stdin, stdout, infinite_scroll, lines_per_page)
		self.eof_when_enter = True

	def turn_backward(self):
		if not self.blocked_in_page:
			InteractiveShell.turn_backward(self)
		self.page_cursor_offset += 1
		self.pending_hover_offset = -2

	def turn_forward(self):
		if not self.blocked_in_page:
			InteractiveShell.turn_forward(self)
		self.page_cursor_offset -= 1
		self.pending_hover_offset = 2

	def turn_up(self):
		if self.page_cursor_offset > 0 or self.infinite_scroll or self.global_buffer_offset > 0:
			self.pending_hover_offset = -1 if not self.blocked_in_page else -2

	def turn_down(self):
		if (self.page_cursor_offset < self.page_buffer_offset and self.which() < len(self.interactables) - 1) or self.infinite_scroll:
			self.pending_hover_offset = 1 if not self.blocked_in_page else 2

	def hover_previous(self):
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

	def hover_next(self):
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

	def touch(self, interactable, key):
		if isinstance(interactable, SelectiveShell.Selectable):
			try:
				return interactable.observe_key(key, self.interactables.index(interactable) == self.which())
			except ValueError:
				pass
		return InteractiveShell.touch(self, interactable, key)

	def render(self):
		InteractiveShell.render(self)
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

	def observe(self, raw):
		if self.eof_when_enter and ord(raw) in {10, 13}: # Enter
			if self.which() == -1:
				return False
			raise EOFError()
		observed = Shell.observe(self, raw)
		if raw != "\x1b" and raw != "\xe0":
			return observed
		key = self.input_raw(1)
		if raw == "\xe0":
			if key == "H": # Up
				self.turn_up()
			elif key == "P": # Down
				self.turn_down()
			elif key == "M": # Right
				self.turn_forward()
			elif key == "K": # Left
				self.turn_backward()
			else:
				return observed
			return True
		if key != "[":
			return observed
		joy = self.input_raw(1)
		if joy == "A": # Up
			self.turn_up()
		elif joy == "B": # Down
			self.turn_down()
		elif joy == "C": # Right
			self.turn_forward()
		elif joy == "D": # Left
			self.turn_backward()
		else:
			return observed
		return True

	def draw(self, interactable, page, page_occupied_lines):
		if isinstance(interactable, SelectiveShell.Selectable):
			return interactable.render(self, self.offset, self.line, page, self.page_buffer_offset, page_occupied_lines, self.page_cursor_offset == self.page_buffer_offset)
		return InteractiveShell.draw(self, interactable, page, page_occupied_lines)

	def enter(self):
		self.page_cursor_offset = -1
		self.pending_hover_offset = 2
		InteractiveShell.enter(self)

	def hovered(self):
		interactable = self.get_interactable(self.which())
		return interactable.hoverable() if isinstance(interactable, SelectiveShell.Selectable) else False

	def which(self):
		return self.global_buffer_offset + self.page_cursor_offset if self.page_cursor_offset != -1 else -1

	def what(self):
		try:
			return self.interactables[self.which()].key
		except IndexError:
			return None

	class Selectable(InteractiveShell.Interactable):
		def __init__(self, key):
			InteractiveShell.Interactable.__init__(self, key)

		def render(self, shell, offset, line, page = 0, index = -1, lines_before = -1, at_cursor = None):
			pass

		def hoverable(self):
			return True

		def placeholder(self):
			pass

		def observe_key(self, what, at_cursor = None):
			return False

class Separator(Shell.Interactable):
	def __init__(self, key = "separator", size = 1):
		Shell.Interactable.__init__(self, key)
		self.size = size

	def render(self, shell, offset, line):
		shell.write("\n" * self.size)

	def lines(self, shell):
		return self.size

class Notice(Shell.Interactable):
	def __init__(self, key, text = None):
		Shell.Interactable.__init__(self, key)
		self.text = text if text is not None else key

	def render(self, shell, offset, line):
		shell.write(str(self.text) + "\n")

	def lines(self, shell):
		return str(self.text).count("\n") + 1

class Entry(SelectiveShell.Selectable):
	def __init__(self, key, text = None, arrow = "> "):
		SelectiveShell.Selectable.__init__(self, key)
		self.text = text if text is not None else key
		self.arrow = arrow

	def get_arrow(self, at_cursor = None):
		return "" if at_cursor is None else \
			str(self.arrow) if at_cursor else " " * len(self.arrow)

	def render(self, shell, offset, line, page = 0, index = -1, lines_before = -1, at_cursor = None):
		shell.write(self.get_arrow(at_cursor) + str(self.text) + "\n")

	def placeholder(self):
		return str(self.text).partition("\n")[0]

	def lines(self, shell):
		return str(self.text).count("\n") + 1

class Switch(Entry):
	def __init__(self, key, text = None, checked = False, arrow = "> ", checked_arrow = "* ", hover_arrow = ">*"):
		Entry.__init__(self, key, text, arrow)
		self.checked_arrow = checked_arrow
		self.checked = checked
		self.hover_arrow = hover_arrow

	def get_arrow(self, at_cursor = None):
		return str(self.hover_arrow) if at_cursor and self.checked else \
			str(self.arrow) if at_cursor else str(self.checked_arrow) if self.checked else " " * len(self.arrow)

	def observe_key(self, what, at_cursor = None):
		if at_cursor and ord(what) in {10, 13}:
			self.checked = not self.checked
			return True
		return Entry.observe_key(self, what)

class Input(Entry):
	def __init__(self, key, hint = None, text = "", arrow = "> ", template = None, maximum_length = 40):
		Entry.__init__(self, key, text, arrow)
		self.hovered = False
		self.hint = hint
		self.template = template
		self.maximum_length = maximum_length

	def render(self, shell, offset, line, page = 0, index = -1, lines_before = -1, at_cursor = None):
		shell.write(self.get_arrow(at_cursor) + (str(self.hint) if self.hint is not None else "") +
			("" if self.hovered else "\x1b[2m") + (self.text if len(self.text) > 0 or self.hovered else \
				"..." if self.template is None else self.template) + ("\x1b[7m " if self.hovered else "") + "\x1b[0m\n")

	def read(self):
		return self.template if not self.hovered and len(self.text) == 0 and self.template is not None else self.text

	def observe_key(self, what, at_cursor = None):
		if at_cursor:
			if ord(what) in {10, 13}:
				self.hovered = not self.hovered
				return True
			if self.hovered:
				if what == "\x7f":
					if len(self.text) > 0:
						self.text = self.text[::-1][1:][::-1]
					else:
						self.hovered = False
				elif what.isprintable() and len(self.text + what) <= self.maximum_length:
					self.text += what
				return True
		return Entry.observe_key(self, what)

class Progress(Shell.Interactable):
	def __init__(self, key = "progress", progress = 0, weight = 49, text = None):
		Shell.Interactable.__init__(self, key)
		self.progress = progress
		self.weight = weight
		self.text = text

	def render(self, shell, offset, line):
		text = (str(self.text) if self.text is not None else str(int(self.progress * 100)) + "%").center(self.weight)
		size = int(self.weight * self.progress)
		shell.write("\x1b[7m" + text[:size] + "\x1b[2m" + text[size:self.weight] + "\x1b[0m\n")

	def seek(self, progress, text = None):
		self.progress = progress
		if text is not None:
			self.text = text

	def lines(self, shell):
		return (str(self.text).count("\n") if self.text is not None else 0) + 1

class Interrupt(InteractiveShell.Interactable):
	def __init__(self, key = "interrupt", occupied_page = True):
		InteractiveShell.Interactable.__init__(self, key)
		self.ocuppied_page = occupied_page

	def render(self, shell, offset, line, page = 0, index = -1, lines_before = -1):
		raise EOFError()

	def lines(self, shell):
		return shell.lines_per_page if self.ocuppied_page else 0

class Debugger(SelectiveShell.Selectable):
	def __init__(self, key = "debugger"):
		SelectiveShell.Selectable.__init__(self, key)

	def render(self, shell, offset, line, page = 0, index = -1, lines_before = -1, at_cursor = None):
		shell.write(f"Page {page}:{shell.global_buffer_offset}, offset {offset}/{shell.page_buffer_offset}, cursor {shell.page_cursor_offset}\n")

	def hoverable(self):
		return False

def select_prompt(prompt = None, *variants, fallback = None, what_not_which = False):
	if prompt is not None:
		print(prompt, end="")
	shell = SelectiveShell(infinite_scroll=True)
	for variant in variants:
		shell.interactables.append(Entry(variant))
	try:
		shell.loop()
		result = shell.which()
	except KeyboardInterrupt:
		result = fallback
	interactable = shell.get_interactable(result)
	try:
		print((prompt + " " if prompt is not None else "") + "\x1b[2m" + interactable.placeholder() + "\x1b[0m")
	except ValueError:
		pass
	return result if not what_not_which else interactable.key if interactable is not None else None


if __name__ == "__main__":
	shell = Shell()
	while True:
		try:
			key = shell.input(1)
		except KeyboardInterrupt:
			break
		print(ord(key), ": ", str(key.encode("unicode-escape"))[2:][::-1][1:][::-1].replace("\\\\", "\\"), sep="")
