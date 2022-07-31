InnerInfo = provider(
    fields = ["compiler_path", "system_lib"],
)

def inner_toolchain_impl():
        toolchain_info = platform_common.ToolchainInfo(
            innerinfo = InnerInfo(
                compiler_path = attr.compiler_path,
                system_lib = attr.system_lib,
            ),
        )
        return [toolchain_info]

def inner_toolchain():
    native.toolchain_type(
	    name = "toolchain_type",
	    visibility = ["//visibility:public"],
    )

    inner_toolchain = rule(
        implementation = inner_toolchain_impl,
        attrs = {
            "compiler_path": attr.string(),
            "system_lib": attr.string(),
        },
    )

    inner_toolchain(
        name = "inner",
        compiler_path = "/pa",
        system_lib = "/p",
    )

    native.toolchain(
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

    native.register_toolchains(
        "//inner_toolchain:inner_toolchain",
    )