# Quickstart

From nothing to a running platform in five steps.

## 1. Install the CLI

```sh
curl -sSL https://get.plasma.sh | sh
```

Prerequisites: **Docker** and **Git**. Runs on Linux, macOS, and Windows. See [Install](install.md) for details.

## 2. Scaffold a platform

```sh
plasmactl platform:create my-platform
```

This creates a platform with a `platform.yaml` (configuration constants) and a `nodes/` directory (one file per machine).

## 3. Declare the packages you want

A platform composes one or more [packages](concepts/component-model.md) in `compose.yaml`:

```yaml
name: my-platform
dependencies:
  - name: plasma-core
    source:
      type: git
      ref: main
      url: https://github.com/plasmash/plasma-core.git
```

## 4. Bring it up

```sh
plasmactl platform:up
```

`platform:up` runs the full workflow — **bump → compose → prepare → deploy**. Bringing real infrastructure up takes time (a single application is 15–30 min; a full platform can be hours) — see [Deploying](operate/deploying.md).

## 5. See what you built

```sh
plasmactl platform:graph
```

The graph is the complete, authoritative picture of a platform — nodes, zone allocations, component distribution, and dependencies — in seconds. → [Investigating a platform](operate/investigating.md)

---

Next: understand the model in [Concepts](concepts/index.md), or learn to author components in [Build](build/index.md).
