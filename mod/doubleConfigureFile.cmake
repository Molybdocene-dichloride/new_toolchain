macro(double_configure_file INPUT OUTPUT ) # Less functional
  configure_file(
    ${INPUT}
    ${OUTPUT}.pre
    @ONLY@
  )

  configure_file(
    ${OUTPUT}.pre
    ${OUTPUT}
    @ONLY@
  )

  file(REMOVE ${OUTPUT}.pre)
endmacro()
