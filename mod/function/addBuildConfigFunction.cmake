#include(${CMAKE_CURRENT_LIST_DIR}/../modFiles/addBuildConfig.cmake)

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

message(${PATH})
message("${ASSETS0}")
message("${ASSETS1}")
message(${LIBS})
message(${BUILD_TYPE})
message(${INNER_API})
message(${REWRITE})

generateBuildConfig(${PATH} "${ASSETS0};${ASSETS1}" ${LIBS} ${BUILD_TYPE} ${INNER_API} ${REWRITE}) #-D