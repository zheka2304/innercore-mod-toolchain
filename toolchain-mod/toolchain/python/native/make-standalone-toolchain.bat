@echo off
echo using ndk path: %NDK_PATH%
echo creating standalone toolchain: %*
%NDK_PATH%\build\tools\make_standalone_toolchain.py %*