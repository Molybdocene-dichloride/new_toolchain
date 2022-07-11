def inner_mod_byID(id, build_file, strip_prefix):
    print("f")

#inner_js = rule(
#    implementation = inner_js_impl,
#    attrs = {
#        "name": attr.label,
#        "srcs": attr.label_list(allow_files = True),
#        "deps": attr.label_list(allow_files = True),
#    },
#    toolchains = ["//inner_toolchain:toolchain_type"],
#)

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

#inner_cc_import = rule(
#    implementation = inner_cc_import_impl,
#    attrs = {
#        "name": attr.label,
#        "hdrs": attr.label_list(allow_files = True),
#        "deps": attr.label_list(allow_files = True),
#   },
#    toolchains = ["//inner_toolchain:toolchain_type"],
#)

#inner_cmake = rule(
#    implementation = inner_cmake_impl,
#    attrs = {
#        "name": attr.label,
#        "cmake_options": attr.label_list,
#	"generate_crosstool_file": attr.bool,
#	"lib_source": attr.label(allow_files = True),
#        "make_commands": attr.label_list(allow_files = True),
#	"visibility": attr.label_list,
#	"out_lib_dir": attr.label(allow_files = True),
#	"library": attr.label(allow_files = True),
#    },
#    toolchains = ["//inner_toolchain:toolchain_type"],
#)