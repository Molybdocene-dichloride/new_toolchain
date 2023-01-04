function(add_main PRJ_DIR OUTPUT_DIR DEV MAIN)
    add_custom_command(
        COMMAND ${CMAKE_COMMAND} -P addMainFunction.cmake
        OUTPUT ${_add_ts_OUTPUT_DIRS}
        DEPENDS ${_add_ts_SOURCE_DIRS} ${_add_ts_SOURCES}
        COMMENT "create main.js-like file"
        VERBATIM
    )
    
    #[[add_custom_cmake_command(
        COMMAND addMainFunction.cmake
        OUTPUT ${_add_ts_OUTPUT_DIRS}
        DEPENDS ${_add_ts_SOURCE_DIRS} ${_add_ts_SOURCES}
        COMMENT "create main.js-like file"
        VERBATIM
    )]]
    
    add_custom_target(
        ${target_name}
        ALL
        SOURCES ${_add_ts_SOURCE_DIRS} ${_add_ts_SOURCES}
        DEPENDS ${_add_ts_OUTPUT_DIRS}
    )
endfunction()

function(add_custom_cmake_command) #less functional
    set(options)
    set(oneValueArgs "COMMAND; OUTPUT; COMMENT")
    set(multiValueArgs "DEPENDS")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        A
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )

    add_custom_command(
        COMMAND ${CMAKE_COMMAND} -P ${COMMAND}
        OUTPUT ${A_OUTPUT}
        DEPENDS ${A_DEPENDS}
        COMMENT ${A_COMMENT}
        VERBATIM
    )
endfunction()