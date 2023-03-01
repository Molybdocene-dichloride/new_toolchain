include(${CMAKE_CURRENT_LIST_DIR}/../modFiles/addAssets.cmake)

message(${OUTPUT_DIR})
message(${SPATHS})

createAssetsFunction(${SPATHS} ${PATH} ${REWRITE}) #-D