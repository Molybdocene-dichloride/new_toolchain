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
        message(FATAL_ERROR "size of source and output path not equal")
    endif()
    
    foreach(i RANGE 0 ${ln})
        message(${i})
    
        list(GET PATHS ${i} PATH)
        
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
        
        if(IS_DIRECTORY ${PRJ_DIR}/${SPATH})
            message(brownian)
            file(GLOB_RECURSE sfiles ${PRJ_DIR}/${SPATH}/*)
        
            #message(${sfiles})
            
            foreach(sfile IN LISTS sfiles)
                file(RELATIVE_PATH relfile ${PRJ_DIR}/${SPATH} ${sfile})
                #message(${relfile})
                set(file ${PRJ_DIR}${OUTPUT_DIR}/${PATH}/${relfile})
                
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
endfunction()

function(generateBuildConfig PATH ASSETS LIBS BUILD_TYPE INNER_API REWRITE)
    list(GET ASSETS 0 RESOURCE_PATHp0)
    list(GET ASSETS 1 RESOURCE_PATHp1)
    
    set(RESOURCE_PATH0 \"${RESOURCE_PATHp0}\")
    set(RESOURCE_PATH1 \"${RESOURCE_PATHp1}\")
    set(LIBRARY_PATH \"${LIBS}\")
    
    set(BUILD_TYPE \"${BUILD_TYPE}\") #only develop type currently supported
    set(INNER_API \"${INNER_API}\") #only CoreEngine API currently supported
    
    if(${REWRITE} OR (NOT EXISTS ${PATH}/build.config))
        configure_file(
            ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/build.config.in
            ${PATH}/build.config
            @ONLY
        )
    endif()
endfunction()

function(add_tchainmod NAME PRJ_DIR STS TS MAIN)
    message("add_tchainmod")
    
    list(TRANSFORM TS PREPEND ${PRJ_DIR}${outputmod}/ OUTPUT_VARIABLE tTS)
    message("${tTS}")
    
    list(TRANSFORM STS PREPEND ${PRJ_DIR}/ OUTPUT_VARIABLE tSTS)
    message("${tSTS}")
    
    message(lenggggggtgggg)
    list(LENGTH tTS len)
    math(EXPR len "${len} - 1")
    message(${len})
    
    list(GET tTS 2 DEV)
    list(GET tSTS 2 SDEV)
    
    add_includes(
        ${NAME}
        ${SDEV}/.includes
        ${DEV}/.includes
    )
    
    #foreach(index RANGE 0 tSTS)
        #list(GET tTS ${index} tT)
        #list(GET tSTS ${index} tST)
        add_ts(
            ${NAME}
            #${NAME}_typescript_${type}
            TYPES PRELOADER LIBS DEV
            SOURCE_DIRS ${tSTS}
            OUTPUT_DIRS ${tTS}
        )
    #endforeach()
    
    add_main(
        ${NAME}
        ${DEV}
        ${PRJ_DIR}${outputmod}/${MAIN}
    )
endfunction()

macro(getPathsFile PRJ_DIR JSONFILE)
    file(READ ${JSONFILE} CONTENT)
    getPaths(${PRJ_DIR} ${CONTENT})
    
    message(dnoooon)
endmacro()

macro(getPaths PRJ_DIR JSONCONTENT)
    string(JSON sources GET ${JSONCONTENT} sources)
    string(JSON ln1 LENGTH ${sources})
    message(${ln1})
    math(EXPR ln1 "${ln1} - 1")
    
    message(sources)
    
    foreach(IDX RANGE ${ln1})
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
    endforeach()

    string(JSON resources GET ${JSONCONTENT} resources)
    string(JSON ln2 LENGTH ${resources})
    math(EXPR ln2 "${ln2} - 1")

    message(resources)

    foreach(IDX RANGE ${ln2})
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
    
    string(JSON additional GET ${JSONCONTENT} additional)
    string(JSON ln3 LENGTH ${additional})
    
    math(EXPR ln3 "${ln3} - 1")
    
    message(additional args) #
    set(type ADDIT)
    
    foreach(IDX RANGE ${ln3})
        string(JSON source GET ${additional} ${IDX})
        
        message(${source})
        string(JSON target GET ${source} targetDir)
        string(JSON source GET ${source} source)

        message(${source})
        message(${target})
        
        message("gueedm")
        
        file(GLOB_RECURSE sfiles ${PRJ_DIR}/${source}/*)
        
        if(#[[ISDIRECTORY]] sfiles)
            string(REGEX MATCH "([a-z A-Z 1-9]*)$" supath ${source})
            message(SPATH)
            message(${supath})
        endif()
        
        list(APPEND ${type} ${target}/${supath})
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
    
    message(${type})
    message(S${type})
endmacro()