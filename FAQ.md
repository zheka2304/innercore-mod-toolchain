# FAQ — frequently asked questions

Here is presented most common questions and problems encounted by users.

### How to connect a device/emulator via ADB

If task **Connect to ADB** is not what you were looking for, try reading https://developer.android.com/studio/command-line/adb.

### I cannot find pushed location
Check `make.pushTo` property in *make.json* file at the root of opened project, it probably contains wrong location by default. Also, make sure that all tasks run without errors.

## Issues you may encounter in terminal

### tsc: command not found

```
npm -g install typescript
```

### npm: command not found

https://nodejs.org/en/download/package-manager/

### unsupported class file version 55.0

Android dex compiler requires JDK 8 (identifier 1.8). Set it as default if needed, or do a little work to choose correct version in IDEs:
 - IntelliJ:
1. Go to `File` > `Project Structure` > `Project`
2. Click on `Project SDK`
3. Select java8 or something like this
4. Apply changes
 - VSCode:
1. Open Explorer (*Ctrl+Shift+E*)
2. Find Java Projects tab, enable it in `Views and More Actions...` if needed
3. Go to `More Actions...` > `Configure Java Runtime`
4. Change Java Version to required one

### ImportError: No module named distutils

Debian has decided that distutils is not a core python package, so it is not included in the last versions of debian and debian-based OSes. You should be able to do `sudo apt-get install python3-distutils --reinstall` and it should work.

### ./gradlew: Permission denied

For some unknown reason, your *gradlew* file did not have executable flag applied. Open `innercore-mod-toolchain` folder in terminal and type `chmod +x gradlew`.

### error trying to exec 'cc1plus': execvp: No such file or directory

After downloading and unpacking NDK, executable flag was lost and operating system does not allow process to run. Download and install NDK manually or just type `chmod -R +x *` on opened in terminal directory `toolchain/ndk/<required-arch>` of your GCCs.

> Article will be updated as new problems and clarifications arise.
