#pragma once

void hz_set_lib_handle(const char* name, void* handle, bool auto_close);
void* hz_init_lib_handle(const char* name, const char* lib, int flags, bool auto_close);
void hz_shutdown_lib_handle(const char* name);
void* hz_open_lib_handle(const char* name, int flags);
int hz_close_lib_handle(void* handle);
void* hz_get_lib_handle(const char* name);
void* hz_get_symbol(void* handle, const char* name, bool can_fail);
void* hz_get_symbol_from_named_handle(const char* handle_name, const char* name, bool can_fail);

/*
 * interface to access dynamic libraries and symbols
 * */
namespace DLHandleManager {
    /*
     * initializes dynamic library handle, that can be further accessed by SYMBOL macros
     * name - full library name
     * key - name to access handle from SYMBOL, equals to name by default
     * flags - flags, that are passed to dlopen, RTLD_LAZY by default
     * */
    inline void* initializeHandle(const char* name, const char* key, int flags) {
		return hz_init_lib_handle(name, key, flags, false);
	}

    inline void* initializeHandle(const char* name, int flags) {
		return hz_init_lib_handle(name, name, flags, false);
	}

    inline void* initializeHandle(const char* name, const char* key) {
		return hz_init_lib_handle(name, key, RTLD_NOW, false);
	}

    inline void* initializeHandle(const char* name) {
		return hz_init_lib_handle(name, name, RTLD_NOW, false);
	}
}

// returns symbol address, if search failed, returns NULL and writes error to log
// HANDLE - DLHandle* or string, representing dynamic library to search ("mcpe" represents minecraft pe library)
// NAME - symbol name
#define HZ_SYMBOL_OPT(A, B) (hz_get_symbol_from_named_handle(A, B, true))
#define HZ_SYMBOL(A, B) (hz_get_symbol_from_named_handle(A, B, false))
#define SYMBOL HZ_SYMBOL

// converts function pointer to (void*)
#define FUNCTION(X) ((void*) ((unsigned long long) &(X)))
