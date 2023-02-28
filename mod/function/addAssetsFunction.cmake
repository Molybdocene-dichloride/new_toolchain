include(${CMAKE_CURRENT_LIST_DIR}/../modFiles/addAssets.cmake)

message(${OUTPUT_DIR})
message(${SPATHS})

createAssetsFunction(${PRJ_DIR} ${OUTPUT_DIR} ${SPATHS} ${PATH} ${REWRITE}) #-D