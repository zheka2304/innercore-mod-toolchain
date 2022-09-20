import os
from os.path import join, relpath, basename
import platform
import re
import subprocess
from glob import glob

from make_config import make_config
from hash_storage import output_storage
from shell import print_progress_bar, select_prompt
from ansi_escapes import link

def get_modpack_push_directory():
	directory = make_config.get_value("pushTo")
	if directory is None:
		make_config.json["pushTo"] = setup_modpack_directory()
		make_config.save()
		return get_modpack_push_directory()
	directory = join(directory, "mods", basename(make_config.get_value("currentProject")))
	if "games/horizon/packs" not in directory and not make_config.get_value("device.pushAnyLocation", False):
		print(
			f"Push directory {directory} looks suspicious, it does not belong to Horizon packs directory. " +
			"This action may easily corrupt all content inside, allow it only if you know what are you doing."
		)
		which = select_prompt(
			"What will you do?",
			"Choice another modpack",
			"Push it anyway",
			"No questions, always push",
			"Nothing", fallback=3
		)
		if which == 0:
			del make_config.json["pushTo"]
			return get_modpack_push_directory()
		elif which == 2:
			if not "device" in make_config.json:
				make_config.json["device"] = {}
			make_config.json["device"]["pushAnyLocation"] = True
			make_config.save()
			print("This may be changed in your toolchain.json config.")
		elif which == 3:
			print("Pushing aborted.")
			return None
	return directory

def ls_pack(path):
	list = [path + "/innercore"] if "mods" in ls(path + "/innercore") else []
	return list + [path + "/modpacks/" + directory for directory in ls(path + "/modpacks")]

def person_readable_modpack_name(path):
	what = path.split("/")[::-1]
	try:
		suffix = " (internal)" if "Android/data" in path else ""
		if what[0] == "com.mojang":
			return "Legacy Core Engine" + suffix
		if what[0] == "innercore":
			return what[1] + suffix
		if what[3] == "packs":
			return f"{basename(path)} in {what[2]}" + suffix
		return "/".join(what[0:2][::-1]) + suffix
	except IndexError:
		pass
	return basename(path)

def setup_modpack_directory(directories = []):
	pack_directories = ls("/storage/emulated/0/games/horizon/packs")
	for directory in pack_directories:
		directories += ls_pack("/storage/emulated/0/games/horizon/packs/" + directory)
	pack_directories = ls("/storage/emulated/0/Android/data/com.zheka.horizon/files/horizon/packs")
	for directory in pack_directories:
		directories += ls_pack("/storage/emulated/0/Android/data/com.zheka.horizon/files/horizon/packs/" + directory)
	if "mods" in ls("/storage/emulated/0/games/com.mojang"):
		directories.append("/storage/emulated/0/games/com.mojang")
	if len(directories) == 0:
		print(
			"It seems your device doesn't contain any Inner Core pack directory. " +
			"If not, describe output path manually in toolchain.json."
		)
		return None
	which = select_prompt("Which modpack will be used?", *[
		person_readable_modpack_name(directory) for directory in directories
	])
	return None if which is None else directories[which]

def ls(path, *args):
	try:
		pipe = subprocess.run(adb_command + [
			"shell", "ls", path
		] + list(args), text=True, check=True, capture_output=True)
	except subprocess.CalledProcessError as err:
		if err.returncode != 1:
			print("adb shell ls failed with code", err.returncode)
		return []
	return pipe.stdout.rstrip().splitlines()

def push(directory, pushUnchanged = False):
	items = [relpath(path, directory) for path in glob(directory + "/*") if pushUnchanged or output_storage.is_path_changed(path)]
	if len(items) < 1:
		print_progress_bar(1, 1, suffix = "Nothing to push.", length = 50)
		return 0

	dst_root = get_modpack_push_directory()
	if dst_root is None:
		return -1

	dst_root = dst_root.replace("\\", "/")
	if not dst_root.startswith("/"):
		dst_root = "/" + dst_root
	src_root = directory.replace("\\", "/")

	progress = 0
	from task import devnull
	for filename in items:
		src = src_root + "/" + filename
		dst = dst_root + "/" + filename
		print_progress_bar(progress, len(items), suffix = f"Pushing {filename}" + (" " * 20), length = 50)
		subprocess.call(adb_command + [
			"shell", "rm", "-r", dst
		], stderr=devnull, stdout=devnull)
		result = subprocess.call(adb_command + [
			"push", src, dst
		], stderr=devnull, stdout=devnull)
		progress += 1

		if result != 0:
			print(f"Failed to push to directory {dst_root} with code {result}")
			return result

	print_progress_bar(progress, len(items), suffix = "Complete!" + (" " * 20), length = 50)
	if not pushUnchanged:
		output_storage.save()
	return result

def make_locks(*locks):
	dst = get_modpack_push_directory()
	if dst is None:
		return -1

	for lock in locks:
		lock = join(dst, lock).replace("\\", "/")
		result = subprocess.call(adb_command + [
			"shell", "touch", lock
		])
		if result != 0:
			return result
	return 0

def ensure_server_running():
	try:
		subprocess.run([
			make_config.get_adb(),
			"start-server"
		], check=True)
		return True
	except subprocess.CalledProcessError as err:
		print("adb start-server failed with code", err.returncode)
		return False

STATE_UNKNOWN = -1
STATE_DEVICE_CONNECTED = 0
STATE_NO_DEVICES = 1
STATE_DISCONNECTED = 2
STATE_DEVICE_AUTHORIZING = 3

