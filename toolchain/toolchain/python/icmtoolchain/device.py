import platform
import re
import socket
import subprocess
from glob import glob
from os.path import basename, join, relpath
from typing import Any, Dict, List, Optional, Tuple

from . import GLOBALS
from .make_config import MakeConfig
from .shell import (Progress, Shell, abort, confirm, error, link,
                    select_prompt, warn)
from .utils import DEVNULL


def get_modpack_push_directory() -> Optional[str]:
	directory = GLOBALS.PREFERRED_CONFIG.get_value("pushTo", accept_prototype=False)
	if not directory:
		directory = GLOBALS.TOOLCHAIN_CONFIG.get_value("pushTo")
		if directory:
			if not isinstance(GLOBALS.PREFERRED_CONFIG, MakeConfig) or not GLOBALS.MAKE_CONFIG.current_project:
				return None
			directory = join(directory, "mods", basename(GLOBALS.MAKE_CONFIG.current_project))

	if not directory:
		GLOBALS.TOOLCHAIN_CONFIG.set_value("pushTo", setup_modpack_directory())
		if not GLOBALS.PREFERRED_CONFIG.get_value("pushTo"):
			abort("Not found any modpacks, nothing to do.")
		GLOBALS.TOOLCHAIN_CONFIG.save()
		return get_modpack_push_directory()

	if "/horizon/packs/" not in directory and not GLOBALS.PREFERRED_CONFIG.get_value("adb.pushAnyLocation", False):
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
			GLOBALS.TOOLCHAIN_CONFIG.remove_value("pushTo")
			if GLOBALS.TOOLCHAIN_CONFIG != GLOBALS.PREFERRED_CONFIG:
				GLOBALS.PREFERRED_CONFIG.remove_value("pushTo")
			return get_modpack_push_directory()
		elif which == 2:
			GLOBALS.TOOLCHAIN_CONFIG.set_value("adb.pushAnyLocation", True)
			GLOBALS.TOOLCHAIN_CONFIG.save()
			print("This may be changed in your 'toolchain.json' config.")
		elif which == 3:
			print("Pushing aborted.")
			return None

	return directory

def ls_pack(path: str) -> List[str]:
	containment = [path + "/innercore"] if "mods" in ls(path + "/innercore") else list()
	return containment + [path + "/modpacks/" + directory for directory in ls(path + "/modpacks")]

def person_readable_modpack_name(path: str) -> str:
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

def setup_modpack_directory(locations: Optional[List[str]] = None) -> Optional[str]:
	pack_directories = ls("/storage/emulated/0/games/horizon/packs")
	directories = list()
	if locations:
		directories += locations
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
			"If not, describe output path manually in 'toolchain.json'."
		)
		return None
	which = select_prompt("Which modpack will be used?", *[
		person_readable_modpack_name(directory) for directory in directories
	])
	return None if which is None else directories[which]

def ls(path: str, *args: str) -> List[str]:
	try:
		pipe = subprocess.run(GLOBALS.ADB_COMMAND + [
			"shell", "ls", path
		] + list(args), text=True, check=True, capture_output=True)
	except subprocess.CalledProcessError as err:
		if err.returncode != 1:
			error("adb shell ls failed with code", err.returncode)
		return list()
	except KeyboardInterrupt:
		return list()
	return pipe.stdout.rstrip().splitlines()

