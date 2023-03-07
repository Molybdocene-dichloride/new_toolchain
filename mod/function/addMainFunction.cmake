include(${CMAKE_CURRENT_LIST_DIR}/../modFiles/addMain.cmake)

message(${SOURCES})
message(${OUTPUT})
message(${INCLUDES})

createMain(${SOURCES} ${OUTPUT} ${INCLUDES}) #-D