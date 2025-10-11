#pragma once

#include "definitions.h"

#if defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__)
void hz_set_lib_handle(const char* name, void* handle, bool auto_close);
void* hz_init_lib_handle(const char* name, const char* lib, int flags, bool auto_close);
void hz_shutdown_lib_handle(const char* name);
void* hz_open_lib_handle(const char* name, int flags);
int hz_close_lib_handle(void* handle);
void* hz_get_lib_handle(const char* name);
void* hz_get_symbol(void* handle, const char* name, bool can_fail);
void* hz_get_symbol_from_named_handle(const char* handle_name, const char* name, bool can_fail);
#endif

/**
 * interface to access dynamic libraries and symbols
 */
namespace DLHandleManager {
#if defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__)
    /**
     * initializes dynamic library handle, that can be further accessed by SYMBOL macros
     * name - full library name
     * key - name to access handle from SYMBOL, equals to name by default
     * flags - flags, that are passed to dlopen, RTLD_NOW by default
     */
    inline void* initializeHandle(const char* name, const char* key, int flags) {
      return hz_init_lib_handle(key, name, flags, false);
    }

    /**
     * initializes dynamic library handle, that can be further accessed by SYMBOL macros
     * name - full library name
     * flags - flags, that are passed to dlopen, RTLD_NOW by default
     */
    inline void* initializeHandle(const char* name, int flags) {
      return hz_init_lib_handle(name, name, flags, false);
    }

    /**
     * initializes dynamic library handle, that can be further accessed by SYMBOL macros
     * name - full library name
     * key - name to access handle from SYMBOL, equals to name by default
     */
    inline void* initializeHandle(const char* name, const char* key) {
      return hz_init_lib_handle(key, name, RTLD_NOW, false);
    }

    /**
     * initializes dynamic library handle, that can be further accessed by SYMBOL macros
     * name - full library name
     */
    inline void* initializeHandle(const char* name) {
      return hz_init_lib_handle(name, name, RTLD_NOW, false);
    }
#else
    /**
     * initializes dynamic library handle, that can be further accessed by SYMBOL macros
     * name - full library name
     * key - name to access handle from SYMBOL, equals to name by default
     * flags - flags, that are passed to dlopen, RTLD_LAZY by default
     * support_elf - if dlsym fails, tries internal method, based on ELF format, true by default
     */
    void* initializeHandle(const char* name, const char* key, int flags, bool support_elf);

    /**
     * initializes dynamic library handle, that can be further accessed by SYMBOL macros
     * name - full library name
     * flags - flags, that are passed to dlopen, RTLD_LAZY by default
     * support_elf - if dlsym fails, tries internal method, based on ELF format, true by default
     */
    void* initializeHandle(const char* name, int flags, bool support_elf);

    /**
     * initializes dynamic library handle, that can be further accessed by SYMBOL macros
     * name - full library name
     * key - name to access handle from SYMBOL, equals to name by default
     * flags - flags, that are passed to dlopen, RTLD_LAZY by default
     */
    void* initializeHandle(const char* name, const char* key, int flags);

    /**
     * initializes dynamic library handle, that can be further accessed by SYMBOL macros
     * name - full library name
     * flags - flags, that are passed to dlopen, RTLD_LAZY by default
     */
    void* initializeHandle(const char* name, int flags);

    /**
     * initializes dynamic library handle, that can be further accessed by SYMBOL macros
     * name - full library name
     * key - name to access handle from SYMBOL, equals to name by default
     */
    void* initializeHandle(const char* name, const char* key);

    /*
     * initializes dynamic library handle, that can be further accessed by SYMBOL macros
     * name - full library name
     */
    void* initializeHandle(const char* name);

    // used in macros, use SYMBOL instead
    void* _symbol(void* handle, const char* symbol);
    // used in macros, use SYMBOL instead
    void* _symbol(const char* dlname, const char* symbol);
#endif
}

// converts any type to (void*)
#define ADDRESS(X) ((void*) X)

#if defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__)
#define HZ_SYMBOL_OPT(HANDLE, NAME) (hz_get_symbol_from_named_handle(HANDLE, NAME, true))
#define HZ_SYMBOL(HANDLE, NAME) (hz_get_symbol_from_named_handle(HANDLE, NAME, false))
// returns symbol address, if search failed, returns NULL and writes error to log
// HANDLE - DLHandle* or string, representing dynamic library to search ("mcpe" represents minecraft pe library)
// NAME - symbol name
#define SYMBOL HZ_SYMBOL
#else
// returns symbol address, if search failed, returns NULL and writes error to log
// HANDLE - DLHandle* or string, representing dynamic library to search ("mcpe" represents minecraft pe library)
// NAME - symbol name
#define SYMBOL(HANDLE, NAME) (DLHandleManager::_symbol(HANDLE, NAME))
#endif

// converts function pointer to (void*)
#define FUNCTION(X) ((void*) ((unsigned long long) &(X)))
