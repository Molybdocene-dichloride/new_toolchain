macro(jstotsFile file)
    message(madnessogruikjid)
    file(READ ${file} content)
    jstots(${content})
endmacro()

macro(jstots str)
    STRING(REGEX REPLACE ".ts\n" ".js\n" newstr ${str})
    STRING(REGEX REPLACE ".ts " ".js " newstr ${newstr})
    STRING(REGEX REPLACE "(.ts)$" ".js" newstr ${newstr})
    message(${newstr})
endmacro()

function(add_includes NAME SOURCE OUTPUT)
    add_custom_command(
        COMMAND ${CMAKE_COMMAND} -DSOURCE=${SOURCE} -DOUTPUT=${OUTPUT} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/function/addIncludesFunction.cmake
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