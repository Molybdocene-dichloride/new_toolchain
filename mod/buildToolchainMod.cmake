include(${CMAKE_CURRENT_LIST_DIR}/../script/UseTS.cmake)

set(output output/)
set(outputscript ${output}/script)
set(outputdeclarations ${output}/declarations)
set(outputshared ${output}/shared)

#set(outputheaders ${output}/headers)

set(outputmod ${output}/mod)

function(copyResources PRJ_DIR OUTPUT_DIR PATHS REWRITE) #without changes. only resources, additional
    message(${PATHS})
    
    foreach(PATH IN LISTS PATHS)
        message(${PATH})
        
        file(GLOB_RECURSE files ${PRJ_DIR}/src/${PATH}/*)
        
        message(files)
        
        foreach(file IN LISTS files)
            #message(${file})
            file(RELATIVE_PATH relfile ${PRJ_DIR}/src ${file})
            
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

function(generateBuildCfgMd PRJ_DIR RESOURCE_PATHS LIBRARY_PATHp REWRITE) #deprecated
    generateBuildCfg(PRJ_DIR ${outputmod} RESOURCE_PATHS LIBRARY_PATHp REWRITE)
endfunction()

function(add_ts_tchainmod NAME PRJ_DIR DEV #[[LIBS]]) #dev and libs
    add_ts(
        ${NAME}
        SOURCE_DIRS ${PRJ_DIR}/${DEV}
        OUTPUT_DIRS ${PRJ_DIR}${outputmod}/${DEV}
    )
endfunction()

#function(add_ts_library_tchainmod NAME PRJ_DIR DEV #[[LIBS]]) maybe

function(getPathsFile JSONFILE SDEV DEV SLIBS LIBS #[[SRES RES]])
    file(READ ${JSONFILE} CONTENT)
    getPaths(${CONTENT} ${SDEV} ${DEV} ${SLIBS} ${LIBS})
    
    message(dnn)
    message(${DEV})
    
    set(LIBS ${LIBS} PARENT_SCOPE)
    set(SLIBS ${SLIBS} PARENT_SCOPE)
    set(DEV ${DEV} PARENT_SCOPE)
    set(SDEV ${SDEV} PARENT_SCOPE)
endfunction()

function(getPaths JSONCONTENT SDEV DEV SLIBS LIBS SRES RES)
    string(JSON sources GET ${JSONCONTENT} sources)
    string(JSON ln LENGTH ${sources})
    
    string(JSON resources GET ${JSONCONTENT} resources)
    string(JSON ln2 LENGTH ${resources})
    
    message(${ln})

    set(lna 1)
    math(EXPR lna "${ln} - 1")

    set(lna2 1)
    math(EXPR lna2 "${ln2} - 1")

    foreach(IDX RANGE ${lna})
        string(JSON source GET ${sources} ${IDX})
        string(JSON type GET ${source} type)
        string(JSON source GET ${source} source)

        message(${source})
        
        message("gum")
        string(LENGTH ${source} lenna)
            
        if(${type} MATCHES main)
            set(type DEV)
        elseif(${type} MATCHES library)
            set(type LIBS)
        else()
           continue() 
        endif()
        
        #message(${type})
            
        string(SUBSTRING ${source} 4 ${lenna} ${type})
            
        message(${${type}})
            
        set(${type} ${${type}} PARENT_SCOPE)
        set(S${type} ${source} PARENT_SCOPE)
            
        #fatalIfNotExists(${type})
        find_path(
            ${type}
            #NAMES mypac
	        PATHS @PATH@${${type}}
	        PATH_SUFFIXES ${source}
	        REQUIRED
            NO_CACHE
        )
        #break()
    endforeach()
    
    foreach(IDX RANGE ${lna2})
        string(JSON source GET ${resources} ${IDX})
        string(JSON type GET ${source} type)
        string(JSON source GET ${source} path)

        message(${source})
        
        message("gum")
        string(LENGTH ${source} lenna)
        
        if(${type} MATCHES resource_directory)
            set(type RES)
        elseif(${type} MATCHES library)
            set(type LIBS)
        else()
           continue() 
        endif()
        
        #message(${type})
            
        string(SUBSTRING ${source} 4 ${lenna} ${type})
            
        message(${${type}})
            
        set(${type} ${${type}} PARENT_SCOPE)
        set(S${type} ${source} PARENT_SCOPE)
            
        #fatalIfNotExists(${type})
        
        find_path(
            ${type}
            #NAMES mypac
	        PATHS @PATH@${${type}}
	        PATH_SUFFIXES ${source}
	        REQUIRED
            NO_CACHE
        )
    endforeach()
endfunction()