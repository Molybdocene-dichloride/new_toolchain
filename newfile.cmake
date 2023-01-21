function(newProjectFile NAME TYPE PATH REWRITE)
    #message(WARNING ${CMAKE_CURRENT_FUNCTION_LIST_DIR})
    
    #initial(${PATH} ${CMAKE_CURRENT_FUNCTION_LIST_DIR})
    #backwards(${PATH} ${symbs})
    #file(RELATIVE_PATH relll ${CMAKE_CURRENT_FUNCTION_LIST_DIR} ${symbs})
    #string(APPEND ${backs} ${relll} pathyy)
    
    set(ToolchainDir ${CMAKE_CURRENT_FUNCTION_LIST_DIR})
    
    set(extra_args ${ARGN})
    
    list(LENGTH extra_args extra_count)
    message(${extra_count})
     
    if (${extra_count} GREATER 0)
        list(GET extra_args 0 REWRITE)
        #message(${REWRITE})
    endif()
    message(${PATH})
    message(${TYPE})
    message(mess)
    message(${REWRITE})
    
    if(${TYPE} MATCHES "innercore_toolchain")
        string(APPEND pth ${CMAKE_CURRENT_SOURCE_DIR} "/third_party/Find" ${NAME} ".cmake")
        
        if(REWRITE OR (NOT EXISTS ${pth}))
            configure_file(
                ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/mod/module_sample.cmake.in
                ${pth}
                @ONLY
            )
        endif()
        #message(FATAL_ERROR err)
    elseif(${TYPE} MATCHES "innercore_build_toolchain_list")
        if(REWRITE OR (NOT EXISTS ${PATH}/CMakeLists.txt))
            configure_file(
                ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/mod/cmakelist_sample.cmake.in
                ${PATH}/CMakeLists.txt
                @ONLY
            )
        endif()
    elseif(${TYPE} MATCHES "innercore_build_toolchain_config")
        if(REWRITE OR (NOT EXISTS ${PATH}/${NAME}Config.cmake))
            configure_file(
                ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/mod/module_sample.cmake.in
                ${PATH}/${NAME}Config.cmake
                @ONLY
            )
            endif()
    elseif(${TYPE} MATCHES "innercore_build_toolchain_cist")
        message(jjjjs)
        if(REWRITE OR (NOT EXISTS ${PATH}/CMakeLists.txt))
            configure_file(
                ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/mod/cmakelist_sample.cmake.in
                ${PATH}/CMakeLists.txt
                @ONLY
            )
        endif()
        if(REWRITE OR (NOT EXISTS ${PATH}/${NAME}Config.cmake))
            configure_file(
                ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/mod/module_sample.cmake.in
                ${PATH}/${NAME}Config.cmake
                @ONLY
            )
        endif()
    else()
        message(FATAL_ERROR "TYPE of mod file not implemented: " ${TYPE})
    endif()
endfunction()