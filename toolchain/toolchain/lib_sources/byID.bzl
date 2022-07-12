def inner_mod_byID_impl(repository_ctx):
    print("load inner mod by name as package" + repository_ctx.name)

    result = repository_ctx.execute(
        arguments = ["node", "icmods.js", "mod_byID", repository_ctx.attr.url],
        quiet=False,
    )

inner_mod_byID = repository_rule(
    environ = [],
    implementation = inner_mod_byID_impl,
    local=True,
    attrs = {"build_file": attr.label(), "strip_prefix": attr.label()},
)