LIBRARY({
	name: "SampleModLibrary",
	version: 1,
	shared: true,
	api: "CoreEngine"
});

var SampleLibraryModule = {
	test: function () {
		alert("hello from sample library");
	}
};

EXPORT("SampleLibraryModule", SampleLibraryModule);
