#pragma once

#include <jni.h>
#include <string>
#include <fstream>
#include <functional>
#include <map>
#include "modules.h"

namespace SignalHandler {
    // initializes signal handles inside given process, this usually happens automatically
    void initialize();
}

/* represents mod library instance */
class ModLibrary {};

/**
 * Modules are main structural units of most mod libraries, that can receive and handle events, contain information etc.
 * - Custom module class must extend Module class or some of its subclasses
 * - Modules must be instantiated in library entry point (MAIN {...})
 * - All initialization logic, including adding callbacks, must happen inside module's initialize() method
 *
 * Properties:
 * - Modules can have name IDs and inherit other modules, this will be represented in UI to show hierarchy
 * - Module name ID is used to search its description in manifest
 *
 * Tips:
 * - Modules are used to divide all code into separate logic pieces
 * - You should have global variables of module instances, created in MAIN {...}
 * - All global variables should be put inside modules and accessed through its instances
 * - All API events should be processed inside modules through addListener
 * - Modules also used for profiling and crash handling
 */
class Module {
#if defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__)
public:
    std::string name;
    hz_module_handle_t handle;
#else
private:
    ModLibrary* library = NULL;
    Module* parent = NULL;
    const char* id = NULL;
    bool _isInitialized = false;

    std::map<std::string, std::vector<std::function<void()>*>> listeners;
#endif

public:
    // receives parent or name ID or both, root module must have name ID
    Module(Module* parent, const char* id);
    Module(const char* id);
#if !(defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__))
    Module(Module* parent);
#else
    virtual ~Module();
#endif

    // all initialization must happen here
    virtual void initialize() {}
#if !(defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__))
    // separate method for java initialization
    virtual void initializeJava(JNIEnv* env);
    // returns type, that used inside UI
    virtual const char* getType();
    // used to create separate mod log, used, if current profiled section belongs to this module
    virtual std::ofstream* getLogStream();
#endif
    virtual void shutdown() {}
};

#define JNI_VERSION JNI_VERSION_1_4

#if defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__)
/**
 * describes library entry point
 * - There must be only one entry point per library
 * - In most cases used only for module instantiation
 * - Inside its body there are variables void* library - instance of this mod library and int* result - pointer to initialization result (0 is OK)
 * MAIN {
 *
 * }
 */
#define NO_JNI_MAIN \
    void __entry(void* library, int* result); \
    int __mod_main(ModLibrary* library) { \
        int result = 0; \
        SignalHandler::initialize(); \
        __entry(library, &result); \
        return result; \
    } \
    void __entry(void* library, int* result)

#define MAIN \
    extern "C" JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM*, void*) { return JNI_VERSION; } \
    NO_JNI_MAIN
#else
/**
 * describes library entry point
 * - There must be only one entry point per library
 * - In most cases used only for module instantiation
 * - Inside its body there are variables ModLibrary* library - instance of this mod library and int* result - pointer to initialization result (0 is OK)
 * MAIN {
 *
 * }
 */
#define NO_JNI_MAIN \
    void __entry(void* library, int* result); \
    int __mod_main(ModLibrary* library) { \
        int result = 0; \
        SignalHandler::initialize(); \
        __entry(library, &result); \
        return result; \
    } \
    void __entry(void* library, int* result)

#define MAIN \
    extern "C" JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM*, void*) { return JNI_VERSION; } \
    NO_JNI_MAIN
#endif
