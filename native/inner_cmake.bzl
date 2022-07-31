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