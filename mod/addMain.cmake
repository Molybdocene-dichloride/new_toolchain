macro(linesFile file)
    file(READ ${file} content)
    lines(${content})
endmacro()

macro(lines str)
    STRING(REGEX REPLACE ";" "\\\\;" strs "${str}")
    STRING(REGEX REPLACE "\n" ";" strs "${str}")

    message("${strs}")
    
    foreach(stra IN LISTS strs)
        if(NOT DEFINED stra OR NOT stra) 
            message(not)
            continue()
        endif()
        
        message(${stra})
        STRING(REGEX MATCH "^[#]" check ${stra})
        if(check) 
            message(${check})
            continue()
        endif()
        
        list(APPEND newstrs ${stra})
    endforeach()
    
    #message("${newstrs}")
endmacro()

function(appendFile file1 file2)
    file(READ ${file2} content2)
    file(APPEND ${file1} ${content2})
    file(APPEND ${file1} "\n")
endfunction()

function(createMainWithIncludesFile sources output)
    message(${sources})
    message(${output})
    foreach(source IN LISTS sources)
        linesFile(${source}/.includes)
        message("${newstrs}")
        createMain(${source} ${output} "${newstrs}")
    endforeach()
endfunction()

function(createMain source output newstrs)
    foreach(newstr IN LISTS newstrs)
        message(${newstr})

        if(newstr MATCHES "(/[*][*])$" OR newstr MATCHES "(/[*])$")
            STRING(REGEX REPLACE "(/[*])$" "" newstr ${newstr})
            message(${newstr})
            STRING(REGEX REPLACE "(/[*][*])$" "" newstr ${newstr})
            message(${newstr})
            file(GLOB_RECURSE files ${source}/${newstr}/*)
            foreach(file IN LISTS files)
                appendFile(${output} ${file})
            endforeach()
        else()
            appendFile(${output} ${source}/${newstr})
        endif()
    endforeach()
endfunction()

function(add_includes NAME SOURCE OUTPUT)
    add_custom_command(
        COMMAND ${CMAKE_COMMAND} -DSOURCE=${SOURCE} -DOUTPUT=${OUTPUT} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/function/IncludesFunction.cmake
        OUTPUT ${OUTPUT} #crutch
        DEPENDS ${SOURCE}
        COMMENT "generate .includes"
        VERBATIM
    )
    message(geeviyiuurru)
    message(${SOURCE})
    
    add_custom_target(
        ${NAME}_includes
        ALL
        SOURCES ${SOURCE}
        DEPENDS ${OUTPUT}
    )
endfunction()

function(add_main NAME SOURCE OUTPUT)
    message(${CMAKE_COMMAND} -DSOURCE=${SOURCE} -DOUTPUT=${OUTPUT} -DDEV=${DEV} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR})
    add_custom_command(
        COMMAND ${CMAKE_COMMAND} -DSOURCE=${SOURCE} -DOUTPUT=${OUTPUT} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/function/addMainFunction.cmake
        OUTPUT ${OUTPUT}
        DEPENDS ${SOURCE}
        COMMENT "create main.js-like file"
        VERBATIM
    )
    
    #[[add_custom_cmake_command(
        COMMAND -DSOURCE=${SOURCE} -DOUTPUT=${OUTPUT} addMainFunction.cmake
        OUTPUT ${OUTPUT}
        DEPENDS ${SOURCE}
        COMMENT "create main.js-like file"
        VERBATIM
    )]]
    
    #message(${OUTPUT})
    
    add_custom_target(
        ${NAME}_mainjs
        ALL
        SOURCES ${SOURCE}
        DEPENDS ${OUTPUT}
    )
endfunction()

function(other_add_main NAME SOURCE OUTPUT) #no work!
    message(${CMAKE_COMMAND} -DSOURCE=${SOURCE} -DOUTPUT=${OUTPUT} -DDEV=${DEV} -DMAIN=${MAIN} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR})
    add_custom_command(
        COMMAND ${CMAKE_COMMAND} -DPRJ_DIR=${PRJ_DIR} -DOUTPUT_DIR=${OUTPUT_DIR} -DDEV=${DEV} -DMAIN=${MAIN} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/function/addMainFunction.cmake
        OUTPUT ${PRJ_DIR}${outputmod}/${MAIN}
        DEPENDS ${PRJ_DIR}${outputmod}/${DEV}
        COMMENT "create main.js-like file"
        VERBATIM
    )

    add_custom_target(
        ${NAME}_mainjs
        ALL
        SOURCES ${PRJ_DIR}${outputmod}/${DEV}
        DEPENDS ${PRJ_DIR}${outputmod}/${MAIN}
    )
endfunction()