include(${CMAKE_CURRENT_LIST_DIR}/../modFiles/addIncludes.cmake)

message(dooo)
message(${SOURCES})
message(${OUTPUT})
message(${TYPE})

createIncludes(${SOURCES} ${OUTPUT} ${TYPE}) #-D