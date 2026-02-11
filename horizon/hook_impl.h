#pragma once

#include <cstdint>
#include <cstdlib>
#include <type_traits>


int hz_make_mem_region_rwx(void *ptr, size_t size);
bool hz_hook_function(void* symbol, void* hook, void** replace);

struct HookWithUserPtr;

#ifdef __aarch64__

struct alignas(8) HookWithUserPtr
{
private:
    static_assert(sizeof(void*) == sizeof(uint64_t), "wtf");
    uint32_t _ldr1  = 0x58000090u;   // LDR X16, #0x16    - load user data into x16
    uint32_t _ldr2  = 0x580000b1u;   // LDR X17, #0x20    - loads hook ptr into x17
    uint32_t _br    = 0xd61f0220u;   // BR X17            - jump to hook ptr
    uint32_t _nop1  = 0xd503201fu;   // NOP               - for alignment
    uint64_t userData;
    uint64_t hookPtr;

public:
    void init(void *hook, void *user_ptr)
    {
        userData = reinterpret_cast<uint64_t>(user_ptr);
        hookPtr = reinterpret_cast<uint64_t>(hook);
        hz_make_mem_region_rwx(this, sizeof(HookWithUserPtr));
    }
};

struct alignas(8) HookWithUserPtrAndReturnRegFwd
{
private:
    static_assert(sizeof(void*) == sizeof(uint64_t), "wtf");
    uint32_t _ldr1  = 0x58000090u;   // LDR X16, #0x16    - load user data into x16
    uint32_t _mov1  = 0xaa0803f1u;   // MOV X17, X8       - stores X8 register into x17
    uint32_t _ldr2  = 0x58000088u;   // LDR X8, #0x16     - loads hook ptr into x8
    uint32_t _br    = 0xd61f0100u;   // BR X8             - jump to hook ptr
    uint64_t userData;
    uint64_t hookPtr;

public:
    void init(void *hook, void *user_ptr)
    {
        userData = reinterpret_cast<uint64_t>(user_ptr);
        hookPtr = reinterpret_cast<uint64_t>(hook);
        hz_make_mem_region_rwx(this, sizeof(HookWithUserPtr));
    }
};

struct HzHookCallState
{
    void* arg0;
    void* ret;
    void* fn;
};

// this is not very safe, but it works well
#define HOOK_STORE_CALL_STATE \
    void* volatile __usr_ptr; asm volatile ("MOV %[Var], X16" : [Var] "=r" (__usr_ptr)); \
    void* volatile __ret_ptr; asm volatile ("MOV %[Var], X17" : [Var] "=r" (__ret_ptr)); \
    HzHookCallState __call_state; __call_state.ret = __ret_ptr;
#define HOOK_USER_PTR __usr_ptr
#define HOOK_RET_PTR __ret_ptr

#define __HOOK_FORWARD_ARGS_HELPER(X) X(1), X(2), X(3), X(4), X(5), X(6), X(7), X(8), X(9), X(10), X(11), X(12), X(13), X(14), X(15)
#define __HOOK_ARG_DECLARE(N) void* __arg##N
#define __HOOK_ARG_PASS(N) __arg##N
#define HOOK_FORWARD_ARGS_DECLARE void* __arg0, __HOOK_FORWARD_ARGS_HELPER(__HOOK_ARG_DECLARE)
#define __HOOK_FORWARD_ARGS_PASS __HOOK_FORWARD_ARGS_HELPER(__HOOK_ARG_PASS)

__attribute__((naked)) static void* hook_callback_invoke(HOOK_FORWARD_ARGS_DECLARE, void* __arg_stub)
{
    asm volatile("MOV X16, X0");
    asm volatile("LDR X0, [X16,#0]");
    asm volatile("LDR X8, [X16,#8]");
    asm volatile("LDR X17, [X16,#16]");
    asm volatile("BR X17");
}

#define HOOK_CALLBACK_INVOKE(RES_VAR, FN) do { \
        __call_state.fn = (FN); __call_state.arg0 = __arg0; \
        RES_VAR = hook_callback_invoke(&__call_state, __HOOK_FORWARD_ARGS_PASS, nullptr); \
    } while(false)
#define HOOK_CALLBACK_INVOKE_USR_PTR(RES_VAR, FN, USR_PTR) do { \
        __call_state.fn = (FN); __call_state.arg0 = (USR_PTR); \
        RES_VAR = hook_callback_invoke(&__call_state, __arg0, __HOOK_FORWARD_ARGS_PASS); \
    } while(false)

#else
struct alignas(4) HookWithUserPtr
{
    void init(void *hook, void *user_ptr)
    {
        hz_make_mem_region_rwx(this, sizeof(HookWithUserPtr));
    }
};
struct alignas(4) HookWithUserPtrAndReturnRegFwd
{
    void init(void *hook, void *user_ptr)
    {
        hz_make_mem_region_rwx(this, sizeof(HookWithUserPtr));
    }
};
// todo: implement properly

struct HzHookCallState
{
    void* arg0;
    void* ret;
    void* fn;
};

#define HOOK_STORE_CALL_STATE
#define HOOK_USER_PTR nullptr
#define HOOK_RET_PTR nullptr
#define HOOK_FORWARD_ARGS_DECLARE void* __arg0
#define HOOK_CALLBACK_INVOKE(...)
#define HOOK_CALLBACK_INVOKE_USR_PTR(...)

#endif

