include(${CMAKE_CURRENT_LIST_DIR}/../../tools/function/CustomCmakeCommand.cmake)

function(createAssetsFunction SPATHS PATH REWRITE)
    message("${SPATHS}")
    list(LENGTH SPATHS sln)
    math(EXPR sln "${sln} - 1")
    message(${sln})
    
    foreach(i RANGE 0 ${sln})
        message(${i})
        
        message(${PATH})
        
        list(GET SPATHS ${i} SPATH)
        message(${SPATH})
        
        string(LENGTH ${SPATH} szeln)
        string(LENGTH ${PATH} zeln)
        message(size)
        message(${szeln})
        message(${zeln})
            
        math(EXPR szeln "${szeln} - 1") #blyamyt
        math(EXPR zeln "${zeln} - 1")
        message(${szeln})
        message(${zeln})
            
        string(SUBSTRING ${SPATH} ${szeln} 1 send)
        string(SUBSTRING ${PATH} ${zeln} 1 end)
            
        message(${end})
        message(${send})
            
        if(${end} STREQUAL *)
            message(free)
                
            math(EXPR szeln "${szeln} - 1")
            math(EXPR zeln "${zeln} - 1")
            message(${szeln})
            message(${zeln})
                
            string(SUBSTRING ${SPATH} 0 ${szeln} SPATH)
            string(SUBSTRING ${PATH} 0 ${zeln} PATH)
                
            message(${PATH})
            message(${SPATH})
        endif()
        
        if(IS_DIRECTORY ${SPATH})
            message(brownian)
            file(GLOB_RECURSE sfiles ${SPATH}/*)
        
            #message(${sfiles})
            
            foreach(sfile IN LISTS sfiles)
                file(RELATIVE_PATH relfile ${SPATH} ${sfile})
                #message(${relfile})
                set(file ${PATH}/${relfile})
                
                if(${REWRITE} OR (NOT EXISTS ${file}))
                    message(${file})
                    configure_file(
                        ${sfile}
                        ${file}
                        COPYONLY
                    )
                endif()
            endforeach()
        else()
            message(sedimentation)
            
            set(sfile ${SPATH})
            message(${sfile})
            
            set(file ${PRJ_DIR}${OUTPUT_DIR}/${PATH})
            message(${file})
            
            if(${REWRITE} OR (NOT EXISTS ${file}))
                message(${file})
                configure_file(
                    ${sfile}
                    ${file}
                    COPYONLY
                )
            endif()
        endif()
    endforeach()
endfunction()

function(add_assets NAME PRJ_DIR OUTPUT_DIR SPATHS PATH REWRITE)
    message("add assetz fedruio")
    message("${SPATHS}")
    list(TRANSFORM SPATHS PREPEND ${PRJ_DIR} OUTPUT_VARIABLE uSPATHS)
    #list(TRANSFORM uSPATHS APPEND "/*" OUTPUT_VARIABLE uSPATHS)

    set(uPATH ${PRJ_DIR}${OUTPUT_DIR}/${PATH})

    message("${uSPATHS}")
    message("${uPATH}")
    
    add_custom_cmake_command(
        COMMAND -DSPATHS=${SPATHS} -DPATH=${PATH} -DREWRITE=${REWRITE} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../function/addAssetsFunction.cmake
        OUTPUT ${uPATH}
        DEPENDS ${uSPATHS}
        COMMENT "copy assets ${uSPATHS} to ${uPATH}"
    )
    
    add_custom_target(
        ${NAME}
        ALL
        SOURCES ${uSPATHS}
        DEPENDS ${uPATH}
    )
endfunction()