include(CMakeLanguageInformation)

if(NOT CMAKE_TS_COMPILE_OBJECT)
    set(CMAKE_TS_COMPILE_OBJECT 
        "<CMAKE_TS_COMPILER> --project <JSON_PROJECT> <SOURCE> --outFiles <OBJECT>"
)   
endif()