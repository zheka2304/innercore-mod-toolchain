# Introducing... Inner Core Mod Toolchain

Howdy and welcome to updated changelog of this toolchain, here are the juiciest features of updates and a list of changes.

## Full Linux support

Now, you can use same toolchain on different platforms. Scripts work with relative paths, tasks have been extended to support any platform backwards, and build files have been added specifically for Unix or updated to suit both platforms. Still same Visual Studio Code, IntelliJ IDEA and direct console work are supported.

## Multiproject

Each project has become a separate component and separated from global toolchain config. Now *make.json* contains only information that is really needed for build, it is more convenient to publish it in open repositories. Create, import and delete as much as your disk space allows. Settings specified in *toolchain.json* main configuration can be used as default values ​​for all projects.

## New projects by template

Do you want to create a new project or import an existing one? Use the appropriate `New Project` and `Import Project` tasks to make project creation easier than ever. Enter a name, optionally change version or description, and you're done! Thanks to the templates, you can directly use different configurations or create your ideal starter mod. Templates are not updatable, are selected from the console, and can be distributed through public repositories. Just rename *make.json* to *template.json* and your design template can already be used.

Created a base template for new mods? Set `defaultTemplate` property in global config or even your current mod to separate specific templates from each other. Even if base template property is specified, you can still select a different template directly from console when creating a new project.

## Code Workspace

Since the entire toolchain has become multi-project, full integration with the *\*.code-workspace* format file has been added for Visual Studio Code, it will now contain all your open projects. Open the workspace through editor with the built-in template [toolchain.code-workspace](toolchain.code-workspace) and start your journey without complicated settings. Or change the `workspaceFile` property to completely disable integration or change relative file path.

You can still open the toolchain folder in your editor using the `Select Project` task. Rest of project folders are hidden so you can focus solely on the selected mod. Do you want to build a project based on the currently opened file? Then, the same tasks with ending `* by Active File` comes to rescue. So, the project whose file is currently opened will be built.

## Connect in a few moments

We have compiled project, what's next? If device is already connected, it will simply be saved in list for future connections. Otherwise, the bridge setup wizard will be called, in which you can configure automatic connection by cable, remotely or with automatic detection of remote connections. After that, connection will be made by itself with a preference for a wired connection, or user will be prompted to select one device from list. Use the `Configure ADB` task to configure new devices if you are already connected.

For each mod, you can still configure `pushTo`, in a first build stage you are prompted to select a global modpack to send to device. It will be used for each mod by default, the property in *make.json* points to the full path to the mod, and the global value only specifies the path to the modpack.

## Speeding up build

At the development stage, we always need a minimum of time between the start of compilation and of launch the game. Scripts, java and native are compiled again only when there are changes, and in which case, if something is not configured, each option is available directly from the open build console. Compilation configurations at the development stage have been moved out, for example, scripts are compiled with partially excluded declarations.

Use a composite build to assembling all project scripts at once when they change, so the build will speed up even more, or just use the `Watch Scripts` task to track changes. Consider the `tsconfig` property and others from `development` for advanced compiler customization, or simply add the desired properties to the comments of the build files. More interactive, less compilation time. Here are two basic steps to the perfect toolchain. Well, the icons added to the tasks will help the intuitiveness.

## Build java with R8/D8 compiler

The projects now officially support Java 8 usage with all sugary goodies and compilation for support on older versions of Android. Compiled classes are cached to save time for subsequent compilation, and unchanged libraries will only be compiled once at all. In near future, it is also planned to implement the use of Kotlin as a language for compilation, but this is a completely different story.

No less important is the fact that now installing a component with a classpatch for compilation takes a few seconds. So, there are only a couple of libraries left here, which compiles faster, updates automatically with launcher updates and weighs a couple of times less. What could be better?

## Updates never been easier

Run the `Check for Updates` task and you are done! Updates are installed for the toolchain scripts, task configs if it is not disabled, and the mod sample if it is. Projects cannot be affected in any way. However, the toolchain is now rich in more than one toolchain. The same task will check for updates for all installed components.

What are components? Android Debug Bridge, TypeScript declarations, Java Compiler, Classpatch with automatic updates for the latest versions of Inner Core, Native GCC Compiler and headers, including GNU STL. Each component is updated only when changes are made to it remotely. You will be able to install the components using the install script or later by using the `Integrity Components` task if the need arises.

## Work without leaving terminal

Not enough built-in configurations, and creating new ones remains a problem to work on different devices? Or maybe you want to work only in the console, or using a remote server? From now on, the toolchain works as an independent library for Python, use it in your programs or call it from your *PATH* without any problems. A good start is to call `python -m icmtoolchain --list` in your terminal, after the toolchain is part of the `PYTHONPATH` of course.

## Ongoing support

