macro(jstotsFile file)
    message(madnessogruikjid)
    file(READ ${file} content)
    jstots(${content})
endmacro()

macro(jstots str)
    STRING(REGEX REPLACE ".ts\n" ".js\n" newstr ${str})
    STRING(REGEX REPLACE ".ts " ".js " newstr ${newstr})
    STRING(REGEX REPLACE "(.ts)$" ".js" newstr ${newstr})
    message(${newstr})
endmacro()