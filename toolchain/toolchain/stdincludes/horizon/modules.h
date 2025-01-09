#pragma once

struct HzModuleRecord;
using hz_module_handle_t = HzModuleRecord*;
using HzModuleInitFn = void(*)(void*);
using HzModuleShutdownFn = void(*)(void*);

hz_module_handle_t hz_module_find(const char *module);
// same as find, but will declare new module, if it does not exist
hz_module_handle_t hz_module_declare(const char *module);
hz_module_handle_t hz_module_add(const char* name, HzModuleInitFn init_fn, HzModuleShutdownFn shutdown_fn, void* user_data);

void hz_module_set_init_after_children(hz_module_handle_t module, bool init_after_children);
void hz_module_set_parent(hz_module_handle_t module, hz_module_handle_t parent);
void hz_module_add_dependency(hz_module_handle_t module, hz_module_handle_t dep);
void hz_module_remove_dependency(hz_module_handle_t module, hz_module_handle_t dep);

hz_module_handle_t hz_module_stack_get();
void hz_module_stack_push(hz_module_handle_t module);
void hz_module_stack_pop(hz_module_handle_t module);

bool hz_modules_ensure_all_resolved();
void hz_modules_init_all();
void hz_modules_debug_print_all();