def push(directory : str, push_unchanged: bool = False) -> int:
	shell = Shell()
	progress = Progress("Pushing")
	shell.interactables.append(progress)
	items = [relpath(path, directory) for path in glob(directory + "/*") if push_unchanged or GLOBALS.OUTPUT_STORAGE.is_path_changed(path)]
	if len(items) == 0:
		Progress.notify(shell, progress, 1, "Nothing to push...")
		with shell: return 0

	destination_directory = get_modpack_push_directory()
	if not destination_directory:
		return 1

	with shell:
		destination_directory = destination_directory.replace("\\", "/")
		if not destination_directory.startswith("/"):
			destination_directory = "/" + destination_directory
		sources_directory = directory.replace("\\", "/")

		percent = 0
		for filename in items:
			src = sources_directory + "/" + filename
			dst = destination_directory + "/" + filename
			if shell and progress:
				progress.seek(percent / len(items), "Pushing " + filename)
				shell.render()
			try:
				subprocess.call(GLOBALS.ADB_COMMAND + [
					"shell", "rm", "-r", dst
				], stderr=DEVNULL, stdout=DEVNULL)
				result = subprocess.call(GLOBALS.ADB_COMMAND + [
					"push", src, dst
				], stderr=DEVNULL, stdout=DEVNULL)
			except KeyboardInterrupt:
				Progress.notify(shell, progress, 0.5, "Pushing aborted.")
				return 1
			percent += 1

			if result != 0:
				Progress.notify(shell, progress, 0.5, f"Failed {filename} with code {result}")
				return result

		if not push_unchanged:
			GLOBALS.OUTPUT_STORAGE.save()
		Progress.notify(shell, progress, 1, "Pushed")
	return 0

def make_locks(*locks: str) -> int:
	destination_directory = get_modpack_push_directory()
	if not destination_directory:
		return -1

	for lock in locks:
		lock = join(destination_directory, lock).replace("\\", "/")
		result = subprocess.call(GLOBALS.ADB_COMMAND + [
			"shell", "touch", lock
		])
		if result != 0:
			return result
	return 0

def ensure_server_running(retry: int = 0) -> bool:
	try:
		subprocess.run([
			GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
			"start-server"
		], check=True, stdout=DEVNULL, stderr=DEVNULL)
		return True
	except subprocess.CalledProcessError as err:
		if retry >= 3:
			error("adb start-server failed with code", err.returncode)
			return False
		return ensure_server_running(retry + 1)

STATE_UNKNOWN = -1
STATE_DEVICE_CONNECTED = 0
STATE_NO_DEVICES = 1
STATE_DISCONNECTED = 2
STATE_DEVICE_AUTHORIZING = 3

def which_state(what: Optional[str] = None) -> int:
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

def get_device_state() -> int:
	try:
		pipe = subprocess.run([
			GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
			"get-state"
		], text=True, check=True, capture_output=True)
	except subprocess.CalledProcessError as err:
		if err.returncode == 1:
			return STATE_NO_DEVICES
		error("adb get-state failed with code", err.returncode)
		return STATE_UNKNOWN
	return which_state(pipe.stdout.strip())

def get_device_serial() -> Optional[str]:
	try:
		pipe = subprocess.run([
			GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
			"get-serialno"
		], text=True, check=True, capture_output=True)
	except subprocess.CalledProcessError as err:
		warn("adb get-serialno failed with code", err.returncode)
		return None
	return pipe.stdout.strip()

def device_list() -> Optional[List[Dict[str, Any]]]:
	try:
		pipe = subprocess.run([
			GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
			"devices", "-l"
		], text=True, check=True, capture_output=True)
	except subprocess.CalledProcessError as err:
		warn("adb devices failed with code", err.returncode)
		return None
	data = pipe.stdout.rstrip().splitlines()
	data.pop(0)
	devices = list()
	for device in data:
		device = re.split(r"\s+", device)
		devices.append({
			"serial": device[0],
			"state": which_state(device[1]),
			"data": device[2:]
		})
	return devices

def person_readable_device_name(device: Dict[str, Any]) -> str:
	if "data" in device:
		for property in device["data"]:
			what = property.partition(":")
			if what[0] == "model":
				return f"{device['serial']} ({what[2]})"
	return device["serial"]

def which_device_will_be_connected(*devices: Dict[str, Any], state_not_matter: bool = False) -> Optional[Dict[str, Any]]:
	connected = [device for device in devices
		if device["state"] == STATE_DEVICE_CONNECTED
		or device["state"] == STATE_DEVICE_AUTHORIZING
		or state_not_matter]
	if len(connected) < 2:
		return None if len(connected) == 0 else connected[0]
	which = select_prompt("Which device will be used?", *[
		person_readable_device_name(device) for device in connected
	] + ["I doesn't see my device"])
	return None if which is None or which == len(connected) else connected[which]

