# Inner Core Mod Toolchain

[![FAQ](https://img.shields.io/badge/figure_out-FAQ-888888?style=for-the-badge)](FAQ.md)
[![Windows](https://img.shields.io/badge/windows-compatible-blue?style=for-the-badge&logo=windows&logoColor=white)](README.md)
[![Linux](https://img.shields.io/badge/linux-compatible-yellowgreen?style=for-the-badge&logo=linux&logoColor=white)](README.md)

## Requirements

**Inner Core Mod Toolchain for Horizon** is a toolchain that can be used to efficiently develop and build Minecraft: Bedrock mods from your PC.

To work properly this toolchain requires:
 - [Python](https://www.python.org/) 3.6 or higher
 - [node.js](https://nodejs.org/en/) 10.15.1 or higher (for typescript modding), you need to have `tsc` installed (to install run `npm install -g tsc`)
 - Valid [Android NDK](https://developer.android.com/ndk/downloads/older_releases) installation (for native modding). Preferred version is r16b
 - [Java Development Kit 1.8](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html) or higher (for Java modding)

It is also highly recommended you install Visual Studio Code code editor. This editor is highly customizable and this toolchain contains all required settings and files to set up the environment. For the best user experience also install the following plugins for VS Code:
 - ESLint (Microsoft), TSLint now deprecated
 - C/C++ Extension Pack (Microsoft)
 - Extension Pack for Java (Microsoft)

### Setting up the Environment

Just clone or [download this repository](https://github.com/zheka2304/innercore-mod-toolchain/archive/refs/heads/master.zip) and open [toolchain.code-workspace](toolchain.code-workspace), it contains everything that needed and will be set up automatically!

[![Inner Core/Horizon Mods Development | Setting up the Environment](.github/environment.jpg)](https://www.youtube.com/watch?v=ofwKkRYh97k)

## Creating a new project

To create a new project for Inner Core, use the script *toolchain-setup.py*. It should be placed in your projects directory and run using python in Windows:
```cmd
python .\toolchain-setup.py project_folder
```
or in Linux shell:
```sh
python3 ./toolchain-setup.py project_folder
```

The script will create a new project and set it up for native and/or java development. See detailed explanations in the video:

## Importing existing project

To create a project from an existing Inner Core mod, use the script *toolchain-import.py*. It should be placed in the mod directory and run using python in Windows:
```cmd
python .\toolchain-import.py
```
or in Linux shell:
```sh
python3 ./toolchain-import.py
```

You can optionally pass old project directory as the first parameter of the script. This script will create required project structure and optionally set up the project for native and/or java development.

## Update toolchain

To update toolchain, use the script *toolchain-update.py* script. It should be placed in the toolchain directory and run using python in Windows:
```cmd
python .\toolchain-update.py
```
or in Linux shell:
```sh
python3 ./toolchain-update.py
```

## Installing Android NDK

To install Android NDK of any version on you computer, you should first download it from the archive: https://developer.android.com/ndk/downloads/older_releases. Preferred version is **16b**. Unpack the archive to *%appdata%/../Local/Android* (on Windows) or to */home/Android* (on Linux). When you open the directory "*Android/android-ndk-r16b*", you should see a list of directories. Run the build to see if everything is OK.

## First Build

To run your first build, run (*Ctrl+Shift+B*) **Build and Push Everything** task. This task performs the required setup and builds the whole project. If your project contains native code, local NDK installation will be created. This can take some time.

## make.json

*make.json* is the main configuration file of the every project. In this file you can specify everything you need to build a mod for Inner Core. Most of the work, such as scripts generation and *build.config* creation is done under the hood.

Here's a description of some of the key properties you can specify in your *make.json*:
 - **info** contains information about the mod name, author, version and description. The information is stored in the corresponding fields
 - **api** specifies what JavaScript API is used in the mod by default
 - **resources** specifies what resources should be included in the output mod. There are currently four resource types available:
   - *resource_directory* contains textures to use in Minecraft
   - *gui* contains all the gui textures
   - *minecraft_resource_pack* contains vanilla resource packs to be used with the mod
   - *minecraft_behavior_pack* contains vanilla behavior packs to be used with the mod
 - **sources** specifies what JavaScript files should be included (or built) into the mod build. Every source can be a file, a list of files specified by wildcards or a directory containing .includes file. There are currently four types of sources:
   - *main* contains main mod logic
   - *launcher* contains mod launching logics
   - *preloader* is run before resources injection. This is useful to generate resources programmatically before Minecraft loads them
   - *lib* contains reusable mod libraries
 - There are also two supported languages:
   - *javascript* is used for pure javascript project using ES5 language standart. These folders are not compiled and are just built 'as is'.
   - *typescript* is used for typescript language and ESNext version of Javascript. These folders are built using typescript compiler.
 - **compile** specifies all the source code that should be compiled. This toolchain currently supports two compilation types:
   - *native* is used to compile C/C++ sources. Note that Android NDK is required to run this type of compilation
   - *java* is used to compile Java sources. Note that you have to install JDK of version 1.8 or higher to run this type of compilation
 - **additional** contains additional directories that should be copied to the mod build. In this example, root directory is copied to the root of the mod

## toolchain.json

*toolchain.json* located in toolchain folder. It contains information about what libraries should be linked and what ABIs should the project target. Projects basic configuration can be changed here.

### Working with Android Debug Bridge

Android Debug Bridge allows this toolchain to push mod files to the remote device and to launch Horizon via USB cable. You can specify push path in `pushTo` property in your *toolchain.json*. When you run the appropriate build task (*Ctrl+Shift+B*), only the files that were changed are being pushed.

## Documentation and Further Resources

All the documentation is available at https://docs.mineprogramming.org.

Some of the old (but mostly still applicable) information can be found at https://wiki.mineprogramming.org.

To update your local typescript header files (used for hints in JavaScript files), go to https://github.com/zheka2304/innercore-mod-toolchain, download everything from *toolchain/jslibs* and unpack to your local *toolchain/jslibs* folder. The documentation is a subject to regular updates, so be sure to use the latest features it provides 😉

## Adding Java directories

To add a new one module, create a directory in *java* folder and add it to *.classpath* file in project folder as a new entry:

```xml
<classpathentry kind="src" path="java/<module_name>/src" />
```

To add *.jar* libraries to classpath and to the compiler, move your library file
to the *libs* directory and add a new entry to the *.classpath* file:

```xml
<classpathentry kind="lib" path="java/<module_name>/lib/<lib_name>.jar" />
```

## Building and Publishing a Release Version of the Mod

To build a release version of the mod, run **Assemble Mod for Release** task. An *mod.icmod* archive is being generated and is ready for upload. You can find out what to do next by following the steps described in https://github.com/zheka2304/InnerCore/blob/master/developer-guide-en.md.
