import sys
from glob import glob as _glob


def glob(pathname, *, root_dir=None, dir_fd=None, recursive=False):
	if sys.version_info < (3, 11):
		return list(iglob(pathname, root_dir=root_dir, dir_fd=dir_fd, recursive=recursive))
	return _glob(pathname, root_dir=root_dir, dir_fd=dir_fd, recursive=recursive, include_hidden=True)

if sys.version_info < (3, 11):
	import fnmatch
	import itertools
	import os
	import stat
	from glob import _ishidden  # type: ignore
	from glob import _iterdir as iterdir  # type: ignore
	from glob import has_magic

	def _iterdir(dirname, dir_fd, dironly):
		if sys.version_info < (3, 10):
			return iterdir(dirname, dironly)
		return iterdir(dirname, dir_fd, dironly)

	def iglob(pathname, *, root_dir=None, dir_fd=None, recursive=False):
		if root_dir is not None:
			root_dir = os.fspath(root_dir)
		else:
			root_dir = pathname[:0]
		it = _iglob(pathname, root_dir, dir_fd, recursive, False)
		if not pathname or recursive and _isrecursive(pathname[:2]):
			try:
				s = next(it)
				if s:
					it = itertools.chain((s, ), it)
			except StopIteration:
				pass
		return it

	def _iglob(pathname, root_dir, dir_fd, recursive, dironly):
		dirname, basename = os.path.split(pathname)
		if not has_magic(pathname):
			assert not dironly
			if basename:
				if _lexists(_join(root_dir, pathname), dir_fd):
					yield pathname
			else:
				if _isdir(_join(root_dir, dirname), dir_fd):
					yield pathname
			return
		if not dirname:
			if recursive and _isrecursive(basename):
				yield from _glob2(root_dir, basename, dir_fd, dironly)
			else:
				yield from _glob1(root_dir, basename, dir_fd, dironly)
			return
		if dirname != pathname and has_magic(dirname):
			dirs = _iglob(dirname, root_dir, dir_fd, recursive, True)
		else:
			dirs = [dirname]
		if has_magic(basename):
			if recursive and _isrecursive(basename):
				glob_in_dir = _glob2
			else:
				glob_in_dir = _glob1
		else:
			glob_in_dir = _glob0
		for dirname in dirs:
			for name in glob_in_dir(_join(root_dir, dirname), basename, dir_fd, dironly):
				yield os.path.join(dirname, name)

	def _glob0(dirname, basename, dir_fd, dironly):
		if basename:
			if _lexists(_join(dirname, basename), dir_fd):
				return [basename]
		else:
			if _isdir(dirname, dir_fd):
				return [basename]
		return []

	def _glob1(dirname, pattern, dir_fd, dironly):
		return fnmatch.filter(_iterdir(dirname, dir_fd, dironly), pattern)

	def _glob2(dirname, pattern, dir_fd, dironly):
		assert _isrecursive(pattern)
		yield pattern[:0]
		yield from _rlistdir(dirname, dir_fd, dironly, _ishidden(pattern))

	def _rlistdir(dirname, dir_fd, dironly, hiddenonly):
		for x in _iterdir(dirname, dir_fd, dironly):
			if not hiddenonly or _ishidden(x):
				yield x
				path = _join(dirname, x) if dirname else x
				for y in _rlistdir(path, dir_fd, dironly, hiddenonly):
					yield _join(x, y)

	def _isrecursive(pattern):
		if isinstance(pattern, bytes):
			return pattern == b'**' or pattern == b'.**'
		else:
			return pattern == '**' or pattern == '.**'

	def _lexists(pathname, dir_fd):
		if dir_fd is None:
			return os.path.lexists(pathname)
		try:
			os.lstat(pathname, dir_fd=dir_fd)
		except (OSError, ValueError):
			return False
		else:
			return True

	def _isdir(pathname, dir_fd):
		if dir_fd is None:
			return os.path.isdir(pathname)
		try:
			st = os.stat(pathname, dir_fd=dir_fd)
		except (OSError, ValueError):
			return False
		else:
			return stat.S_ISDIR(st.st_mode)

	def _join(dirname, basename):
		if not dirname or not basename:
			return dirname or basename
		return os.path.join(dirname, basename)
