#include <stdlib.h>
#include <functional>
#include <logger.h>
#include <hook.h>
#include <stdarg.h>
#include <jni.h>
#include <list>


#ifndef CALLBACKS_SYSTEM_CALLBACKS_H
#define CALLBACKS_SYSTEM_CALLBACKS_H 

// 4 * 16 = 64 bytes per callback params
#define _MAX_CALLBACK_PARAMS_SIZE 16 
// macro for creating callback lambdas
#define CALLBACK(VALS, ARGS, ...) ((std::function<void(Callbacks::CallbackParamsPlaceholder)>*) new std::function<void ARGS> (VALS ARGS -> void __VA_ARGS__)) 


namespace Callbacks {
	struct CallbackParamsPlaceholder {
		uint32_t bytes[_MAX_CALLBACK_PARAMS_SIZE];  
	};

	class Callback {
	public:
		std::function<void(CallbackParamsPlaceholder)> func;
		struct Callback* next;
		struct Callback* prev; 

		Callback(std::function<void(CallbackParamsPlaceholder)>&);
	};

	class CallbackList {
	public:
		struct Callback* first;
		struct Callback* last;

		void add(std::function<void(CallbackParamsPlaceholder)>&);	
		void invoke(CallbackParamsPlaceholder);
	};

	void addCallback(std::string name, std::function<void(CallbackParamsPlaceholder)>* func);
	void invokeCallback(std::string name, ...);
	void invokeAsyncCallback(std::string name, ...);  // TODO: make this method to run callbacks in separate thread
};

namespace JavaCallbacks {
	enum CallbackFlag {
		PREVENTABLE = 1,
		RECURSIVE = 2,
		SIGNATURE = 4,
		NO_STACK = 8
	};

	enum PreventionMask {
		TARGET = 1,    // prevent target call 
		CALLBACKS = 2  // prevent future native callbacks for this method
	};

	class JavaThreadContainer {
		JNIEnv* env = nullptr;
		bool attached = false;
	public:
		JavaThreadContainer();
		JavaThreadContainer(JNIEnv* env);
		~JavaThreadContainer();

		JNIEnv* get();
	};

	class CallbackStack {
	public:
		class StackElement {
		public:
			jmethodID method;
			StackElement(jmethodID m);
		};

		std::list<StackElement> stack;

		bool isEmpty();
		bool has(jmethodID name);
		void push(jmethodID name);
		void pop();
	};

	void passStringParameter(std::string key, std::string value);
	std::string getStringParameter(std::string key);

	void setJavaVM(JavaVM* vm);
	JavaVM* getJavaVM();
	void setDefaultCallbackClass(JNIEnv *env, std::string path);
	jclass getDefaultCallbackClass();

	void invokeCallbackV(jclass callbackClass, std::string name, std::string signature, HookManager::CallbackController* controller, int flags, va_list);
	void invokeControlledCallback(jclass callbackClass, std::string name, std::string signature, HookManager::CallbackController* controller, int flags, ...);
	void invokeControlledCallback(std::string name, std::string signature, HookManager::CallbackController* controller, int flags, ...);
	void invokeCallback(jclass callbackClass, std::string name, std::string signature, ...);
	void invokeCallback(std::string name, std::string signature, ...);

	void prevent(int mask);
	void prevent();
	bool isPrevented(); // returns if target is prevented

	void addExceptionHandler(std::function<void(JNIEnv*, const char*, jthrowable)> handler);
	void handleJavaException(JNIEnv* env, std::string callback, jthrowable throwable);
};

/* helpful macro to attach java env at any moment
JNIEnv* env;
ATTACH_JAVA(env, JNI_VERSION) {
	do something with env
}
*/
#define ATTACH_JAVA(ENV, VER) for (bool wasEnvAttached = (JavaCallbacks::getJavaVM()->GetEnv((void **) &ENV, VER) == JNI_EDETACHED), _flag = true; _flag; wasEnvAttached && JavaCallbacks::getJavaVM()->DetachCurrentThread(), _flag = false)

#endif