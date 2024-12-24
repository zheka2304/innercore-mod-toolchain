import json
import os
import time
from io import BytesIO
from os.path import getsize, isfile, join
from typing import IO, Callable, Optional
from urllib.error import URLError
from urllib.response import addinfourl

from . import GLOBALS
from .shell import Notice, Progress, Shell, confirm, warn
from .utils import ensure_file, name_to_identifier


class HttpConnection10:
	preffered_http_vsn: Optional[int] = None
	preffered_http_vsn_str: Optional[str] = None

	def __enter__(self, *args, **kwargs) -> 'HttpConnection10':
		try:
			import http.client
			self.preffered_http_vsn = http.client.HTTPConnection._http_vsn # type: ignore
			http.client.HTTPConnection._http_vsn = 10 # type: ignore
			self.preffered_http_vsn_str = http.client.HTTPConnection._http_vsn_str # type: ignore
			http.client.HTTPConnection._http_vsn_str = 'HTTP/1.0' # type: ignore
		except BaseException:
			pass
		return self

	def __exit__(self, *args, **kwargs) -> None:
		try:
			import http.client
			if self.preffered_http_vsn:
				http.client.HTTPConnection._http_vsn = self.preffered_http_vsn # type: ignore
				self.preffered_http_vsn = None
			if self.preffered_http_vsn_str:
				http.client.HTTPConnection._http_vsn_str = self.preffered_http_vsn_str  # type: ignore
				self.preffered_http_vsn_str = None
		except BaseException:
			pass

def retrieve_stream(input: IO[bytes], output: Optional[IO[bytes]] = None, /, chunk_size: int = 8192, progress_handler: Optional[Callable[[int], None]] = None) -> int:
	if chunk_size < -1 or chunk_size == 0:
		raise ValueError(f"chunk_size should be > 0 or == -1, got {chunk_size}!")
	with input as stream:
		received = 0
		while True:
			chunk = stream.read(chunk_size)
			if not chunk:
				break
			received += len(chunk)
			if progress_handler:
				progress_handler(received)
			if output:
				output.write(chunk)
	return received

def retrieve_fetch_request(url: str, data: Optional[bytes] = None, /, timeout: float = 10, seconds_between_requests: float = 0.5, attempts: int = 2) -> tuple[int, addinfourl]:
	from urllib.request import urlopen
	with HttpConnection10():
		responce: addinfourl = urlopen(url, data, timeout)
	content_size = -1
	if "Content-Length" in responce.headers:
		content_size = int(responce.headers["Content-Length"])
	elif attempts > 1 and not "Transfer-Encoding" in responce.headers:
		time.sleep(seconds_between_requests)
		return retrieve_fetch_request(url, data, timeout=timeout, seconds_between_requests=seconds_between_requests, attempts=attempts - 1)
	return content_size, responce

def retrieve_bytes(url: str, data: Optional[bytes] = None, /, timeout: float = 10, seconds_between_requests: float = 0.5, attempts: int = 2, progress_handler: Optional[Callable[[int, int], None]] = None) -> bytes:
	content_size, responce = retrieve_fetch_request(url, data, timeout=timeout, seconds_between_requests=seconds_between_requests, attempts=attempts)
	buffer = BytesIO()
	retrieve_stream(responce, buffer, progress_handler=lambda progress: progress_handler(progress, content_size) if progress_handler else None)
	return buffer.getvalue()

def retrieve_github_repository_size(repository: str, branch: str = "master", /, timeout: float = 10, calculate_truncated: bool = False) -> int:
	entrance_responce = retrieve_bytes(f"https://api.github.com/repos/{repository}/branches/{branch}", timeout=timeout, attempts=1)
	entrance = json.loads(entrance_responce.decode(encoding="utf-8"))
	try:
		commit_tree_sha = entrance["commit"]["commit"]["tree"]["sha"]
	except KeyError as exc:
		raise RuntimeError(entrance["message"] if "message" in entrance else str(entrance)) from exc
	tree_responce = retrieve_bytes(f"https://api.github.com/repos/{repository}/git/trees/{commit_tree_sha}?recursive=true", timeout=timeout, attempts=1)
	tree = json.loads(tree_responce.decode(encoding="utf-8"))
	try:
		if not calculate_truncated and "truncated" in tree and tree["truncated"]:
			return -1
		tree_entries = tree["tree"]
	except KeyError as exc:
		raise RuntimeError(tree["message"] if "message" in tree else str(tree)) from exc
	size = 0
	for blob in tree_entries:
		if not "size" in blob or not "type" in blob or blob["type"] != "blob":
			continue
		size += int(blob["size"])
	return size

def create_download_request(url: str, data: Optional[bytes] = None, /, placeholder: Optional[str] = None, timeout: float = 10, seconds_between_requests: float = 0.5, attempts: int = 2):
	if not placeholder:
		placeholder = url.rsplit("/", 1)[-1]
	content_size, responce = retrieve_fetch_request(url, data, timeout=timeout, seconds_between_requests=seconds_between_requests, attempts=attempts)
	def fetch(output_path: Optional[str] = None, /, progress_handler: Optional[Callable[[int, int], None]] = None) -> int:
		if not output_path:
			temporary_directory = GLOBALS.TOOLCHAIN_CONFIG.get_path("toolchain/temp")
			output_path = join(temporary_directory, name_to_identifier(placeholder, "-"))
		ensure_file(output_path)
		if isfile(output_path):
			file_size = getsize(output_path)
			if content_size == -1:
				warn(f"* File {placeholder!r} already exists, but since we were unable to determine size of remote file, we will need to download it again.")
			elif file_size != content_size:
				warn(f"* File {placeholder!r} already exists, but is not fully downloaded/has changed on remote.")
			else:
				return content_size
			os.remove(output_path)
		with open(output_path, "wb") as output:
			return retrieve_stream(responce, output, progress_handler=lambda received: progress_handler(received, content_size) if progress_handler else None)
	return content_size, fetch

def create_download_github_repository_request(repository: str, branch: str = "master", /, placeholder: Optional[str] = None, timeout: float = 10, seconds_between_requests: float = 0.5, attempts: int = 8):
	if not placeholder:
		placeholder = f"{repository}#{branch}"
	return create_download_request(f"https://codeload.github.com/{repository}/zip/{branch}", placeholder=placeholder, timeout=timeout, seconds_between_requests=seconds_between_requests, attempts=attempts)

def queue_download_request(url: str, data: Optional[bytes] = None, output_path: Optional[str] = None, /, shell: Optional[Shell] = None, placeholder: Optional[str] = None, timeout: float = 10, seconds_between_requests: float = 0.5, attempts: int = 2):
	if not placeholder:
		placeholder = url.rsplit("/", 1)[-1]
	if shell:
		progress = Progress(text=placeholder)
		shell.interactables.append(progress)
		shell.render()
	try:
		_, fetch = create_download_request(url, data, placeholder=placeholder, timeout=timeout, seconds_between_requests=seconds_between_requests, attempts=attempts)
		fetch(output_path, lambda received, size: progress.notify(shell, progress, received / size, f"{placeholder} ({received / size / 1048576:.1f}%)") if shell else None)
		progress.notify(shell, progress, 1, placeholder)
	except URLError as exc:
		Shell.notify(shell, f"#{exc.errno}: {exc.strerror}")
		Progress.notify(shell, progress, 1, "Check your network connection!")
