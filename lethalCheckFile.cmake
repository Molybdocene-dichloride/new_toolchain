function(fatalIfNotExists dirs)
    foreach(var IN LISTS ${dirs})
        if(NOT EXISTS ${var})
            message(FATAL_ERROR ${var} " no exists")
        endif()
    endforeach()
endfunction()