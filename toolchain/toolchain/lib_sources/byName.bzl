def _impl(repository_ctx):
    print("dfdf")

    native.new_local_repository(
        name = repository_ctx.name,
        path = "third_party/attr",
        build_file = repository_ctx.attr.build_file,
    )

inner_mod_byName = repository_rule(
    implementation=_impl,
    local=True,
    attrs={
        "build_file": attr.label(),
        "strip_prefix": attr.string(),
    },
)