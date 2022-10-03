import os
from os.path import join, relpath, basename
import platform
import re
import socket
import subprocess
from glob import glob

from make_config import MAKE_CONFIG, TOOLCHAIN_CONFIG
from hash_storage import output_storage
from shell import Progress, Shell, select_prompt
from ansi_escapes import link

def get_modpack_push_directory():
	directory = MAKE_CONFIG.get_value("pushTo", accept_prototype=False)
	if directory is None:
		directory = TOOLCHAIN_CONFIG.get_value("pushTo")
		if directory is not None:
			directory = join(directory, "mods", basename(MAKE_CONFIG.current_project))
	if directory is None:
		TOOLCHAIN_CONFIG.set_value("pushTo", setup_modpack_directory())
		TOOLCHAIN_CONFIG.save()
		if MAKE_CONFIG.get_value("pushTo") is None:
			from task import error
			error("Nothing may be selected in modpack, nothing to do.")
		return get_modpack_push_directory()
	if "/horizon/packs/" not in directory and not MAKE_CONFIG.get_value("adb.pushAnyLocation", False):
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
			TOOLCHAIN_CONFIG.remove_value("pushTo")
			MAKE_CONFIG.remove_value("pushTo")
			return get_modpack_push_directory()
		elif which == 2:
			TOOLCHAIN_CONFIG.set_value("adb.pushAnyLocation", True)
			TOOLCHAIN_CONFIG.save()
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

def push(directory, push_unchanged = False):
	shell = Shell()
	progress = Progress("Pushing")
	shell.interactables.append(progress)
	items = [relpath(path, directory) for path in glob(directory + "/*") if push_unchanged or output_storage.is_path_changed(path)]
	if len(items) == 0:
		progress.seek(1, "Nothing to push")
		shell.enter()
		shell.leave()
		return 0

	dst_root = get_modpack_push_directory()
	if dst_root is None:
		return 1

	shell.enter()
	dst_root = dst_root.replace("\\", "/")
	if not dst_root.startswith("/"):
		dst_root = "/" + dst_root
	src_root = directory.replace("\\", "/")

	percent = 0
	from task import devnull
	for filename in items:
		src = src_root + "/" + filename
		dst = dst_root + "/" + filename
		progress.seek(percent / len(items), "Pushing " + filename)
		shell.render()
		subprocess.call(adb_command + [
			"shell", "rm", "-r", dst
		], stderr=devnull, stdout=devnull)
		result = subprocess.call(adb_command + [
			"push", src, dst
		], stderr=devnull, stdout=devnull)
		percent += 1

		if result != 0:
			progress.seek(0.5, f"Failed {filename} with code {result}")
			shell.render()
			shell.leave()
			return result

	if not push_unchanged:
		output_storage.save()
	progress.seek(1, "Pushed")
	shell.render()
	shell.leave()
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

def ensure_server_running(retry = 0):
	try:
		from task import devnull
		subprocess.run([
			TOOLCHAIN_CONFIG.get_adb(),
			"start-server"
		], check=True, stdout=devnull, stderr=devnull)
		return True
	except subprocess.CalledProcessError as err:
		if retry >= 3:
			print("adb start-server failed with code", err.returncode)
			return False
		return ensure_server_running(retry + 1)

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
	except KeyError: # offline
		return STATE_DISCONNECTED

def get_device_state():
	try:
		pipe = subprocess.run([
			TOOLCHAIN_CONFIG.get_adb(),
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
			TOOLCHAIN_CONFIG.get_adb(),
			"get-serialno"
		], text=True, check=True, capture_output=True)
	except subprocess.CalledProcessError as err:
		print("adb get-serialno failed with code", err.returncode)
		return None
	return pipe.stdout.strip()

