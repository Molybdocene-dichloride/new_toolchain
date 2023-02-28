function(double_configure_file INPUT OUTPUT) # may less functional
    set(options "@ONLY;COPY_ONLY;ESCAPE_QUOTES")
    set(oneValueArgs "NEWLINE_STYLE")
    set(multiValueArgs "")

    cmake_parse_arguments(
        PARSE_ARGV 0 
        ARG
        "${options}"
        "${oneValueArgs}"
        "${multiValueArgs}"
    )
    message(qorotd)
    if(ARG_COPYONLY)
        message(dddww)
        set(ONLY COPYONLY)
    elseif(ARG_@ONLY)
        message(ddduw)
        set(ONLY @ONLY)
    endif()
    if(ARG_ESCAPE_QUOTES)
        message(ddunm)
        set(EQ ESCAPE_QUOTES)
    endif()
    
  configure_file(
    ${INPUT}
    ${OUTPUT}.pre
    ${ONLY}
    ${EQ}
    ${ARG_NEWLINE_STYLE}
  )

  configure_file(
    ${OUTPUT}.pre
    ${OUTPUT}
    ${ONLY}
    ${EQ}
    ${ARG_NEWLINE_STYLE}
  )

  file(REMOVE ${OUTPUT}.pre)
endfunction()
