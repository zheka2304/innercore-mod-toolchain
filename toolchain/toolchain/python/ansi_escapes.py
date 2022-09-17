ESC = "\u001B["
OSC = "\u001B]"

cursorLeft = ESC + "G"
cursorSavePosition = ESC + "s"
cursorRestorePosition = ESC + "u"
cursorGetPosition = ESC + "6n"
cursorNextLine = ESC + "E"
cursorPrevLine = ESC + "F"
cursorHide = ESC + "?25l"
cursorShow = ESC + "?25h"

eraseEndLine = ESC + "K"
eraseStartLine = ESC + "1K"
eraseLine = ESC + "2K"
eraseDown = ESC + "J"
eraseUp = ESC + "1J"
eraseScreen = ESC + "2J"
scrollUp = ESC + "S"
scrollDown = ESC + "T"

clearScreen = "\u001Bc"

from platform import system
clearTerminal = f"{eraseScreen}{ESC}0f" if system() == "Windows" else f"{eraseScreen}{ESC}3J{ESC}H"

beep = "\u0007"

def cursorTo(x, y = None):
	if x is None:
		raise TypeError("The `x` argument is required")
	if y is None:
		return ESC + str(x + 1) + "G"
	return ESC + str(y + 1) + ";" + str(x + 1) + "H"

def cursorMove(x, y = 0):
	if x is None:
		raise TypeError("The `x` argument is required")
	returnValue = ""
	if x < 0:
		returnValue += ESC + str(-x) + "D"
	elif x > 0:
		returnValue += ESC + str(x) + "C"
	if y < 0:
		returnValue += ESC + str(-y) + "A"
	elif y > 0:
		returnValue += ESC + str(y) + "B"
	return returnValue

def cursorUp(count = 1):
	return ESC + str(count) + "A"

def cursorDown(count = 1):
	return ESC + str(count) + "B"

def cursorForward(count = 1):
	return ESC + str(count) + "C"

def cursorBackward(count = 1):
	return ESC + str(count) + "D"

def eraseLines(count):
	clear = ""
	for i in range(count - 1):
		clear += eraseLine + (cursorUp() if i < count - 1 else "")
	if count > 0:
		clear += cursorLeft
	return clear

def link(text, url = None):
	return f"{OSC}8;;{url if url is not None else text}{beep}{text}{OSC}8;;{beep}"

def image(base64, options = {}):
	returnValue = OSC + "1337;File=inline=1"
	if "width" in options:
		returnValue += ";width=" + str(options["width"])
	if "height" in options:
		returnValue += ";height=" + str(options["height"])
	if "preserveAspectRatio" in options and options["preserveAspectRatio"] == False:
		returnValue += ";preserveAspectRatio=0"
	return returnValue + ":" + base64 + beep
