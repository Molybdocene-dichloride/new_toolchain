macro(linesIncludes PREFIX PRJ_DIR PATH)
    message(linesIncludes)
    message(${PRJ_DIR}/${PATH})
    linesFile(${PREFIX} ${PRJ_DIR}/${PATH})
endmacro()

macro(linesFile PREFIX file)
    message(linesFile)
    file(READ ${file} content)
    lines(${PREFIX} ${content})
endmacro()

macro(lines PREFIX content)
    message(linesS)
    STRING(REGEX REPLACE ";" "\\\\;" strs "${content}")
    STRING(REGEX REPLACE "\n" ";" strs "${content}")

    message("${strs}")
    
    foreach(stra IN LISTS strs)
        if(NOT DEFINED stra OR NOT stra) 
            #message(not)
            continue()
        endif()
        
        #message(${stra})
        string(REGEX MATCH "^[#]" check ${stra})
        if(check)
            continue()
        endif()
        
        list(APPEND ${PREFIX}_lines ${stra})
    endforeach()
    
    message(lines)
    message("${${PREFIX}_lines}")
endmacro()

macro(deline PREFIX content)
    
endmacro()