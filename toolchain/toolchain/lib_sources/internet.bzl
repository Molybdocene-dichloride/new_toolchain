load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository", "new_git_repository")
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

def new_inner_git_repository_impl(repository_ctx):
    print("getting a mod git repository " + repository_ctx.name)

    new_git_repository(

    )
    

def new_inner_archive_repository_impl(repository_ctx):
    print("getting a mod archive" + repository_ctx.name)

    http_archive(
        
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