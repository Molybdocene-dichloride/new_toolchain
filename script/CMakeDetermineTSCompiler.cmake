find_program(
    CMAKE_TS_COMPILER 
        NAMES "tsc"
        HINTS "${CMAKE_SOURCE_DIR}"
        DOC "TypeScript compiler" 
)

if(${CMAKE_HOST_SYSTEM_NAME} STREQUAL "Android")
    message(${CMAKE_HOST_SYSTEM_NAME})
    
    #set(CMAKE_TS_COMPILER /data/data/com.termux/files/usr/lib/node_modules/typescript/bin/tsc)
    
    find_program(
        CMAKE_TS_COMPILER 
        NAMES "/data/data/com.termux/files/usr/lib/node_modules/typescript/bin/tsc"
        HINTS "${CMAKE_SOURCE_DIR}"
        DOC "TypeScript compiler" 
    )
endif()

#message(${CMAKE_HOST_SYSTEM_NAME})

#[[if(${CMAKE_TS_COMPILER} MATCHES "tsc")
    message("Use Ts compiler " ${CMAKE_TS_COMPILER})
    
    set(CMAKE_TS_COMPILER_VERSION 1)
else()
    message(FATAL_ERROR "error. Only tsc allowed" ${CMAKE_TS_COMPILER})
endif()]]

message(${CMAKE_CURRENT_LIST_DIR})

configure_file(
    ${CMAKE_CURRENT_LIST_DIR}/CMakeTSCompiler.cmake.in
    ${CMAKE_PLATFORM_INFO_DIR}/CMakeTSCompiler.cmake
)
set(CMAKE_TS_COMPILER_ENV_VAR "TS_COMPILER")