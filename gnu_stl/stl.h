#ifndef NDK_STL_H
#define NDK_STL_H

#if !(defined(ARM64) || defined(_M_ARM64) || defined(__aarch64__))
#define USING_NDK1_NAMESPACE_WRAP
#include <stl/string>
#include <stl/vector>
#include <stl/memory>
#include <stl/map>
#include <stl/unordered_map>
#endif

// #define REDEFINE_NDK1_NAMESPACE

#ifdef REDEFINE_NDK1_NAMESPACE
#endif

#include <string>
#include <vector>
#include <memory>
#include <map>
#include <unordered_map>


#ifdef REDEFINE_NDK1_NAMESPACE
/**
 * New versions of minecraft wrap all std types into namespace std::__ndk1
 * This will make them accessible
 */
namespace std {
    namespace __ndk1 {

        template<class _CharT>
        struct char_traits : public std::char_traits<_CharT> {  
        public:
            using std::char_traits<_CharT>::char_traits;
        };
        
        template<typename _Tp>
        class allocator : public std::allocator<_Tp> {  
        public:
            using std::allocator<_Tp>::allocator;
        };

        template<typename _CharT, typename _Traits = std::__ndk1::char_traits<_CharT>,
           typename _Alloc = std::__ndk1::allocator<_CharT> >
        class basic_string : public std::basic_string<_CharT, _Traits, _Alloc> {  
        public:
            using std::basic_string<_CharT, _Traits, _Alloc>::basic_string;

            typedef std::basic_string<_CharT, std::__ndk1::char_traits<_CharT>, std::__ndk1::allocator<_CharT>> t_self;

            basic_string(std::string const& str) : std::basic_string<_CharT, std::__ndk1::char_traits<_CharT>, std::__ndk1::allocator<_CharT>>::basic_string(*(t_self*) &str) {};
        
            std::string const& to_std() const {
                return *(std::string*) this;
            }
        };

        template<typename _Tp, typename _Alloc = std::__ndk1::allocator<_Tp> >
        class vector : public std::vector<_Tp, _Alloc> {  
        public:
            using std::vector<_Tp, _Alloc>::vector;
        };

        template<typename _T1, typename _T2>
        struct pair : public std::pair<_T1, _T2> {  
        public:
            using std::pair<_T1, _T2>::pair;
        };

        template<typename _Tp>
        struct less : public std::less<_Tp> { };

        template <typename _Key, typename _Tp, typename _Compare = std::__ndk1::less<_Key>,
        typename _Alloc = std::__ndk1::allocator<std::__ndk1::pair<const _Key, _Tp> > >
        class map : public std::map<_Key, _Tp, _Compare, _Alloc> {  
        public:
            using std::map<_Key, _Tp, _Compare, _Alloc>::map;
        };

        template<typename _Tp>
        class shared_ptr : public std::shared_ptr<_Tp> { 
        public: 
            using std::shared_ptr<_Tp>::shared_ptr;
        };

        template<typename _Tp>
        struct default_delete : public std::default_delete<_Tp> { 
        public: 
            using std::default_delete<_Tp>::default_delete;
        };

        template <typename _Tp, typename _Dp = std::__ndk1::default_delete<_Tp> >
        class unique_ptr : public std::unique_ptr<_Tp, _Dp> { 
        public:
            using std::unique_ptr<_Tp, _Dp>::unique_ptr;
        };
        
        template<typename _Tp>
        class weak_ptr : public std::weak_ptr<_Tp> {
            using std::weak_ptr<_Tp>::weak_ptr;

            std::weak_ptr<_Tp>& to_std() {
                return *(std::weak_ptr<_Tp>*) this;
            }
        };

        // the fuck? at least it works properly
        template<typename _Signature>
        class function;
        template<typename _Res, typename... _ArgTypes>
        class function<_Res(_ArgTypes...)> : public std::function<_Res(_ArgTypes...)> {
            using std::function<_Res(_ArgTypes...)>::function;
        };
    }
    
}

