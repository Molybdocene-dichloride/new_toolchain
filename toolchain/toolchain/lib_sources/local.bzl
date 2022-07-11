def inner_local_impl():
    print("f")

inner_local_repository = rule(
    implementation = inner_local_impl,
    attrs = {
        "name": attr.label(),
        "build_file": attr.label(allow_files = True),
	    "path": attr.label(allow_files = True),
    },
    toolchains = ["//inner_toolchain:toolchain_type"],
)