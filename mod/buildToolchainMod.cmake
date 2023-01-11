include(${CMAKE_CURRENT_LIST_DIR}/../script/UseTS.cmake)

include(${CMAKE_CURRENT_LIST_DIR}/addMain.cmake)
include(${CMAKE_CURRENT_LIST_DIR}/addIncludes.cmake)

set(output output/)
set(outputscript ${output}/script)
set(outputdeclarations ${output}/declarations)

set(outputshared ${output}/shared)

#set(outputheaders ${output}/headers)

set(outputmod ${output}/mod)

function(copyResources PRJ_DIR OUTPUT_DIR SPATHS PATHS REWRITE) #without changes. only resources, additional
    message("${SPATHS}")
    list(LENGTH SPATHS sln)
    list(LENGTH PATHS ln)
    math(EXPR ln "${ln} - 1")
    math(EXPR sln "${sln} - 1")
    message(${sln})
    message(${ln})
    
    if(NOT ${sln} EQUAL ${ln})
        message(FATAL_ERROR "not eq")
    endif()
    
    foreach(i RANGE 0 ${ln})
        message(${i})
    
        list(GET PATHS ${i} PATH)
        
        message(${i})
        message(${PATH})
        
        list(GET SPATHS ${i} SPATH)
        message(${SPATH})
        
        string(LENGTH ${SPATH} ssizel)
        string(LENGTH ${PATH} sizel)
            message(size)
            message(${ssizel})
            message(${sizel})
            
            math(EXPR ssizel "${ssizel} - 1")
            math(EXPR sizel "${sizel} - 1")
            message(${ssizel})
            message(${sizel})
            
            string(SUBSTRING ${SPATH} ${ssizel} 1 send)
            string(SUBSTRING ${PATH} ${sizel} 1 end)
            
        message(${end})
        message(${send})
            
        if(${end} STREQUAL *)
            message(free)
                
            math(EXPR ssizel "${ssizel} - 1")
            math(EXPR sizel "${sizel} - 1")
            message(${ssizel})
            message(${sizel})
                
            string(SUBSTRING ${SPATH} 0 ${ssizel} SPATH)
            string(SUBSTRING ${PATH} 0 ${sizel} PATH)
                
            message(${PATH})
            message(${SPATH})
        endif()
            
            
        
        file(GLOB_RECURSE files ${PRJ_DIR}${OUTPUT_DIR}/${PATH}/*)
        file(GLOB_RECURSE sfiles ${PRJ_DIR}/${SPATH}/*)
        
        #message(${sfiles})
        
        if(sfiles)
            file(GLOB_RECURSE sfiles ${PRJ_DIR}/${SPATH}/*)
        
            #message(${sfiles})
            #message(sfiles)
        
            foreach(sfile IN LISTS sfiles)
                #message(${sfile})
                file(RELATIVE_PATH relfile ${PRJ_DIR}/${SPATH} ${sfile})
                #message(${relfile})
                set(file ${PRJ_DIR}${OUTPUT_DIR}/${PATH}/${relfile})
                #message(${file})
                
                if(${REWRITE} OR (NOT EXISTS ${file}))
                    message(${file})
                    configure_file(
                        ${sfile}
                        ${file}
                        COPYONLY
                    )
                endif()
            endforeach()
        endif()
        if(NOT sfiles) #costylno
            message(poco)
            file(RELATIVE_PATH PATH /src /${SPATH})
            message(${PATH})
            
            set(sfile ${PRJ_DIR}/${SPATH})
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
        
    #message(FATAL_ERROR errornio!)
endfunction()

function(generateBuildCfg PRJ_DIR OUTPUT_DIR RESOURCE_PATHS LIBRARY_PATHp BUILD_TYPE REWRITE)
    list(GET RESOURCE_PATHS 0 RESOURCE_PATHp0)
    list(GET RESOURCE_PATHS 1 RESOURCE_PATHp1)
    
    set(RESOURCE_PATH0 \"${RESOURCE_PATHp0}\")
    set(RESOURCE_PATH1 \"${RESOURCE_PATHp1}\")
    set(LIBRARY_PATH \"${LIBRARY_PATHp}\")
    
    #set(BUILD_TYPE develop) only develop type currently supported
    set(INNER_API CoreEngine) #only CoreEngine API currently supported
    
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

function(generateAndCopyBuildCfg PATH ASSETS LIBS BUILD_TYPE)
    generateBuildCfg(
        ${PATH}
        "src"
        "${ASSETS}"
        "${LIBS}"
        ${BUILD_TYPE}
        FALSE
    )

    generateBuildCfg(
        ${PATH}
        ${outputmod}
        "${ASSETS}"
        "${LIBS}"
        ${BUILD_TYPE}
        FALSE
    )
endfunction()

function(add_tchainmod NAME PRJ_DIR STS TS MAIN) #dev and libs
    message("compilestvb")
    
    list(TRANSFORM TS PREPEND ${PRJ_DIR}${outputmod}/ OUTPUT_VARIABLE tTS)
    #list(TRANSFORM tTS APPEND ${outputmod}/ OUTPUT_VARIABLE tTS)
    message(${tTS})
    message("${tTS}")
    
    list(TRANSFORM STS PREPEND ${PRJ_DIR}/ OUTPUT_VARIABLE tSTS)
    message(${tSTS})
    message("${tSTS}")
    
    message(lenggggggtgggg)
    list(LENGTH tTS len)
    message(${len})
    math(EXPR len "${len} - 1")
    message(${len})
    
    list(GET tTS 2 DEV)
    list(GET tSTS 2 SDEV)
    
    add_includes(
        ${NAME}
        ${SDEV}/.includes
        ${DEV}/.includes
    )
    
    add_ts(
        ${NAME}
        TYPES PRELOADER LIBS DEV
        SOURCE_DIRS ${tSTS}
        OUTPUT_DIRS ${tTS}
    )
    
    add_main(
        ${NAME}
        ${DEV}
        ${PRJ_DIR}${outputmod}/${MAIN}
    )
endfunction()

macro(getPathsFile JSONFILE) #pseudolegacy with bad design
    file(READ ${JSONFILE} CONTENT)
    getPaths(${CONTENT})
    
    message(dnn)
    message(${DEV})
endmacro()

macro(getPaths JSONCONTENT) #pseudolegacy with bad design
    string(JSON sources GET ${JSONCONTENT} sources)
    string(JSON ln LENGTH ${sources})
    
    string(JSON resources GET ${JSONCONTENT} resources)
    string(JSON ln2 LENGTH ${resources})
    
    string(JSON additional GET ${JSONCONTENT} additional)
    string(JSON ln3 LENGTH ${additional})
    
    message(${ln})

    set(lna 1)
    math(EXPR lna "${ln} - 1")

    set(lna2 1)
    math(EXPR lna2 "${ln2} - 1")

    set(lna3 1)
    math(EXPR lna2 "${ln3} - 1")
    
    foreach(IDX RANGE ${lna})
        string(JSON sourceinfo GET ${sources} ${IDX})
        
        string(JSON type GET ${sourceinfo} type)
        
        string(JSON source GET ${sourceinfo} source)
        
        message(${source})
        
        message("gum")
        string(LENGTH ${source} lenna)
            
        if(${type} MATCHES main)
            set(type DEV)
            
            string(JSON target GET ${sourceinfo} target)
            set(DEVTARGET ${target})
        elseif(${type} MATCHES library)
            set(type LIBS)
        elseif(${type} MATCHES preloader)
            set(type PRELOADER)
        else()
           continue() 
        endif()
            
        string(SUBSTRING ${source} 4 ${lenna} ${type})
            
        message(${${type}})
    
        set(S${type} ${source})
            
        if(${type} MATCHES "[/][*]$")
            message(matches)
            string(REGEX REPLACE "[/][*]$" "" ${type} ${${type}})
            string(REGEX REPLACE "[/][*]$" "" S${type} ${S${type}})
        endif()
        
        message(${${type}})
        message(${S${type}})
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

    foreach(type IN ITEMS PRELOADER LIBS DEV)
        list(APPEND STS ${S${type}})
        list(APPEND TS ${${type}})
        
        #set(TS ${TS} PARENT_SCOPE)
        #set(STS ${STS} PARENT_SCOPE)
    endforeach()

    #message(${STS})

    foreach(IDX RANGE ${lna2})
        string(JSON source GET ${resources} ${IDX})
        
        string(JSON type GET ${source} type)
        string(JSON source GET ${source} path)

        message(${source})
        
        message("gum")
        string(LENGTH ${source} lenna)
        
        if(${type} MATCHES resource_directory)
            set(type RES)
        elseif(${type} MATCHES gui)
            set(type GUI)
        else()
           continue() 
        endif()
        
        #message(${type})
            
        string(SUBSTRING ${source} 4 ${lenna} ${type})
            
        message(${${type}})
            
        set(S${type} ${source})
            
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
    
    set(type ADDIT)
    
    foreach(IDX RANGE ${lna3})
        string(JSON source GET ${additional} ${IDX})
        
        message(${source})
        string(JSON target GET ${source} targetDir)
        string(JSON source GET ${source} source)

        message(${source})
        message(${target})
        
        message("gueedm")
        
        list(APPEND ${type} ${target})
        list(APPEND S${type} ${source})
            
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
    
    message(ddddebilll)
    message(${${type}})
    
    list(REMOVE_AT ${type} 0)
    list(REMOVE_AT S${type} 0)
endmacro()