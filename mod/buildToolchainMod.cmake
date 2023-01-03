include(${CMAKE_CURRENT_LIST_DIR}/../script/UseTS.cmake)

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

function(add_ts_tchainmod NAME PRJ_DIR SDEV DEV #[[SLIBS LIBS]]) #dev and libs
    message("compilestvb")
    
    jstotsFile(${PRJ_DIR}/${SDEV}/.includes)
    
    file(WRITE ${PRJ_DIR}${outputmod}/${DEV}/.includes ${newstr})
    
    add_ts(
        ${NAME}
        SOURCE_DIRS ${PRJ_DIR}/${SDEV}
        OUTPUT_DIRS ${PRJ_DIR}${outputmod}/${DEV}
    )
    
    #[[add_main(
        ${NAME} main
        @PATH@
        ${outputmod} 
        "${DEV}" 
        ${DEVTARGET}
    )]]
endfunction()

#function(add_ts_library_tchainmod NAME PRJ_DIR DEV #[[LIBS]]) maybe

function(getPathsFile JSONFILE SDEV DEV SLIBS LIBS SRES RES SGUI GUI ADDIT SADDIT DEVTARGET) #pseudolegacy with bad design
    file(READ ${JSONFILE} CONTENT)
    getPaths(${CONTENT} ${SDEV} ${DEV} ${SLIBS} ${LIBS} ${SRES} ${RES} ${SGUI} ${GUI} ${DEVTARGET})
    
    message(dnn)
    message(${DEV})
    
    set(LIBS ${LIBS} PARENT_SCOPE)
    set(SLIBS ${SLIBS} PARENT_SCOPE)
    set(DEV ${DEV} PARENT_SCOPE)
    set(SDEV ${SDEV} PARENT_SCOPE)
    set(RES ${RES} PARENT_SCOPE)
    set(SRES ${SRES} PARENT_SCOPE)
    set(GUI ${GUI} PARENT_SCOPE)
    set(SGUI ${SGUI} PARENT_SCOPE)
    set(ADDIT ${ADDIT} PARENT_SCOPE)
    set(SADDIT ${SADDIT} PARENT_SCOPE)
    
    set(DEVTARGET ${DEVTARGET} PARENT_SCOPE)
endfunction()

function(getPaths JSONCONTENT SDEV DEV SLIBS LIBS SRES RES SGUI GUI DEVTARGET) #pseudolegacy with bad design
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
            set(DEVTARGET ${target} PARENT_SCOPE)
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
        elseif(${type} MATCHES gui)
            set(type GUI)
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
    
    set(${type} "${${type}}" PARENT_SCOPE)
    set(S${type} "${S${type}}" PARENT_SCOPE)
endfunction()

macro(jstotsFile file)
    message(madnessogruikjid)
    file(READ ${file} content)
    jstots(${content})
endmacro()

macro(jstots str)
    STRING(REGEX REPLACE ".ts\n" ".js\n" newstr ${str})
    STRING(REGEX REPLACE ".ts " ".js " newstr ${newstr})
    STRING(REGEX REPLACE "(.ts)$" ".js" newstr ${newstr})
    message(${newstr})
endmacro()

macro(linesFile file)
    file(READ ${file} content)
    lines(${content})
endmacro()

macro(lines str)
    STRING(REGEX REPLACE ";" "\\\\;" strs "${str}")
    STRING(REGEX REPLACE "\n" ";" strs "${str}")

    message("${strs}")
    
    foreach(stra IN LISTS strs)
        if(NOT stra) 
            message(not)
            continue()
        endif()
        
        message(${stra})
        STRING(REGEX MATCH "^[#]" check ${stra})
        if(check) 
            message(${check})
            continue()
        endif()
        
        list(APPEND newstrs ${stra})
    endforeach()
    
    #message("${newstrs}")
endmacro()

function(appendFile file1 file2)
    file(READ ${file2} content2)
    file(APPEND ${file1} ${content2})
    file(APPEND ${file1} "\n")
endfunction()

function(createMain PRJ_DIR OUTPUT_DIR DEV MAIN)
    #file(GLOB_RECURSE files ${PRJ_DIR}${outputmod}/${DEV}/*)
    
    message(${PRJ_DIR}${outputmod}/${MAIN})

    linesFile(${PRJ_DIR}${outputmod}/${DEV}/.includes)
    
    message("${newstrs}")

    foreach(newstr IN LISTS newstrs)
        message(${newstr})

        if(newstr MATCHES "(/[*][*])$" OR newstr MATCHES "(/[*])$")
            STRING(REGEX REPLACE "(/[*])$" "" newstr ${newstr})
            message(${newstr})
            STRING(REGEX REPLACE "(/[*][*])$" "" newstr ${newstr})
            message(${newstr})
            file(GLOB_RECURSE files ${PRJ_DIR}${outputmod}/${DEV}/${newstr}/*)
            foreach(file IN LISTS files)
                appendFile(${PRJ_DIR}${outputmod}/${MAIN}
                    ${file}
                )
            endforeach()
        else()
            appendFile(${PRJ_DIR}${outputmod}/${MAIN} 
                ${PRJ_DIR}${outputmod}/${DEV}/${newstr}
            )
        endif()
    endforeach()
endfunction()