def get_ip() -> str:
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

def get_adb_command() -> List[str]:
	ensure_server_running()
	devices = GLOBALS.TOOLCHAIN_CONFIG.get_value("devices", list())
	if len(devices) > 0:
		subprocess.run([
			GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
			"disconnect"
		], stdout=DEVNULL, stderr=DEVNULL)
	for device in devices:
		if isinstance(device, dict):
			try:
				subprocess.run([
					GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
					"connect",
					f"{device['ip']}:{device['port']}" if "port" in device else device["ip"]
				], timeout=3.0, stdout=DEVNULL, stderr=DEVNULL)
			except subprocess.TimeoutExpired:
				print("Timeout")
	pending = device_list()
	if pending:
		itwillbe = list()
		for device in pending:
			if device["serial"] in devices:
				itwillbe.append(device)
		device = which_device_will_be_connected(*(pending if len(itwillbe) == 0 else itwillbe))
		if device:
			return get_adb_command_by_serial(device["serial"])
	if GLOBALS.PREFERRED_CONFIG.get_value("adb.doNothingIfDisconnected", False):
		abort("Not found connected devices, nothing to do.")
	which = setup_externally(True) if len(devices) > 0 else setup_device_connection()
	if which is None:
		abort("Nothing will happened, adb set up interrupted.")
	return which

def get_adb_command_by_serial(serial: str) -> List[str]:
	ensure_server_running()
	devices = GLOBALS.TOOLCHAIN_CONFIG.get_value("devices", list())
	if not serial in devices:
		try:
			from ipaddress import ip_address
			ip_address(serial.partition(":")[0])
		except ValueError:
			devices.append(serial)
			GLOBALS.TOOLCHAIN_CONFIG.set_value("devices", devices)
			GLOBALS.TOOLCHAIN_CONFIG.save()
	return [
		GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
		"-s", serial
	]

def get_adb_command_by_tcp(ip: str, port: Optional[int] = None, skip_error: bool = False) -> Optional[List[str]]:
	ensure_server_running()
	if not get_adb_command_by_serialno_type("-e"):
		if skip_error or not confirm("Are you sure want to save it?", False):
			return None
	device: dict[str, Any] = {
		"ip": ip
	}
	if port:
		device["port"] = port
	devices = GLOBALS.TOOLCHAIN_CONFIG.get_value("devices", list())
	if not device in devices:
		devices.append(device)
		GLOBALS.TOOLCHAIN_CONFIG.set_value("devices", devices)
		GLOBALS.TOOLCHAIN_CONFIG.save()
	return [
		GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
		"-e"
	]

def get_adb_command_by_serialno_type(which: str) -> Optional[List[str]]:
	serial = subprocess.run([
		GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
		which, "get-serialno"
	], text=True, capture_output=True)
	if serial.returncode != 0:
		warn("adb get-serialno failed with code", serial.returncode)
		return None
	return get_adb_command_by_serial(serial.stdout.rstrip())

def setup_device_connection() -> Optional[List[str]]:
	not_connected_any_device = len(GLOBALS.TOOLCHAIN_CONFIG.get_value("devices", list())) == 0
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
	] + (["Wha.. I don't understand!"] if not_connected_any_device else list()) + [
		"It will be performed later"
	], fallback=3 + (1 if not_connected_any_device else 0))
	return setup_via_usb() if which == 0 else \
		setup_via_network() if which == 1 else \
		setup_externally() if which == 2 else \
		setup_how_to_use() if which == 3 and \
			not_connected_any_device else None

def setup_via_usb() -> Optional[List[str]]:
	try:
		print("Listening device via cable...")
		print(f"* Press Ctrl+{'Z' if platform.system() == 'Windows' else 'C'} to leave")
		subprocess.run([
			GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
			"wait-for-usb-device"
		], check=True, timeout=90.0, stdout=DEVNULL, stderr=DEVNULL)
		command = get_adb_command_by_serialno_type("-d")
		if command:
			return command
	except subprocess.CalledProcessError as err:
		error("adb wait-for-usb-device failed with code", err.returncode)
	except subprocess.TimeoutExpired:
		print("Timeout")
	except KeyboardInterrupt:
		print()
	return setup_device_connection()

