# Introducing... Inner Core Mod Toolchain

Howdy and welcome to updated changelog of this toolchain, here are the juiciest features of updates and a list of changes.

## Full Linux support

Now, you can use same toolchain on different platforms. Scripts work with relative paths, tasks have been extended to support any platform backwards, and build files have been added specifically for Unix or updated to suit both platforms. Still same Visual Studio Code, IntelliJ IDEA and direct console work are supported.

## Multiproject

Each project has become a separate component and separated from global toolchain config. Now *make.json* contains only information that is really needed for build, it is more convenient to publish it in open repositories. Create, import and delete as much as your disk space allows. And assembly tasks for the active file will help save time for switching between projects, toolchain will take care of everything. Settings specified in *toolchain.json* main configuration can be used as default values ​​for all projects. You can learn more about configurations in [article](CONFIG.md).

## New projects by template

Do you want to create a new project or import an existing one? Use the appropriate `New Project` and `Import Project` tasks to make project creation easier than ever. Enter a name, optionally change version or description, and you're done! Thanks to the templates, you can directly use different configurations or create your ideal starter mod. Templates are not updatable, are selected from the console, and can be distributed through public repositories. Just rename *make.json* to *template.json* and your design template can already be used.

Created a base template for new mods? Set `defaultTemplate` property in global config or even your current mod to separate specific templates from each other. Even if base template property is specified, you can still select a different template directly from console when creating a new project.

## Code Workspace

Since the entire toolchain has become multi-project, full integration with the *\*.code-workspace* format file has been added for Visual Studio Code, it will now contain all your open projects. Open the workspace through editor with the built-in template [toolchain.code-workspace](toolchain.code-workspace) and start your journey without complicated settings. Or change the `workspaceFile` property to completely disable integration or change relative file path.

You can still open the toolchain folder in your editor using the `Select Project` task. Rest of project folders are hidden so you can focus solely on the selected mod.

## Connect in a few moments

We have compiled project, what's next? If device is already connected, it will simply be saved in list for future connections. Otherwise, connection setup wizard will be called, in which you can configure automatic connection by wire, remotely, or a connection with automatic detection of local addresses. After that, connection will be made by itself with a preference for a wired connection, or user will be prompted to select one device from list. Use the `Configure ADB` task to configure new devices if you are already connected.

For each mod, you can still configure `pushTo`, in a first build stage you are prompted to select a global modpack to send to device. It will be used for each mod by default, the property in *make.json* points to the full path to the mod, and the global value only specifies the path to the modpack.

## Speed up build

At the development stage, we always need a minimum of time between start of compilation and game launch. Scripts, java and native are compiled again only when there are changes, and in which case, if something is not configured, each option will be available directly from opened build console. Compilation configurations at development stage have been removed, for example, scripts are compiled with excluded declarations. More interactive, less compilation time. These are two main steps to perfect toolchain. Well, the icons added to tasks will help intuitiveness.

## Build java with R8/D8 compiler

The projects now officially support Java 8 usage with all sugary goodies and compilation for support on older versions of Android. Compiled classes are cached to save time for subsequent compilation, and unchanged libraries will only be compiled once at all. In near future, it is also planned to implement the use of Kotlin as a language for compilation, but this is a completely different story.

## Updates never been easier

Run the `Check for Updates` task and you are done! Updates are installed for toolchain scripts, task configurations if it is not disabled and mod sample if it is. Projects cannot be affected in any way. However, toolchain is now rich in more than one toolchain. The same task will check for updates for all installed components.

What are components? Android Debug Bridge, TypeScript declarations, toad compiler, class patch with automatic updates for the latest versions of Inner Core, native compiler and headers, including GNU STL. Each component is updated only when changes are made to it. You will be able to install components using install script or later by using the `Integrity Components` task if the need arises.

## All information in front of your eyes

We have collected information for you on using toolchain, a description of each setting in configurations and answers to frequently asked questions. And if latter will subsequently be repeatedly replenished, information on the available features should be enough to avoid researching scripts of toolchain for hours on end.

## Other changes

Something that for some reason was not included in the rest of list, but it may be no less interesting for you.

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
- Native and toad compilers no longer try to compile empty folders or files with an unsupported extension
- Shortcuts `{datestamp}` and `{timestamp}` for *mod.info* properties (`info` in *make.json*) are converted to compile date and time respectively
- The distutils library has been deprecated and is no longer required for toolchain to work
- Exclude toolchain from search results
- Base configs, in which case, are inherited from global toolchain config, which allows you to use overrides in projects
- Added relative or absolute paths for some properties, see config settings for details
- The import script has been expanded to support new types of scripts, toad and native code, as well as compressing several *make.json* into one; repositories folders are additionally copied to simplify the transition to a new toolchain
- Updated progress in tasks, in general, all console elements have changed
- Snippets for callbacks will help you insert new ones into the code even faster
- A few more new properties in config, it makes no sense to paint them here
- Still requires Python 3.6, but Python 3.7 is required for autoping to work asynchronously

> While this is only first stage of update, new functionality is already planned in the future.
