function(add_ts target_name)
    set(options)
    set(oneValueArgs "OUTPUT_DIR;EXCLUDE_FROM_ALL")
    set(multiValueArgs "SOURCE_DIRS;SOURCES;")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        _add_ts
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    set(count0 0)
    set(count1 0)
    
    if(_add_ts_SOURCE_DIRS)
        message(${_add_ts_SOURCE_DIRS})
        foreach(ppp IN LISTS _add_ts_SOURCE_DIRS)
            math(EXPR count0 "${count0} + 1")
            message(${ppp})
        endforeach()
    endif()
    if(_add_ts_SOURCES)
        message(${_add_ts_SOURCES})
        foreach(ppp IN LISTS _add_ts_SOURCES)
            math(EXPR count1 "${count1} + 1")
            message(${ppp})
        endforeach()
    endif()
    
    if(_add_ts_OUTPUT_DIR)
        message(${_add_ts_OUTPUT_DIR})
    else()
        message(FATAL_ERROR output not in args!)
    endif()
    
    message(${count0})
    message(${count1})
    
    if(${count0} EQUAL 0 AND ${count1} EQUAL 0)
        message(WARNING count == 0!)
    endif()
    
    add_custom_command (
        COMMAND ${CMAKE_TS_COMPILER}
        ${_add_ts_SOURCE_DIRS} ${_add_ts_SOURCES} --outDir ${_add_ts_OUTPUT_DIR}
        OUTPUT ${_add_ts_OUTPUT_DIR}
        DEPENDS ${_add_ts_SOURCE_DIRS} ${_add_ts_SOURCES}
        COMMENT "compile ts"
        VERBATIM
    )
    
    add_custom_target(
        ${target_name}
        ALL
        SOURCES ${_add_ts_SOURCE_DIRS} ${_add_ts_SOURCES}
        DEPENDS ${_add_ts_OUTPUT_DIR}
    )

endfunction()

function(create_cfg)
    set(options)
    set(oneValueArgs "FILE_PATH;")
    set(multiValueArgs "SOURCE_DIRS;")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        _add_ts
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    #message(${_add_ts_SOURCE_DIRS}${_add_ts_FILE_PATH})
    
    configure_file(
        ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/tsconfig.json.in
        ${_add_ts_SOURCE_DIRS}${_add_ts_FILE_PATH}
        @ONLY
    )
endfunction()

function(create_ts_library_declarations)
    set(options)
    set(oneValueArgs "OUTPUT_DIR;EXCLUDE_FROM_ALL")
    set(multiValueArgs "SOURCE_DIRS;SOURCES;")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        _add_ts
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    set(count0 0)
    set(count1 0)
    
    if(_add_ts_SOURCE_DIRS)
        message(zx)
        message(${_add_ts_SOURCE_DIRS})
        foreach(ppp IN LISTS _add_ts_SOURCE_DIRS)
            math(EXPR count0 "${count0} + 1")
        endforeach()
    endif()
    if(_add_ts_SOURCES)
        message(zhx)
        message(${_add_ts_SOURCES})
        foreach(ppp IN LISTS _add_ts_SOURCES)
            math(EXPR count1 "${count1} + 1")
        endforeach()
    endif()
    
    if(_add_ts_OUTPUT_DIR)
        message(${_add_ts_OUTPUT_DIR})
    else()
        message(FATAL_ERROR output not in args!)
    endif()
    
    message(${count0})
    message(${count1})
    
    if(${count0} EQUAL 0 AND ${count1} EQUAL 0)
        message(WARNING count == 0!)
    endif()
    
    #message(${CMAKE_TS_COMPILER}
        #${_add_ts_SOURCES}
        #--declaration --emitDeclarationOnly 
        #--outDir ${_add_ts_OUTPUT_DIR})
    
    execute_process(
        COMMAND ${CMAKE_TS_COMPILER}
        --declaration --emitDeclarationOnly 
        --outDir ${_add_ts_OUTPUT_DIR}
        WORKING_DIRECTORY ${_add_ts_SOURCE_DIRS}
        RESULT_VARIABLE CMD_ERROR
        ERROR_VARIABLE outb
    )
    
    message(${CMD_ERROR})
    #message(${outb})
endfunction()

function(add_ts_library target_name)
    set(options)
    set(oneValueArgs "OUTPUT_DIR;EXCLUDE_FROM_ALL")
    set(multiValueArgs "SOURCE_DIRS;SOURCES;")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        _add_ts
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    set(count0 0)
    set(count1 0)
    
    if(_add_ts_SOURCE_DIRS)
        message(${_add_ts_SOURCE_DIRS})
        foreach(ppp IN LISTS _add_ts_SOURCE_DIRS)
            math(EXPR count0 "${count0} + 1")
            message(${ppp})
        endforeach()
    endif()
    
    if(_add_ts_SOURCES)
        message(${_add_ts_SOURCES})
        foreach(ppp IN LISTS _add_ts_SOURCES)
            math(EXPR count1 "${count1} + 1")
            message(${ppp})
        endforeach()
    endif()
    
    if(${count0} EQUAL 0 AND ${count1} EQUAL 0)
        message(WARNING count == 0!)
    endif()
    
    add_custom_target(
        ${target_name}
        ALL
        #SOURCES ${_add_ts_SOURCE_DIRS} ${_add_ts_SOURCES}
        DEPENDS ${_add_ts_SOURCE_DIRS} ${_add_ts_SOURCES}
    )

endfunction()