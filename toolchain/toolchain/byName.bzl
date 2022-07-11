def inner_mod2_impl():
    print("f")

inner_mod_byName = rule(
    implementation = inner_mod2_impl,
    attrs = {
        "name": attr.label,
        "build_file": attr.label(allow_files = True),
	"strip_prefix": attr.label,
    },
    toolchains = ["//inner_toolchain:toolchain_type"],
)