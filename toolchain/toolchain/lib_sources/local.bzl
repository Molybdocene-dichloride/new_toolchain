def inner_local_impl():
    print("getting a mod local repository " + repository_ctx.name)

    repository_ctx.extract(repository_ctx.attr.src)
    #repository_ctx.file("BUILD.bazel", repository_ctx.read(repository_ctx.attr.build_file))

inner_local_repository = rule(
    implementation = inner_local_impl,
    attrs = {
        "name": attr.label(),
        "build_file": attr.label(allow_files = True),
	    "path": attr.label(allow_files = True),
    },
    toolchains = ["//inner_toolchain:toolchain_type"],
)