set(importHelpers false)
set(noEmitHelpers false)
set(noEmitOnError true)
set(alwaysStrict false)
set(forceCasing false)
set(composite false)

set(downlevelIteration true)
set(experimentalDecorators true)

function(prepareTS ts_command target_name key switch val) #switch can null
    message(prepareTS)
    if(val)
        message(${target_name})
        message("${key}")
        message("${val}")
        set_target_properties(
            ${target_name}
            PROPERTIES ${key} "${val}"
        )
        string(APPEND ts_command " ${switch} ${val}")
        set(ts_command "${ts_command}" PARENT_SCOPE)
    endif()
endfunction()

function(set_target_property key val)
    message(val)
    if(val)
        #message("${val}")
        set_target_properties(
            ${target_name}
            PROPERTIES ${key} ${val}
        )
    endif()
endfunction()

function(countCheck ARG_SOURCE_DIR ARG_SOURCES)
    message(countCheck)
    #message("${ARG_SOURCES}")
    if(ARG_SOURCES)
        message(true)
        list(LENGTH ARG_SOURCES lnstd)
    else()
        message(false)
        set(lnstd 0)
    endif()
    
    message(${lnstd})
    
    if(NOT ARG_SOURCE_DIR OR NOT ${lnstd} GREATER 0)
        message(FATAL_ERROR "count of sources == zero")
    endif()
endfunction()

function(createTSDeclarations)
    set(options)
    set(oneValueArgs "SOURCE_DIR")
    set(multiValueArgs "SOURCES;OUTPUT_DIRS")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        ARG
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    message(${ARG_SOURCE_DIRS})
    
    if(ARG_OUTPUT_DIRS)
        message(${ARG_OUTPUT_DIRS})
    else()
        message(FATAL_ERROR "output not in args!")
    endif()
    
    countCheck(${ARG_SOURCE_DIR} "${ARG_SOURCES}")
    
    execute_process(
        COMMAND ${CMAKE_TS_COMPILER}
        --declaration --emitDeclarationOnly 
        --outDir ${ARG_OUTPUT_DIRS}
        WORKING_DIRECTORY ${ARG_SOURCE_DIR}
        RESULT_VARIABLE CMD_RESULT
        ERROR_VARIABLE CMD_ERROR
    )
    
    message(${CMD_RESULT})
    
    if(CMD_ERROR)
        message(${CMD_ERROR})
    endif()
