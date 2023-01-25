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

function(add_tchainmod NAME PRJ_DIR TYPES STS TS MAIN)
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
    
    #[[list(LENGTH tSTS ln)
    math(EXPR len "${len} - 1")
    message(${len})
    foreach(index RANGE O ${ln})
        list(GET tSTS ${index} sourceDir)
    
        if(NOT EXISTS ${sourceDir})
            continue()
        endif()
    
        list(GET tTS ${index} tT)
        list(GET tSTS ${index} tST)]]
        add_js(
            ${NAME}
            TYPES ${TYPES}
            SOURCE_DIRS ${tSTS}
            OUTPUT_DIRS ${tTS}
        )
    #endforeach()
    
    list(LENGTH TYPES ln)
    math(EXPR ln "${ln} - 1")
    message(${ln})
    foreach(index RANGE 0 ${ln})
        list(GET tSTS ${index} sourceDir)
    
        if(NOT EXISTS ${sourceDir})
            continue()
        endif()
    
        list(GET TYPES ${index} TYPE)
        targetTSOptions(${NAME}_${TYPE} ${options})
    endforeach()
    
    add_main(
        ${NAME}
        ${DEV}
        ${PRJ_DIR}${outputmod}/${MAIN}
    )
endfunction()

macro(getInfoFile PREFIX PRJ_DIR JSONFILE)
    file(READ ${JSONFILE} CONTENT)
    getInfo(${PREFIX} ${CONTENT})
    
    message(dnoooon)
endmacro()

macro(getPathsFile PREFIX PRJ_DIR JSONFILE)
    file(READ ${JSONFILE} CONTENT)
    getPaths(${PREFIX} ${CONTENT})
    
    message(dnoooon)
endmacro()

macro(getInfo PREFIX JSONCONTENT)
  string(JSON ${PREFIX}_NAME GET ${JSONCONTENT} global.info.name)
  string(JSON ${PREFIX}_VERSION GET ${JSONCONTENT} global.info.version)
  string(JSON ${PREFIX}_AUTHOR GET ${JSONCONTENT} global.info.author)
  string(JSON ${PREFIX}_DESCRIPTION GET ${JSONCONTENT} global.info.description)
  string(JSON ${PREFIX}_ICON GET ${JSONCONTENT} global.info.icon)
  string(JSON ${PREFIX}_INNER_API GET ${JSONCONTENT} global.api)
endmacro()

macro(getPaths PREFIX JSONCONTENT)
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
            set(${PREFIX}_DEVTARGET ${target})
        elseif(${type} MATCHES library)
            set(type LIBS)
        elseif(${type} MATCHES preloader)
            set(type PRELOADER)
        else()
           continue() 
        endif()
            
        string(SUBSTRING ${source} 4 ${lenna} ${PREFIX}_${type})
            
        message(${${PREFIX}_${type}})
    
        set(${PREFIX}_S${type} ${source})
            
        if(${type} MATCHES "[/][*]$")
            message(matches)
            string(REGEX REPLACE "[/][*]$" "" ${PREFIX}_${type} ${${PREFIX}_${type}})
            string(REGEX REPLACE "[/][*]$" "" ${PREFIX}_S${type} ${${PREFIX}_S${type}})
        endif()
        
        message(${${PREFIX}_${type}})
        message(${${PREFIX}_S${type}})
        #fatalIfNotExists(${PREFIX}_${type})
        find_path(
            ${PREFIX}_${type}
            #NAMES mypac
	        PATHS @PATH@${${PREFIX}_${type}}
	        PATH_SUFFIXES ${source}
	        REQUIRED
            NO_CACHE
        )
        #break()
    endforeach()

    foreach(type IN ITEMS PRELOADER LIBS DEV)
        list(APPEND ${PREFIX}_STS ${${PREFIX}_S${type}})
        list(APPEND ${PREFIX}_TS ${${PREFIX}_${type}})
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
            
        string(SUBSTRING ${source} 4 ${lenna} ${PREFIX}_${type})
            
        message(${${PREFIX}_${type}})
            
        set(${PREFIX}_S${type} ${source})
            
        #fatalIfNotExists(${PREFIX}_${type})
        
        find_path(
            ${PREFIX}_${type}
            #NAMES mypac
	        PATHS @PATH@${${PREFIX}_${type}}
	        PATH_SUFFIXES ${source}
	        REQUIRED
            NO_CACHE
        )
    endforeach()
    
    string(JSON compiletyp ERROR_VARIABLE errv TYPE ${JSONCONTENT} compile)
    #message( ${compiletyp})
    
    if(NOT ${compiletyp} MATCHES "(NOTFOUND)$")
        string(JSON compile GET ${JSONCONTENT} compile)
        string(JSON ln3 LENGTH ${compile})
    
        math(EXPR ln3 "${ln3} - 1")
    
        message(compile) #
    
        foreach(IDX RANGE ${ln3})
            string(JSON source GET ${compile} ${IDX})
        
            message(${source})

            string(JSON source GET ${source} source)
            string(JSON target GET ${source} src/${source})

            string(JSON type GET ${source} type)

            if(type MATCHES java)
                set(type COMPILEJAVA)
            elseif(type MATCHES native)
                set(type COMPILENATIVE)
            else()
                message(WARNING ${type} not supported)
                continue()
            endif()
        
            message(${source})
            message(${target})
        
            message("gueedm")
            
            if(${type} MATCHES "[/][*]$")
                message(matches)
                string(REGEX REPLACE "[/][*]$" "" ${source} ${${source}})
                string(REGEX REPLACE "[/][*]$" "" ${target} ${${target}})
            endif()
        
            list(APPEND ${PREFIX}_${type} ${target})
            list(APPEND ${PREFIX}_S${type} ${source})
            
            #fatalIfNotExists(${PREFIX}_${type})
        
            find_path(
                ${PREFIX}_${type}
                #NAMES mypac
	            PATHS @PATH@${${PREFIX}_${type}}
	            PATH_SUFFIXES ${source}
	            REQUIRED
                NO_CACHE
            )
        endforeach()
    endif()
     
    string(JSON additional GET ${JSONCONTENT} additional)
    string(JSON ln4 LENGTH ${additional})
    
    math(EXPR ln4 "${ln4} - 1")
    
    message(additional args) #
    set(type ADDIT)
    
    foreach(IDX RANGE ${ln4})
        string(JSON source GET ${additional} ${IDX})
        
        message(${source})
        string(JSON target GET ${source} targetDir)
        string(JSON source GET ${source} source)

        message(${source})
        message(${target})
        
        message("gueedm")
        
        if(IS_DIRECTORY sfiles)
            string(REGEX MATCH "([a-z A-Z 1-9]*)$" supath ${source})
            message(SPATH)
            message(${source})
            message(${supath})
        endif()
        
        list(APPEND ${PREFIX}_${type} ${target}/${supath})
        list(APPEND ${PREFIX}_S${type} ${source})
    
        message(typeeew)
        message(${${PREFIX}_S${type}})
        message(${${PREFIX}_${type}})

        #fatalIfNotExists(${PREFIX}_${type})
        
        find_path(
            ${PREFIX}_${type}
            #NAMES mypac
	        PATHS @PATH@${${PREFIX}_${type}}
	        PATH_SUFFIXES ${source}
	        REQUIRED
            NO_CACHE
        )
    endforeach()
    
    message(ddddebilll)
    message(${${PREFIX}_${type}})
endmacro()
