include(${CMAKE_CURRENT_LIST_DIR}/../../tools/function/CustomCmakeCommand.cmake)
include(${CMAKE_CURRENT_LIST_DIR}/split.cmake)

function(createIncludes SOURCES OUTPUT TYPE)
    message(createIncludes)
    if(TYPE)
        jstots("${SOURCES}")
    else()
        jstotsFile("${SOURCES}")
    endif()
    
    message(FATAL_ERROR ${OUPUT})

    file(WRITE ${OUTPUT} ${output})
endfunction()

function(add_includes NAME SOURCES OUTPUT INCLUDES_FILES) #INCLUDES_FILES is paths includes files if SOURCES list ("relative" recommended) includes! if SOURCES is files, this files must absolute!
    message(add_includes)
    message("${SOURCES}")
    message(outpudds)
    message("${OUTPUT}")
    message("${INCLUDES_FILES}")

    if(INCLUDES_FILE)
        set(TYPE TRUE)
    elseif()
        set(TYPE FALSE)
    endif()
    
    add_custom_cmake_command(
        COMMAND -DSOURCE=${SOURCES} -DOUTPUT=${OUTPUT} -DTYPE=${TYPE} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../function/addIncludesFunction.cmake
        OUTPUT ${OUTPUT} #crutch
        DEPENDS ${SOURCES}
        COMMENT "generate .includes"
    )
    
    if(INCLUDES_FILES)
        add_custom_target(
            ${NAME}_includes
            ALL
            SOURCES ${INCLUDES_FILES}
            DEPENDS ${OUTPUT}
        )
    else()
        add_custom_target(
            ${NAME}_includes
            ALL
            SOURCES ${SOURCES}
            DEPENDS ${OUTPUT}
        )
    endif()
endfunction()
