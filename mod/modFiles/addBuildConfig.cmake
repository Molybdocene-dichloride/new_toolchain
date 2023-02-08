function(add_build_config NAME PATH ASSETS LIBS BUILD_TYPE INNER_API REWRITE)
    message(erreto)
    message("${ASSETS}")
    
    list(GET ASSETS 0 RESOURCE_PATHp0)
    list(GET ASSETS 1 RESOURCE_PATHp1)
    
    add_custom_cmake_command(
        COMMAND -DPATH=${PATH} -DASSETS0="${RESOURCE_PATHp0}" -DASSETS1="${RESOURCE_PATHp1}" -DLIBS=${LIBS} -DBUILD_TYPE=${BUILD_TYPE} -DINNER_API=${INNER_API} -DREWRITE=${REWRITE} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../function/addBuildConfigFunction.cmake
        OUTPUT ${PATH}/build.config #crutch
        DEPENDS ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/build.config.in
        COMMENT "generate build.config"
    )
    message(geeviyiuurru)
    message(${PATH})
    
    add_custom_target(
        ${NAME}_buildconfig
        ALL
        SOURCES ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/build.config.in
        DEPENDS ${PATH}/build.config
    )
endfunction()