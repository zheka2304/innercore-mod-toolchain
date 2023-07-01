@echo off
python -m icmtoolchain clearOutput buildScriptsRelease buildResources compileNativeRelease compileJavaRelease buildAdditional buildInfo excludeDirectories buildPackage -- --clean