def setup_via_network() -> Optional[List[str]]:
	which = select_prompt(
		"Which network type must be used?",
		"Just TCP by IP and PORT",
		"Ping network automatically",
		"Connect with pairing code",
		"Turn back", fallback=3
	)
	return setup_device_connection() if which == 3 else \
		setup_via_ping_localhost() if which == 1 else \
		setup_via_tcp_network(with_pairing_code=which == 2)

def setup_via_ping_localhost() -> Optional[List[str]]:
	ip = get_ip().rpartition(".")
	if len(ip[2]) == 0:
		print("Not availabled right now.")
		return setup_via_network()
	shell = Shell()
	progress = Progress(text="Connecting")
	shell.interactables.append(progress)
	with shell:
		accepted = list()
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
		except KeyboardInterrupt:
			print()
			return setup_via_network()
		if len(accepted) == 0:
			print()
			print("Not found anything, are you sure that network connected?")
			return setup_via_network()
		subprocess.run([
			GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
			"disconnect"
		], stdout=DEVNULL, stderr=DEVNULL)
		print()
		print("\n".join(accepted))
		print("Pinging every port, interrupt operation if you already know it.")
		print()
		latest = None
		for next in accepted:
			try:
				subprocess.run([
					GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
					"connect", next
				], check=True, timeout=5.0, stdout=DEVNULL, stderr=DEVNULL)
				command = get_adb_command_by_tcp(next, skip_error=True)
				if command:
					latest = command
				else:
					print()
			except subprocess.CalledProcessError as err:
				error("adb connect failed with code", err.returncode)
			except subprocess.TimeoutExpired:
				print("Timeout")
			except KeyboardInterrupt:
				break
			try:
				ports = list()
				try:
					import asyncio
					asyncio.run(connect_async(next, shell, progress, ports))
				except ImportError:
					pass
				for port in ports:
					command = get_adb_command_by_tcp(next + ":" + port, skip_error=True)
					if command:
						latest = command
					else:
						print()
			except KeyboardInterrupt:
				break
			print()
		print()
	return latest or setup_via_network()

def ping_via_shell(ip: str, shell: Optional[Shell], progress: Optional[Progress], index: int) -> int:
	if shell and progress:
		progress.seek(index / 255, f"Pinging {ip}")
		shell.render()
	return subprocess.call([
		"ping",
		"-n" if platform.system() == "Windows" else "-c", "1",
		ip
	], stdout=DEVNULL, stderr=DEVNULL) == 0

async def ping(ip: str, shell: Optional[Shell], progress: Optional[Progress], index: int, accepted: List[str]) -> None:
	if shell and progress and index % 15 == 0:
		progress.seek(index / 255, f"Pinging {ip}")
		shell.render()
	import asyncio
	coroutine = await asyncio.create_subprocess_shell(
		f"ping {'-n' if platform.system() == 'Windows' else '-c'} 1 {ip}", stdout=DEVNULL, stderr=DEVNULL
	)
	await coroutine.wait()
	if coroutine.returncode == 0:
		accepted.append(ip)

async def ping_async(ip: Tuple[str, str, str], shell: Optional[Shell], progress: Optional[Progress], accepted: List[str]) -> None:
	import asyncio
	tasks = list()
	for index in range(256):
		if str(index) == ip[2]:
			continue
		next_ip = "{}.{}".format(ip[0], index)
		task = asyncio.ensure_future(ping(next_ip, shell, progress, index, accepted))
		tasks.append(task)
	await asyncio.gather(*tasks, return_exceptions=True)

