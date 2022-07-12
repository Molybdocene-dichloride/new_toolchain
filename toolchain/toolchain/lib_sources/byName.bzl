def inner_mod_byName_impl(repository_ctx):
    print("load inner mod by name as package" + repository_ctx.name)

    result = repository_ctx.execute(
        arguments = ["node", "icmods.js", "mod_byName", repository_ctx.attr.url],
        quiet=False,
    )

inner_mod_byName = repository_rule(
    environ = [],
    implementation = inner_mod_byName_impl,
    local=True,
    attrs = {"build_file": attr.label(), "strip_prefix": attr.label()},
)