set(importHelpers false)
set(noEmitHelpers false)
set(noEmitOnError true)
set(alwaysStrict false)
set(forceCasing false)
set(composite false)

function(add_js target_name) #source_dirs - includes, sources - files
    set(options)
    set(oneValueArgs "PROJECT_DIR;DECLARATIONS_DIR;OUTPUT_DIR;TYPE")
    set(multiValueArgs "SOURCES;INCLUDES;EXCLUDES")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        ARG
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    message(add_js)
    message("${ARG_PROJECT_DIR}")
    message("${ARG_OUTPUT_DIR}")
    
    message("${ARG_TYPE}")
    message("${ARG_SOURCES}") #files
    message("${ARG_INCLUDES}")
    message("${ARG_EXCLUDES}")
    
    message(ARG_SOURCES)
    set(count 0)
    if(ARG_SOURCES)
        message("${ARG_SOURCES}")
        foreach(ppp IN LISTS ARG_SOURCES)
            math(EXPR count "${count} + 1")
            message(${ppp})
        endforeach()
        foreach(ppp IN LISTS ARG_INCLUDES)
            math(EXPR count "${count} + 1")
            message(${ppp})
        endforeach()
    endif()
    
    message(ARG_OUTPUT_DIR)
    if(NOT ARG_OUTPUT_DIR)
        message(FATAL_ERROR "output not in args!")
    endif()

    set(sourceDir ${ARG_PROJECT_DIR})
    set(sources ${ARG_SOURCES})
    set(outputDir ${ARG_OUTPUT_DIR})
        
    message(iter)
    message(${index})
    message(${sourceDir})
    message(${outputDir})
    
    message(ats_command)
    set(ts_command ${CMAKE_TS_COMPILER})
    appendTSCommand("${ts_command}" "" "${sources}")
    #message("${ts_command}")
    appendTSCommand("${ts_command}" --project ${sourceDir})
    #message("${ts_command}")
    appendTSCommand("${ts_command}" --exclude "${ARG_EXCLUDES}")
    message(ts_command)
    message("${ts_command}")
    
    if(sourceDir)
        add_custom_command(
            COMMAND ${CMAKE_TS_COMPILER} --project ${sourceDir} --outDir ${outputDir}
            OUTPUT ${outputDir}/*.js
            DEPENDS ${ARG_SOURCES}
            COMMENT "compile typescript project ${sourceDir}"
            VERBATIM
        )
    
        add_custom_target(
            ${target_name}
            ALL
            SOURCES ${ARG_SOURCES}
            DEPENDS ${outputDir}/*.js
        )
        
        targetTSDefault(${target_name} TRUE)
        
        set_target_properties(
            ${target_name}
            PROPERTIES TS_EXCLUDES "${ARG_EXCLUDES}"
            TS_DECLARATIONS "${ARG_DECLARATIONS_DIRS}"
        )
    endif()
    
    #[[if()
    list(LENGTH ARG_SOURCES len)
    math(EXPR len "${len} - 1")
    message(${len})
    
    message("${ARG_SOURCES}")
    
    foreach(index RANGE 0 ${len})
        list(GET ARG_SOURCES ${index} sourceDir)
        set(outputDir ${ARG_OUTPUT_DIR})
        set(type ${ARG_TYPE})
    
        if(NOT EXISTS ${sourceDir})
            continue()
        endif()
        
        message(${sourceDir})
        message(${outputDir})
        message(${type}) 
    endforeach()]]
endfunction()

function(appendTSCommand ts_command switch val) #switch can null
    message(val)
    if(val)
        #message("${val}")
        string(APPEND ts_command " ${switch} ${val}")
        #message("${ts_command}")
        set(ts_command "${ts_command}" PARENT_SCOPE)
    endif()
endfunction()

function(add_js_library target_name) #no build
    set(options)
    set(oneValueArgs "ALL;DECLARATIONS_DIR")
    set(multiValueArgs "SOURCE_DIRS;SOURCES;EXCLUDES")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        ARG
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    add_custom_target(
        ${target_name}
        ALL
        SOURCES ${ARG_SOURCE_DIRS} ${ARG_SOURCES}
        DEPENDS ${ARG_OUTPUT_DIR}
    )
    
    targetTSDefault(${target_name} FALSE)
    
    set_target_properties(${target_name}
        PROPERTIES TS_EXCLUDES "${ARG_EXCLUDES}"
        TS_DECLARATIONS "${ARG_DECLARATIONS_DIRS}"
    )
    
    # if (tsconfig_latest.json) getLatestBuild()
endfunction()

function(generateTSConfig)
    set(options)
    set(oneValueArgs "FILE;INNER")
    set(multiValueArgs "SOURCE_DIRS;FILES;INCLUDES;EXCLUDES;REFERENCES;COMPILEROPTIONS")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        ARG
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    if(NOT ARG_FILE)
        set(ARG_FILE tsconfig.json)
    endif()
    
    set(OUTPUT output)
    
    if(ARG_INNER)
        string(PREPEND compile_options """\"rootDir\": \".\",
    \"outDir\": \"output\",
    \"allowJs\": true,
    \"target\": \"es5\",
    \"lib\": [
        \"ES2015\"
    ],
    \"experimentalDecorators\": true,
    \"downlevelIteration\": true""")
    endif()
    
    if(ARG_COMPILEROPTIONS OR ARG_INNER)
        string(PREPEND compile_options "\"compilerOptions\": {\n    ")
    endif()
    
    if(ARG_COMPILEROPTIONS)
        if(ARG_INNER)
        string(APPEND compile_options ",\n    ")
        endif()
        list(JOIN ARG_COMPILEROPTIONS ",\n    " compile_optionst)
        string(APPEND compile_options ${compile_optionst})
    endif()
    
    if(ARG_COMPILEROPTIONS OR ARG_INNER)
        string(APPEND compile_options "\n  },")
    endif()

    if(ARG_FILES)
        list(JOIN ARG_FILES ",\n    " FILES)
    
        string(PREPEND FILES "\n  \"files\": [\n    ")
        
        string(APPEND FILES "\n  ],")
    endif()
    
    if(ARG_INNER)
        string(PREPEND INCLUDES "\"**/*\",
    \"../../toolchain/declarations/*.d.ts\"")
    endif()
    
    if(ARG_INCLUDES OR ARG_INNER)
        string(PREPEND INCLUDES "\n  \"include\": [\n    ")
    endif()
    
    if(ARG_INCLUDES)
        if(ARG_INNER)
            string(APPEND INCLUDES ",\n    ")
        endif()
        
        list(JOIN ARG_INCLUDES ",\n    " INCLUDESt)
    
        string(APPEND INCLUDES ${INCLUDESt})
        message(${INCLUDES})
    endif()
    
    if(ARG_INCLUDES OR ARG_INNER)
        string(APPEND INCLUDES "\n  ],")
    endif()
    
    if(ARG_INNER)
        string(PREPEND EXCLUDES "\"**/node_modules/*\",\n    \"dom\", \n    \"webpack\"")
    endif()
        
    if(ARG_EXCLUDES OR ARG_INNER)
        string(PREPEND EXCLUDES "\n  \"exclude\": [\n    ")
    endif()
    
    if(ARG_EXCLUDES)
        if(ARG_INNER)
            string(APPEND EXCLUDES ",\n    ")
        endif()
        list(JOIN ARG_EXCLUDES ",\n    " EXCLUDESt)
        string(APPEND EXCLUDES ${EXCLUDESt})
    endif()
    
    if(ARG_EXCLUDES OR ARG_INNER)
        string(APPEND EXCLUDES "\n  ],")
    endif()
    
    if(ARG_REFERENCES)
        list(JOIN ARG_REFERENCES ",\n    " REFERENCES)
    
        string(PREPEND REFERENCES "\n  \"references\": [\n    ")
        string(APPEND REFERENCES "\n  ],")
    endif()
    
    configure_file(
        ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/tsconfig.json.in
        ${ARG_SOURCE_DIRS}${ARG_FILE}
        @ONLY
    )
