#pragma once

#include <string>
#include <unordered_map>
#include <stdlib.h>
#include <dlfcn.h>
#include <errno.h>
#include <bits/sysconf.h>

#include "definitions.h"


int hz_make_mem_region_rwx(void *ptr, size_t size);
bool hz_hook_function(void* symbol, void* hook, void** replace);

struct HzHookInfo
{
    void* hook;
    void* original;
};
HzHookInfo* hz_find_function_hook_info(void* symbol);

namespace SubstrateInterface
{
int protect(void* address, int offset, int size, int mode);
bool hook(void* symbol, void* hook, void** result);
}

// debug info

struct HzHookDebugInfo
{
    void* symbol = nullptr;
    void* cbPtr[8] = {nullptr};
    int cbCount = 0;
};

int hz_get_all_running_hooks_info(HzHookDebugInfo** data, int max_count);

// callback control

namespace internal
{
struct CbControlBase
{
    void* targetFn;
    void* result;
    void* returnPtrReg;
    bool isPrevented;
    bool isResultInited;
};
}

struct CbControl : public internal::CbControlBase
{
inline void prevent() { isPrevented = true; }
};


HZ_COMPAT_ENUM(CbFlag, uint16_t)
{
    PREVENTING   = 1u << 3u,
    RESULT       = 1u << 4u,
    CONTROLLER   = 1u << 5u,
    PREVENTABLE  = 1u << 6u
};

HZ_COMPAT_ENUM(CbType, uint16_t)
{
    CALL         = 0,
    ACTION       = 1,
    TARGET       = 2,
    // 4 is reserved for actual target
    // 5 in case there is another stage before return needed
    RETURN       = 6,
    // 7 for the future
};

bool hz_add_symbol_callback(void* symbol, void* callback, CbFlag::Type flags = 0u, CbType::Type stage = CbType::CALL, int priority = 0);
int hz_remove_symbol_callback(void *symbol, void* callback);


// compatibility with old code
namespace HookManager
{
enum CallbackType : uint16_t
{
    LISTENER     = 0,
    REPLACE      = uint16_t(CbFlag::PREVENTING) << uint16_t(3),
};
enum CallbackTarget : uint16_t
{
    CALL         = uint16_t(CbType::CALL),
    ACTION       = uint16_t(CbType::ACTION),
    TARGET       = uint16_t(CbType::TARGET),
    RETURN       = uint16_t(CbType::RETURN)
};
enum CallbackParams : uint16_t
{
    RESULT       = uint16_t(CbFlag::RESULT) << uint16_t(3),
    CONTROLLER   = uint16_t(CbFlag::CONTROLLER) << uint16_t(3),
};
}

namespace HookManager
{
inline void setProfilingRequired(bool required) {}
inline void setExtremeSignalHandlingRequired(bool required) {}

// priority for adding callbacks
enum CallbackPriority
{
    PRIORITY_MIN = -10,
    PRIORITY_LESS = -5,
    PRIORITY_DEFAULT = 0,
    PRIORITY_GREATER = 5,
    PRIORITY_MAX = 10
};

// interface, that allows you to control and gain data of current hook, passed as first parameter to callbacks if required
struct CallbackController : internal::CbControlBase
{
    inline bool isReplaced() const { return isPrevented; };
    inline bool hasResult() const { return isResultInited; }
    inline void* getResult() const { return result; }
    inline void prevent() { isPrevented = true; }
    inline void replace() { isPrevented = true; }
    inline void* getTarget() const { return targetFn; }

    template<typename R, typename... ARGS>
    R call (ARGS... args) const
    {
        return ((R(*)(ARGS...)) targetFn)(args ...);
    }

    template<typename R, typename... ARGS>
    R callAndReplace (ARGS... args)
    {
        replace();
        return ((R(*)(ARGS...)) targetFn)(args ...);
    }
};

bool addCallback(void* addr, void* func, uint16_t flags, int priority = 0);
}

// base define for lambda wrap
#define __LAMBDA(ARGS, CODE, ...) (reinterpret_cast<void*>(+([] ARGS { CODE }))) \

// legacy macro for closures
#define LAMBDA(ARGS, CODE, VALUES, ...) __LAMBDA(ARGS, CODE, VALUES, ...)
