//
// Created by zheka on 18/07/15.
//

#include <jni.h>
#include <functional>
#include <vector>
#include <fstream>
#include <map>
#include "definitions.h"

#ifndef HORIZON_MOD_H
#define HORIZON_MOD_H

class Module;

/* represents mod library instance */
class ModLibrary {
public:
    // library handle ptr
    void* handle = nullptr;

    // initialization result
    int result = 0;

    // returns list of all modules
    std::vector<Module*> getModules();
};

/*
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
private:
    ModLibrary* library = NULL;
    Module* parent = NULL;
    const char* id = NULL;
    bool _isInitialized = false;

    std::map<std::string, std::vector<std::function<void()>*>> listeners;

public:
    // receives parent or name ID or both, root module must have name ID
    Module(Module* parent, const char* id);
    Module(const char* id);
    Module(Module* parent);

    // adds mod listener method, that will be called upon given event
    template <typename T>
    void addListener(std::string event, std::function<T> const& function);

    // invokes all listeners for given event
    template <typename... ARGS>
    void onEvent(std::string event, ARGS... args);

    // all initialization must happen here
    virtual void initialize();

    // separate method for java initialization
    virtual void initializeJava(JNIEnv* env);

    // returns parent module
    Module* getParent();
    // returns name ID
    const char* getNameID();
    // returns type, that used inside UI
    virtual const char* getType();
    // used to create separate mod log, used, if current profiled section belongs to this module
    virtual std::ofstream* getLogStream();

    bool isInitialized();
    // returns mod library, this module belongs to
    ModLibrary* getLibrary();
};

/*
 * same class as module, but interpreted as mod inside UI, root module of your mod should implement this class
 */
class Mod : public Module {
public:
    Mod(Module *parent, const char *id);
    Mod(Module *parent);
    Mod(const char *id);
};


namespace ModuleRegistry {
    // returns all modules for given name ID
    std::vector<Module*> getModulesById(std::string id);

    // invokes event with given name and args for all modules, if filter function returned true
    template <typename... ARGS>
    void onFilteredEvent(std::string event, std::function<bool(Module*)> filter,  ARGS... args);

    // invokes event with given name and args for all modules
    template <typename... ARGS>
    void onEvent(std::string event, ARGS... args);

    // invokes event with given name and args for all modules with given name ID
    template <typename... ARGS>
    void onTargetEvent(std::string module, std::string event, ARGS... args);

    // invokes method for all modules
    void onAction(std::function<void(Module*)> action);
};

namespace SignalHandler {
    // initializes signal handles inside given process, this usually happens automatically
    void initialize();
}



#define JNI_VERSION JNI_VERSION_1_4

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
            void __entry(ModLibrary* library, int* result); \
            int __mod_main(ModLibrary* library) {\
                int result = 0; \
                SignalHandler::initialize();\
                __entry(library, &result);\
                return result;\
            }\
            void __entry(ModLibrary* library, int* result)

#define MAIN \
            extern "C" JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM*, void*) {return JNI_VERSION;} \
            NO_JNI_MAIN
            


#endif //HORIZON_MOD_H
