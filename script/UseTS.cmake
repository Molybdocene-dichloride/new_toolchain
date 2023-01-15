function(add_ts target_name)
    set(pre _add_ts)
    set(options)
    set(oneValueArgs)
    set(multiValueArgs "TYPES;SOURCE_DIRS;SOURCES;OUTPUT_DIRS")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        ${pre}
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    set(count0 0)
    set(count1 0)
    
    message(begin)
    message("${_add_ts_TYPES}")
    
    if(_add_ts_SOURCE_DIRS)
        message("${_add_ts_SOURCE_DIRS}")
        foreach(ppp IN LISTS _add_ts_SOURCE_DIRS)
            math(EXPR count0 "${count0} + 1")
            message(${ppp})
        endforeach()
    endif()
    message(sou)
    if(_add_ts_SOURCES)
        message("${_add_ts_SOURCES}")
        foreach(ppp IN LISTS _add_ts_SOURCES)
            math(EXPR count1 "${count1} + 1")
            message(${ppp})
        endforeach()
    endif()
    message(sou)
    if(NOT _add_ts_OUTPUT_DIRS)
        message(FATAL_ERROR "output not in args!")
    endif()
    
    message(${count0})
    message(${count1})
    
    if(${count0} EQUAL 0 AND ${count1} EQUAL 0)
        message(WARNING "count == 0!")
    endif()
    
    message(leng)
    list(LENGTH _add_ts_SOURCE_DIRS len)
    message(${len})
    math(EXPR len "${len} - 1")
    message(${len})

    message(${_add_ts_SOURCE_DIRS})
    message(${_add_ts_OUTPUT_DIRS})
    
    message("${_add_ts_SOURCE_DIRS}")
    message("${_add_ts_OUTPUT_DIRS}")
    
    foreach(index RANGE 0 ${len})
        
        list(GET _add_ts_SOURCE_DIRS ${index} sourceDir)
        list(GET _add_ts_OUTPUT_DIRS ${index} outputDir)
        
        if(NOT EXISTS ${_add_ts_SOURCE_DIRS})
            continue()
        endif()
        
        list(GET _add_ts_TYPES ${index} type)
        
        message(${sourceDir})
        message(${outputDir})
        message(${type})
        
        add_custom_command(
            COMMAND ${CMAKE_TS_COMPILER} --project ${sourceDir} --outDir ${outputDir}
            OUTPUT ${outputDir}/*.js #crutch
            DEPENDS ${sourceDir}
            COMMENT "compile typescript directory ${sourceDir} of ${type}"
            VERBATIM
        )
    
        add_custom_target(
            ${target_name}_typescript_${type}
            ALL
            SOURCES ${sourceDir}
            DEPENDS ${outputDir}/*.js
        )
    endforeach()
endfunction()

function(generate_tscfg)
    set(options)
    set(oneValueArgs "FILE_PATH;INNER")
    set(multiValueArgs "SOURCE_DIRS;FILES;INCLUDES;EXCLUDES;REFERENCES;COMPILEROPTIONS")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        _add_ts
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    set(OUTPUT output)
    
    if(_add_ts_INNER)
        string(PREPEND compile_options """\"target\": \"es5\",
    \"lib\": [
        \"ES2015\"
    ],
    \"experimentalDecorators\": true,
    \"downlevelIteration\": true""")
    endif()
    
    if(_add_ts_COMPILEROPTIONS OR _add_ts_INNER)
        string(PREPEND compile_options "\"compileOptions\": [\n    ")
    endif()
    
    if(_add_ts_COMPILEROPTIONS)
        if(_add_ts_INNER)
        string(APPEND compile_options ",\n    ")
        endif()
        list(JOIN _add_ts_COMPILEROPTIONS ",\n    " compile_optionst)
        string(APPEND compile_options ${compile_optionst})
    endif()
    
    if(_add_ts_COMPILEROPTIONS OR _add_ts_INNER)
        string(APPEND compile_options "\n  ],")
    endif()

    if(_add_ts_FILES)
        list(JOIN _add_ts_FILES ",\n    " FILES)
    
        string(PREPEND FILES "\n  \"files\": [\n    ")
        
        string(APPEND FILES "\n  ],")
    endif()
    
    if(_add_ts_INNER)
        string(PREPEND INCLUDES "\"**/*\",
    \"../../toolchain/declarations/*.d.ts\"")
    endif()
    
    if(_add_ts_INCLUDES OR _add_ts_INNER)
        string(PREPEND INCLUDES "\n  \"includes\": [\n    ")
    endif()
    
    if(_add_ts_INCLUDES)
        if(_add_ts_INNER)
            string(APPEND INCLUDES ",\n    ")
        endif()
        
        list(JOIN _add_ts_INCLUDES ",\n    " INCLUDESt)
    
        string(APPEND INCLUDES ${INCLUDESt})
        message(${INCLUDES})
    endif()
    
    if(_add_ts_INCLUDES OR _add_ts_INNER)
        string(APPEND INCLUDES "\n  ],")
    endif()
    
    if(_add_ts_INNER)
        string(PREPEND EXCLUDES "\"**/node_modules/*\",\n    \"dom\", \n    \"webpack\"")
    endif()
        
    if(_add_ts_EXCLUDES OR _add_ts_INNER)
        string(PREPEND EXCLUDES "\n  \"excludes\": [\n    ")
    endif()
    
    if(_add_ts_EXCLUDES)
        if(_add_ts_INNER)
            string(APPEND EXCLUDES ",\n    ")
        endif()
        list(JOIN _add_ts_EXCLUDES ",\n    " EXCLUDESt)
        string(APPEND EXCLUDES ${EXCLUDESt})
    endif()
    
    if(_add_ts_EXCLUDES OR _add_ts_INNER)
        string(APPEND EXCLUDES "\n  ],")
    endif()
    
    if(_add_ts_REFERENCES)
        list(JOIN _add_ts_REFERENCES ",\n    " REFERENCES)
    
        string(PREPEND REFERENCES "\n  \"references\": [\n    ")
        string(APPEND REFERENCES "\n  ],")
    endif()
    
    configure_file(
        ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/tsconfig.json.in
        ${_add_ts_SOURCE_DIRS}${_add_ts_FILE_PATH}
        @ONLY
    )
endfunction()

function(create_ts_library_declarations)
    set(options)
    set(oneValueArgs)
    set(multiValueArgs "SOURCE_DIRS;SOURCES;OUTPUT_DIRS")

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
    
    message(${_add_ts_SOURCE_DIRS})
    
    if(_add_ts_OUTPUT_DIRS)
        message(${_add_ts_OUTPUT_DIRS})
    else()
        message(FATAL_ERROR "output not in args!")
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
        --outDir ${_add_ts_OUTPUT_DIRS}
        WORKING_DIRECTORY ${_add_ts_SOURCE_DIRS}
        RESULT_VARIABLE CMD_RESULT
        ERROR_VARIABLE CMD_ERROR
    )
    
    message(${CMD_RESULT})
    #message(${CMD_ERROR})
endfunction()

function(add_ts_library target_name)
    set(options)
    set(oneValueArgs "ALL")
    set(multiValueArgs "SOURCE_DIRS;SOURCES;OUTPUT_DIRS")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        _add_ts
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    add_custom_target(
        ${target_name}
        ALL
        SOURCES ${_add_ts_SOURCE_DIRS} ${_add_ts_SOURCES}
        DEPENDS ${_add_ts_OUTPUT_DIRS}
    )
endfunction()