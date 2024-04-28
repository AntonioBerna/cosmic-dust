cmake_minimum_required(VERSION 3.12)
project(gh-to-raw)

set(CMAKE_CXX_COMPILER clang++)
set(CMAKE_CXX_STANDARD 17)

add_executable(gh-to-raw.app main.cpp)
add_compile_options(-Wall -Wextra -Werror)
