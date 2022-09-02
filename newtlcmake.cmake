#message(WARNING ${CMAKE_CURRENT_FUNCTION_LIST_DIR})
function(newcmfile NAME TYPE PATH)
    message(WARNING ${CMAKE_CURRENT_FUNCTION_LIST_DIR})
    if(${TYPE} MATCHES "headers")
        string(APPEND pth ${CMAKE_CURRENT_SOURCE_DIR} "/third_party/Find" ${NAME} ".cmake")
        message(INFO ${pth})
        configure_file(
            ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/module_sample.cmake.in
           ${pth}
            @ONLY
        )
        
        #message(FATAL_ERROR err)
    elseif(${TYPE} MATCHES "compilion")
        configure_file(
            ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/cmakelist_sample.cmake.in
            ${PATH}/CMakeLists.txt
            @ONLY
        )
        create_cfg()
        
    else()
        message(FATAL_ERROR "TYPE not supported: " ${TYPE})
    endif()
endfunction()

