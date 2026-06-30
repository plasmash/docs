# Automation & structured output

`plasmactl` is built for automation as much as for humans. Every command can emit machine-readable output, and the platform's graph is queryable, so you can drive Plasma from scripts, CI, and AI agents.

## Structured output

Any command can return JSON or YAML:

```sh
plasmactl <command> --json
plasmactl <command> --yaml
```

This makes command results parseable instead of scraped.

## Result schemas

Each action declares the **shape** of its result in `action.yaml`, so structured output is typed and stable:

```yaml
result:
  type: object
  properties:
    components:
      type: array
      items:
        type: object
        properties:
          name:    { type: string }
          version: { type: string }
```

## Native plugin vs package action

Two kinds of command, by where the logic lives:

| | Native Go plugin (`plasmactl-*`) | Package-defined action (`src/platform/actions/`) |
|---|---|---|
| **For** | Platform lifecycle (compose, prepare, deploy, bump), graph/impact | Domain operations (schema generation, data/event bus) |
| **Needs** | Go internals, cross-package reach | Package-specific tooling (Python, protoc) |
| **Evolves with** | the CLI | the package |

**Rule of thumb:** orchestrates the platform lifecycle or needs Go internals → native plugin. Operates on package content or needs package tooling → package action.

## Build on the graph

The [dependency graph](../reference/graph.md) is the richest automation surface: query it as JSON, run impact analysis before a change, or feed it to an agent for AI-assisted operations.

→ For querying live *data* (not the platform structure), see the [MCP server](mcp.md).