def device_list():
	try:
		pipe = subprocess.run([
			TOOLCHAIN_CONFIG.get_adb(),
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

def which_device_will_be_connected(*devices, state_not_matter = False):
	devices = [device for device in devices
		if device["state"] == STATE_DEVICE_CONNECTED
		or device["state"] == STATE_DEVICE_AUTHORIZING
		or state_not_matter]
	if len(devices) < 2:
		return None if len(devices) == 0 else devices[0]
	which = select_prompt("Which device will be used?", *[
		person_readable_device_name(device) for device in devices
	] + ["I don't see my device"])
	return None if which is None or which == len(devices) else devices[which]

def get_ip():
	make = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	make.settimeout(0)
	try:
		make.connect(("10.253.254.255", 1))
		ip = make.getsockname()[0]
	except Exception:
		ip = "127.0.0.1"
	finally:
		make.close()
	return ip

def get_adb_command():
	ensure_server_running()
	devices = TOOLCHAIN_CONFIG.get_value("devices", [])
	from task import devnull
	if len(devices) > 0:
		subprocess.run([
			TOOLCHAIN_CONFIG.get_adb(),
			"disconnect"
		], stdout=devnull, stderr=devnull)
	for device in devices:
		if isinstance(device, dict):
			try:
				subprocess.run([
					TOOLCHAIN_CONFIG.get_adb(),
					"connect",
					f"{device['ip']}:{device['port']}" if "port" in device else device["ip"]
				], timeout=3.0, stdout=devnull, stderr=devnull)
			except subprocess.TimeoutExpired:
				print("Timeout")
	list = device_list()
	if list is not None:
		itwillbe = []
		for device in list:
			if device["serial"] in devices:
				itwillbe.append(device)
		device = which_device_will_be_connected(*(list if len(itwillbe) == 0 else itwillbe))
		if device is not None:
			return get_adb_command_by_serial(device["serial"])
	if MAKE_CONFIG.get_value("adb.doNothingIfDisconnected", False):
		from task import error
		error("Not found connected devices, nothing to do.", 0)
	which = setup_externally(True) if len(devices) > 0 else setup_device_connection()
	if which is None:
		from task import error
		error("Nothing will happened, adb set up interrupted.", 1)
	return which

def get_adb_command_by_serial(serial):
	ensure_server_running()
	devices = TOOLCHAIN_CONFIG.get_value("devices", [])
	if not serial in devices:
		try:
			from ipaddress import ip_address
			ip_address(serial.partition(":")[0])
		except ValueError:
			devices.append(serial)
			TOOLCHAIN_CONFIG.set_value("devices", devices)
			TOOLCHAIN_CONFIG.save()
	return [
		TOOLCHAIN_CONFIG.get_adb(),
		"-s", serial
	]

def get_adb_command_by_tcp(ip, port = None, skip_error = False):
	ensure_server_running()
	if get_adb_command_by_serialno_type("-e") is None:
		if skip_error:
			return None
		try:
			if input("Are you sure want to save it? [N/y] ")[:1].lower() != "y":
				return print("Abort.")
		except KeyboardInterrupt:
			return print("Abort.")
	device = {
		"ip": ip
	}
	if port is not None:
		device["port"] = port
	devices = TOOLCHAIN_CONFIG.get_value("devices", [])
	if not device in devices:
		devices.append(device)
		TOOLCHAIN_CONFIG.set_value("devices", devices)
		TOOLCHAIN_CONFIG.save()
	return [
		TOOLCHAIN_CONFIG.get_adb(),
		"-e"
	]

def get_adb_command_by_serialno_type(which):
	serial = subprocess.run([
		TOOLCHAIN_CONFIG.get_adb(),
		which, "get-serialno"
	], text=True, capture_output=True)
	if serial.returncode != 0:
		print("adb get-serialno failed with code", serial.returncode)
		return None
	return get_adb_command_by_serial(serial.stdout.rstrip())

def setup_device_connection():
	not_connected_any_device = len(TOOLCHAIN_CONFIG.get_value("devices", [])) == 0
	if not_connected_any_device:
		print(
			"Howdy! " +
			"Before starting we're must set up your devices, don't you think so? " +
			"Let's configure some connections."
		)
	which = select_prompt("How connection will be performed?", *[
		"I've connected device via cable",
		"Over air/network will be best",
		"Everything already performed"
	] + (["Wha.. I don't understand!"] if not_connected_any_device else []) + [
		"It will be performed later"
	])
	return setup_via_usb() if which == 0 else \
		setup_via_network() if which == 1 else \
		setup_externally() if which == 2 else \
		setup_how_to_use() if which == 3 and \
			not_connected_any_device else None

def setup_via_usb():
	try:
		print("Listening device via cable...")
		print(f"* Press Ctrl+{'Z' if platform.system() == 'Windows' else 'C'} to leave")
		from task import devnull
		subprocess.run([
			TOOLCHAIN_CONFIG.get_adb(),
			"wait-for-usb-device"
		], check=True, timeout=90.0, stdout=devnull, stderr=devnull)
		command = get_adb_command_by_serialno_type("-d")
		if command is not None:
			return command
	except subprocess.CalledProcessError as err:
		print("adb wait-for-usb-device failed with code", err.returncode)
	except subprocess.TimeoutExpired:
		print("Timeout")
	except KeyboardInterrupt:
		print()
	return setup_device_connection()

def setup_via_network():
	which = select_prompt(
		"Which network type must be used?",
		"Just TCP by IP and PORT",
		"Ping network automatically",
		"Connect with pairing code",
		"Turn back", fallback=2
	)
	return setup_device_connection() if which == 3 else \
		setup_via_ping_localhost() if which == 1 else \
		setup_via_tcp_network(with_pairing_code=which == 2)

def setup_via_ping_localhost():
	ip = get_ip().rpartition(".")
	if len(ip[2]) == 0:
		print("Not availabled right now.")
		return setup_via_network()
	shell = Shell()
	progress = Progress(text="Connecting")
	shell.interactables.append(progress)
	shell.enter()
	accepted = []
	try:
		import asyncio
		asyncio.run(ping_async(ip, shell, progress, accepted))
	except ImportError:
		for index in range(256):
			if str(index) == ip[2]:
				continue
			next_ip = "{}.{}".format(ip[0], index)
			if ping_via_shell(next_ip, shell, progress, index):
				accepted.append(next_ip)
	shell.leave()
	from task import devnull
	subprocess.run([
		TOOLCHAIN_CONFIG.get_adb(),
		"disconnect"
	], stdout=devnull, stderr=devnull)
	latest = None
	for next in accepted:
		try:
			subprocess.run([
				TOOLCHAIN_CONFIG.get_adb(),
				"connect", next
			], check=True, timeout=5.0, stdout=devnull, stderr=devnull)
			command = get_adb_command_by_tcp(next, skip_error=True)
			if command is not None:
				latest = command
		except subprocess.CalledProcessError as err:
			print("adb connect failed with code", err.errorcode)
		except subprocess.TimeoutExpired:
			print("Timeout")
		except KeyboardInterrupt:
			print()
	if latest is not None:
		return latest
	if len(accepted) > 0:
		print("Found several variants to connection, default port not worked otherwise.")
		print("\n".join(accepted))
		print("You can try reconnect to one of it with specified port.")
		try:
			input()
		except KeyboardInterrupt:
			pass
	return setup_via_network()

def ping_via_shell(ip, shell, progress, index):
	progress.text = "Pinging " + ip
	progress.progress = index / 255
	shell.render()

	from task import devnull
	return subprocess.call([
		"ping",
		"-n" if platform.system() == "Windows" else "-c", "1",
		ip
	], stdout=devnull, stderr=devnull) == 0

async def ping(ip, shell, progress, index, accepted):
	progress.text = "Pinging " + ip
	progress.progress = index / 255
	shell.render()

	from task import devnull
	import asyncio
	coroutine = await asyncio.create_subprocess_shell(
		"ping " + ("-n" if platform.system() == "Windows" else "-c") + " 1 " + ip, stdout=devnull, stderr=devnull
	)
	await coroutine.wait()

	if coroutine.returncode == 0:
		accepted.append(ip)

async def ping_async(ip, shell, progress, accepted):
	import asyncio
	tasks = []
	for index in range(256):
		if str(index) == ip[2]:
			continue
		next_ip = "{}.{}".format(ip[0], index)
		task = asyncio.ensure_future(ping(next_ip, shell, progress, index, accepted))
		tasks.append(task)
	await asyncio.gather(*tasks, return_exceptions=True)

def setup_via_tcp_network(ip = None, port = None, pairing_code = None, with_pairing_code = False):
	if ip is None:
		print("You are connected via", get_ip())
		try:
			tcp = input("Specify address: IP[:PORT] ")
			if len(tcp) == 0:
				return setup_via_network()
		except KeyboardInterrupt:
			return setup_via_network()
		tcp = tcp.split(":")
		ip = tcp[0]
		port = tcp[1] if len(tcp) > 1 else port
	if with_pairing_code or pairing_code is not None:
		if pairing_code is None:
			try:
				pairing_code = input("Specify pairing code: ")
				if len(tcp) == 0:
					return setup_via_tcp_network(ip, port)
			except KeyboardInterrupt:
				return setup_via_network()
		try:
			subprocess.run([
				TOOLCHAIN_CONFIG.get_adb(),
				"pair",
				f"{ip}:{port}" if port is not None else ip,
				pairing_code
			], check=True, stderr=devnull, stdout=devnull)
		except subprocess.CalledProcessError as err:
			print("adb pair failed with code", err.errorcode)
		except KeyboardInterrupt:
			print()
	from task import devnull
	subprocess.run([
		TOOLCHAIN_CONFIG.get_adb(),
		"disconnect"
	], stdout=devnull, stderr=devnull)
	try:
		subprocess.run([
			TOOLCHAIN_CONFIG.get_adb(),
			"connect",
			f"{ip}:{port}" if port is not None else ip
		], check=True, timeout=10.0, stdout=devnull, stderr=devnull)
		command = get_adb_command_by_tcp(ip, port)
		return command if command is not None else setup_via_tcp_network()
	except subprocess.CalledProcessError as err:
		print("adb connect failed with code", err.errorcode)
	except subprocess.TimeoutExpired:
		print("Timeout")
	except KeyboardInterrupt:
		print()
	return setup_via_network()

def setup_externally(skip_input = False):
	state = get_device_state()
	if state == STATE_DEVICE_CONNECTED or state == STATE_DEVICE_AUTHORIZING:
		serial = get_device_serial()
		if serial is not None:
			if not serial in TOOLCHAIN_CONFIG.get_value("devices", []):
				return get_adb_command_by_serial(serial)
			else:
				print("Connected device already saved, maybe another available too.")
	else:
		print("Not found connected devices, resolving everything...")
	list = device_list()
	if list is None:
		return setup_device_connection()
	device = which_device_will_be_connected(*list, state_not_matter=True)
	if device is None:
		print("Nope, nothing to perform here.")
		if not skip_input:
			try:
				input()
			except KeyboardInterrupt:
				pass
		return setup_device_connection()
	return get_adb_command_by_serial(device["serial"])

def setup_how_to_use():
	print(
		"Android Debug Bridge (adb) is a versatile command-line tool that lets you communicate with a device. " +
		"The adb command facilitates a variety of device actions, such as installing and debugging apps, " +
		"and it provides access to a Unix shell that you can use to run a variety of commands on a device."
	)
	print(link("https://developer.android.com/studio/command-line/adb"))
	try:
		input()
	except KeyboardInterrupt:
		pass
	return setup_device_connection()

adb_command = get_adb_command()