endfunction()

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
    message("${ARG_TYPE}")
    
    countCheck(${ARG_PROJECT_DIR} "${ARG_SOURCES}")
    
    if(NOT ARG_OUTPUT_DIR)
        message(FATAL_ERROR "OUTPUT_DIR not in args!")
    endif()

    set(sourceDir ${ARG_PROJECT_DIR})
    set(sources ${ARG_SOURCES})
    set(outputDir ${ARG_OUTPUT_DIR})

    message(iter)
    message(${index})
    message("${sources}")
    message(${sourceDir})
    message(${outputDir})

    #[[if(ARG_INCLUDES)
        message("${ARG_INCLUDES}")
    endif()]]
    if(ARG_EXCLUDES)
        message("${ARG_EXCLUDES}")
    endif()

    add_custom_target(
        ${target_name}
        ALL
        SOURCES ${ARG_SOURCES}
        DEPENDS ${outputDir}/*.js
    )

    message(ats_command)
    set(ts_command ${CMAKE_TS_COMPILER})
    #[[set_target_properties(
        ${target_name}
        PROPERTIES TS_INCLUDES ${ARG_INCLUDES}
    )]]
    prepareTS("${ts_command}" ${target_name} TS_FILES "" "${ARG_FILES}"
    )
    prepareTS("${ts_command}" ${target_name} TS_SOURCES "" "${sources}"
    )
    prepareTS("${ts_command}" ${target_name} TS_PROJECT_DIR --project ${sourceDir}
    )
    prepareTS("${ts_command}" ${target_name} TS_EXCLUDES --exclude "${ARG_EXCLUDES}"
    )
    prepareTS("${ts_command}" ${target_name} TS_OUTPUT_DIR --outDir "${ARG_OUTPUT_DIR}"
    )
    
    message(ts_command)
    message("${ts_command}")
    
    if(sourceDir OR sources)
        message(sourceDir)
        message(${sourceDir})
        add_custom_command(
            COMMAND ${CMAKE_TS_COMPILER} --project ${sourceDir} --outDir ${outputDir}
            OUTPUT ${outputDir}/*.js
            DEPENDS ${ARG_SOURCES}
            COMMENT "compile typescript project ${sourceDir}"
            VERBATIM
        )
    endif()
    
    #[[if(sources)
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
        endforeach()
    endif()]]
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
    
    #targetTSDefault(${target_name} FALSE)
    
    set_target_properties(${target_name}
        PROPERTIES TS_EXCLUDES "${ARG_EXCLUDES}"
        TS_DECLARATIONS "${ARG_DECLARATIONS_DIRS}"
    )
    
    # if (tsconfig_latest.json) getLatestBuild()
endfunction()

function(generateTSConfig) #--init
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

function(targetTSDefault target_name build)
    #[[if(build) #no remove
    else()
    end()]]

    message(${build})
    message(${alwaysStrict})
    message(${importHelpers})
    targetTSOptions(${target_name} 
        BUILD ${build} 
        ALWAYS_STRICT ${alwaysStrict}
        IMPORT_HELPERS ${importHelpers}
        NO_EMIT_HELPERS ${noEmitHelpers}
        NO_EMIT_ON_ERROR ${noEmitOnError}
        ALWAYS_STRICT ${alwaysStrict}
        FORCE_CASING ${forceCasing}
        COMPOSITE ${composite}
        
        downlevelIteration ${downlevelIteration}
        EXPERIMENTAL_DECORATORS ${experimental_decorators}
    )
endfunction()

function(targetTSOptions target_name)
    set(options)
    set(multiValueArgs "INCLUDES")
    set(oneValueArgs "BUILD;VERBOSE;allowUnreachableCode;allowUnusedLabels;downlevelIteration;EXPERIMENTAL_DECORATORS;IMPORT_HELPERS;NO_EMIT_HELPERS;NO_EMIT_ON_ERROR;ALWAYS_STRICT;DECORATOR_METADATA;COMPOSITE;FORCED_CASING")
    
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
    
    set_target_property(${target_name} TS_INCLUDES "${ARG_INCLUDES}")
    set_target_property(${target_name} TS_VERBOSE "${ARG_VERBOSE}")
    set_target_property(${target_name} TS_BUILD "${ARG_BUILD}")
    set_target_property(${target_name} TS_noEmitOnError ${ARG_noEmitOnError})
    set_target_property(${target_name} TS_IMPORT_HELPERS "${ARG_IMPORT_HELPERS}")
    set_target_property(${target_name} TS_NO_EMIT_HELPERS ${ARG_NO_EMIT_HELPERS})
    set_target_property(${target_name} TS_downlevelIteration "${ARG_downlevelIteration}")
    set_target_property(${target_name} TS_experimentalDecorators ${ARG_experimentalDecorators})
    set_target_property(${target_name} ${TS_allowUnusedLabels} "${ARG_allowUnusedLabels}")
    set_target_property(${target_name} TS_allowUnreachableCode "${ARG_allowUnreachableCode}")
    set_target_property(${target_name} TS_FORCED_CASING "${ARG_FORCED_CASING}")
    set_target_property(${target_name} TS_COMPOSITE "${ARG_COMPOSITE}")
    #set_target_property(${target_name} TS_EXCLUDES "${ARG_EXCLUDES}")
    set_target_property(${target_name} TS_ALWAYS_STRICT "${ARG_ALWAYS_STRICT}")
    set_target_property(${target_name} TS_DECORATOR_METADATA "${ARG_DECORATOR_METADATA}")
    set_target_property(${target_name} TS_DECLARATIONS "${ARG_DECLARATIONS_DIRS}")
endfunction()
