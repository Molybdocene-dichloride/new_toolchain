def inner_cc_library_impl(id, build_file, strip_prefix):
    print("f")

#inner_cc_library = rule(
#    implementation = inner_cc_library_impl,
#    attrs = {
#       "name": attr.label,
#	"lang": attr.label,
#	"type": attr.bool,
#	"hdrs": attr.label_list(allow_files = True),
#       "srcs": attr.label_list(allow_files = True),
#        "deps": attr.label_list(allow_files = True),
#    },
#    toolchains = ["//inner_toolchain:toolchain_type"],
#)