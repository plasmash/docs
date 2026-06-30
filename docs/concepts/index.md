# Concepts

Plasma is a **digital nervous system** for an organization: it senses what's happening, processes it intelligently, and responds — in real time, from infrastructure to dashboard.

This section explains *how it's built* and *why*. If you only read one thing, read this page.

## One idea, everywhere: HOW → WHAT → WHEN/WHY

Almost everything in Plasma composes along the same three-layer pattern, expressed twice:

| Pattern | HOW (computation) | WHAT (configuration) | WHEN/WHY (orchestration) |
|---|---|---|---|
| **Event-driven logic** | Function | Skill | **Agent** |
| **Infrastructure** | Software | Service | **Application** |

A **function** is a generic computation; a **skill** configures it for a use case; an **agent** decides *when* it runs and holds a repertoire of skills. The same shape governs software → service → application. Learn it once, read the whole platform. → [Component model](component-model.md)

## Choreography, not orchestration

There is no Airflow, no central scheduler. Each **agent embeds its own trigger** (a channel subscription or a cron expression) and selects a skill from the incoming **situation** — which is simply the channel it's listening on. Behavior emerges from **channel topology**. → [Choreography & channels](choreography.md)

## Layers with their own buses

Plasma is organized into specialized **layers**, each with a message **bus** tuned to its semantics (NATS, Kafka, Matrix). Layers never share a bus — the only cross-layer coupling is an explicit **relay** with backpressure. → [Architecture & layers](architecture.md) · [Core patterns](patterns.md)

## A biological analogy

If it helps to hold the whole thing in your head:

| Plasma | Body |
|---|---|
| Topology (skeleton), Nodes (bones) | structure |
| Applications (organs), Services (tissues), Software (cells) | execution |
| Agents (nerve signals), Skills (reflexes), Functions (neurons) | intelligence |
| Integration (spinal cord), Foundation (circulatory), Cognition (brain), Conversation (speech & hearing), Interaction (senses), Stabilization (homeostasis) | layers |

## In this section

- [**Architecture & layers**](architecture.md) — the specialized layers and how they depend on each other
- [**Component model**](component-model.md) — components, the two triads, packages, models, platforms
- [**Choreography & channels**](choreography.md) — triggers, the grammar of action, join vs divide
- [**Core patterns**](patterns.md) — ECST, DIKW, bus-per-layer, ontology as contract
- [**Topology & nodes**](topology.md) — zones, allocation, mapping logical to physical

New to the vocabulary? Keep the [Glossary](../reference/glossary.md) open.
