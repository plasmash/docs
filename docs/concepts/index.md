# Concepts

Plasma is a **digital nervous system** for an organization: it senses what's happening, processes it intelligently, and responds — in real time, from infrastructure to dashboard.

This section explains *how it's built* and *why*. If you only read one thing, read this page.

## One idea, everywhere: HOW → WHAT → WHEN

Almost everything in Plasma composes along the same three-layer pattern, expressed twice:

| Pattern | HOW (computation) | WHAT (configuration) | WHEN (orchestration) |
|---|---|---|---|
| **Event-driven logic** | Function | Skill | **Agent** |
| **Infrastructure** | Software | Service | **Application** |

A **function** is a generic computation; a **skill** configures it for a use case; an **agent** decides *when* it runs and holds a repertoire of skills. The same shape governs software → service → application. Learn it once, read the whole platform. → [Component model](component-model.md)

## Choreography, not workflows

An agent orchestrates its *own* skills — but no central **workflow** sequences the agents. There is no Airflow, no DAG to maintain, no central scheduler. Each **agent embeds its own trigger** (a channel subscription or a cron expression) and selects a skill from the incoming **situation** — which is simply the channel it's listening on. Behavior emerges from **channel topology**. → [Choreography & channels](choreography.md)

## Layers with their own buses

Plasma is organized into specialized **layers**, each with a message **bus** tuned to its semantics (NATS, Kafka, Matrix). Layers never share a bus — the only cross-layer coupling is an explicit **relay** with backpressure. → [Architecture & layers](architecture.md) · [Core patterns](patterns.md)

## A digital organism

The point of all this isn't a stack of services — it's a **living system**. Plasma is built to behave like an organism: it takes in what's happening, makes sense of it, acts, and keeps itself in balance — continuously, and on its own.

- **It perceives.** Foundation and Integration take in the world — events, metrics, signals — and carry complete state ([ECST](patterns.md#ecst-event-carried-state-transfer)).
- **It understands.** Cognition turns raw data into knowledge and wisdom ([DIKW](patterns.md#dikw-the-analytics-hierarchy)).
- **It acts.** Agents fire on the situations they care about and choose how to respond — no central brain issuing orders.
- **It communicates.** Conversation and Interaction speak to people and to other systems.
- **It self-regulates.** Stabilization (emerging) watches its own health and nudges the whole system back toward a balanced state — **homeostasis**.

And like any organism, **no single organ is in charge**. Behavior emerges from how the parts are wired together — the way reflexes and nerve signals coordinate a body with no conductor. That's why Plasma is choreographed, not run from a [central workflow](choreography.md).

## In this section

- [**Architecture & layers**](architecture.md) — the specialized layers and how they depend on each other
- [**Component model**](component-model.md) — components, the two triads, packages, models, platforms
- [**Choreography & channels**](choreography.md) — triggers, the grammar of action, join vs divide
- [**Core patterns**](patterns.md) — ECST, DIKW, bus-per-layer, ontology as contract
- [**Topology & nodes**](topology.md) — zones, allocation, mapping logical to physical

New to the vocabulary? Keep the [Glossary](../reference/glossary.md) open.
