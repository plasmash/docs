# Architecture

Plasma is built from **eight specialized layers**. Each has a dedicated purpose and its own message bus, and communicates through explicit relays — behavior emerges from channel topology, not a central coordinator.

| | Layer | Purpose | Representative tech |
|---|---|---|---|
| **Fd** | **Foundation** | Infrastructure and observability — public cloud, private cloud, on-prem, air-gapped | Kubernetes, etcd, Ceph, Flannel |
| **In** | **Integration** | Central hub for all business data exchange | NATS, APIs, serverless |
| **Cg** | **Cognition** | AI/ML, analytics, real-time intelligence processing | Spark, Druid, Trino, Kafka |
| **Cv** | **Conversation** | Natural language processing, chatbots, AI interactions | DeepSeek, Llama, Matrix |
| **Vi** | **Vision** | Computer vision, image recognition, visual perception | — |
| **Au** | **Audition** | Audio processing, speech recognition, acoustic perception | — |
| **Ia** | **Interaction** | Dashboards, visualization, monitoring, external communication | Grafana, Graylog, Prometheus |
| **St** | **Stabilization** | System health monitoring and performance optimization across all layers | — |

## How the layers relate

- **Foundation** provisions and runs everything; **Integration** is the bus every other layer exchanges data through.
- **Cognition**, **Vision**, and **Audition** are the sensing/processing layers — they turn raw signals into intelligence.
- **Conversation** handles natural-language interaction; **Interaction** surfaces state to humans and external systems.
- **Stabilization** observes the whole stack and keeps it healthy.

Each layer is realized as a set of **components** composed into **packages**. See [Concepts](component-model.md) for that model, and the [CLI reference](../cli/index.md) for how to compose and deploy them.
