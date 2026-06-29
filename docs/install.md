# Install

## Prerequisites

- **Docker** and **Git**
- Runs on **Linux**, **macOS**, and **Windows**

## Install plasmactl

`plasmactl` is the CLI for all platform operations.

=== "Linux / macOS"

    ```sh
    curl -sSL https://get.plasma.sh | sh
    ```

=== "Windows"

    Download the latest `plasmactl_windows_amd64.exe` (or `_arm64`) from the
    [releases page](https://github.com/plasmash/plasmactl/releases) and add it to your `PATH`.

The installer detects your OS and architecture and downloads the matching binary from the latest [GitHub release](https://github.com/plasmash/plasmactl/releases).

## Quickstart

```sh
# 1. Scaffold a new platform (platform.yaml + nodes/)
plasmactl platform:create my-platform

# 2. Bring it up on your infrastructure
plasmactl platform:up
```

From here, explore the [CLI reference](cli/index.md) for the full command set, or read [Concepts](concepts.md) to understand packages, models, and components.
