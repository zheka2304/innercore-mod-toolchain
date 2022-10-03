# Inner Core Mod Toolchain — Configuration

Any operations of toolchain are guided by configuration files for building the project, creating it, and setting the basic properties of templates.

There are several types of configurations, description of each properties of which is described below. If a default value exists, it is also specified.

Path selections can contain /\*\*/ to select folders and all subfolders, as well as /\* to select all files, /\*.js or /\*.jar to select all files with the desired extension.

## make.json - building project

Properties marked with \* can have absolute file paths.

```js
.
├─ info: {} // basic information about project, setted at the stage of its creation
│  ├─ name: "Mod"
│  ├─ version: "1.0"
│  ├─ author: "ICMods"
│  ├─ description: ""
│  ├─ clientOnly: false
│  └─ *icon: "mod_icon.png"
├─ api: "CoreEngine" // "CoreEngine", "AdaptedScript", "Preloader", "PrefsWinAPI", "Instant"
├─ optimizationLevel: -1 // value between -1..9, serves to unload scripts from memory
├─ setupScript: null // path to script that is triggered when unpacking project archive in mod browser
│
├─ sources: [] // directories for compiling scripts, such as launcher script to run or main.js
│  └─ {}
│     ├─ type // "main", "launcher", "preloader", "instant", "custom", "library"
│     ├─ source // relative path to script or folder, /* format is supported to include subfolders in folder
│     ├─ language: "javascript" // or "typescript"
│     ├─ target: basename(this.source) + ".js" // script file name for output compilation
│     ├─ sourceName: null // exclusive to "custom" build types, but script name is also displayed, for example, on errors
│     ├─ includes: ".includes" // file for building scripts, there can be several of them in one folder
│     ├─ api: api // "CoreEngine", "AdaptedScript", "Preloader", "PrefsWinAPI"
│     └─ optimizationLevel: optimizationLevel // value between -1..9, serves to unload scripts from memory
│
├─ compile: [] // directories for compiling C++ and Java code, this of course does not mean that you can just take source code from Forge, but this is no less interesting thing
│  └─ {}
│     ├─ type // "native", "java"
│     ├─ source // relative path to folder, /* format is supported to include subfolders in folder
│     └─ rules: {} // exclusive to native modding
│        ├─ keepSources: false // whether to leave sources in project after compilation
│        ├─ keepIncludes: true // whether to leave headers (includes, headers) in project after compilation
│        └─ link: [] // additional linking only for this source
│
├─ resources: [] // directories for building resources, such as textures for items or interface
│  └─ {}
│     ├─ type // "resource_directory", "gui", "minecraft_resource_pack", "minecraft_behavior_pack"
│     ├─ path // relative path to resource folder
│     └─ target: basename(this.path) // path in project after building
│
├─ additional: [] // additional directories that need to be included in project after building
│  └─ {}
│     ├─ sources // relative path to folder, /* format is supported to include subfolders in folder
│     └─ pushTo // output path in project after building
├─ excludeFromRelease: [] // relative paths to folders excluded from project when building to release, /* format is supported to include subfolders in a folder
│
├─ gradle: {} // exclusive to java modding
│  ├─ keepLibraries: true // whether to leave libraries in project after compilation
│  ├─ keepSources: false // whether to leave sources in project after compilation
│  └─ classpath: [] // additional paths to include in system libraries, they will not be included in archive itself
├─ linkNative: [] // paths that will be linked for all native sources
│
└─ target: {} // default output building paths
   ├─ source: "source" // all scripts except libraries
   ├─ library: "library" // only script libraries
   ├─ native: "native" // native modding
   ├─ java: "java" // java modding
   ├─ resource_directory: "resources" // texture resources of blocks, items and various atlases
   ├─ gui: "gui" // built-in Inner Core interface
   ├─ minecraft_resource_pack: "minecraft_packs/resource" // resource packs included in game after entering the world
   └─ minecraft_behavior_pack: "minecraft_packs/behavior" // addons included in game after entering the world
```

Basic configuration for projects. Each of properties not set here can also be obtained from toolchain configuration as a default value.

## toolchain.json — toolchain configuration

Properties marked with \* can have absolute file paths.

```js
.
├─ *projectLocations: [] // relative or absolute paths to projects, the entire folder is scanned for make.json and template.json configurations
├─ *workspaceFile: "../toolchain.code-workspace" // path to the workspace file, exclusive to Visual Studio Code, all open and created projects are added to it
│
├─ ^template: {} // info property from make.json, values are automatically filled in when creating a project, overwrites properties from the template if they are set there too
│  └─ ^skipDescription: false // skips description page when creating a project from a template, i.e. it will be enough just to enter a name, remaining properties will be taken from the template or overwritten by properties
├─ *defaultTemplate: "../toolchain-mod" // template selected by default when creating the project can be a relative or absolute path to it
│
├─ denyJavaScript: true // uses the tsc compiler even if project uses only JavaScript
├─ *debugIncludesExclude: [] // fetching declarations that tsc excludes from compilation at development helps reduce building time; if the path is not found, it will try again with absolute variant
│
├─ ^*ndkPath: null // can be specified if you already have NDK installed for compiling native code, it is recommended to use the r16b version; by default, the compiler will be searched in PATH or set by toolchain itself
├─ abis: [] // "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
├─ debugAbi: "armeabi-v7" // main architecture for compiling native code at development stage
│
├─ pushTo // output modpack folder on device, selected on anything connection; modpack path in toolchain config, mod itself in make
├─ adb: {} // additional ADB settings
│  ├─ pushAnyLocation: false // by default, if the pushTo property does not specify installation of Inner Core pack, a warning will be issued for pushing to a strange location; this setting disables it
│  ├─ pushUnchangedFiles: true // whether all files should be pushed to the device, or only modified ones
│  └─ doNothingIfDisconnected: false // instead of prompting for device configuration in console, just terminates building process if no device is connected
├─ ^devices: [] // a list of saved devices that changes when connected during ADB setup; this contains private information, so changing it is not possible from make.json
│
├─ ^componentInstallationWithoutCommit: false // whether .commit marks are needed in installed components; if not needed, updates cannot be installed, and the component will be considered installed if a folder with it exists
└─ ^updateAcceptReplaceConfiguration: true // whether it is necessary to replace configuration files in toolchain folder of toolchain, such as .vscode/tasks.json and others; otherwise your changes will remain the same even with updates
```

Can only be created once in toolchain directory, some of properties marked with ^ cannot be changed from *make.json* to building.

## template.json - project template

> Inherits directly from *make.json* to build project, `info` property is overwritten when the project is created. In addition, properties from `info` will be applied as default values when the template is used.

If this file exists in directory and project can be found, it will later be used as a template when creating the project. Can be used in conjunction with *make.json* to build a project.
