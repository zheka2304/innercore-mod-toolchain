@echo off
python -m icmtoolchain ensureProjectExists clearOutput buildScripts compileNative compileJava buildResources buildInfo
