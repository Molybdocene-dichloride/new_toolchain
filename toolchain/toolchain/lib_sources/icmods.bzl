def inner_mod_byName_impl(repository_ctx):
    print("getting a icmods mod " + repository_ctx.name)

    repository_ctx.execute(
        ["node", "../toolchain/toolchain/icmods/icmods.js", "mod_byName", "-s", repository_ctx.attr.strip_prefix],
        quiet = False
    )

def inner_mod_byID_impl(repository_ctx):
    print("getting a icmods mod " + repository_ctx.name)

    repository_ctx.execute(
        ["node", "../toolchain/toolchain/icmods/icmods.js", "mod_byID", "-s", repository_ctx.attr.strip_prefix],
        quiet = False
    )

inner_mod_byName = repository_rule(
    implementation=inner_mod_byName_impl,
    local=True,
    attrs={
        "strip_prefix": attr.string(),
    }
)

inner_mod_byID = repository_rule(
    implementation=inner_mod_byID_impl,
    local=True,
    attrs={
        "strip_prefix": attr.string(),
    }
)