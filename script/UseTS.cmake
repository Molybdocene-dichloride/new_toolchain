set(importHelpers false)
set(noEmitHelpers false)
set(noEmitOnError true)
set(alwaysStrict false)
set(forceCasing false)
set(composite false)

set(downlevelIteration true)
set(experimentalDecorators true)

set(listofkeys "")
set(listofswitches "")

function(prepareTS target_name key switch val) #switch can null or empty, key one word only
    message(prepareTS)
    if(DEFINED val)
        message(prp)
        message(${target_name})
        message(${key})
        message("${val}")
        
        set_target_properties(
            ${target_name}
            PROPERTIES ${key} "${val}"
        )
        
        file(APPEND ${CMAKE_CURRENT_SOURCE_DIR}/listofkeys.txt "${key};")
        file(APPEND ${CMAKE_CURRENT_SOURCE_DIR}/listofswitches.txt "${switch};")
    elseif()
        message(WARNING "notval")
    endif()
endfunction()

function(prepareCommand ts_command)
    message(prepareCommand)
    file(READ ${CMAKE_CURRENT_SOURCE_DIR}/listofswitches.txt listofswitches)
    file(READ ${CMAKE_CURRENT_SOURCE_DIR}/listofkeys.txt listofkeys)
    
    list(LENGTH listofkeys len)
    math(EXPR len "${len} - 1")
    message(${len}) 
    foreach(i RANGE 0 ${len})
        list(GET listofswitches ${i} switch)
        list(GET listofkeys ${i} key)
        
        list(APPEND ts_command ${switch})
        list(APPEND ts_command $<TARGET_PROPERTY:${target_name},${key}>)
    endforeach()

    set(ts_command ${ts_command} PARENT_SCOPE)
endfunction()

