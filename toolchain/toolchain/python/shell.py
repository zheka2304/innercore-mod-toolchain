import sys
import os
import termios
import tty

from ansi_escapes import *

def mute_input():
    with open(os.devnull, "r") as devnull:
        sys_stdin = sys.stdin
        sys.stdin = devnull
        try:
            yield
        finally:
            sys.stdin = sys_stdin

def mute_output():
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
        self.write(cursorUp(count))

    def down(self, count):
        self.write(cursorDown(count))

    def right(self, count):
        self.write(cursorForward(count))

    def left(self, count):
        self.write(cursorBackward(count))

    def clear(self):
        if self.line > 0:
            self.stdout.write(eraseLines(self.line + 1))
            self.line = 0
        self.offset = 0

    def loop():
        pass

class InteractiveShell(Shell):
    def __init__(self):
        Shell.__init__(self)

    def read_raw(self, count = 1):
        return input_key(count)

    def read(self, count = 1):
        key = self.read_raw(count)
        if key == "\x03": # Ctrl+C
            raise KeyboardInterrupt()
        return key

    def readline(self, count = 1):
        buffer = ""
        while count > 0:
            key = self.read()
            if key == "\r":
                buffer += "\n"
                count -= 1
            else:
                buffer += key
        return buffer

    def hide_cursor(self):
        self.write(cursorHide)

    def show_cursor(self):
        self.write(cursorShow)

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
        if key == "\r": # Enter
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
            self.write("\x1b[2m" + self.prompt + "\x1b[0m " + self.what() + "\n")
        self.show_cursor()

    def what(self):
        if self.selected == -1:
            return None
        return self.keys[self.selected]

    def which(self):
        return self.selected


if __name__ == "__main__":
    while True:
        key = input_key()
        if key == "\x03":
            break
        print(ord(key), ": ", str(key.encode("unicode-escape"))[2:][::-1][1:][::-1].replace("\\\\", "\\"), sep="")
