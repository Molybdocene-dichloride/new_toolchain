include(${CMAKE_CURRENT_LIST_DIR}/../modFiles/addAssets.cmake)

message(${PATH})
message(${SPATHS})

copyAssets(${SPATHS} ${PATH} ${REWRITE}) #-D