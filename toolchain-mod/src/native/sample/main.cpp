
#include <hook.h>
#include <mod.h>
#include <logger.h>
#include <symbol.h>

#include <nativejs.h>


// modules are main structural units of native libraries, all initialization must happen inside of them
class MainModule : public Module {
public:
	MainModule(const char* id): Module(id) {};

	virtual void initialize() {	
        // any HookManager::addCallback calls must be in initialize method of a module
        // any other initialization also highly recommended to happen here
    }
};

class OtherModule : public Module {
public:
	OtherModule(Module* parent, const char* id) : Module(parent, id) {};
};

// entry point for a native library
// only one MAIN {} allowed per library
MAIN {
	// create all modules
	Module* main_module = new MainModule("sample_library");
	// to create module hierarchy, create modules with additional parent parameter in constructor
	new OtherModule(main_module, "sample_library.other_module");
}

// module version defines version of next functions, that belong to this module
// if several modules with one name is loaded and several same functions registered, only function with highest version is registered
// this is required in case of libraries 
JS_MODULE_VERSION(SampleNativeModule, 1)

// exports module and function to javascript, now you can call WRAP_NATIVE("SampleNativeModule") and a module with single function "hello", receiving two numbers, will be returned
// signature I(LL) defines a method, receiving two ints, and returning long
JS_EXPORT(SampleNativeModule, hello, "I(II)", (JNIEnv* env, int value1, int value2) {
	// for different return types you must call appropriate NativeJS::wrap... functions
	// if you function is void, use return 0;
	return NativeJS::wrapIntegerResult(value1 + value2);
});

// native js signature rules:
/* signature represents parameters and return type, RETURN_TYPE(PARAMETERS...) example: S(OI)
	return types:
		V - void      - return 0
		I - long int  - wrapIntegerResult
		F - double    - wrapDoubleResult
		S - string    - wrapStringResult
		O - object    - wrapObjectResult
	parameter types:
		I - int (4 bits) 
		L - long (8 bits)
		F - float (4 bits)
		D - double (8 bits)
		B - boolean (1 bit)
		C - char (1 bit)
	as seen, basic call functions cannot receive string and objects for sake of performance, so complex functions come in place
	in case of complex functions parameters are ignored
	JNIEnv* is always passed as first parameter
*/