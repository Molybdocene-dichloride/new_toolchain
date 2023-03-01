macro(jstotsFile file)
    message(madnessogruikjid)
    file(READ ${file} content)
    jstots(${content})
endmacro()

macro(jstots str)
    STRING(REGEX REPLACE ".ts\n" ".js\n" output ${str})
    STRING(REGEX REPLACE ".ts " ".js " output ${output})
    STRING(REGEX REPLACE "(.ts)$" ".js" output ${output})
    message(${output})
endmacro()