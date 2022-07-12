#inner_cc_import = rule(
#    implementation = inner_cc_import_impl,
#    attrs = {
#        "name": attr.label,
#        "hdrs": attr.label_list(allow_files = True),
#        "deps": attr.label_list(allow_files = True),
#   },
#    toolchains = ["//inner_toolchain:toolchain_type"],
#)