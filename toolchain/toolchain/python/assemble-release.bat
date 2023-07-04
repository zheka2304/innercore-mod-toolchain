@echo off
python -m icmtoolchain clearOutput --force buildScriptsRelease buildResources compileNativeRelease compileJavaRelease buildAdditional buildInfo excludeDirectories buildPackage
