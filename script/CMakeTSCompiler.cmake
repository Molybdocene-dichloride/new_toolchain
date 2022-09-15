if(${CMAKE_HOST_SYSTEM_NAME} STREQUAL "Android")
    #message(${CMAKE_HOST_SYSTEM_NAME})
    
    set(CMAKE_TS_COMPILER /data/data/com.termux/files/usr/lib/node_modules/typescript/bin/tsc)
endif()

set(CMAKE_TS_COMPILER tsc)
set(CMAKE_TS_COMPILER_VERSION "1")
set(CMAKE_TS_COMPILER_ENV_VAR "TS")

set(CMAKE_CXX_SOURCE_FILE_EXTENSIONS js;ts)

