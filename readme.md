# new_toolchain

Inner Core toolchain based on Bazel

## Requirements

1 npm modules icmodsapi, commander, node-stream-zip
2 bazel modules build_bazel_rules_nodejs, ts, rules_foreign_cc (Optional)

## Capabilities

1 Load icmods from local and icmods.mineprogramming site properly
2 compile by properly compiler

repository_rules creates packages in directory and then necesary call local_repository.
Load icmods very tricky and haves high risk of failure. Toolchain repos slighty few.
