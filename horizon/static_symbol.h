#include <logger.h>
#include <symbol.h>

#ifndef _STATIC_SYMBOL_H
#define _STATIC_SYMBOL_H


#define STATIC_SYMBOL(VAR_NAME, SYMBOL_NAME, PARAM_TYPES, RETURN_TYPE) \
    static RETURN_TYPE (*VAR_NAME) PARAM_TYPES = nullptr; \
    if(VAR_NAME == nullptr) { \
        VAR_NAME = (RETURN_TYPE (*) PARAM_TYPES) SYMBOL("mcpe", SYMBOL_NAME); \
        Logger::debug("InnerCore-StaticSymbols", "initialized static symbol %s with pointer %p", SYMBOL_NAME, VAR_NAME); \
    }

#define STATIC_VTABLE_SYMBOL(VAR, NAME) \
    static void** VAR = nullptr; \
    if(!VAR) VAR = (void**) SYMBOL("mcpe", NAME) + 2;


#endif //_STATIC_SYMBOL_H
