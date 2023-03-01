include(${CMAKE_CURRENT_LIST_DIR}/../../tools/function/CustomCmakeCommand.cmake)
include(${CMAKE_CURRENT_LIST_DIR}/split.cmake)

function(createIncludes SOURCES OUTPUT)
    list(GET SOURCE 0 s)
    STRING(REGEX MATCH ".ts\n" m1 ${s})
    STRING(REGEX MATCH ".ts" m2 ${s})
    STRING(REGEX MATCH "(.ts)$" m3 ${s})
    
    #list(TRANSFORM SOURCES PREPEND ${PATH} OUTPUT_VARIABLE SOURCE)
    
    message(${s})
    if(m1 OR m2 OR m3)
        message(jstots)
        jstots("${SOURCES}")
    else()
        message(jstotsFile)
        jstotsFile("${SOURCES}")
    endif()
    #message(${OUPT})

    file(WRITE ${OUTPUT} ${output})
endfunction()

function(add_includes NAME SOURCES OUTPUT)
    message(geeviyiuurru)
    message("${SOURCES}")
    
    list(TRANSFORM SOURCES PREPEND ${PATH} OUTPUT_VARIABLE uSOURCES)

    add_custom_cmake_command(
        COMMAND -DSOURCE=${uSOURCES} -DOUTPUT=${OUTPUT} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../function/addIncludesFunction.cmake
        OUTPUT ${OUTPUT} #crutch
        DEPENDS ${SOURCES}
        COMMENT "generate .includes"
    )
    add_custom_target(
        ${NAME}_includes
        ALL
        SOURCES ${SOURCE}
        DEPENDS ${OUTPUT}
    )
endfunction()
