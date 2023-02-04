#include(${CMAKE_CURRENT_LIST_DIR}/../modFiles/addBuildConfig.cmake)

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
            ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/modFiles/build.config.in
            ${PATH}/build.config
            @ONLY
        )
    endif()
endfunction()

message(${SOURCE})
message(${OUTPUT})

generateBuildConfig(${PATH} ${ASSETS} ${LIBS} ${BUILD_TYPE} ${INNER_API} ${REWRITE}) #-D