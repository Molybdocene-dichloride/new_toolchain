function (downloadExternalToolchainProject NAME)
    set(options)  # currently there are no zero value args (aka: options)
    set(oneValueArgs "PATH;GIT-REPO;URL;GIT_TAG")
    set(multiValueArgs STRIP-PREFIX)

    cmake_parse_arguments(
        PARSE_ARGV 0
        External
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    
    message(frgg)
    
    if(External_GIT-REPO)
    #message("ipp")
        execute_process(
            COMMAND node ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/external.js git ${External_GIT-REPO} -d ${External_PATH} -s ${External_STRIP-PREFIX} -n ${NAME}
            RESULT_VARIABLE CMD_ERROR
            ERROR_VARIABLE outb
        )
        message(${CMD_ERROR})
        if(outb)
            message(${outb})
        endif()
    elseif(External_URL)
        execute_process(
            COMMAND node ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/external.js remote ${External_URL} -d ${External_PATH} -s ${External_STRIP-PREFIX} -n ${NAME}
            RESULT_VARIABLE CMD_ERROR
            ERROR_VARIABLE outb
        )
        message(node ${CMAKE_CURRENT_FUNCTION_LIST_DIR}/external.js remote ${External_URL} -d ${External_PATH} -s ${External_STRIP-PREFIX} -n ${External_PRJ_NAME})
        message(${CMD_ERROR})
        #message(${outb})
        message(zuk)
    else()
        message(FATAL_ERROR Git or URL no exists)
    endif()
    
    foreach(j IN LISTS ${STRIP_PREFIX})
        message(${j})
    endforeach()
    
endfunction()