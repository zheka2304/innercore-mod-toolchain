// This is a sample source for mod, that uses sample native module in native/sample

alert("Sample mod loaded!");

const SampleNativeModule = WRAP_NATIVE("SampleNativeModule");
alert("Received value from native: " + SampleNativeModule.hello(2, 1));

// Also some test sample library here

IMPORT("SampleModLibrary")
SampleLibraryModule.test();