#endif


#ifdef USING_NDK1_NAMESPACE_WRAP

// std::string
using stl_string = std::__ndk1::basic_string<char>;

// std::vector
template<typename _Tp>
using stl_vector = std::__ndk1::vector<_Tp>; 

// std::array
template<typename _T, size_t _N>
using stl_array = std::__ndk1::array<_T, _N>;

// std::map
template<typename _Key, typename _Tp>
using stl_map = std::__ndk1::map<_Key, _Tp>; 

// std::unordered_map
template<typename _Key, typename _Tp>
using stl_unordered_map = std::__ndk1::unordered_map<_Key, _Tp>; 

// std::pair
template<typename _T1, typename _T2>
using stl_pair = std::__ndk1::pair<_T1, _T2>;

// std::shared_ptr
template<typename _Tp>
using stl_shared_ptr = std::__ndk1::shared_ptr<_Tp>; 

// std::unique_ptr
template<typename _Tp>
using stl_unique_ptr = std::__ndk1::unique_ptr<_Tp>; 

// std::weak_ptr
template<typename _Tp>
using stl_weak_ptr = std::__ndk1::weak_ptr<_Tp>; 

// std::function
template<typename... Args>
struct stl_function_impl;
template<typename _Signature>
struct stl_function_impl<_Signature> {
    using type = std::__ndk1::function<_Signature>;
};
template<typename _Res, typename... _ArgTypes>
struct stl_function_impl<_Res, _ArgTypes...> {
    using type = std::__ndk1::function<_Res(_ArgTypes...)>;
};
template<typename... _Args>
using stl_function = typename stl_function_impl<_Args...>::type;

inline std::string to_std(std::__ndk1::string const& s) {
    return std::string(s.data());
} 

inline std::__ndk1::string to_stl(std::string const& s) {
    return std::__ndk1::string(s.data());
}

template<typename _Tp>
inline std::unique_ptr<_Tp> to_std(std::__ndk1::unique_ptr<_Tp> const& p) {
    return std::unique_ptr<_Tp>(p.get());
} 

template<typename _Tp>
inline std::__ndk1::unique_ptr<_Tp> to_stl(std::unique_ptr<_Tp> const& p) {
    return std::__ndk1::unique_ptr<_Tp>(p.get());
}

#else // USING_NDK1_NAMESPACE_WRAP

// std::string
using stl_string = std::string;

// std::vector
template<typename _Tp>
using stl_vector = std::vector<_Tp>;

// std::array
template<typename _T, size_t _N>
using stl_array = std::array<_T, _N>;

// std::map
template<typename _Key, typename _Tp>
using stl_map = std::map<_Key, _Tp>; 

// std::unordered_map
template<typename _Key, typename _Tp>
using stl_unordered_map = std::unordered_map<_Key, _Tp>; 

// std::pair
template<typename _T1, typename _T2>
using stl_pair = std::pair<_T1, _T2>;

// std::shared_ptr
template<typename _Tp>
using stl_shared_ptr = std::shared_ptr<_Tp>; 

// std::unique_ptr
template<typename _Tp>
using stl_unique_ptr = std::unique_ptr<_Tp>; 

// std::weak_ptr
template<typename _Tp>
using stl_weak_ptr = std::weak_ptr<_Tp>; 

// std::function
template<typename... Args>
struct stl_function_impl;
template<typename _Signature>
struct stl_function_impl<_Signature> {
    using type = std::function<_Signature>;
};
template<typename _Res, typename... _ArgTypes>
struct stl_function_impl<_Res, _ArgTypes...> {
    using type = std::function<_Res(_ArgTypes...)>;
};
template<typename... _Args>
using stl_function = typename stl_function_impl<_Args...>::type;

#define to_std(X) X
#define to_stl(X) X

#endif // USING_NDK1_NAMESPACE_WRAP

#endif
