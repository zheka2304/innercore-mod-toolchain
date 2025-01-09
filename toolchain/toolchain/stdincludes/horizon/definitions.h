#pragma once

#define HZ_ALWAYS_INLINE __attribute__((always_inline))
#define HZ_NOINLINE __attribute__((used)) __attribute__((noinline))
#define HZ_KEEP_STATIC_VAR __attribute__((used))

#define HZ_MACRO_CONCAT0(A, B) A##B
#define HZ_MACRO_CONCAT(A, B) HZ_MACRO_CONCAT0(A, B)

#define HZ_DISTINCT_CODEGEN static volatile int __distinct_codegen = 0; __distinct_codegen = 1;

#define HZ_COMPAT_ENUM_EX(NAME, ENUM_NAME, BASE_TYPE, BASE_TYPE_ALIAS) namespace NAME { enum ENUM_NAME : BASE_TYPE; using BASE_TYPE_ALIAS = BASE_TYPE; }; enum NAME::ENUM_NAME : BASE_TYPE
#define HZ_COMPAT_ENUM(NAME, BASE_TYPE) HZ_COMPAT_ENUM_EX(NAME, Enum, BASE_TYPE, Type)