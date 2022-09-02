function (localToolchainProject NAME)
    

    find_package(${CMAKE_CURRENT_SOURCE_DIR}/tp/${name} REQUIRED)
endfunction()