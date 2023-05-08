#include(${CMAKE_CURRENT_LIST_DIR}/split.cmake)
include(${CMAKE_CURRENT_LIST_DIR}/lines.cmake)
include(${CMAKE_CURRENT_LIST_DIR}/append.cmake)
include(${CMAKE_CURRENT_LIST_DIR}/../../tools/function/CustomCmakeCommand.cmake)

function(createMain source output includes)
    message(createMain)
    if(NOT includes)
        set(includes "")
        list(TRANSFORM source APPEND /.includes OUTPUT_VARIABLE includefile)
        message(source)
        
            message(${includefile})
        file(READ ${includefile} includenl)
        message(${includenl})
            lines(MAIN_INTERNAL ${includenl})
            list(APPEND includes ${MAIN_INTERNAL_lines})
        message(internal_lines)
        message("${MAIN_INTERNAL_lines}")
        message(iclu)
        message(${includes})
    else()
        #message
    endif()
    
    message("All includes")
    message("${includes}")
    message(inclidesIter)
    list(LENGTH includes ln)
    math(EXPR ln "${ln} - 1")
    message(${ln})
    message(${source})
    foreach(i RANGE 0 ${ln})
        message(iter${i})
        list(GET includes ${i} includa)
        message(${includa})
        appendFileStr(${output} "#${includa}")
        appendFile(${output} ${source}/${includa})
        #appendFileStr(${output} "")
    endforeach()
    message(${output})
endfunction()

function(add_main NAME SOURCES OUTPUT INCLUDES)
    message(add_main)
    message("${SOURCES}")
    message(oipuddd)
    message(${OUTPUT})
    message("${INCLUDES}")
    
    list(TRANSFORM SOURCES APPEND /*.js OUTPUT_VARIABLE SOURCESjs)
    message("${SOURCES}")

    if(INCLUDES)
        message(yes)
        add_custom_cmake_command(
            COMMAND -D SOURCES=${SOURCES} -D OUTPUT=${OUTPUT} -D INCLUDES=${INCLUDES} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../function/addMainFunction.cmake
            OUTPUT ${OUTPUT}
            DEPENDS ${SOURCESjs}
            COMMENT "create main.js-like file"
        )
    else()
        message(no)
        add_custom_cmake_command(
            COMMAND -D SOURCES=${SOURCES} -D OUTPUT=${OUTPUT} -D INCLUDES=FALSE -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../function/addMainFunction.cmake
            OUTPUT ${OUTPUT}
            DEPENDS ${SOURCESjs}
            COMMENT "create main.js-like file"
        )
    endif()
    #message(${OUTPUT})
    add_custom_target(
        ${NAME}_mainjs
        ALL
        SOURCES ${SOURCESjs}
        DEPENDS ${OUTPUT}
    )
endfunction()
