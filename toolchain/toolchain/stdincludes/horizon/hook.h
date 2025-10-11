#pragma once

#include <string>
#include <unordered_map>
#include <stdlib.h>
#include <dlfcn.h>
#include <errno.h>
#include <bits/sysconf.h>

#include "definitions.h"


namespace SubstrateInterface {
    /**
     * change protection mode of given memory address and surrounding pages
     * - address - address to change protection
     * - offset - offset in pages before page, that contains address
     * - size - size in pages
     * - mode - protection mode
     * returns 0 on success or error code
     */
    int protect(void* address, int offset, int size, int mode);

    /**
     * technical hook function, use HookManager::addCallback
     * - symbol - function to hook address
     * - hook - function to replace
     * - result - pointer, to pass original hooked function
     * returns true on success
     */
    bool hook(void* symbol, void* hook, void** result);
}

#if defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__)
int hz_make_mem_region_rwx(void *ptr, size_t size);
bool hz_hook_function(void* symbol, void* hook, void** replace);

struct HzHookInfo {
    void* hook;
    void* original;
};

HzHookInfo* hz_find_function_hook_info(void* symbol);

// debug info
struct HzHookDebugInfo {
    void* symbol = nullptr;
    void* cbPtr[8] = {nullptr};
    int cbCount = 0;
};

int hz_get_all_running_hooks_info(HzHookDebugInfo** data, int max_count);

// callback control
namespace internal {
    struct CbControlBase {
        void* targetFn;
        void* result;
        void* returnPtrReg;
        bool isPrevented;
        bool isResultInited;
    };
}

struct CbControl : public internal::CbControlBase {
    inline void prevent() { isPrevented = true; }
};

HZ_COMPAT_ENUM(CbFlag, uint16_t) {
    // called as target, will force all RETURN callbacks to be called after it
    PREVENTING   = 1u << 3u,
    RESULT       = 1u << 4u,
    CONTROLLER   = 1u << 5u,
    PREVENTABLE  = 1u << 6u
};

HZ_COMPAT_ENUM(CbType, uint16_t) {
    // called before target call and cannot be prevented
    CALL         = 0,
    // called after "CALL" callbacks, can be prevented by ones before it
    ACTION       = 1,
    // called just before target call if its not prevented, cannot be prevented by other such callback
    TARGET       = 2,
    // 4 is reserved for actual target
    // 5 in case there is another stage before return needed
    // called after target or replace callback is called to process return value and change it if required. RETURN | REPLACE combination is illegal
    RETURN       = 6,
    // 7 for the future
};

bool hz_add_symbol_callback(void* symbol, void* callback, CbFlag::Type flags = 0u, CbType::Type stage = CbType::CALL, int priority = 0);
int hz_remove_symbol_callback(void *symbol, void* callback);
#endif

/**
 * core namespace for callback creation
 */
namespace HookManager {
#if defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__)
    enum CallbackType : uint16_t {
        // usual listener, does not create any special conditions
        LISTENER     = 0,
        // called as target, will force all RETURN callbacks to be called after it
        REPLACE      = uint16_t(CbFlag::PREVENTING) << uint16_t(3),
    };
    enum CallbackTarget : uint16_t {
        // called before target call and cannot be prevented
        CALL         = uint16_t(CbType::CALL),
        // called after "CALL" callbacks, can be prevented by ones before it
        ACTION       = uint16_t(CbType::ACTION),
        // called just before target call if its not prevented, cannot be prevented by other such callback
        TARGET       = uint16_t(CbType::TARGET),
        // called after target or replace callback is called to process return value and change it if required. RETURN | REPLACE combination is illegal
        RETURN       = uint16_t(CbType::RETURN),
    };
    enum CallbackParams : uint16_t {
        // should be passed, if callback returns result, otherwise engine will ignore it
        RESULT       = uint16_t(CbFlag::RESULT) << uint16_t(3),
        // should be passed, if callback requires controller, HookManager::CallbackController* will be passed as first parameter
        CONTROLLER   = uint16_t(CbFlag::CONTROLLER) << uint16_t(3),
    };
#else
    enum CallbackType {
        // usual listener, does not create any special conditions
        LISTENER     = 0,
        // called as target, will force all RETURN callbacks to be called after it
        REPLACE      = 4,
    };
    enum CallbackTarget {
        // called before target call and cannot be prevented
        CALL         = 0,
        // called after "CALL" callbacks, can be prevented by ones before it
        ACTION       = 1,
        // called just before target call if its not prevented, cannot be prevented by other such callback
        TARGET       = 2,
        // called after target or replace callback is called to process return value and change it if required. RETURN | REPLACE combination is illegal
        RETURN       = 3,
    };
    enum CallbackParams {
        // should be passed, if callback returns result, otherwise engine will ignore it
        RESULT       = 16,
        // should be passed, if callback requires controller, HookManager::CallbackController* will be passed as first parameter
        CONTROLLER   = 32,
    };
#endif

    // priority for adding callbacks, greater priority = earlier call inside one CallbackTarget
    enum CallbackPriority {
        PRIORITY_MIN = -10,
        PRIORITY_LESS = -5,
        PRIORITY_DEFAULT = 0,
        PRIORITY_GREATER = 5,
        PRIORITY_MAX = 10
    };

