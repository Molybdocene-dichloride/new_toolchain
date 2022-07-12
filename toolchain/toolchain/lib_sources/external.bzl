load("@bazel_tools//tools/build_defs/repo:git.bzl", "http_archive")

def new_inner_git_repository_impl(repository_ctx):
    print("getting a icmods mod " + repository_ctx.name)

    new_git_repository(

    )
    

def new_inner_archive_repository_impl(repository_ctx):
    print("getting a icmods mod " + repository_ctx.name)

    new_archive_repository(
        
    )

def inner_git_repository_impl(repository_ctx):
    print("getting a icmods mod " + repository_ctx.name)

    git_repository(

    )
    

def inner_archive_repository_impl(repository_ctx):
    print("getting a icmods mod " + repository_ctx.name)

    archive_repository(
        
    )

inner_git_repository = repository_rule(
    implementation=inner_git_repository_impl,
    local=True,
    attrs={
        "build_file": attr.label(),
        "strip_prefix": attr.string(),
    },
)

inner_archive_repository = repository_rule(
    implementation=inner_archive_repository_impl,
    local=True,
    attrs={
        "build_file": attr.label(),
        "strip_prefix": attr.string(),
    },
)