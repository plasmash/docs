# Concepts

Plasma is composed from a small set of building blocks. From smallest to largest: **components → packages → models → platforms**.

## Components

A **component** is a single-purpose, reusable unit (an application, service, software, library, function, skill, or flow) living under `src/{layer}/{type}/{name}/`. Every component carries metadata (author, description, license, version) and the tasks needed to build and configure it.

Plasma uses **two parallel three-layer patterns**:

- **Flow components** (event-driven logic): **Function** (computation) → **Skill** (configuration) → **Flow** (orchestration).
- **Application components** (infrastructure): **Software** (computation) → **Service** (configuration) → **Application** (orchestration).

## Packages

A **package** is a repository of related components for a domain. Packages are composed into platforms via a `compose.yaml`:

```yaml
name: plasma
dependencies:
  - name: plasma-core
    source:
      type: git
      ref: main
      url: https://github.com/plasmash/plasma-core.git
```

Planned packages include `plasma-core` (the kernel), `plasma-work`, `plasma-data`, `plasma-talk`, `plasma-code`, `plasma-learn`, and `plasma-lab`. They are being published progressively — see [github.com/plasmash](https://github.com/plasmash).

## Models

A **model** composes packages plus configuration into a complete, deployable platform blueprint. For example, **`ta` (The Agency)** is a digital operating system for service companies, composed from all the packages above.

## Platforms

A **platform** is a materialized model running on your infrastructure. The `plasmactl` workflow takes you there:

```
compose.yaml → model:compose → model:prepare → model:bundle → platform:up
   (packages)      (merge)        (ansible)      (artifact)    (deploy)
```

Continue to the [CLI reference](cli/index.md) for the commands behind each step.
