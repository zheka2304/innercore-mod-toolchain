@echo off
python -m icmtoolchain --release clearOutput --force buildScripts buildResources compileNative compileJava buildAdditional buildInfo excludeDirectories buildPackage
