def inner_archive_impl(repository_ctx):
    print("load archive with sources " + repository_ctx.name)

    result = http_archive(
      name = repository_ctx.name,
      urls = repository_ctx.attr.urls,
      build_file = repository_ctx.attr.build_file,
      strip_prefix = repository_ctx.attr.strip_prefix,
    )

inner_archive = repository_rule(
    environ = [],
    implementation = inner_archive_impl,
    local=True,
    attrs = {"urls": attr.label_list(), "build_file": attr.label(), "strip_prefix": attr.label()},
)