# Glossary

Plasma has a compact but precise vocabulary. These terms recur throughout the docs.

## Component model

**Component**
: The unit of everything in Plasma — a single-purpose, reusable, versioned piece living at `src/<layer>/<kind>/<name>/`. Carries metadata and the tasks to build and configure it.

**Function**
: *HOW.* A universal computation that performs one operation with generic parameters. One function serves many use cases.

**Skill**
: *WHAT.* A function configured for a specific use case with concrete parameter values.

**Agent**
: *WHEN.* The event-driven orchestration unit. An agent holds a *repertoire* of skills, embeds its own **trigger** (a channel subscription or a cron schedule), and selects a skill based on the incoming situation. (Formerly: executor + flow.)

**Software**
: *HOW.* A program providing a computational capability (e.g. Postgres, Grafana).

**Service**
: *WHAT.* Software configured for a specific deployment context.

**Application**
: *WHEN.* An orchestration of multiple services into a business capability.

!!! note "The two triads"
    Plasma has two parallel patterns, both **HOW → WHAT → WHEN**: `Function → Skill → Agent` (event-driven logic) and `Software → Service → Application` (infrastructure).

**Entity**
: A digital representation of a real-world thing (Person, Project, Utterance). Defines *what exists*.

**Metric**
: A measurement (Engagement, Sentiment, Risk). Defines *how to measure*.

**Library**
: Reusable code abstracting complex functionality.

## Structure & deployment

**Package**
: A repository of related components bundled for deployment (e.g. `plasma-core`).

**Model**
: A blueprint composing packages into a deployable platform (e.g. `ta`, The Agency).

**Platform**
: A materialized model running on real infrastructure.

**Topology**
: The platform's structural "skeleton" — the arrangement of zones that maps logical architecture to physical resources.

**Zone**
: A unit of the topology (e.g. `platform.cognition.data`). Components **distribute** to zones; nodes **allocate** to zones. Managed with `plasmactl zone`.

**Node**
: A physical or virtual machine providing compute. Allocates to one or more zones.

## Naming & identity

**MRN** (Machine Resource Name)
: A component's full name (e.g. `interaction.applications.dashboards`).

**MRSN / MRK / MRV / MRT**
: Short name · kind · version (git commit hash) · tags.

**MRC** (Machine Resource Channel)
: The channel a component publishes/subscribes on. **The channel IS the situation** — its name encodes both perception and interpretation.

## Patterns

**ECST** (Event-Carried State Transfer)
: Events carry the complete state needed to process them — no back-queries to source systems. The basis of Plasma's loose coupling.

**DIKW**
: The analytics hierarchy the Cognition layer climbs: **D**ata → **I**nformation → **K**nowledge → **W**isdom.

**Ontology**
: Entities + Metrics together — the stable data contract between systems, defined in Protobuf.

**Choreography** (vs central workflows)
: Behavior emerges from channel topology; each agent is its own micro-orchestrator, but no central workflow sequences the agents. There is no central coordinator or external scheduler.

**Bus**
: A layer's message transport, tuned to its semantics (NATS for Integration, Kafka for Cognition, Matrix/Synapse for Conversation).

**Relay**
: The *only* cross-layer coupling point — a Benthos/Bento process moving data between buses with backpressure.

**Trigger**
: What fires an agent: a channel subscription (reactive) or a cron schedule (proactive). Part of the agent, not an external scheduler.

**Situation**
: The interpreted meaning of a channel. Subscribing to a channel resolves both surveillance and situation at design time.

## Lifecycle

**Composition** (`compose.yaml`)
: How a platform declares the packages it depends on; merged by `model:compose`.

**Builder**
: The abstraction that turns a component into a deployable artifact (`application_builder` → K8s manifests, `service_builder` → Docker images, …). Never use raw `docker`/`kubectl`.

**Bump** (`component:bump`)
: Updates component versions to the current git hash and cascades the change through the dependency tree. Always run before pushing.

**`machine_env`**
: The canonical environment discriminator (`dev` / `prod` / `sandbox`), selected at deploy time.
