//
// Created by zheka on 23.02.2019.
//

#include <jni.h>
#include <stdlib.h>
#include <string>
#include <algorithm>
#include <map>
#include "definitions.h"
#include "logger.h"

#ifndef HORIZON_JAVA_H
#define HORIZON_JAVA_H

#define __JAVA_METHOD_INVOKE_IMPL(RET, TYPE) \
API RET invoke##TYPE##Method(JNIEnv* env, jobject self, std::string header, ...);\
API RET invoke##TYPE##Method(JNIEnv* env, std::string header, ...);\
API RET invoke##TYPE##Method(jobject self, std::string header, ...);\
API RET invoke##TYPE##Method(std::string header, ...);\


namespace JavaInterface {
    // returns java vm instance
    API JavaVM* getJavaVM();

    // returns environment, attached to current thread via JAVA_ENV(...) {...}
    // for every method, that receives JNIEnv*, there is same method, that uses default environment
    API JNIEnv* getDefaultEnvironment();

    API int __attachEnv(JavaVM* jvm, JNIEnv** envPtr, int version);
    API int __detachEnv(JavaVM* jvm);

    /*
     * tries to find, caches and returns class for given name or NULL (example: sample.pkg.SampleClass)
     */
    API jclass referenceClass(JNIEnv* env, std::string pkg);
    API jclass referenceClass(std::string pkg);

    /*
     * tries to find, caches and returns method for given header or NULL
     * header:
     *  [static] return-type package.class.method(arg1, arg2, arg3)
     * example header:
     *  static java.lang.String java.lang.String.valueOf(java.lang.Object)
     */
    API jmethodID referenceMethod(JNIEnv* env, std::string header);
    API jmethodID referenceMethod(std::string header);

    /*
     * invokes java method by header and param, for non-static methods jobject passed as first parameter as this
     * name template:
     *  invoke<Type>Method
     * example:
     *  invokeCharMethod
     */
    __JAVA_METHOD_INVOKE_IMPL(void, Void)
    __JAVA_METHOD_INVOKE_IMPL(jobject, Object)
    __JAVA_METHOD_INVOKE_IMPL(jbyte, Byte)
    __JAVA_METHOD_INVOKE_IMPL(jchar, Char)
    __JAVA_METHOD_INVOKE_IMPL(jshort, Short)
    __JAVA_METHOD_INVOKE_IMPL(jint, Int)
    __JAVA_METHOD_INVOKE_IMPL(jlong, Long)
    __JAVA_METHOD_INVOKE_IMPL(jfloat, Float)
    __JAVA_METHOD_INVOKE_IMPL(jdouble, Double)

    // returns stacktrace of java throwable
    API std::string stacktrace(JNIEnv* env, jthrowable exception);
    API std::string stacktrace(jthrowable exception);
}

// default version for java environments
#define CALLBACK_JNI_VERSION JNI_VERSION_1_2

/*
 * creates code block with java environment attached to current thread, then detaches it after block ends
 * receives name of JNIEnv* variable, JavaVM* to use and jni version code
 */
#define JAVA_ENV_CUSTOM(ENV_VAR, JVM, JNI_VERSION)\
    JNIEnv* ENV_VAR;\
    int __attach_status_##ENV_VAR = JavaInterface::__attachEnv(JVM, &ENV_VAR, JNI_VERSION);\
    if (__attach_status_##ENV_VAR == JNI_EDETACHED) {\
        (JVM)->AttachCurrentThread(&ENV_VAR, NULL);\
    }\
    for(int __inner_counter_##ENV_VAR = 0; __inner_counter_##ENV_VAR < 1; __inner_counter_##ENV_VAR += (1 + (__attach_status_##ENV_VAR == JNI_EDETACHED ? JavaInterface::__detachEnv(JVM) : 0)))

/*
 * more common version of JAVA_ENV_CUSTOM, attaches to current JavaVM* and CALLBACK_JNI_VERSION
 * receives name of JNIEnv* variable
 *
 * creates code block, attached to java thread
 * example:
 * JAVA_ENV(test_env) {
 *  JavaInterface::invokeVoidMethod(...);
 * }
 */
#define JAVA_ENV(ENV_VAR) JAVA_ENV_CUSTOM(ENV_VAR, JavaInterface::getJavaVM(), CALLBACK_JNI_VERSION)

/*
 * Java try-catch block
 *
 * JAVA_TRY {
 *  JCHK(exception_variable) java-call1
 *  JCHK(exception_variable) java-call2
 * }
 * JAVA_CATCH(exception_variable) {
 *  // handle exception, it is already cleared
 * }
 */
#define JAVA_TRY
#define JCHK_E(ENV_VAR, EXCEPTION_VAR)  if ((ENV_VAR)->ExceptionCheck()) {goto __catch_##EXCEPTION_VAR;};
#define JCHK(EXCEPTION_VAR) JCHK_E(JavaInterface::getDefaultEnvironment(), EXCEPTION_VAR)
#define JAVA_CATCH_ER(ENV_VAR, EXCEPTION_VAR) \
                        __catch_##EXCEPTION_VAR: \
                        jthrowable EXCEPTION_VAR = (ENV_VAR)->ExceptionOccurred(); \
                        if((ENV_VAR)->ExceptionCheck())
#define JAVA_CATCH_E(ENV_VAR, EXCEPTION_VAR) \
                        __catch_##EXCEPTION_VAR: \
                        jthrowable EXCEPTION_VAR = (ENV_VAR)->ExceptionOccurred(); \
                        bool __flag_##EXCEPTION_VAR = (ENV_VAR)->ExceptionCheck(); \
                        (ENV_VAR)->ExceptionClear(); \
                        if(__flag_##EXCEPTION_VAR)
#define JAVA_CATCH_R(EXCEPTION_VAR) JAVA_CATCH_ER(JavaInterface::getDefaultEnvironment(), EXCEPTION_VAR)
#define JAVA_CATCH(EXCEPTION_VAR) JAVA_CATCH_E(JavaInterface::getDefaultEnvironment(), EXCEPTION_VAR)


#endif //HORIZON_JAVA_H
