// This is a sample source for mod, that uses sample native module, that is created in src/native/sample

alert("Sample mod loaded!");

var SampleNativeModule = WRAP_NATIVE("SampleNativeModule");
alert("Received value from native: " + SampleNativeModule.hello(2, 1));


// test sample library 

IMPORT("SampleModLibrary")
SampleLibraryModule.test();
