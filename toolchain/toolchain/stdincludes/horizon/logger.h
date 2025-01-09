#pragma once

#include <stdarg.h>
#include <cstdint>

#include "definitions.h"

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

namespace Logger
{
void flush();
void clear();
void verbose(const char* tag, const char* message, ...);
void debug(const char* tag, const char* message, ...);
void message(const char* tag, const char* message, ...);
void info(const char* tag, const char* message, ...);
void error(const char* tag, const char* message, ...);
void fatal(const char* tag, const char* message, ...);
}
