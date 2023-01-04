function(createMainFunction PRJ_DIR OUTPUT_DIR DEV MAIN)
    createMain(${PRJ_DIR} ${OUTPUT_DIR} ${DEV} ${MAIN})
endfunction()

createMainFunction(${PRJ_DIR} ${OUTPUT_DIR} ${DEV} ${MAIN}) #-D