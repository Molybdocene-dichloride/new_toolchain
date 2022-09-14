function(new_project_file NAME TYPE PATH REWRITE)
    message(WARNING ${CMAKE_CURRENT_FUNCTION_LIST_DIR})
    if(${TYPE} MATCHES "innercore_toolchain")
        string(APPEND pth ${CMAKE_CURRENT_SOURCE_DIR} "/third_party/Find" ${NAME} ".cmake")
        message(INFO ${pth})
        if(${REWRITE} OR (NOT EXISTS ${pth}))
            configure_file(
                ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/module_sample.cmake.in
                ${pth}
                @ONLY
            )
        endif()
        #message(FATAL_ERROR err)
    elseif(${TYPE} MATCHES "innercore_build_toolchain_list")
        if(${REWRITE} OR (NOT EXISTS ${PATH}/CMakeLists.txt))
            configure_file(
                ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/cmakelist_sample.cmake.in
                ${PATH}/CMakeLists.txt
                @ONLY
            )
        endif()
    elseif(${TYPE} MATCHES "innercore_build_toolchain_config")
        if(${REWRITE} OR (NOT EXISTS ${PATH}/${NAME}"Config.cmake"))
            configure_file(
                ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/moduleconfig_sample.cmake.in
                ${PATH}/${NAME}"Config.cmake"
                @ONLY
            )
            endif()
    else()
        message(FATAL_ERROR "TYPE not implemented: " ${TYPE})
    endif()
endfunction()

