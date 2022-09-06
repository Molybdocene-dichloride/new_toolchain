#message(WARNING ${CMAKE_CURRENT_FUNCTION_LIST_DIR})
function(new_project_file NAME TYPE PATH)
    message(WARNING ${CMAKE_CURRENT_FUNCTION_LIST_DIR})
    if(${TYPE} MATCHES "innercore_toolchain")
        string(APPEND pth ${CMAKE_CURRENT_SOURCE_DIR} "/third_party/Find" ${NAME} ".cmake")
        message(INFO ${pth})
        configure_file(
            ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/module_sample.cmake.in
           ${pth}
            @ONLY
        )
        #message(FATAL_ERROR err)
    elseif(${TYPE} MATCHES "new_convert_toolchain_list")
        configure_file(
            ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/cmakelist_sample.cmake.in
            ${PATH}/CMakeLists.txt
            @ONLY
        )
    elseif(${TYPE} MATCHES "new_convert_toolchain_config")
        configure_file(
            ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/moduleconfig_sample.cmake.in
            ${PATH}/ ${NAME} "Config.cmake"
            @ONLY
        )
    else()
        message(FATAL_ERROR "TYPE not supported: " ${TYPE})
    endif()
endfunction()

