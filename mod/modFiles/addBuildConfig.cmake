function(add_build_config PATH ASSETS LIBS BUILD_TYPE INNER_API REWRITE)
    add_custom_cmake_command(
        COMMAND -DPATH=${PATH} -DASSETS=${ASSETS} -DLIBS=${LIBS} -DBUILD_TYPE=${BUILD_TYPE} -DINNER_API=${INNER_API} -DREWRITE=${REWRITE} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/function/addBuildConfigFunction.cmake
        OUTPUT ${PATH}/build.config #crutch
        DEPENDS ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../modFiles/build.config.in
        COMMENT "generate .includes"
    )
    message(geeviyiuurru)
    message(${PATH})
    
    add_custom_target(
        ${NAME}_includes
        ALL
        SOURCES ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../modFiles/build.config.in
        DEPENDS ${PATH}/build.config
    )
endfunction()