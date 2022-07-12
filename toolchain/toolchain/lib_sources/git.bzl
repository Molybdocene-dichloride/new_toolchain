def inner_git_repository_impl(repository_ctx):
    print("load git " + repository_ctx.name)

    #in_files = ctx.files.srcs
    #output_file = ctx.actions.declare_file(ctx.label.name)
    result = git_repository(
      name = repository_ctx.name,
      remote = repository_ctx.attr.url,
      build_file = repository_ctx.attr.build_file,
      strip_prefix = repository_ctx.attr.strip_prefix,
    )

inner_git_repository = repository_rule(
    environ = [],
    implementation = inner_git_repository_impl,
    local=True,
    attrs = {"url": attr.label(), "build_file": attr.label(), "strip_prefix": attr.label()},
)