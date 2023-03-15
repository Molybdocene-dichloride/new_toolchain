include(${CMAKE_CURRENT_LIST_DIR}/../../tools/function/CustomCmakeCommand.cmake)

function(generateBuildConfig PATH ASSETS LIBS BUILD_TYPE INNER_API REWRITE)
    message("${ASSETS}")
    list(GET ASSETS 0 ASSETS0)
    list(GET ASSETS 1 ASSETS1)
    
    set(RESOURCE_PATH0 \"${ASSETS0}\")
    set(RESOURCE_PATH1 \"${ASSETS1}\")
    set(LIBRARY_PATH \"${LIBS}\")
    
    set(BUILD_TYPE \"${BUILD_TYPE}\") #only develop type currently supported
    set(INNER_API \"${INNER_API}\") #only CoreEngine API currently supported
    
    if(${REWRITE} OR (NOT EXISTS ${PATH}/build.config))
        configure_file(
            ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../modFiles/build.config.in
            ${PATH}/build.config
            @ONLY
        )
    endif()
endfunction()

function(add_build_config NAME PATHY ASSETS LIBS BUILD_TYPE INNER_API REWRITE)
    message(add_build_config)
    message(${PATHY})
    message("${ASSETS}")
    
    list(GET ASSETS 0 ASSETSp0)
    list(GET ASSETS 1 ASSETSp1)
    
    add_custom_cmake_command(
        COMMAND -D PATH=${PATHY} -D ASSETS0=${ASSETSp0} -D ASSETS1=${ASSETSp1}  -D LIBS=${LIBS} -D BUILD_TYPE=${BUILD_TYPE} -D INNER_API=${INNER_API} -D REWRITE=${REWRITE} -P ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../function/addBuildConfigFunction.cmake
        OUTPUT ${PATHY}/build.config #crutch
        DEPENDS ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/build.config.in
        COMMENT "generate build.config"
    )
    message(geeviyiuurru)
    message(${PATHY})
    add_custom_target(
        ${NAME}_buildconfig
        ALL
        SOURCES ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/build.config.in
        DEPENDS ${PATHY}/build.config
        VERBATIM
    )
endfunction()