load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

def inner_dependencies():
    http_archive(
        name = "rules_foreign_cc",
        sha256 = "6041f1374ff32ba711564374ad8e007aef77f71561a7ce784123b9b4b88614fc",
        strip_prefix = "rules_foreign_cc-0.8.0",
        url = "https://github.com/bazelbuild/rules_foreign_cc/archive/0.8.0.tar.gz",
    )

    http_archive(
        name = "build_bazel_rules_nodejs",
        sha256 = "c78216f5be5d451a42275b0b7dc809fb9347e2b04a68f68bad620a2b01f5c774",
        urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.5.2/rules_nodejs-5.5.2.tar.gz"],
    )