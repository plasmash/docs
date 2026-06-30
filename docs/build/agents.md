# Defining agents

Authoring the event-driven side of Plasma means writing three kinds of component: a **function** (the computation), one or more **skills** (configurations), and one or more **agents** (the triggers). The pattern is explained in [Choreography & channels](../concepts/choreography.md); this page is how you build it.

## Function → Skill → Agent

One function serves many use cases through different skills; each agent picks a skill when its trigger fires.

```
Function: integration.functions.washer            # HOW — rubs an abrasive on a surface with detergent
├── Skill: integration.skills.car-wash            # WHAT — chamois + car body + car shampoo
│   └── Agent: integration.agents.car-washing     # WHEN — car returns from countryside
├── Skill: integration.skills.hand-wash           # WHAT — hand skin + hands + soap
│   └── Agent: integration.agents.hand-washing    # WHEN — leaving the bathroom
└── Skill: integration.skills.dish-wash           # WHAT — sponge + dishes + dish soap
    └── Agent: integration.agents.dish-washing    # WHEN — after a meal
```

A **function** declares generic, reusable parameters:

```yaml
kind: function
metadata: { pcn: "integration.functions.washer", pcsn: "washer" }
name: "integration.functions.washer"
description: "Rubs an abrasive against a surface with detergent"
parameters: [abrasive, surface, detergent]
```

A **skill** binds those parameters to concrete values for one use case. An **agent** chooses a skill from its repertoire when triggered.

## Triggers

Every agent embeds its own trigger — there is no external scheduler:

- **Channel subscription** (reactive) — the agent fires when an event lands on a channel it watches.
- **Cron expression** (proactive) — the agent fires on a schedule.

## The skill repertoire

An agent holds a *repertoire* of skills, not one. The incoming situation (the channel) decides which skill is selected. Adding a capability is usually a new skill or a new agent — the function underneath stays untouched.

## Output channels: join vs divide

Where an agent sends a skill's output decides whether parallel flows converge or stay separate — set it in the agent's channel configuration:

- Output to **`skill.mrc`** → flows **join** (downstream sees one stream).
- Output to **`agent.mrc/situation`** → flows **divide** (each stays isolated).

See [join vs divide](../concepts/choreography.md#channel-routing-join-vs-divide) for the full picture. It's one field; it's the only place the topology is decided.

## Runtimes

Agents have one runtime per layer, both implementing the identical pattern (subscribe/cron → select skill → run function):

| Layer | Runtime | Bus | For |
|---|---|---|---|
| **Integration** | Go | NATS | Business events, entity mutations, ECST |
| **Cognition** | Scala Spark | Kafka | Streaming analytics, DIKW transforms |

The builder that packages an agent is the **executor builder**.

→ Back to the [Build overview](index.md), or learn to run a platform in [Operate](../operate/index.md).