    inline void setProfilingRequired(bool required) {}
    inline void setExtremeSignalHandlingRequired(bool required) {}

#if defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__)
    /**
     * interface, that allows you to control and gain data of current hook,
     * passed as first parameter to callbacks, if CONTROLLER flag is given
     */
    struct CallbackController : internal::CbControlBase {
        inline bool isReplaced() const { return isPrevented; }
        inline bool hasResult() const { return isResultInited; }
        inline void* getResult() const { return result; }
        inline void prevent() { isPrevented = true; }
        inline void replace() { isPrevented = true; }
        inline void* getTarget() const { return targetFn; }

        template<typename R, typename... ARGS>
        R call(ARGS... args) const {
            return ((R(*)(ARGS...)) targetFn)(args ...);
        }

        template<typename R, typename... ARGS>
        R callAndReplace(ARGS... args) {
            replace();
            return ((R(*)(ARGS...)) targetFn)(args ...);
        }
    };
#else
    /**
     * interface, that allows you to control and gain data of current hook,
     * passed as first parameter to callbacks, if CONTROLLER flag is given
     */
    struct CallbackController {
        void* result = NULL;
        void* target = NULL;

        bool _hasResult = false;
        bool _isReplaced = false;
        bool _isPrevented = false;

        inline bool isPrevented() { return _isPrevented; }
        inline bool isReplaced() { return _isReplaced; }
        inline bool hasResult() { return _hasResult; }
        inline void* getResult() { return (void*) result; }
        inline void prevent() { _isPrevented = true; }
        inline void replace() { _isReplaced = true; }
        inline void* getTarget() { return target; }

        // calls target with given params and casts result to R, usage: int result = controller->call<int>(1, "a");
        template<typename R, typename... ARGS>
        inline R call(ARGS... args) {
            return ((R(*)(ARGS...)) getTarget())(args ...);
        }

        template<typename R, typename... ARGS>
        inline R callAndReplace(ARGS... args) {
            replace();
            return ((R(*)(ARGS...)) getTarget())(args ...);
        }
    };
#endif

#if defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__)
    /**
     * adds func as callback for address with given params and priority
     * - addr - address to add
     * - func - function pointer, cast to void*
     * - flags - all flags are described above, default combination is CALL | LISTENER
     * - priority - higher priority - earlier call, default is DEFAULT_PRIORITY (0)
     */
    bool addCallback(void* addr, void* func, uint16_t flags, int priority = 0);
#else
    // not implemented for now
    struct CallbackAddStatus {};

    template<typename R, typename... ARGS>
    class CallInterface;

    /**
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

    /**
     * returns call interface for given function, call interface allows to call both callback and original function and immune to creating callbacks of this method
     * usage:
     * auto method = HookManager::getCallInterface<void*(int, int)>(...);
     */
    template<typename T>
    CallInterface<T>* getCallInterface(void* addr);

    /**
     * adds func as callback for address with given params and priority
     * - addr - address to add
     * - func - function pointer, cast to void*
     * - flags - all flags are described above, default combination is CALL | LISTENER
     * - priority - higher priority - earlier call, default is DEFAULT_PRIORITY (0)
     */
    CallbackAddStatus* addCallback(void* addr, void* func, int flags, int priority);
    /**
     * adds func as callback for address with given params
     * - addr - address to add
     * - func - function pointer, cast to void*
     * - flags - all flags are described above, default combination is CALL | LISTENER
     */
    CallbackAddStatus* addCallback(void* addr, void* func, int flags);
    /**
     * adds func as callback for address
     * - addr - address to add
     * - func - function pointer, cast to void*
     * deprecated, please always implicitly set flags
     */
    CallbackAddStatus* addCallback(void* addr, void* func);

    /**
     * adds lambda as callback for address with given params and priority
     * - addr - address to add
     * - func - function pointer, cast to void*
     * - flags - all flags are described above, default combination is CALL | LISTENER
     * - priority - higher priority - earlier call, default is DEFAULT_PRIORITY (0)
     */
    CallbackAddStatus* addCallback(void* addr, int64_t lambda, int flags, int priority);
    /**
     * adds lambda as callback for address with given params
     * - addr - address to add
     * - func - function pointer, cast to void*
     * - flags - all flags are described above, default combination is CALL | LISTENER
     */
    CallbackAddStatus* addCallback(void* addr, int64_t lambda, int flags);
    /**
     * adds lambda as callback for address
     * - addr - address to add
     * - func - function pointer, cast to void*
     * deprecated, please always implicitly set flags
     */
    CallbackAddStatus* addCallback(void* addr, int64_t lambda);
#endif
}

// deprecated, no hook statistics
#define STAT_REGISTER_HOOK_CALL(NAME_STR)

#if defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__)
// base define for lambda wrap
#define __LAMBDA(ARGS, CODE, ...) (reinterpret_cast<void*>(+([] ARGS { CODE })))
// legacy macro for closures
#define LAMBDA(ARGS, CODE, VALUES, ...) __LAMBDA(ARGS, CODE, VALUES, ...)
#else
#define LAMBDA(ARGS, CODE, VALUES, ...) ((int64_t) new std::function<void ARGS>([VALUES] ARGS CODE))
#endif
