function(add_main PRJ_DIR OUTPUT_DIR DEV MAIN)
    add_custom_command(
        COMMAND ${CMAKE_COMMAND} -P addMainFunction.cmake -DPRJ_DIR=${PRJ_DIR} -DOUTPUT_DIR=${OUTPUT_DIR} -DDEV=${DEV} -DMAIN=${MAIN}
        OUTPUT ${PRJ_DIR}${outputmod}/${MAIN}
        DEPENDS ${PRJ_DIR}${outputmod}/${DEV}
        COMMENT "create main.js-like file"
        VERBATIM
    )
    
    #[[add_custom_cmake_command(
        COMMAND addMainFunction.cmake -DPRJ_DIR=${PRJ_DIR} -DOUTPUT_DIR=${OUTPUT_DIR} -DDEV=${DEV} -DMAIN=${MAIN}
        OUTPUT ${PRJ_DIR}${outputmod}/${MAIN}
        DEPENDS ${PRJ_DIR}${outputmod}/${DEV}
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