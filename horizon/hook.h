//
// Created by zheka on 18/07/19.
//

#include <functional>

#ifndef HORIZON_HOOK_H
#define HORIZON_HOOK_H

typedef long long int64_t;

namespace SubstrateInterface {
    /** change protection mode of given memory address and surrounding pages
     * - address - address to change protection
     * - offset - offset in pages before page, that contains address
     * - size - size in pages
     * - mode - protection mode
     * returns 0 on success or error code
     * */
    int protect(void* address, int offset, int size, int mode);

    /**
     * technical hook function, use HookManager::addCallback
     * - origin - function to hook address
     * - hook - function to replace
     * - result - pointer, to pass original hooked function
     * returns true on success
     */
    bool hook(void *origin, void *hook, void **result);
}

/**
 * core namespace for callback creation
 */
namespace HookManager {
    enum CallbackType {
        // usual listener, does not create any special conditions
        LISTENER = 0,

        // called as target, will force all RETURN callbacks to be called after it
        REPLACE = 4
    };

    enum CallbackTarget {
        // called before target call and cannot be prevented
        CALL = 0,

        // called after "CALL" callbacks, can be prevented by ones before it
        ACTION = 1,

        // called just before target call if its not prevented, cannot be prevented by other such callback
        TARGET = 2,

        // called after target or replace callback is called to process return value and change it if required. RETURN | REPLACE combination is illegal
        RETURN = 3
    };

    enum CallbackParams {
        // should be passed, if callback returns result, otherwise engine will ignore it
        RESULT = 16,

        // should be passed, if callback requires controller, HookManager::CallbackController* will be passed as first parameter
        CONTROLLER = 32
    };

    // priority for adding callbacks, greater priority = earlier call inside one CallbackTarget
    enum CallbackPriority {
        PRIORITY_MIN = -10,
        PRIORITY_LESS = -5,
        PRIORITY_DEFAULT = 0,
        PRIORITY_GREATER = 5,
        PRIORITY_MAX = 10
    };

    // not implemented for now
    struct CallbackAddStatus {

    };

    /**
     * used to access callback logic, result, status, ect.
     * will be passed as first parameter, if CONTROLLER flag is given
     */
    struct CallbackController {
        // returns, if callback was prevented
        bool isPrevented();

        // returns, if callback was replaced
        bool isReplaced();

        // returns, if contains result from previous calls
        bool hasResult();

        // returns saved result
        void* getResult();

        // prevents callback, all future calls wont happen, this will force all RETURN callbacks to execute right after
        void prevent();

        // replaces callback, prevents target and TARGET callbacks from being called, equivalent to REPLACE flag effect
        void replace();

        // returns pointer to target function
        void* getTarget();

        // calls target with given params and casts result to R, usage: int result = controller->call<int>(1, "a");
        template<typename R, typename... ARGS>
        R call (ARGS... args)  {
            return ((R(*)(ARGS...)) getTarget())(args ...);
        }

        template<typename R, typename... ARGS>
        R callAndReplace (ARGS... args)  {
            replace();
            return ((R(*)(ARGS...)) getTarget())(args ...);
        }
    };

    // technical struct
    struct Hook {
    public:
        void* getCaller();
        void* getTarget();
        void* getAddress();
    };


    template<typename R, typename... ARGS>
    class CallInterface;

    /*
     * represents interface to call specified function, its callback or target
     * CallInterface is immune to future addCallback calls for its target method
     */
    template<typename R, typename... ARGS>
    class CallInterface<R(ARGS...)> {
    public:
        // calls target (original) function
        R target(ARGS... args);

        // calls function callback, or original function, if no callbacks exist
        R hook(ARGS... args);

        // equivalent to hook(), but as operator
        R operator()(ARGS... args);

        // creates same interface for other type
        template<typename T>
        CallInterface<T>* cast();

        // returns target (original) function address
        void* getTargetCaller();

        // returns hook function address
        void* getHookCaller();

        void* getAddrHookCaller();
    };

    /*
     * returns call interface for given function, call interface allows to call both callback and original function and immune to creating callbacks of this method
     * usage:
     *  auto method = HookManager::getCallInterface<void*(int, int)>(...);
     */
    template<typename T>
    CallInterface<T>* getCallInterface(void* addr);

    // -- function pointers --
    /*
     * adds func as callback for address with given params and priority
     * - addr - address to add
     * - func - function pointer, cast to void*
     * - flags - all flags are described above, default combination is CALL | LISTENER
     * - priority - higher priority - earlier call, default is DEFAULT_PRIORITY (0)
     * */
    CallbackAddStatus* addCallback(void* addr, void* func, int flags, int priority);
    CallbackAddStatus* addCallback(void* addr, void* func, int flags);
    CallbackAddStatus* addCallback(void* addr, void* func);


    // -"- with usage of LAMBDA()
    CallbackAddStatus* addCallback(void* addr, int64_t lambda, int flags, int priority);
    CallbackAddStatus* addCallback(void* addr, int64_t lambda, int flags);
    CallbackAddStatus* addCallback(void* addr, int64_t lambda);
}

#define LAMBDA(ARGS, CODE, VALUES, ...) ((int64_t) new std::function<void ARGS>([VALUES] ARGS CODE))



#endif //HORIZON_HOOK_H
