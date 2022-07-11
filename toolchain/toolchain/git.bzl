def inner_git_impl():
    print("f")

inner_git_repository = rule(
    implementation = inner_git_impl,
    attrs = {
        "name": attr.label,
        "build_file": attr.label(allow_files = True),
	"strip_prefix": attr.label,
	"url": attr.label_list(allow_files = True),
    },
    toolchains = ["//inner_toolchain:toolchain_type"],
)