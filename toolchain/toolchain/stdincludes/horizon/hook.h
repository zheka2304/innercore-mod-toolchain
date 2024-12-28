//
// Created by zheka on 18/07/19.
//

#include <cstdint>
#include <unordered_map>
#include <functional>
#include <chrono>
#include <logger.h>

#ifndef HORIZON_HOOK_H
#define HORIZON_HOOK_H

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
        void* result = NULL;
        void* target = NULL;

        bool _hasResult = false;
        bool _isReplaced = false;
        bool _isPrevented = false;

        inline bool isPrevented() {
            return _isPrevented;
        }

        inline bool isReplaced() {
            return _isReplaced;
        }

        inline bool hasResult() {
            return _hasResult;
        }

        inline void* getResult() {
            return (void*) result;
        }

        inline void prevent() {
            _isPrevented = true;
        }

        inline void replace() {
            _isReplaced = true;
        }

        inline void* getTarget() {
            return target;
        }

        // calls target with given params and casts result to R, usage: int result = controller->call<int>(1, "a");
        template<typename R, typename... ARGS>
        inline R call (ARGS... args)  {
            return ((R(*)(ARGS...)) getTarget())(args ...);
        }

        template<typename R, typename... ARGS>
        inline R callAndReplace (ARGS... args)  {
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
}


// base define for lambda wrap
#define __LAMBDA(ARGS, CODE, ...) (reinterpret_cast<void*>(+([] ARGS CODE)))


// 
// #define HOOK_STATISTICS


// hook statistics 
#ifdef HOOK_STATISTICS

namespace HookManagerStatistics {
    inline long long getTimeNanoseconds() {
        using namespace std::chrono;
        nanoseconds ms = duration_cast< nanoseconds >(
            high_resolution_clock::now().time_since_epoch()
        );
        return ms.count();
    };

    struct ThreadLifecycle {
        struct CallbackStats {
            int call_count = 0;
            int log_frame_call_count = 0;
            long long call_time = 0;
            long long log_frame_call_time = 0;
            long long last_log_time = 0;
            
            inline void addCallInfo(long long time) {
                call_time += time;
                log_frame_call_time += time;
                call_count++;
                log_frame_call_count++;
            }

            inline void logStats(std::string const& name, long long thread_lifetime, long long last_log_frame) {
                Logger::debug("Hook-Statistics", "callback %s called %i (%i) times, it took %lli (%lli) ms (percent %lf (%lf))", name.data(), call_count, log_frame_call_count, call_time / 1000000, log_frame_call_time / 1000000, 100.0 * call_time / (double) thread_lifetime, 100.0 * log_frame_call_time / (double) last_log_frame);
                log_frame_call_time = 0;
                log_frame_call_count = 0;
            } 
        };

        std::unordered_map<std::string, CallbackStats> stats;
        long long time_start, time_end;

        inline ThreadLifecycle() {
            time_start = getTimeNanoseconds();
        }

        inline void addCallInfo(std::string const& name, long long time) {
            CallbackStats& callback_stats = stats[name];
            callback_stats.addCallInfo(time);
            long long cur_time = getTimeNanoseconds();
            if (callback_stats.last_log_time + 2000000000 < cur_time) {
                long long thread_lifetime = cur_time - time_start;
                if (callback_stats.last_log_time) {
                    callback_stats.logStats(name, thread_lifetime, cur_time - callback_stats.last_log_time);
                }
                callback_stats.last_log_time = cur_time;
            }
        }

        inline ~ThreadLifecycle() {
            time_end = getTimeNanoseconds();
        }
    };

    static thread_local ThreadLifecycle thread_lifecycle;

    struct RegisterCall {
    public:
        std::string name;
        long long time_start, time_end;

        inline RegisterCall(std::string const& n) : name(n) {
            time_start = getTimeNanoseconds();
        }

        inline ~RegisterCall() {
            time_end = getTimeNanoseconds();
            thread_lifecycle.addCallInfo(name, time_end - time_start);
        }
    };
}; 

#define STAT_REGISTER_HOOK_CALL(NAME_STR) HookManagerStatistics::RegisterCall _reg_call(NAME_STR);
#define LAMBDA(ARGS, CODE, VALUES, ...) __LAMBDA(ARGS, {HookManagerStatistics::RegisterCall _reg_call(#CODE); CODE}, VALUES, ...)

// no hook statistics
#else
#define STAT_REGISTER_HOOK_CALL(NAME_STR)
#define LAMBDA(ARGS, CODE, VALUES, ...) __LAMBDA(ARGS, CODE, VALUES, ...)
#endif


#endif //HORIZON_HOOK_H
