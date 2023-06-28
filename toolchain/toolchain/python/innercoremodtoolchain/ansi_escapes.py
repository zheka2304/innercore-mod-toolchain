from platform import system
from typing import Dict, Optional

ESC = "\u001B["
OSC = "\u001B]"

CURSOR_LEFT = ESC + "G"
CURSOR_SAVE_POSITION = ESC + "s"
CURSOR_RESTORE_POSITION = ESC + "u"
CURSOR_GET_POSITION = ESC + "6n"
CURSOR_NEXT_LINE = ESC + "E"
CURSOR_PREV_LINE = ESC + "F"
CURSOR_HIDE = ESC + "?25l"
CURSOR_SHOW = ESC + "?25h"

ERASE_END_LINE = ESC + "K"
ERASE_START_LINE = ESC + "1K"
ERASE_LINE = ESC + "2K"
ERASE_DOWN = ESC + "J"
ERASE_UP = ESC + "1J"
ERASE_SCREEN = ESC + "2J"
SCROLL_UP = ESC + "S"
SCROLL_DOWN = ESC + "T"

CLEAR_SCREEN = "\u001Bc"

CLEAR_TERMINAL = f"{ERASE_SCREEN}{ESC}0f" if system() == "Windows" else f"{ERASE_SCREEN}{ESC}3J{ESC}H"

BEEP = "\u0007"

def cursor_to(x: Optional[int], y: Optional[int] = None) -> str:
	if x is None:
		raise TypeError("The `x` argument is required")
	if y is None:
		return ESC + str(x + 1) + "G"
	return ESC + str(y + 1) + ";" + str(x + 1) + "H"

def cursor_move(x: Optional[int], y: Optional[int] = 0) -> str:
	if x is None:
		raise TypeError("The `x` argument is required")
	returnValue = ""
	if x < 0:
		returnValue += ESC + str(-x) + "D"
	elif x > 0:
		returnValue += ESC + str(x) + "C"
	if y is not None:
		if y < 0:
			returnValue += ESC + str(-y) + "A"
		elif y > 0:
			returnValue += ESC + str(y) + "B"
	return returnValue

def cursor_up(count: int = 1) -> str:
	return ESC + str(count) + "A"

def cursor_down(count: int = 1) -> str:
	return ESC + str(count) + "B"

def cursor_forward(count: int = 1) -> str:
	return ESC + str(count) + "C"

def cursor_backward(count: int = 1) -> str:
	return ESC + str(count) + "D"

def erase_lines(count: int) -> str:
	clear = ""
	for i in range(count - 1):
		clear += ERASE_LINE + (cursor_up() if i < count - 1 else "")
	if count > 0:
		clear += CURSOR_LEFT
	return clear

def link(text: str, url: Optional[str] = None) -> str:
	return f"{OSC}8;;{url if url is not None else text}{BEEP}{text}{OSC}8;;{BEEP}"

def image(base64: str, options: Optional[Dict[str, object]] = None) -> str:
	returnValue = OSC + "1337;File=inline=1"
	if options is not None:
		if "width" in options:
			returnValue += ";width=" + str(options["width"])
		if "height" in options:
			returnValue += ";height=" + str(options["height"])
		if "preserveAspectRatio" in options and options["preserveAspectRatio"] == False:
			returnValue += ";preserveAspectRatio=0"
	return returnValue + ":" + base64 + BEEP
