# Integration patterns

Plasma is designed to exchange data with the outside world — and to move it between layers internally — through a small set of well-defined patterns. The backbone is **ECST** (Event-Carried State Transfer): components publish state changes as events, and consumers react without querying back.

## Pub/Sub messaging

The Integration layer is the platform's central nervous system, built on **NATS** as the event bus. Every layer runs its own bus and exchanges data through explicit **relays**, so there is no central coordinator — behavior emerges from the channel topology.

| Layer bus | Technology | Carries |
|---|---|---|
| Integration | **NATS** | business events (ECST) |
| Cognition | **Kafka** | analytical data streams |
| Conversation | **Matrix / Synapse** | natural-language utterances |

## Connectors

Two complementary tools bring external data in and move it around:

- **Airbyte** — the **`connect`** application ingests from external systems (databases, SaaS APIs, files) using Airbyte's connector catalog, with a **custom Plasma destination** that lands data directly on the platform's bus.
- **Benthos** — lightweight stream processors used as **relays** between layers, providing backpressure so a fast producer can't overwhelm a slower consumer.

Workflow automation (**n8n**) and durable orchestration (**Temporal**) are available in the Interaction layer for connecting steps across systems.

## Unified query

**Trino** provides a single SQL surface across all of a platform's data sources, so you can query the platform as one logical database regardless of where each dataset physically lives. The [MCP server](mcp.md) exposes these queries to AI assistants over SSE.

## APIs & contracts

Plasma treats its **ontology as the contract**. Entities and metrics are defined as **Protobuf** schemas — the `.proto` file *is* the source of truth:

```protobuf
message Person {
  string id = 1 [(is_primary_key) = true];
  string name = 2;
}
```

From those definitions the platform generates **JSON Schema** and registers it in a runtime **schema registry** (Apicurio), so producers and consumers validate against the same, versioned contract.

→ For driving `plasmactl` itself from scripts and CI, see [Automation & structured output](automation.md).
