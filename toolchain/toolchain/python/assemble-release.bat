@echo off
python -m icmtoolchain --release ensureProjectExists clearOutput --force buildScripts compileNative compileJava buildResources buildInfo buildPackage
