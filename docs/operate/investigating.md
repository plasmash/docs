# Investigating a platform

There is exactly **one correct way** to understand a running platform: ask the graph. Do not read node files, `compose.yaml`, or `platform.yaml` by hand, and don't go spelunking through directories — those give an incomplete and misleading picture.

```sh
plasmactl platform:graph
```

This returns the complete, authoritative picture — nodes, zone allocations, component distribution, and dependency edges — in seconds.

## The graph command

```sh
# Overview (node counts by kind)
plasmactl platform:graph

# Full graph as JSON, for programmatic analysis
plasmactl platform:graph --json

# A specific node and its dependencies
plasmactl platform:graph "interaction.applications.dashboards"

# Reverse dependencies — what depends on this?
plasmactl platform:graph "foundation.applications.ssot" --reverse

# A Mermaid diagram
plasmactl platform:graph --format mermaid
```

The model behind it — node types and edge types — is described in the [Dependency graph](../reference/graph.md) reference.

## The other investigation commands

```sh
plasmactl platform:check            # validate platform consistency
plasmactl platform:impact <node>    # what's affected by changing this?
plasmactl component:list            # list all components
plasmactl component:query <mrn>     # inspect a specific component
plasmactl platform:variables-check  # find orphan / missing variables
```

`platform:impact` is your blast-radius tool: before changing a component, variable, or zone, see everything that depends on it.

!!! tip "Why not just read the files?"
    A platform's behavior emerges from how packages, zones, nodes, and variables combine — relationships that no single file shows. The graph is the only view that assembles them correctly. Reach for it first, every time.

→ Next: [Debugging](debugging.md).
