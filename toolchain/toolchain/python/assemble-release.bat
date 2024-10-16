@echo off
python -m icmtoolchain --release ensureProjectExists clearOutput --force buildScripts buildResources compileNative compileJava buildAdditional buildInfo excludeDirectories buildPackage