def which_state(what = None):
	if what is None:
		return STATE_UNKNOWN
	try:
		return {
			"no devices": STATE_NO_DEVICES,
			"device": STATE_DEVICE_CONNECTED,
			"authorizing": STATE_DEVICE_AUTHORIZING
		}[what]
	except KeyError:
		return STATE_DISCONNECTED

def get_device_state():
	try:
		pipe = subprocess.run([
			make_config.get_adb(),
			"get-state"
		], text=True, check=True, capture_output=True)
	except subprocess.CalledProcessError as err:
		if err.returncode == 1:
			return STATE_NO_DEVICES
		print("adb get-state failed with code", err.returncode)
		return STATE_UNKNOWN
	return which_state(pipe.stdout.strip())

def get_device_serial():
	try:
		pipe = subprocess.run([
			make_config.get_adb(),
			"get-serialno"
		], text=True, check=True, capture_output=True)
	except subprocess.CalledProcessError as err:
		print("adb get-serialno failed with code", err.returncode)
		return None
	return pipe.stdout.strip()

def device_list():
	try:
		pipe = subprocess.run([
			make_config.get_adb(),
			"devices", "-l"
		], text=True, check=True, capture_output=True)
	except subprocess.CalledProcessError as err:
		print("adb devices failed with code", err.returncode)
		return None
	data = pipe.stdout.rstrip().splitlines()
	data.pop(0)
	devices = []
	for device in data:
		device = re.split(r"\s+", device)
		devices.append({
			"serial": device[0],
			"state": which_state(device[1]),
			"data": device[2:]
		})
	return devices

def person_readable_device_name(device):
	if "data" in device:
		for property in device["data"]:
			what = property.partition(":")
			if what[0] == "model":
				return f"{device['serial']} ({what[2]})"
	return device["serial"]

def which_device_will_be_connected(*devices, stateDoesntMatter = False):
	devices = [device for device in devices
		if device["state"] == STATE_DEVICE_CONNECTED
		or device["state"] == STATE_DEVICE_AUTHORIZING
		or stateDoesntMatter]
	if len(devices) < 2:
		return None if len(devices) == 0 else devices[0]
	which = select_prompt("Which device will be used?", *[
		person_readable_device_name(device) for device in devices
	] + ["I don't see my device"])
	return None if which is None or which == len(devices) else devices[which]

def get_adb_command():
	ensure_server_running()
	which = setup_device_connection()
	if which is None:
		print("Nothing will happened, adb set up interrupted.")
		exit(1)
	return which

def get_adb_command_by_serial(serial):
	ensure_server_running()
	return [
		make_config.get_adb(),
		"-s", serial
	]

def setup_device_connection():
	if not "device" in make_config.json or get_device_state() == STATE_NO_DEVICES:
		print(
			"Howdy! " +
			"Before starting we're must set up your devices, don't you think so? " +
			"Let's configure some connections."
		)
	which = select_prompt(
		"How connection will be performed?",
		"I've connected device via cable",
		"Over air/network will be best",
		"Connect with pairing code",
		"Everything already performed",
		"Wha.. I don't understand!",
		"It will be performed later"
	)
	return None if which == 5 else \
		setup_how_to_use() if which == 4 else \
		setup_externally() if which == 3 else \
		setup_via_usb() if which == 0 else \
		setup_via_network(which == 2)

def setup_via_usb():
	try:
		print("Listening device via cable...")
		print(f"* Press Ctrl+{'Z' if platform.system() == 'Windows' else 'C'} to leave")
		subprocess.run([
			make_config.get_adb(),
			"wait-for-usb-device"
		], check=True, timeout=120.0)
		serial = subprocess.run([
			make_config.get_adb(),
			"-d", "get-serialno"
		], text=True, capture_output=True)
		if serial.returncode != 0:
			print("adb -d get-serialno failed with code", serial.returncode)
			return get_adb_command()
		return get_adb_command_by_serial(serial.stdout.rstrip())
	except subprocess.CalledProcessError as err:
		print("adb wait-for-usb-device failed with code", err.returncode)
	except subprocess.TimeoutExpired:
		print("Timeout")
	except KeyboardInterrupt:
		print()
	return get_adb_command()

def setup_via_network(withPairingCode = False):
	return get_adb_command()

def setup_externally():
	state = get_device_state()
	if state == STATE_DEVICE_CONNECTED or state == STATE_DEVICE_AUTHORIZING:
		serial = get_device_serial()
		if serial is not None:
			return get_adb_command_by_serial(serial)
	print("Not found connected devices, resolving everything...")
	list = device_list()
	if list is None:
		return get_adb_command()
	device = which_device_will_be_connected(*list, stateDoesntMatter=True)
	if device is None:
		print("Nope, nothing to perform here.")
		input()
		return get_adb_command()
	return get_adb_command_by_serial(device["serial"])

def setup_how_to_use():
	print(
		"Android Debug Bridge (adb) is a versatile command-line tool that lets you communicate with a device. " +
		"The adb command facilitates a variety of device actions, such as installing and debugging apps, " +
		"and it provides access to a Unix shell that you can use to run a variety of commands on a device."
	)
	print(link("https://developer.android.com/studio/command-line/adb"))
	input()
	return get_adb_command()

adb_command = get_adb_command()


if __name__ == "__main__":
	print(setup_modpack_directory())
