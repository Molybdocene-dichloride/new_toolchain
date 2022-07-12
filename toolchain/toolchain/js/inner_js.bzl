def inner_js_impl(id, build_file, strip_prefix):
    print("f")

inner_js = rule(
    implementation = inner_js_impl,
    attrs = {
        "name": attr.label,
        "srcs": attr.label_list(allow_files = True),
        "deps": attr.label_list(allow_files = True),
    },
    toolchains = ["//inner_toolchain:toolchain_type"],
)