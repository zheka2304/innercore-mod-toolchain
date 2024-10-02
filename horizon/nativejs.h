#include <stdlib.h>
#include <functional>
#include <logger.h>
#include <hook.h>
#include <stdarg.h>
#include <jni.h>
#include <mod.h>


#ifndef NATIVEJS_H
#define NATIVEJS_H 

namespace NativeJS {
	typedef int64_t result_t;

	struct ParameterBuffer {
	public:
		uint32_t buffer[12];
	};

	struct ComplexArgs {
	public:
		enum ValueType {
			CHAR = 0,
			INT32 = 1,
			INT64 = 2,
			DOUBLE = 3,
			STRING = 4,
			INVALID = 8
		};

		struct ValueContainer {
		public:
			ValueType type = INVALID;
			uint64_t packedValue = 0;

			ValueContainer();
			ValueContainer(void* buffer, int& offset);
			void finalize();
		
			char asChar(char defaultValue = 0);
			unsigned char asUChar(unsigned char defaultValue = 0);
			int asInt(int defaultValue = 0);
			unsigned int asUInt(unsigned defaultValue = 0);
			int64_t asInt64(int64_t defaultValue = 0);
			uint64_t asUInt64(uint64_t defaultValue = 0);
			float asFloat(float defaultValue = 0);
			double asDouble(double defaultValue = 0);
			void* asPointer(void* defaultValue = nullptr);
			char* asString();
		};

		std::map<std::string, ValueContainer> data;
		ComplexArgs(void* buffer, int& offset);
		ValueContainer get(std::string name);
	};

	
	enum FunctionType {
		INVALID = 0,
		BASIC = 1,
		COMPLEX = 2
	};

	struct InitializerWrap {
	public:
		InitializerWrap(std::string module, std::string name, std::string signature, FunctionType type, void* function);
	};
	
	struct ModuleVersionWrap {
	public:
		ModuleVersionWrap(std::string module, int version);
	};

	struct FunctionWrap {
	public:
		void* functionPtr = nullptr;
		FunctionType type = INVALID;
		std::string signature;
		int version = -1;
	};


	struct Module {
	public:
		std::string name = "";
		int version = 0;
		std::map<std::string, FunctionWrap> functions;
	};
	
	/* signature represents parameters and return type, RETURN_TYPE(PARAMETERS...) example: S(OI)
		return types:
			V - void
			I - long int
			F - double
			S - string
			O - object
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
	void _registerFunction(std::string name, std::string module, std::string signature, FunctionType type, void* function);
	void _setModuleVersion(std::string name, int version);

	Module* getModule(std::string name);

	jobjectArray getFunctionListForModule(JNIEnv* env, jstring jmodule);
	jlong getFunctionHandle(JNIEnv* env, jstring jmodule, jstring jname);
	jint getFunctionCallType(JNIEnv* env, jlong handle);
	jstring getFunctionSignature(JNIEnv* env, jlong handle);
	jlong invokeBasicParameterFunction(JNIEnv* env, jlong handle, jobject jbuffer);
	jlong invokeComplexParameterFunction(JNIEnv* env, jlong handle, jobject buffer);

	jlong wrapIntegerResult(int64_t value);
	jlong wrapDoubleResult(double value);
	jlong wrapStringResult(JNIEnv* env, std::string value);
	jlong wrapObjectResult(JNIEnv* env, jobject value);

	jlong unwrapLongResult(jlong result);
	jdouble unwrapDoubleResult(jlong result);
	jstring unwrapStringResult(JNIEnv* env, jlong result);
	jobject unwrapObjectResult(JNIEnv* env, jlong result);
};


#define __JS_MODULE_VERSION(module, version, line) NativeJS::ModuleVersionWrap __module_version_wrap ## module ## version ## line (#module, version);
#define JS_MODULE_VERSION(module, version) __JS_MODULE_VERSION(module, version, __LINE__);
#define JS_EXPORT_CUSTOM(module, name, signature, type, result_type, function_body) \
 result_type __nativejs_ ## name ## _ ## module function_body \
 NativeJS::InitializerWrap __wrap_ ## name ## _ ## module(#module, #name, signature, type, (void*) __nativejs_ ## name ## _ ## module);
#define JS_EXPORT(module, name, signature, function_body) JS_EXPORT_CUSTOM(module, name, signature, NativeJS::BASIC, jlong, function_body)
#define JS_EXPORT_COMPLEX(module, name, signature, function_body) JS_EXPORT_CUSTOM(module, name, signature, NativeJS::COMPLEX, jlong, function_body)

#endif