include(${CMAKE_CURRENT_LIST_DIR}/../modFiles/addMain.cmake)

message(${SOURCE})
message(${OUTPUT})
message(${INCLUDES})

createMainFunction(${INCLUDES} ${SOURCE} ${OUTPUT}) #-D