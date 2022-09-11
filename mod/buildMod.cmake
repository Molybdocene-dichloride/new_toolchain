set(output output)
set(outputscript ${output}/script)
set(outputdeclarations ${output}/declarations)
set(outputshared ${output}/shared)
#set(outputshared ${output}/headers)

set(outputmod ${output}/mod)

function(copyResources PRJ_DIR PATHS OUTPUT_DIR REWRITE) #without changes. only resources, additional
    
    message(${PATHS})
    
    foreach(PATH IN LISTS PATHS)
        message(${PATH})
        
        file(GLOB_RECURSE files ${PRJ_DIR}${PATH}/*)
        
        message(files)
        
        foreach(file IN LISTS files)
            #message(${file})
            file(RELATIVE_PATH relfile ${PRJ_DIR} ${file})
            
            if(${REWRITE} OR (NOT EXISTS ${PRJ_DIR}${OUTPUT_DIR}${relfile}))
                message(${PRJ_DIR}${OUTPUT_DIR}/${relfile})
                configure_file(
                    ${file}
                    ${PRJ_DIR}${OUTPUT_DIR}/${relfile}
                    COPYONLY
                )
            endif()
        endforeach()
    endforeach()
endfunction()

function(generateBuildConfig OUTPUT_DIR)
    configure_file(
        ${file}
        ${PRJ_DIR}${OUTPUT_DIR}/${relfile}
        COPYONLY
    )
endfunction()