//
// Created by zheka on 18/07/19.
//

#ifndef HORIZON_SYMBOL_H
#define HORIZON_SYMBOL_H

#include "definitions.h"

/*
 * represents dynamic library handle
 * */
class DLHandle {
private:
    const char* name = "<unknown>";

    void* handle = nullptr;

    // if dlsym failed, uses elf elf_dlsym instead
    bool elf_support = true;

public:
    void* symbol(const char* name);
};


/*
 * interface to access dynamic libraries and symbols
 * */
namespace DLHandleManager {
    DLHandle* getHandle(const char* name);

    /*
     * initializes dynamic library handle, that can be further accessed by SYMBOL macros
     * name - full library name
     * key - name to access handle from SYMBOL, equals to name by default
     * flags - flags, that are passed to dlopen, RTLD_LAZY by default
     * support_elf, if dlsym fails, tries internal method, based on ELF format, true by default
     * */
    DLHandle* initializeHandle(const char* name, const char* key, int flags, bool support_elf);
    DLHandle* initializeHandle(const char* name, int flags, bool support_elf);
    DLHandle* initializeHandle(const char* name, const char* key, int flags);
    DLHandle* initializeHandle(const char* name, int flags);
    DLHandle* initializeHandle(const char* name, const char* key);
    DLHandle* initializeHandle(const char* name);

    // used in macros
    void* _symbol(DLHandle* handle, const char* symbol);
    void* _symbol(const char* dlname, const char* symbol);
}

// converts any type to (void*)
#define ADDRESS(X) ((void*) X)

// returns symbol address, if search failed, returns NULL and writes error to log
// HANDLE - DLHandle* or string, representing dynamic library to search ("mcpe" represents minecraft pe library)
// NAME - symbol name
#define SYMBOL(HANDLE, NAME) (DLHandleManager::_symbol(HANDLE, NAME))

// converts function pointer to (void*)
#define FUNCTION(X) ((void*) ((unsigned long long) &(X)))

#endif //HORIZON_SYMBOL_H
