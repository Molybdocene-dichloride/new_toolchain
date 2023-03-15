include(${CMAKE_CURRENT_LIST_DIR}/lines.cmake)
include(${CMAKE_CURRENT_LIST_DIR}/append.cmake)
include(${CMAKE_CURRENT_LIST_DIR}/../../tools/function/CustomCmakeCommand.cmake)

function(createMain sources output includes)
    message(createMain)
    if(NOT includes)
        foreach(source IN LISTS sources)
            file(READ ${sources} includes)
        endforeach()
    endif()
    
    foreach(newstr IN LISTS includes)
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

function(add_main NAME SOURCES OUTPUT INCLUDES)
    message(add_main)
    message("${SOURCES}")
    message(oipuddd)
    message(${OUTPUT})
    message("${INCLUDES}")
    
    list(TRANSFORM SOURCES APPEND /*.js OUTPUT_VARIABLE SOURCES)
    message("${SOURCES}")

    if(INCLUDES)
        message(yes)
        add_custom_cmake_command(
            COMMAND "-DSOURCE=${SOURCES} -DOUTPUT=${OUTPUT} -DINCLUDES=${INCLUDES} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../function/addMainFunction.cmake"
            OUTPUT ${OUTPUT}
            DEPENDS ${SOURCES}
            COMMENT "create main.js-like file"
        )
    else()
        message(no)
        add_custom_cmake_command(
            COMMAND -D SOURCE=${SOURCES} -D OUTPUT=${OUTPUT} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../function/addMainFunction.cmake
            OUTPUT ${OUTPUT}
            DEPENDS ${SOURCES}
            COMMENT "create main.js-like file"
        )
    endif()
    #message(${OUTPUT})
    add_custom_target(
        ${NAME}_mainjs
        ALL
        SOURCES ${SOURCES}
        DEPENDS ${OUTPUT}
    )
endfunction()
