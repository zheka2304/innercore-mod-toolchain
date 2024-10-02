import sys
from glob import glob as _glob

def glob(pathname, *, recursive=False):
	if sys.version_info < (3, 11):
		return list(iglob(pathname, recursive=recursive))
	return _glob(pathname, recursive=recursive, include_hidden=True)

if sys.version_info < (3, 11):
	import os
	import fnmatch
	from glob import has_magic, \
		_glob0, _iterdir, _ishidden # type: ignore

	def iglob(pathname, *, recursive=False):
		it = _iglob(pathname, recursive, False)
		if recursive and _isrecursive(pathname):
			s = next(it)
			assert not s
		return it

	def _iglob(pathname, recursive, dironly):
		dirname, basename = os.path.split(pathname)
		if not has_magic(pathname):
			assert not dironly
			if basename:
				if os.path.lexists(pathname):
					yield pathname
			else:
				if os.path.isdir(dirname):
					yield pathname
			return
		if not dirname:
			if recursive and _isrecursive(basename):
				yield from _glob2(dirname, basename, dironly)
			else:
				yield from _glob1(dirname, basename, dironly)
			return
		if dirname != pathname and has_magic(dirname):
			dirs = _iglob(dirname, recursive, True)
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
			for name in glob_in_dir(dirname, basename, dironly):
				yield os.path.join(dirname, name)

	def _glob1(dirname, pattern, dironly):
		return fnmatch.filter(_iterdir(dirname, dironly), pattern)

	def _glob2(dirname, pattern, dironly):
		assert _isrecursive(pattern)
		yield pattern[:0]
		yield from _rlistdir(dirname, dironly, _ishidden(pattern))

	def _rlistdir(dirname, dironly, hiddenonly):
		for x in _iterdir(dirname, dironly):
			if not hiddenonly or _ishidden(x):
				yield x
				path = os.path.join(dirname, x) if dirname else x
				for y in _rlistdir(path, dironly, hiddenonly):
					yield os.path.join(x, y)

	def _isrecursive(pattern):
		if isinstance(pattern, bytes):
			return pattern == b'**' or pattern == b'.**'
		else:
			return pattern == '**' or pattern == '.**'
