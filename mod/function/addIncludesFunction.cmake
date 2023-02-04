include(${CMAKE_CURRENT_LIST_DIR}/../modFiles/addIncludes.cmake)

function(createIncludes SOURCE OUTPUT)
    jstotsFile(${SOURCE})
    file(WRITE ${OUTPUT} ${newstr})
endfunction()

message(${SOURCE})
message(${OUTPUT})

createIncludes(${SOURCE} ${OUTPUT}) #-D