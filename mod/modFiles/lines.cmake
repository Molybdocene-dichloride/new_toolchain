macro(linesIncludes PREFIX PRJ_DIR PATH)
    message(linez)
    message(${PRJ_DIR}/${PATH})
    linesFile(${PREFIX} ${PRJ_DIR}/${PATH})
endmacro()

macro(linesFile PREFIX file)
    file(READ ${file} content)
    lines(${PREFIX} ${content})
endmacro()

macro(lines PREFIX content)
    STRING(REGEX REPLACE ";" "\\\\;" strs "${content}")
    STRING(REGEX REPLACE "\n" ";" strs "${content}")

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
        
        list(APPEND ${PREFIX}_lines ${stra})
    endforeach()
    
    #message("${${PREFIX}_lines}")
endmacro()