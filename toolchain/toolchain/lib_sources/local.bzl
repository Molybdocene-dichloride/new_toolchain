def inner_local_repository_impl(repository_ctx):
    print("load local " + repository_ctx.name)

    #in_files = ctx.files.srcs
    #output_file = ctx.actions.declare_file(ctx.label.name)
    result = local_repository(
      name = repository_ctx.name,
      path = repository_ctx.attr.path,
      build_file = repository_ctx.attr.build_file,
      strip_prefix = repository_ctx.attr.strip_prefix,
    )

inner_git_repository = repository_rule(
    environ = [],
    implementation = inner_local_repository_impl,
    local=True,
    attrs = {"path": attr.label(), "build_file": attr.label(), "strip_prefix": attr.label()},
)