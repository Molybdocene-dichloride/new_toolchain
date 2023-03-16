include(${CMAKE_CURRENT_LIST_DIR}/../../tools/function/CustomCmakeCommand.cmake)
include(${CMAKE_CURRENT_LIST_DIR}/split.cmake)

function(createIncludes SOURCES OUTPUT TYPE)
    message(createIncludes)
    if(TYPE)
        jstots("${SOURCES}")
    else()
        jstotsFile("${SOURCES}")
    endif()
    
    globtofilesFile(${OUTPUT})
    
    message(${OUTPUT})

    file(WRITE ${OUTPUT} ${output})
endfunction()

function(add_includes NAME SOURCES OUTPUT INCLUDES_PATH) #INCLUDES_FILES is paths includes files if SOURCES list ("relative" recommended) includes! if SOURCES is files, this files must absolute!
    message(add_includes)
    message("${SOURCES}")
    message(outpudds)
    message("${OUTPUT}")
    message("${INCLUDES_PATH}")
    
    set(str "${SOURCES}")
    message(sttrr)
    message("${str}")
    
    if(INCLUDES_PATH)
        message(add_includes_INCLUDES_PATH)
        if(NOT EXISTS ${INCLUDES_PATH})
            message(FATAL_ERROR ext)
        endif()
        if(IS_DIRECTORY ${INCLUDES_PATH})
            message(DIRRY)
            list(TRANSFORM INCLUDES_PATH APPEND /.includes OUTPUT_VARIABLE INCLUDES_PATH)
        endif()
        
        message("${SOURCES}")
        message(${INCLUDES_PATH})
        add_custom_cmake_command(
            COMMAND -D SOURCES=${SOURCES} -D OUTPUT=${OUTPUT} -D TYPE=TRUE -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../function/addIncludesFunction.cmake
            OUTPUT ${OUTPUT} #crutch
            DEPENDS ${INCLUDES_PATH}
            COMMENT "generate .includes"
        )
        add_custom_target(
            ${NAME}_includes
            ALL
            SOURCES ${INCLUDES_PATH}
            DEPENDS ${OUTPUT}
        )
    else()
        message(add_includes_INCLUDES_PATH_NO)
        add_custom_cmake_command(
        COMMAND -D SOURCES="${SOURCES}" -D OUTPUT=${OUTPUT} -D TYPE=FALSE -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../function/addIncludesFunction.cmake
        OUTPUT ${OUTPUT} #crutch
        DEPENDS ${SOURCES}
        COMMENT "generate .includes"
        )
        add_custom_target(
            ${NAME}_includes
            ALL
            SOURCES ${SOURCES}
            DEPENDS ${OUTPUT}
        )
    endif()
endfunction()
