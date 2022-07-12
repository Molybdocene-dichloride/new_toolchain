def inner_mod_byName_impl(repository_ctx):
    print("getting a icmods mod " + repository_ctx.name)

    #new_local_repository(
        #name = repository_ctx.name,
        #path = "third_party/attr",
        #build_file = repository_ctx.attr.build_file,
    #)

    repository_ctx.execute(
        ["node", "toolchain/toolchain/icmods/icmods.js", "mod_byName", "-b", repository_ctx.attr.build_file, "-s", repository_ctx.attr.strip_prefix],
        quiet = False
    )

def inner_mod_byID_impl(repository_ctx):
    print("getting a icmods mod " + repository_ctx.name)

    repository_ctx.execute(
        ["node", "icmods.js", "mod_byID", "-b", repository_ctx.attr.build_file, "-s", repository_ctx.attr.strip_prefix],
        quiet = False
    )

inner_mod_byName = repository_rule(
    implementation=inner_mod_byName_impl,
    local=True,
    attrs={
        "build_file": attr.label(),
        "strip_prefix": attr.string(),
    }
)

inner_mod_byID = repository_rule(
    implementation=inner_mod_byID_impl,
    local=True,
    attrs={
        "build_file": attr.label(),
        "strip_prefix": attr.string(),
    }
)