function(backsC PATH0 PATH1 cout) #1 otn 2 of prj

    string(LENGTH ${PATH0} LPATH0)
    string(LENGTH ${PATH1} LPATH1)
    
    if(${LPATH1} LESS ${LPATH0})
        math(EXPR LPATH "${LPATH0} - 1")
        math(EXPR LPATHL "${LPATH1} - 1")
        
        message(${LPATH0})
        message(${LPATH1})
        message(${LPATH})
        message(patwwww)
    else()
        math(EXPR LPATH "${LPATH1} - 1")
        math(EXPR LPATHL "${LPATH0} - 1")
        
        message(${LPATH0})
        message(${LPATH1})
        message(${LPATH})
        message(pat)
    endif()
    
    message(${LPATH})

    set(ecout -1)
    set(cout 0 PARENT_SCOPE)
    set(err FALSE)
    
    foreach(loop RANGE 0 ${LPATH})
        if(${loop} LESS ${LPATH0})
            message(ga)
            #message(${loop})
            #message(${LPATH0})
            string(SUBSTRING ${PATH0} ${loop} 1 symb0)
            string(APPEND symbs${ecout}0 ${symb0})
        else()
            message(ca)
            unset(symb0)
            #message(symb0)
        endif()
        
        if(${loop} LESS ${LPATH1})
            string(SUBSTRING ${PATH1} ${loop} 1 symb1)
            string(APPEND symbs${ecout}1 ${symb1})
        else()
            message(ca)
            unset(symb1)
            #message(symb1)
        endif()
        
        #message(${symbs${ecout}0})
        #message(${symbs${ecout}1})
        
        if(NOT err)
        if((NOT DEFINED symb0) OR (NOT DEFINED symb1))
            set(err TRUE)
            message(erroredd)
        endif()
        
        if(NOT err)
            if((${symb0} STREQUAL "/") AND (${symb1} STREQUAL "/"))
            set(prevcout ${ecout})
            
            message(${symbs${prevcout}0}g)
            message(${symbs${prevcout}1}g)
            
            math(EXPR ecout "${ecout} + 1")
            
            message(${ecout})
            
            if((NOT ${ecout} EQUAL 0) AND (NOT ${symbs${prevcout}0} STREQUAL ${symbs${prevcout}1}))
                message(errored)
                set(err TRUE)
            endif()
            elseif((NOT errored) AND (${symb0} STREQUAL "/") AND (NOT ${symb1} STREQUAL "/"))
                math(EXPR cout "${cout} + 1")
        
                message(errored)
                set(err TRUE)
            elseif((NOT errored) AND (NOT ${symb0} STREQUAL "/") AND (${symb1} STREQUAL "/"))
                message(errored)
                set(err TRUE)
            endif()
        endif()
        endif()
        
        message(${err})
        message(${loop})
        
        if(DEFINED symb1)
        if((${symb1} STREQUAL "/") AND err)
            math(EXPR cout "${cout} + 1")
            set(cout ${cout} PARENT_SCOPE)
            
            message(err)
            message(${cout})
        endif()
        endif()
        
    endforeach()
endfunction()

function(addBacks DIR count NEWDIR)
    message(${DIR})
    set(NEWDIR ${DIR})
    set(NEWDIR ${DIR} PARENT_SCOPE)
    message(${NEWDIR})
    if(${count} LESS 1)
        return()
    endif()
    
    foreach(loop RANGE 1 ${count})
        message(${loop})
        string(APPEND NEWDIR "../")
        set(NEWDIR ${NEWDIR} PARENT_SCOPE)
    endforeach()
    
    message(${count})
    message(${NEWDIR})
endfunction()

function(backwards FULLDIR DIR)
    string(LENGTH DIR LENG)
    string(LENGTH FULLDIR FLENG)
    
    foreach(loop RANGE LENG FLENG)
        string(SYMB FULLDIR loop symb0)
        
        if(symb0 STREQUAL "/")
            string(APPEND backs "../")
        endif()
    endforeach()
endfunction()