load("@rules_foreign_cc//foreign_cc:repositories.bzl", "rules_foreign_cc_dependencies")

load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")
#load("@npm//typescript:index.bzl", "tsc") 

def inner_post_dependencies():
    rules_foreign_cc_dependencies()

    build_bazel_rules_nodejs_dependencies()