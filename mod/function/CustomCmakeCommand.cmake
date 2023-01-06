function(add_custom_cmake_command) #less functional, no work!
    set(options)
    set(oneValueArgs "COMMAND; OUTPUT; COMMENT")
    set(multiValueArgs "DEPENDS")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        A
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )

    add_custom_command(
        COMMAND ${CMAKE_COMMAND} -P ${COMMAND}
        OUTPUT ${A_OUTPUT}
        DEPENDS ${A_DEPENDS}
        COMMENT ${A_COMMENT}
        VERBATIM
    )
endfunction()