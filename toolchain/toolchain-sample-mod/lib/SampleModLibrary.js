LIBRARY({
	name: "SampleModLibrary",
	version: 1,
	shared: false,
	api: "CoreEngine"
});

(function() {
	const SampleLibraryModule = {
		test: function() {
			alert("hello from sample library");
		}
	};

	EXPORT("SampleLibraryModule", SampleLibraryModule);
})();
