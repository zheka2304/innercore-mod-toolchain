#include <symbol.h>
#include <logger.h>

#include <dlfcn.h>

#ifndef INNER_CORE_DEFINE_H
#define INNER_CORE_DEFINE_H


template <typename R, typename... ARGS>
R VTABLE_CALL(int index, void* target, ARGS... args) {
    return (*(R (**) (void*, ARGS...)) (*(char**) target + index * 4))(target, args...);
};

template <typename R, typename... ARGS>
R VTABLE_CALL_RESULT_PTR(int index, void* result, void* target, ARGS... args) {
    return (*(R (**) (void*, void*, ARGS...)) (*(char**) target + index * 4))(result, target, args...);
};

inline int getVtableOffset(const char* vtableName, const char* functionName) {
    void** vtable = (void**) SYMBOL("mcpe", vtableName);
    void* func = SYMBOL("mcpe", functionName);
    for (int i = 2; vtable[i]; i++) {
        if (vtable[i] == func) {
            i -= 2;
            Logger::debug("InnerCore-getVtableOffset", "found offset %i of '%s' in '%s'", i, functionName, vtableName);
            return i;
        }
    }
    Logger::error("InnerCore-getVtableOffset", "failed to find '%s' in '%s'", functionName, vtableName);
    return -1;
}

#define VTABLE_FIND_OFFSET(variableName, vtableName, functionName) static int variableName = -1; if (variableName == -1) { variableName = getVtableOffset(#vtableName, #functionName); };
#define VTABLE_SET(vtableVariableName, vtableName, functionName) VTABLE_FIND_OFFSET(_ZTV ## vtableName ## functionName, vtableName, functionName); ((void**) vtableVariableName)[_ZTV ## vtableName ## functionName]


void dumpVtable(const char*, void*);


#endif //INNER_CORE_DEFINE_H
