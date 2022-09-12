//
// Created by zheka on 18/07/19.
//

#include <unistd.h>
#include <string>
#include <vector>

#ifndef HORIZON_LOGGER_H
#define HORIZON_LOGGER_H

class Module;


namespace Logger {
    // technical method: clears internal cache
    void clear();

    // technical method: flushes internal cache
    void flush();

    // logs formatted debug message
    void debug(const char* tag, const char* message, ...);
    // logs formatted usual message
    void message(const char* tag, const char* message, ...);
    // logs formatted info message
    void info(const char* tag, const char* message, ...);
    // logs formatted error message
    void error(const char* tag, const char* message, ...);
}


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

std::string string_format_varargs(const std::string fmt_str, va_list args);

#endif //HORIZON_LOGGER_H
