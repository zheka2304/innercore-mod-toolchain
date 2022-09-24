import sys
import os
import termios
import tty

from ansi_escapes import *

def print_progress_bar(iteration, total, suffix = "", decimals = 1, length = 50, fill = "\u2588"):
	percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
	filled_length = int(length * iteration // total)
	bar = fill * filled_length + "\x1b[2m" + fill * (length - filled_length) + "\x1b[0m"
	print(f"\r {bar} {percent}% {suffix}", end = "\r")
	if iteration == total: 
		print()

class MuteInput():
	def __enter__(self):
		with open(os.devnull, "r") as devnull:
			sys_stdin = sys.stdin
			sys.stdin = devnull
			try:
				yield
			finally:
				sys.stdin = sys_stdin

	def __exit__(self, exc_type, exc_value, traceback):
		pass

class MuteOutput():
	def __enter__(self):
		with open(os.devnull, "w") as devnull:
			sys_stdout = sys.stdout
			sys_stderr = sys.stderr
			sys.stdout = devnull
			sys.stderr = devnull
			try:
				yield
			finally:
				sys.stdout = sys_stdout
				sys.stderr = sys_stderr

	def __exit__(self, exc_type, exc_value, traceback):
		pass

def input_key(count = 1):
	fd = sys.stdin.fileno()
	term_attrs = termios.tcgetattr(fd)
	try:
		tty.setraw(fd)
		key = sys.stdin.read(count)
	finally:
		termios.tcsetattr(fd, termios.TCSADRAIN, term_attrs)
	return key

class Shell():
	def __init__(self, stdin = sys.stdin, stdout = sys.stdout):
		self.offset = 0
		self.line = 0
		self.stdin = stdin
		self.stdout = stdout

	def read(self, count = 1):
		return self.stdin.read(count)

	def readline(self, count = 1):
		return self.stdin.readline(count)

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

	def loop():
		pass

class InteractiveShell(Shell):
	def __init__(self, stdin = sys.stdin, stdout = sys.stdout):
		Shell.__init__(self, stdin, stdout)
		self.eof_when_enter = False
		self.interactables = []

	def read_raw(self, count = 1):
		return input_key(count)

	def read(self, count = 1):
		key = self.read_raw(count)
		if key == "\x03" or key == "\x1a": # Ctrl+C or Ctrl+Z
			raise KeyboardInterrupt()
		return key

	def observe(self, key):
		if self.eof_when_enter and ord(key) in {10, 13}: # Enter
			raise EOFError()
		return False

	def readline(self, count = 1):
		buffer = ""
		while count > 0:
			key = self.read()
			if ord(key) in {10, 13}: # Enter
				if count > 1:
					buffer += "\n"
				count -= 1
			else:
				buffer += key
		return buffer

	def get_interactable(self, criteria):
		try:
			return self.interactables[criteria]
		except IndexError:
			pass
		for interactable in self.interactables:
			if interactable.key == criteria:
				return interactable
		raise ValueError(criteria)

	def draw(self, interactable):
		interactable.render(self, self.offset, self.line)

	def touch(self, interactable, key):
		return interactable.observe_key(key)

	def render(self):
		self.clear()
		self.write("\n")
		for interactable in self.interactables:
			self.draw(interactable)

	def loop(self):
		self.hide_cursor()
		self.render()
		while True:
			try:
				key = self.read(1)
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
		self.clear()
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

		def lines(self):
			return 0

class InteractivePagerShell(InteractiveShell):
	page_buffer_offset = 0
	global_buffer_offset = 0
	page = 1

	def __init__(self, stdin = sys.stdin, stdout = sys.stdout, infinite_scroll = False, lines_per_page = 6):
		InteractiveShell.__init__(self, stdin, stdout)
		self.infinite_scroll = infinite_scroll
		self.lines_per_page = lines_per_page

	def observe(self, raw):
		observed = InteractiveShell.observe(self, raw)
		if raw != "\x1b":
			return observed
		key = self.read_raw(1)
		if key != "[":
			return observed
		joy = self.read_raw(1)
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
					lines = self.interactables[index].lines()
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
			lines = self.interactables[index - 1].lines()
			if lines > self.lines_per_page or lines < 0:
				raise BufferError()
			if page_occupied_lines + lines > self.lines_per_page:
				break
			page_occupied_lines += lines
			index -= 1
		self.global_buffer_offset = index
		self.page_buffer_offset = 0
		self.page -= 1

	def reset(self):
		self.global_buffer_offset = self.page_buffer_offset = 0
		self.page = 1

	def draw(self, interactable, page, page_occupied_lines):
		if isinstance(interactable, InteractivePagerShell.Interactable):
			interactable.render(self, self.offset, self.line, page, self.page_buffer_offset, page_occupied_lines)
		else:
			InteractiveShell.draw(self, interactable)

	def render(self):
		self.clear()
		if self.global_buffer_offset >= len(self.interactables):
			raise IndexError()
		self.write("\n")
		page_occupied_lines = 0
		self.page_buffer_offset = 0
		while self.global_buffer_offset + self.page_buffer_offset < len(self.interactables):
			interactable = self.interactables[self.global_buffer_offset + self.page_buffer_offset]
			lines = interactable.lines()
			if lines > self.lines_per_page or lines < 0:
				raise BufferError()
			if page_occupied_lines + lines > self.lines_per_page:
				break
			self.draw(interactable, self.page, page_occupied_lines)
			page_occupied_lines += lines
			self.page_buffer_offset += 1

	def loop(self):
		self.reset()
		InteractiveShell.loop(self)

	class Interactable(InteractiveShell.Interactable):
		def __init__(self, key):
			InteractiveShell.Interactable.__init__(self, key)

		def render(self, shell, offset, line, page = 0, index = -1, lines_before = -1):
			pass

class SelectiveShell(InteractivePagerShell):
	page_cursor_offset = -1
	pending_hover_offset = 0

	def __init__(self, stdin = sys.stdin, stdout = sys.stdout, infinite_scroll = False, lines_per_page = 6):
		InteractivePagerShell.__init__(self, stdin, stdout, infinite_scroll, lines_per_page)
		self.eof_when_enter = True

	def turn_backward(self):
		InteractivePagerShell.turn_backward(self)
		self.page_cursor_offset += 1
		self.pending_hover_offset = -2

	def turn_forward(self):
		InteractivePagerShell.turn_forward(self)
		self.page_cursor_offset -= 1
		self.pending_hover_offset = 2

	def turn_up(self):
		if self.page_cursor_offset > 0 or self.infinite_scroll or self.global_buffer_offset > 0:
			self.pending_hover_offset = -1

	def turn_down(self):
		if (self.page_cursor_offset < self.page_buffer_offset and self.global_buffer_offset + self.page_cursor_offset < len(self.interactables) - 1) or self.infinite_scroll:
			self.pending_hover_offset = 1

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
				return interactable.observe_key(key, self.interactables.index(interactable) == self.global_buffer_offset + self.page_cursor_offset)
			except ValueError:
				pass
		return InteractivePagerShell.touch(self, interactable, key)

	def render(self):
		InteractivePagerShell.render(self)
		if self.pending_hover_offset != 0:
			if self.pending_hover_offset <= -1:
				if not self.hover_previous():
					if self.pending_hover_offset == -1:
						if self.infinite_scroll or self.global_buffer_offset > 0:
							self.page_cursor_offset = self.lines_per_page
							InteractivePagerShell.turn_backward(self)
							InteractivePagerShell.render(self)
							if not self.hover_previous():
								self.page_cursor_offset = -1
					elif not self.hover_next():
						self.page_cursor_offset = -1
				InteractivePagerShell.render(self)
			elif self.pending_hover_offset >= 1:
				if not self.hover_next():
					if self.pending_hover_offset == 1:
						self.page_cursor_offset = -1
						InteractivePagerShell.turn_forward(self)
						InteractivePagerShell.render(self)
						if not self.hover_next():
							self.page_cursor_offset = -1
					elif not self.hover_previous():
						self.page_cursor_offset = -1
				InteractivePagerShell.render(self)
			self.pending_hover_offset = 0
		self.write(f"Page {str(self.page)} offset {str(self.global_buffer_offset)} entry {str(self.page_cursor_offset)} of {str(self.page_buffer_offset)}\n")

	def observe(self, raw):
		observed = InteractiveShell.observe(self, raw)
		if raw != "\x1b":
			return observed
		key = self.read_raw(1)
		if key != "[":
			return observed
		joy = self.read_raw(1)
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
			interactable.render(self, self.offset, self.line, page, self.page_buffer_offset, page_occupied_lines, self.page_cursor_offset == self.page_buffer_offset)
		else:
			InteractivePagerShell.draw(self, interactable, page, page_occupied_lines)

	def reset(self):
		InteractivePagerShell.reset(self)
		self.page_cursor_offset = -1
		self.pending_hover_offset = 2

	def which(self):
		return self.global_buffer_offset + self.page_cursor_offset

	def what(self):
		try:
			return self.interactables[self.which()].key
		except IndexError:
			return None

	class Selectable(InteractivePagerShell.Interactable):
		def __init__(self, key):
			InteractivePagerShell.Interactable.__init__(self, key)

		def render(self, shell, offset, line, page = 0, index = -1, lines_before = -1, at_cursor = None):
			pass

		def hoverable(self):
			return True

		def placeholder(self, shell, offset, line):
			pass

		def observe_key(self, what, at_cursor = None):
			return False

class Separator(InteractiveShell.Interactable):
	def __init__(self, key = "separator", size = 1):
		InteractiveShell.Interactable.__init__(self, key)
		self.size = size

	def render(self, shell, offset, line):
		shell.write("\n" * self.size)

	def lines(self):
		return self.size

class Notice(InteractiveShell.Interactable):
	def __init__(self, key, text = None):
		InteractiveShell.Interactable.__init__(self, key)
		self.text = text if text is not None else key

	def render(self, shell, offset, line):
		shell.write(str(self.text) + "\n")

	def lines(self):
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

	def placeholder(self, shell, offset, line):
		return str(self.text).partition("\n")[0]

	def lines(self):
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
	def __init__(self, key, hint = None, text = "", arrow = "> "):
		Entry.__init__(self, key, text, arrow)
		self.hovered = False
		self.hint = hint

	def render(self, shell, offset, line, page = 0, index = -1, lines_before = -1, at_cursor = None):
		shell.write(self.get_arrow(at_cursor) + (str(self.hint) if self.hint is not None else "") +
			("" if self.hovered else "\x1b[2m") + (self.text if len(self.text) > 0 or self.hovered else "...") + ("" if self.hovered else "\x1b[0m") + "\n")

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
				elif what.isprintable():
					self.text += what
				return True
		return Entry.observe_key(self, what)

class Progress(InteractiveShell.Interactable):
	def __init__(self, key, progress = 0, weight = 49, text = None):
		InteractiveShell.Interactable.__init__(self, key)
		self.progress = max(min(progress, 100), 0)
		self.weight = weight
		self.text = text

	def render(self, shell, offset, line):
		text = (str(self.text) if self.text is not None else str(int(self.progress)) + "%").center(self.weight)
		size = int(self.weight * self.progress // 100)
		shell.write("\x1b[7m" + text[:size] + "\x1b[2m" + text[size:self.weight] + "\x1b[0m\n" + text[self.weight:])

	def lines(self):
		return (str(self.text).count("\n") if self.text is not None else 0) + 1

class SelectionShell(InteractiveShell):
	def __init__(self, prompt = "Which you prefer?", arrow = "> ", arrow_offset = None):
		self.selected = -1
		self.variants = []
		self.keys = []
		self.prompt = prompt
		self.arrow = str(arrow)
		self.arrow_offset = len(self.arrow) if arrow_offset is None else arrow_offset
		InteractiveShell.__init__(self)

	def variant(self, key, what):
		self.keys.append(key)
		self.variants.append(what)

	def read_key(self):
		key = self.read(1)
		if ord(key) in {10, 13}: # Enter
			raise EOFError()
		if key != "\x1b":
			return 0
		key = self.read_raw(1)
		if key != "[":
			return 0
		key = self.read_raw(1)
		if key == "A": # Up
			return 1
		elif key == "B": # Down
			return 2
		elif key == "C": # Right
			return 3
		elif key == "D": # Left
			return 4
		return 0

	def render(self):
		index = 0
		self.clear()
		self.write(self.prompt)
		for variant in self.variants:
			if index != self.selected:
				self.write("\n" + " " * self.arrow_offset + variant)
			else:
				self.write("\n" + self.arrow + variant)
			index += 1

	def loop(self):
		if len(self.variants) == 0:
			raise ValueError("Selection requires at least one variant")
		self.selected = 0
		if len(self.variants) == 1:
			return
		self.hide_cursor()
		self.render()
		while True:
			try:
				code = self.read_key()
				if code == 1:
					if self.selected > 0:
						self.selected -= 1
					else:
						self.selected = len(self.variants) - 1
				elif code == 2:
					self.selected += 1
					if self.selected >= len(self.variants):
						self.selected = 0
				elif code == 3:
					self.selected = len(self.variants) - 1
				elif code == 4:
					self.selected = 0
				else:
					continue
				self.render()
			except EOFError:
				break
			except KeyboardInterrupt as err:
				self.selected = -1
				self.leave()
				raise err
		self.leave()

	def leave(self):
		self.clear()
		if self.selected != -1:
			self.write(self.prompt + " \x1b[2m" + self.what() + "\x1b[0m\n")
		self.show_cursor()

	def what(self):
		if self.selected == -1:
			return None
		return self.keys[self.selected]

	def which(self):
		return self.selected

def select_prompt(prompt = None, *variants, fallback = None):
	shell = SelectionShell(prompt)
	for variant in variants:
		shell.variant(variant, variant)
	try:
		shell.loop()
	except KeyboardInterrupt:
		return fallback
	return shell.which()

if __name__ == "__main__":
	while True:
		key = input_key()
		if key == "\x03" or key == "\x1a":
			break
		print(ord(key), ": ", str(key.encode("unicode-escape"))[2:][::-1][1:][::-1].replace("\\\\", "\\"), sep="")
