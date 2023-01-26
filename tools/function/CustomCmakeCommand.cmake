function(add_custom_cmake_command) #less functional
    set(options)
    set(oneValueArgs "OUTPUT;COMMENT")
    set(multiValueArgs "COMMAND;DEPENDS")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        A
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    message(${A_COMMAND})

    add_custom_command(
        COMMAND ${CMAKE_COMMAND} ${A_COMMAND}
        OUTPUT ${A_OUTPUT}
        DEPENDS ${A_DEPENDS}
        COMMENT ${A_COMMENT}
        VERBATIM
    )
endfunction()