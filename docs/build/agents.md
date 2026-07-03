# Defining agents

Authoring the event-driven side of Plasma means writing three kinds of component: a **function** (the computation), one or more **skills** (configurations), and an **agent** that manages the **flows** binding them to triggers. The pattern is explained in [Choreography & channels](../concepts/choreography.md); this page is how you build it.

## Function → Skill → Agent

One function serves many use cases through different skills; an agent's flows decide when each skill runs.

```
Function: integration.functions.washer            # HOW — rubs an abrasive on a surface with detergent
├── Skill: integration.skills.car_wash            # WHAT — chamois + car body + car shampoo
├── Skill: integration.skills.hand_wash           # WHAT — hand skin + hands + soap
└── Skill: integration.skills.dish_wash           # WHAT — sponge + dishes + dish soap

Agent: integration.agents.washing                 # WHEN — one flow per situation (see below)
```

Every component's identity lives in `meta/plasma.yaml`; its kind is carried in `categories`:

```yaml title="meta/plasma.yaml"
plasma:
  author: Your Name
  categories: [machine, kind.function]   # or kind.skill / kind.agent
  description: Rubs an abrasive against a surface with detergent
  license: EUPL-1.2
  version: 4fc38a21d392f                  # set by plasmactl component:bump
```

## The function — the computation (HOW)

A function is generic and reusable. Its logic lives in `files/` as code (Go in the Integration layer, Scala/Spark in Cognition), not in YAML — the component is that code plus its `meta/plasma.yaml` and standardized `tasks/`.

## The skill — the configuration (WHAT)

A skill *configures* a function for one use case. It carries prefixed default variables and a config template the function reads at runtime:

```yaml title="skills/car_wash/defaults/main.yaml"
car_wash_abrasive: chamois
car_wash_detergent: car-shampoo
```

```jinja title="skills/car_wash/templates/config.yaml.j2"
washer:
  abrasive: {{ car_wash_abrasive }}
  surface:  car-body
  detergent: {{ car_wash_detergent }}
```

Adding a capability is usually a new skill — the function underneath stays untouched.

## The agent — the trigger (WHEN)

An agent manages the **flows** for a domain. Each flow is an inline spec in the agent's `manifests.yaml.j2` that binds a **trigger** to a **skill** and names an **output channel**:

```jinja title="agents/washing/templates/manifests.yaml.j2"
---
kind: Flow
name: car_washing
trigger: "data:{{ integration__skills__garage_registrar.mrc }}.event"   # reactive
output: {{ integration__skills__car_wash.mrc }}
skill: integration.skills.car_wash
---
kind: Flow
name: dish_washing
trigger: "schedule:0 0 20 * * ?"                                        # proactive (after dinner)
output: {{ integration__skills__dish_wash.mrc }}
skill: integration.skills.dish_wash
```

Two trigger forms, no external scheduler:

- **`data:<channel>.event`** — reactive: the flow fires when an event lands on a channel (a skill's `mrc`).
- **`schedule:<cron>`** — proactive: the flow fires on a quartz-style schedule.

!!! note "Flows are inline now"
    A flow used to be its own component. Flows are now **inline specs inside an agent** — one agent groups the flows for a domain (e.g. *the event-related flows manager*). The build artifact for an agent is produced by the **executor builder**.

## Output channels: join vs divide

A flow's `output` is a channel (`mrc`). Where you point it decides whether parallel flows converge or stay separate — see [join vs divide](../concepts/choreography.md#channel-routing-join-vs-divide). It's one field, and it's the only place the topology is decided.

## Runtimes

Agents have one runtime per layer, both implementing the identical pattern (trigger → select skill → run function):

| Layer | Runtime | Bus | For |
|---|---|---|---|
| **Integration** | Go | NATS | Business events, entity mutations, ECST |
| **Cognition** | Scala Spark | Kafka | Streaming analytics, DIKW transforms |

→ Put it together end to end in [Your first platform](../tutorials/first-platform.md), or run a platform in [Operate](../operate/index.md).