We fix or help with the solution of emerging problems in the near future. Since the first update, adjustments have been made to fix existing issues; console testing stage is no longer that way, the new features do not affect the work of the old ones, the modding process becomes more intuitive, and the transition to multiplatform support is fully completed. Found a problem or inaccuracy? Post a new issue to the repository so we can learn about it.

There are more settings, opportunities are expanding, and the build time, on the contrary, is decreasing. But that's not all, the planned ideas will be implemented as far as possible. And believe me, they will still be able to surprise you and make the modding process more enjoyable and easier. And in order not to get lost in the project, the documentation contains all the necessary information about the available tasks and all configurations of the toolchain.

## Other changes

Something that for some reason was not included in the rest of list, but it may be no less interesting for you.

- Compilation of legacy javascript and individual files with typescript is carried out by the toolchain
- Build folders using legacy javascript with a standard, Inner Core like, look
- Added autoping also local ports of found addresses, you can make yourself some tea while the process is completed
- Separate build tasks no longer overwrite the list of changed files, it is replaced when cleaning or releasing
- Mod selections and some of the console functions now consist of mod names instead of chaotic folder names
- Assembly is performed correctly if the output path does not exist or the file becomes a folder
- The installer script works properly on Windows, we apologize for the problem
- Several strategies for comparing files will speed up the build or make the search for changes more accurate
- Entering text from the console on Windows works properly, including checkboxes and other CLI elements
- Page transition indicators will help you feel even more confident in the console
- Optionally specifying a target file or folder for additional resources is available
- If the import folder is not set, the naming standards are used as when creating the project
- Non-relative paths in modified build folders are no longer cleared
- Standard folders and templates include tracking exceptions for cached folders
- Build folders do not affect the format of output files, the format changes only for files
- File attributes in archives are correctly extracted, installation is faster in some cases
- Improved documentation to make it easier for you to get started in this toolchain update
- The absence of optional properties in the manifest of java and native folders does not cause an error
- The default output folder is not cleared to speed up the build, the config changes this
- Requirement TypeScript 3 or higher to compile composite projects
- Changing *tsconfig.json* in the result of the build does not cause the build next time
- Canceling native compiler loading stops the build instead of continuing it
- Java no longer needs to rebuild dexes every time if they were cleared in *output/*
- If the output source of the script does not exist, only a warning will be displayed
- Not very huge increase in hashing speed on new versions of Python, by about 20-40%
- Fixed some graphic or aesthetic bugs in the console

---

- Installation script has been expanded to use start operations of import, installation of components and an interactive console with settings; it can also be used to reinstall a broken toolchain
- Support for building `custom` scripts with `sourceName`, `optimizationLevel` settings and support for multi-includes with the `includes` property
- Added tasks for exclusive assembly, in such cases, sending to the device will not be performed
- Updated native headers, missing libraries and generation of new libraries for updates were added to classpath, declarations were separated to support context of preloader (resource loader) of mods
- The release archive is collected in a subfolder equivalent to the name of the project folder, folder and not entire project is now in the root of build archive
- Separate task for rebuilding declarations config
- A large part of known errors are accompanied by appropriate messages and exit codes instead of directly occurring
- By default, all files are sent to device, not just modified ones, since there are several people who have problems with this; change the `adb.pushUnchangedFiles` property to revert this option back to the old way
- Partial support for 'head' javascript, tsc compiler required if you plan to use declarations or typescript
- toolchain-mod -> toolchain, toolchain-mod/src -> toolchain-sample-mod, toolchain-mod is now a template based on basic needs of modders
- It is recommended to remove the *src* prefix from your projects, it is better to place folders right in the root of project in front of your eyes
- Only really unnecessary folders are hidden from workspace, main scripts, declarations, headers and classpatch do not apply to them
- Fixed assembly of base template for mod and an example using all available features
- Installing the NDK does not kick the user with an error if installation is canceled
- The project uses tabs instead of spaces; this applies to both toolchain and mods it collects; well, unused imports are removed just as is
- Removed the standard creation of mods with archives attached to it
- `ndkPath` property can use relative paths from toolchain
- Android Debug Bridge will not be loaded by default if it is already installed on the system
- Native and java compilers no longer try to compile empty folders or files with an unsupported extension
- Shortcuts `{datestamp}` and `{timestamp}` for *mod.info* properties (`info` in *make.json*) are converted to compile date and time respectively
- The distutils library has been deprecated and is no longer required for toolchain to work
- Exclude toolchain from search results
- Base configs, in which case, are inherited from global toolchain config, which allows you to use overrides in projects
- Added relative or absolute paths for some properties, see config settings for details
- The import script has been expanded to support new types of scripts, java and native code, as well as compressing several *make.json* into one; repositories folders are additionally copied to simplify the transition to a new toolchain
- Updated progress in tasks, in general, all console elements have changed
- Snippets for callbacks will help you insert new ones into the code even faster
- A few more new properties in config, it makes no sense to paint them here
