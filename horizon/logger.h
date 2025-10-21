#pragma once

#include <stdarg.h>
#include <string>
#include <cstdint>
#include <vector>

#include "definitions.h"

#if defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__)
HZ_COMPAT_ENUM(HzLogLevel, uint8_t)
{
    VERBOSE = 0,
    DEBUG,
    INFO,
    WARNING,
    ERROR,
    FATAL
};

HZ_COMPAT_ENUM(HzLogFlag, uint16_t)
{
    NONE = 0u,
    NO_PREFIX = 1u << 0u,
    TIME = 1u << 1u,
    SYSTEM_LOG = 1u << 2u,
    NO_FMT = 1u << 3u,
    INLINE = 1u << 4u
};

void hz_init_default_log_handler(const char *filename);
void hz_shutdown_default_log_handler();
void hz_flush_default_log();

void hz_log_message(HzLogLevel::Type level, const char* tag, const char* fmt, ...);
void hz_log_message_inline(HzLogLevel::Type level, const char* tag, const char* fmt, ...);
void hz_log_message_verbose(const char* tag, const char* fmt, ...);
void hz_log_message_debug(const char* tag, const char* fmt, ...);
void hz_log_message_error(const char* tag, const char* fmt, ...);
void hz_log_message_va(HzLogLevel::Type level, HzLogFlag::Type flags, const char* tag, const char* fmt, va_list list);
void hz_log_message_with_trace_va(int frames, int skip, HzLogLevel::Type level, const char* tag, const char* fmt, va_list list);
void hz_log_message_with_trace_ex(int frames, int skip, HzLogLevel::Type level, const char* tag, const char* fmt, ...);
void hz_log_message_with_trace(HzLogLevel::Type level, const char* tag, const char* fmt, ...);
#else
class Module;

namespace Profiler {
    struct SectionStackElement {
        Module* module;
        SectionStackElement* next;
        std::string section;
    };

    struct SectionStack {
        /** creates and pushes new section
         * module - module, that section belongs, can be NULL
         * section - section name
         */
        SectionStackElement* push(Module* module, std::string section);
        // pops last section element
        SectionStackElement* pop();
        // returns true, if stack is empty
        bool isEmpty();
        // gets current module
        Module* getModule();
        // gets current section
        std::string getSection();
        // gets current stack element
        SectionStackElement* getFirstStackElement();
        // clones section stack, to prevent its further change by startSection/endSection
        SectionStack* clone();
        // transforms stack data into vector
        std::vector<std::pair<Module*, std::string>> asVector();
        // returns formatted string, each new line is followed with prefix
        std::string toString(std::string prefix);
    };

    // returns stack for given thread id
    SectionStack& getStack(pid_t);
    // returns stack for gettid()
    SectionStack& getStack();
    // returns current module
    Module* getModule();
    // returns current section
    std::string getSection();
    // begins new section, that belongs to given module
    SectionStackElement* startSection(Module* module, std::string name);
    // begins new section, that belongs to current module
    SectionStackElement* startSection(std::string name);
    // end section and gets its SectionStackElement pointer, it must be manually freed
    SectionStackElement* endAndGetSection();
    // ends section
    void endSection();
    // ends section and starts new (with current module)
    void endStartSection(std::string name);
};
#endif

namespace Logger {
    // technical method: flushes internal cache
    void flush();
    // technical method: clears internal cache
    void clear();
    // logs formatted debug message
    void debug(const char* tag, const char* message, ...);
    // logs formatted usual message
    void message(const char* tag, const char* message, ...);
    // logs formatted info message
    void info(const char* tag, const char* message, ...);
    // logs formatted error message
    void error(const char* tag, const char* message, ...);

#if defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__)
    void verbose(const char* tag, const char* message, ...);
    void fatal(const char* tag, const char* message, ...);
#endif
}
