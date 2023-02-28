include(${CMAKE_CURRENT_LIST_DIR}/lines.cmake)
include(${CMAKE_CURRENT_LIST_DIR}/append.cmake)
include(${CMAKE_CURRENT_LIST_DIR}/../../tools/function/CustomCmakeCommand.cmake)

#[[
function(createMainWithDirectories sources output filenames)
    message("${sources}")
    message(${output})
    
    list(LENGTH sources ln)
    list(LENGTH filenames ln2)
    
    foreach(i RANGE 0 ${ln})
        list(GET sources ${i} source)
        
        if(${i} GREATER ${ln2})
            list(GET filenames ${i} filename)
        elseif()
            
        endif()
        
        linesFile(${source})
        message("${newstrs}")
        createMain(${source}/.includes ${output} "${newstrs}")
    endforeach()
endfunction()]]

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

function(add_main NAME includes SOURCE OUTPUT)
    #message(${CMAKE_COMMAND} -DINCLUDES=${includes} -DSOURCE=${SOURCE} -DOUTPUT=${OUTPUT} -DDEV=${DEV} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR})
    
    add_custom_cmake_command(
        COMMAND -DSOURCE=${SOURCE} -DOUTPUT=${OUTPUT} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../function/addMainFunction.cmake
        OUTPUT ${OUTPUT}
        DEPENDS ${SOURCE}/*.js
        COMMENT "create main.js-like file"
    )
    
    #message(${OUTPUT})
    
    add_custom_target(
        ${NAME}_mainjs
        ALL
        SOURCES ${SOURCE}/*.js
        DEPENDS ${OUTPUT}
    )
endfunction()
