@echo off
python -m icmtoolchain ensureProjectExists clearOutput buildScripts buildResources compileNative compileJava buildAdditional buildInfo
