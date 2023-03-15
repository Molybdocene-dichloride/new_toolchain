function(add_custom_cmake_command) #may less functional
    set(options "VERBATIM;APPEND;USES_TERMINAL;COMMAND_EXPAND_LISTS")
    set(oneValueArgs "MAIN_DEPENDENCY;OUTPUT;COMMENT;DEPFILE;WORKING_DIRECTORY")
    set(multiValueArgs "COMMAND;DEPENDS;BYPRODUCTS;IMPLICIT_DEPENDS")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        ARG
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    message(add_custom_cmake_command)
    if(ARG_VERBATIM)
        message(dddww)
        set(VERBATIM VERBATIM)
    elseif(ARG_APPEND)
        message(ddduw)
        set(APPEND APPEND)
    endif()
    if(ARG_USES_TERMINAL)
        message(ddunm)
        set(USES_TERMINAL USES_TERMINAL)
    endif()
    if(ARG_COMMAND_EXPAND_LISTS)
        message(COMMAND_EXPAND_LISTS)
        set(COMMAND_EXPAND_LISTS COMMAND_EXPAND_LISTS)
    endif()
    
    message("${ARG_COMMAND}")
    message("${ARG_DEPENDS}")
    message(${ARG_OUTPUT})
    message(${CMAKE_COMMAND})

    add_custom_command(
        COMMAND ${CMAKE_COMMAND} #[[-S ${CMAKE_SOURCE_DIR} -B ${CMAKE_BINARY_DIR}]] ${ARG_COMMAND}
        OUTPUT ${ARG_OUTPUT}
        DEPENDS ${ARG_DEPENDS}
        #[[BYPRODUCTS ${ARG_BYPRODUCTS}
        IMPLICIT_DEPENDS ${ARG_IMPLICIT_DEPENDS}
        MAIN_DEPENDENCY ${ARG_MAIN_DEPENDENCY}
        WORKING_DIRECTORY ${ARG_WORKING_DIRECTORY}]]
        COMMENT ${ARG_COMMENT}
        #[[DEPFILE ${ARG_DEPFILE}]]
        ${VERBATIM}
        #[[${APPEND}
        ${USES_TERMINAL}
        ${COMMAND_EXPAND_LISTS}]]
    )
endfunction()