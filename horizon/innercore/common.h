
#ifndef INNER_CORE_COMMON_H
#define INNER_CORE_COMMON_H

#include <string>
#include <stl/string>
#include <stl/vector>


// std::__ndk1::string
using stl_string = std::__ndk1::basic_string<char>;

// std::__ndk1::vector
template<typename _Tp>
using stl_vector = std::__ndk1::vector<_Tp>; 

inline std::string to_std(std::__ndk1::string const& s) {
    return std::string(s.data());
} 

inline std::__ndk1::string to_stl(std::string const& s) {
    return std::__ndk1::string(s.data());
}

#endif
