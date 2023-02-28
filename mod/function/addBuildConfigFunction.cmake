#include(${CMAKE_CURRENT_LIST_DIR}/../modFiles/addBuildConfig.cmake)

message(${PATH})
message("${ASSETS0}")
message("${ASSETS1}")
message(${LIBS})
message(${BUILD_TYPE})
message(${INNER_API})
message(${REWRITE})

generateBuildConfig(${PATH} "${ASSETS0};${ASSETS1}" ${LIBS} ${BUILD_TYPE} ${INNER_API} ${REWRITE}) #-D