async def connect(ip: str, port: int, shell: Optional[Shell], progress: Optional[Progress], accepted: List[str]) -> None:
	if len(accepted) > 0:
		return
	if shell and progress and port % 15 == 0:
		progress.seek(port / 65535, f"Connecting to {ip}:{str(port)}")
		shell.render()
	import asyncio
	coroutine = await asyncio.create_subprocess_shell(
		GLOBALS.TOOLCHAIN_CONFIG.get_adb() + " connect " + ip + ":" + str(port), stdout=DEVNULL, stderr=DEVNULL
	)
	await coroutine.wait()
	if coroutine.returncode == 0:
		accepted.append(str(port))

async def connect_async(ip: str, shell: Optional[Shell], progress: Optional[Progress], accepted: List[str]) -> None:
	import asyncio
	tasks = list()
	for index in range(1000, 65536):
		task = asyncio.ensure_future(connect(ip, index, shell, progress, accepted))
		tasks.append(task)
	await asyncio.gather(*tasks, return_exceptions=True)

def setup_via_tcp_network(ip: Optional[str] = None, port: Optional[str] = None, pairing_code: Optional[str] = None, with_pairing_code: bool = False) -> Optional[List[str]]:
	if not ip:
		print("You are connected via", get_ip())
		try:
			tcp = input("Specify address: IP[:PORT] ")
			if len(tcp) == 0:
				return setup_via_network()
		except KeyboardInterrupt:
			print()
			return setup_via_network()
		tcp = tcp.split(":")
		ip = tcp[0]
		port = tcp[1] if len(tcp) > 1 else port
	if with_pairing_code or pairing_code:
		if not pairing_code:
			try:
				pairing_code = input("Specify pairing code: ")
			except KeyboardInterrupt:
				print()
				return setup_via_network()
		try:
			subprocess.run([
				GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
				"pair",
				f"{ip}:{port}" if port else ip,
				pairing_code
			], check=True, stderr=DEVNULL, stdout=DEVNULL)
		except subprocess.CalledProcessError as err:
			error("adb pair failed with code", err.returncode)
		except KeyboardInterrupt:
			print()
	subprocess.run([
		GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
		"disconnect"
	], stdout=DEVNULL, stderr=DEVNULL)
	try:
		subprocess.run([
			GLOBALS.TOOLCHAIN_CONFIG.get_adb(),
			"connect",
			f"{ip}:{port}" if port else ip
		], check=True, timeout=10.0, stdout=DEVNULL, stderr=DEVNULL)
		command = get_adb_command_by_tcp(ip, int(port) if port else None)
		return command or setup_via_tcp_network()
	except subprocess.CalledProcessError as err:
		error("adb connect failed with code", err.returncode)
	except subprocess.TimeoutExpired:
		print("Timeout")
	except KeyboardInterrupt:
		print()
	return setup_via_network()

def setup_externally(skip_input: bool = False) -> Optional[List[str]]:
	state = get_device_state()
	if state == STATE_DEVICE_CONNECTED or state == STATE_DEVICE_AUTHORIZING:
		serial = get_device_serial()
		if serial:
			if not serial in GLOBALS.TOOLCHAIN_CONFIG.get_value("devices", list()):
				return get_adb_command_by_serial(serial)
			else:
				print("Connected device already saved, maybe another available too.")
	else:
		print("Not found connected devices, resolving everything...")
	devices = device_list()
	if not devices:
		return setup_device_connection()
	device = which_device_will_be_connected(*devices, state_not_matter=True)
	if not device:
		print("Nope, nothing to perform here.")
		if not skip_input:
			try:
				input()
			except KeyboardInterrupt:
				print()
		return setup_device_connection()
	return get_adb_command_by_serial(device["serial"])

def setup_how_to_use() -> Optional[List[str]]:
	print(
		"Android Debug Bridge (adb) is a versatile command-line tool that lets you communicate with a device. " +
		"The adb command facilitates a variety of device actions, such as installing and debugging apps, " +
		"and it provides access to a Unix shell that you can use to run a variety of commands on a device."
	)
	print(link("https://developer.android.com/studio/command-line/adb"))
	try:
		input()
	except KeyboardInterrupt:
		print()
	return setup_device_connection()
