function(appendFile file1 file2)
    file(READ ${file2} content2)
    file(APPEND ${file1} ${content2})
    file(APPEND ${file1} "\n")
endfunction()

function(appendFileStr file1 content2)
    file(APPEND ${file1} ${content2})
    file(APPEND ${file1} "\n")
endfunction()