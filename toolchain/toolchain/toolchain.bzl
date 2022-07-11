toolchain_type(
	name = "toolchain_type",
	visibility = ["//visibility:public"],
)

InnerInfo = provider(
    fields = ["compiler_path", "system_lib"],
)

def inner_toolchain_impl():
    toolchain_info = platform_common.ToolchainInfo(
        barcinfo = InnerInfo(
            compiler_path = ctx.attr.compiler_path,
            system_lib = ctx.attr.system_lib,
        ),
    )
    return [toolchain_info]


inner_toolchain = rule(
    implementation = inner_toolchain_impl,
    attrs = {
        "compiler_path": attr.string(),
        "system_lib": attr.string(),
    },
)

inner_toolchain(
    name = "inner",
    compiler_path = "/path/to/barc/on/linux",
)

toolchain(
    name = "inner_toolchain",
    exec_compatible_with = [
        "@platforms//os:android",
        "@platforms//cpu:armv7",
    ],
    target_compatible_with = [
        "@platforms//os:android",
        "@platforms//cpu:armv7",
    ],
    toolchain = ":inner",
    toolchain_type = ":toolchain_type",
)