include(${CMAKE_CURRENT_LIST_DIR}/../modFiles/addMain.cmake)

function(createMainFunction SOURCE OUTPUT)
    createMainWithIncludesFile(${SOURCE} ${OUTPUT})
endfunction()

message(${SOURCE})
message(${OUTPUT})

createMainFunction(${SOURCE} ${OUTPUT}) #-D