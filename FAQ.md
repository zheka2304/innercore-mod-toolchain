# FAQ — frequently asked questions

Here is presented most common questions and problems encounted by users.

## Issues in editor itself

### How to connect a device/emulator via ADB

If task **Configure ADB** is not what you were looking for, try reading <https://developer.android.com/studio/command-line/adb>.

### I cannot find pushed location

Check `pushTo` property in your configuration files, it probably contains wrong location by default. Also, make sure that all tasks run without errors.

### What if I want just single project

Then just place the working files in the root folder of the toolchain, it does not need to be selected and if such a project exists, it will be selected by default. You will still be able to use all the features, the main folder will only act as a project. If necessary, change the `projectLocations` property to exclude the root folder (*..*) from the list of projects to prevent them from being duplicated in the selection interface. Once the `currentProject` property is changed by you personally, the "global" project has no meaning.

### How to change import path

By running the **Import Project** task any project is converted to the appropriate folder relative to the toolchain, you can change the folder by running *toolchain-setup.py* or *toolchain/python/icmtoolchain/import.py* using the second argument as the target folder. Use `--help` to get a list of available commands and their descriptions.

### Variable `${fileWorkspaceFolder}` can not be resolved. Please open an editor

One of most convenient and advantageous ways to find out which folder you are interacting with is to open any file in the project that you want to act on. By default, the last opened folder is used, if it does not exist, you will be prompted to create a new project.

### Project 'toolchain_\<hash>' is missing required source folder: '_/<folder_name>/java/\<module>/src'

All path paths in multi-root workspace become relative, however, folders outside main *toolchain/* folder are converted from root folders (../) to an extension-safe format (_/). This error does not need to be fixed if you are building a mod using the toolchain, easiest way to avoid this error is to move your mod to any of the loochain subfolders where it belongs, or change your environment settings by manually adding the necessary paths to the settings instead of using *.classpath*.

## Issues you may encounter in terminal

### npm: command not found

<https://nodejs.org/en/download/package-manager/>

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

### ./gradlew: Permission denied

For some unknown reason, your *gradlew* file did not have executable flag applied. Open `toolchain/toolchain/bin/gradle` folder in terminal and type `chmod +x gradlew`.

### error trying to exec 'cc1plus': execvp: No such file or directory

After downloading and unpacking NDK, executable flag was lost and operating system does not allow process to run. Download and install NDK manually or just type `chmod -R +x *` on opened in terminal directory `toolchain/ndk/<required-arch>` of your GCCs.

### FileNotFoundError: No such file or directory: \<toolchain\>/icmtoolchain/colorama/\_\_init\_\_.py'

Please, install updates manually. Archive located in `toolchain/temp`, so just replace `toolchain` with new directory. Now, updates will be installed correctly.

> Article will be updated as new problems and clarifications arise.
