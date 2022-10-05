include(${CMAKE_CURRENT_LIST_DIR}/../script/UseTS.cmake)

set(output output/)
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
            
            if(${REWRITE} OR (NOT EXISTS ${PRJ_DIR}${OUTPUT_DIR}/${relfile}))
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

function(generateBuildCfg PRJ_DIR OUTPUT_DIR RESOURCE_PATHS LIBRARY_PATHp REWRITE)
    list(GET RESOURCE_PATHS 0 RESOURCE_PATHp0)
    list(GET RESOURCE_PATHS 1 RESOURCE_PATHp1)
    
    set(RESOURCE_PATH0 \"${RESOURCE_PATHp0}\")
    set(RESOURCE_PATH1 \"${RESOURCE_PATHp1}\")
    set(LIBRARY_PATH \"${LIBRARY_PATHp}\")
    
    if(${REWRITE} OR (NOT EXISTS ${PRJ_DIR}${OUTPUT_DIR}/build.config))
        configure_file(
            ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/build.config.in
            ${PRJ_DIR}${OUTPUT_DIR}/build.config
            @ONLY
        )
    endif()
endfunction()

function(generateBuildCfgM PRJ_DIR RESOURCE_PATHS LIBRARY_PATHp REWRITE)
    generateBuildCfg(PRJ_DIR ${outputmod} RESOURCE_PATHS LIBRARY_PATHp REWRITE)
endfunction()

function(add_ts_tchainmod NAME PRJ_DIR DEV #[[LIBS]]) #dev and libs
    add_ts(
        ${NAME}
        SOURCE_DIRS ${PRJ_DIR}/${DEV}
        OUTPUT_DIRS ${PRJ_DIR}${outputmod}/${DEV}
    )
endfunction()

function(getPaths JSONCONTENT DEV)
    string(JSON sources GET ${JSONCONTENT} sources)

    string(JSON ln LENGTH ${sources})

    message(${ln})

    set(lna 1)
    math(EXPR lna "${ln} - 1")

    foreach(IDX RANGE ${lna})
        string(JSON source GET ${sources} ${IDX})
        string(JSON type GET ${source} type)
        string(JSON source GET ${source} source)

        if(${type} MATCHES main)
            message(${type})
            message(${source})
        
            set(dev ${source})
        
            #fatalIfNotExists(dev)
            find_path(
                dev
                #NAMES mypackage.h
	            PATHS @PATH@${dev}
	            PATH_SUFFIXES ${source}
	            REQUIRED
                NO_CACHE
            )
            break()
        endif()
    endforeach()
endfunction()