function(set_target_property target_name key val)
    message(val)
    #if(DEFINED val)
        #message("${val}")
        set_target_properties(
            ${target_name}
            PROPERTIES ${key} ${val}
        )
    #endif()
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
    
    if(NOT ARG_SOURCE_DIR AND NOT ${lnstd} GREATER 0)
        message(FATAL_ERROR "count of sources = 0")
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
    set(multiValueArgs "SOURCES;DEPENDS;INCLUDES;EXCLUDES")

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
    
    message(deps)
    message(${ARG_DEPENDS})

    #[[if(ARG_INCLUDES)
        message("${ARG_INCLUDES}")
    endif()]]
    if(ARG_EXCLUDES)
        message("${ARG_EXCLUDES}")
    endif()

    message(as_command)
    set(ts_command ${CMAKE_TS_COMPILER})
    
    #[[prepareTS(
        ${target_name}
        PROPERTIES TS_INCLUDES ${ARG_INCLUDES}
    )]]
    
    prepareCommand(ts_command)
    
    message(ts_comman)
    message("${ts_command}")
    message(sourceDir)
    message(${sourceDir})
    
    add_custom_command(
        COMMAND ${ts_command}
        OUTPUT ${outputDir}/*.js
        DEPENDS #[[${sourceDir}/*]] "${ARG_DEPENDS}"
        COMMENT "compile typescript project ${sourceDir}"
        VERBATIM
    )
    
    #[[$<TARGET_PROPERTY:${target_name},TS_VERBOSE>, 
    $<TARGET_PROPERTY:${target_name},TS_downlevelIteration>
    $<TARGET_PROPERTY:${target_name},TS_allowUnreachableCode>
    $<TARGET_PROPERTY:${target_name}, TS_allowUnusedLabel>
    $<TARGET_PROPERTY:${target_name},TS_IMPORT_HELPERS>
    $<TARGET_PROPERTY:${target_name},TS_NO_EMIT_HELPERS>
    $<TARGET_PROPERTY:${target_name},TS_NO_EMIT_ON_ERROR>
    $<TARGET_PROPERTY:${target_name},TS_EXPERIMENTAL_DECORATORS>
    $<TARGET_PROPERTY:${target_name}, TS_ALWAYS_STRICT>
    $<TARGET_PROPERTY:${target_name},TS_DECORATOR_METADATA>
    
    $<IF:$<BOOL:$<TARGET_PROPERTY:${target_name},TS_VERBOSE>>,$<TARGET_PROPERTY:${target_name},TS_VERBOSE>," ">]]
    
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
    
    set_target_properties(${target_name}
        PROPERTIES TS_EXCLUDES "${ARG_EXCLUDES}"
        TS_DECLARATIONS "${ARG_DECLARATIONS_DIRS}"
    )
    
    # if (tsconfig_latest.json) getLatestBuild()
endfunction()

function(generateTSConfig) #tsconfig.json
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

    message(tsDef)
    message(${build})
    message(${alwaysStrict})
    message(${importHelpers})
    targetTSOptions(${target_name} 
        BUILD ${build}
        IMPORT_HELPERS ${importHelpers}
        NO_EMIT_HELPERS ${noEmitHelpers}
        NO_EMIT_ON_ERROR ${noEmitOnError}
        ALWAYS_STRICT ${alwaysStrict}
        FORCED_CASING ${forceCasing}
        COMPOSITE ${composite}
        downlevelIteration ${downlevelIteration}
        EXPERIMENTAL_DECORATORS ${experimental_decorators}
    )
endfunction()

function(targetTSOptions target_name)
    set(options)
    set(multiValueArgs "")
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
    
    if(NOT TARGET ${target-name})
        add_custom_target(
            ${target_name}
            ALL
            SOURCES "${ARG_DEPENDS}"
            DEPENDS ${outputDir}/*.js
        )
    endif()
    
    if(DEFINED ARG_VERBOSE)
        prepareTS(${target_name} TS_VERBOSE --verbose "${ARG_VERBOSE}")
    endif()
    
    if(DEFINED ARG_NO_EMIT_ON_ERROR)
        prepareTS(${target_name} TS_NO_EMIT_ON_ERROR --noEmitOnError ${ARG_NO_EMIT_ON_ERROR})
    endif()
    if(DEFINED ARG_IMPORT_HELPERS)
        prepareTS(${target_name} TS_IMPORT_HELPERS --importHelpers "${ARG_IMPORT_HELPERS}")
    endif()
    if(DEFINED ARG_NO_EMIT_HELPERS)
        #message(ARG_NO_EMIT_HELPERS)
        #message(${ARG_NO_EMIT_HELPERS})
        prepareTS(${target_name} TS_NO_EMIT_HELPERS --noEmitHelpers ${ARG_NO_EMIT_HELPERS})
    endif()
    if(DEFINED ARG_downlevelIteration)
        prepareTS(${target_name} TS_downlevelIteration --downlevelIteration "${ARG_downlevelIteration}")
    endif()
    if(DEFINED ARG_experimentalDecorators)
        prepareTS(${target_name} TS_experimentalDecorators --experimentalDecorators ${ARG_experimentalDecorators})
    endif()
    if(DEFINED ARG_allowUnusedLabels)
        prepareTS(${target_name} TS_allowUnusedLabels --allowUnusedLabels "${ARG_allowUnusedLabels}")
    endif()
    if(DEFINED ARG_allowUnreachableCode)
        prepareTS(${target_name} TS_allowUnreachableCode --allowUnreachableCode "${ARG_allowUnreachableCode}")
    endif()
    if(DEFINED ARG_FORCED_CASING)
        prepareTS(${target_name} TS_FORCED_CASING --forceCase "${ARG_FORCED_CASING}")
    endif()
    if(DEFINED ARG_COMPOSITE)
        prepareTS(${target_name} TS_COMPOSITE --composite "${ARG_COMPOSITE}")
    endif()
    if(DEFINED ARG_ALWAYS_STRICT)
        message(ARG_ALWAYS_STRICT)
        message(${ARG_ALWAYS_STRICT})
        prepareTS(${target_name} TS_ALWAYS_STRICT --alwaysStrict "${ARG_ALWAYS_STRICT}")
    endif()
    if(DEFINED ARG_DECORATOR_METADATA)
        prepareTS(${target_name} TS_DECORATOR_METADATA --emitDecoratorMetadata "${ARG_DECORATOR_METADATA}")
    endif()

    file(READ ${CMAKE_CURRENT_SOURCE_DIR}/listofkeys.txt listofkeys)
    message("${listofkeys}")
endfunction()