endfunction()

function(createTSDeclarations)
    set(options)
    set(oneValueArgs)
    set(multiValueArgs "SOURCE_DIRS;SOURCES;OUTPUT_DIRS")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        ARG
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    set(count0 0)
    set(count1 0)
    
    if(ARG_SOURCE_DIRS)
        message(zx)
        message(${ARG_SOURCE_DIRS})
        foreach(ppp IN LISTS ARG_SOURCE_DIRS)
            math(EXPR count0 "${count0} + 1")
        endforeach()
    endif()
    if(ARG_SOURCES)
        message(zhx)
        message(${ARG_SOURCES})
        foreach(ppp IN LISTS ARG_SOURCES)
            math(EXPR count1 "${count1} + 1")
        endforeach()
    endif()
    
    message(${ARG_SOURCE_DIRS})
    
    if(ARG_OUTPUT_DIRS)
        message(${ARG_OUTPUT_DIRS})
    else()
        message(FATAL_ERROR "output not in args!")
    endif()
    
    message(${count0})
    message(${count1})
    
    if(${count0} EQUAL 0 AND ${count1} EQUAL 0)
        message(WARNING count == 0!)
    endif()
    
    execute_process(
        COMMAND ${CMAKE_TS_COMPILER}
        --declaration --emitDeclarationOnly 
        --outDir ${ARG_OUTPUT_DIRS}
        WORKING_DIRECTORY ${ARG_SOURCE_DIRS}
        RESULT_VARIABLE CMD_RESULT
        ERROR_VARIABLE CMD_ERROR
    )
    
    message(${CMD_RESULT})
    
    if(CMD_ERROR)
        message(${CMD_ERROR})
    endif()
endfunction()

function(targetTSDefault target_name build)
    #[[if(build) #no remove
    else()
    end()]]

    message(${build})
    message(${alwaysStrict})
    message(${importHelpers})
    set_target_properties(${target_name}
        PROPERTIES TS_BUILD ${build} 
        TS_ALWAYS_STRICT ${alwaysStrict}
        TS_IMPORT_HELPERS ${importHelpers}
        
        TS_NO_EMIT_HELPERS ${noEmitHelpers}
        TS_NO_EMIT_ON_ERROR ${noEmitOnError}
        TS_ALWAYS_STRICT ${alwaysStrict}
        TS_FORCE_CASING ${forceCasing}
        TS_COMPOSITE ${composite}
    )
endfunction()

function(targetTSOptions target_name)
    set(options)
    set(multiValueArgs)
    set(oneValueArgs ALWAYS_STRICT;DECORATOR_METADATA;FORCED_CASING)
    
    cmake_parse_arguments(
        PARSE_ARGV 0 
        ARG
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    message(TARGIT)
    message(${target_name})
    message(${ARG_ALWAYS_STRICT})
    
    set_target_properties(${target_name}
        PROPERTIES TS_FORCED_CASING "${ARG_FORCED_CASING}"
        TS_EXCLUDES "${ARG_EXCLUDES}"
        TS_ALWAYS_STRICT "${ARG_ALWAYS_STRICT}"
        TS_DECORATOR_METADATA "${ARG_DECORATOR_METADATA}"
        TS_DECLARATIONS "${ARG_DECLARATIONS_DIRS}"
    )
endfunction()
