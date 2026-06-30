# MCP server

Plasma ships an **MCP (Model Context Protocol) server** so AI assistants can query live platform data — communication, people, projects — and act on it.

## What it is

A Go-based **SSE** server that connects to platform data and exposes it over MCP. Its endpoint follows the platform's domain:

```
https://talk.<platform>.<domain>/sse
```

## What it exposes

The server surfaces **Trino** queries over the platform's data:

- **Utterances** — communication messages with metadata
- **Conversation statistics** — hourly aggregations
- **Person data** — profiles and activity
- **Project artifacts** — development metadata
- **Contribution recommendations** — AI-suggested actions

## Connecting an AI client

For an MCP-capable assistant, add the server as an SSE transport:

```sh
claude mcp add --transport sse <platform> \
  https://talk.<domain>/sse \
  --header "Authorization: Basic <base64 of login:password>"
```

## Use cases

- Query live platform data during development
- Analyze communication patterns
- Generate reports from real data
- AI-assisted platform operations

→ See also [Automation & structured output](automation.md) for driving `plasmactl` itself.
