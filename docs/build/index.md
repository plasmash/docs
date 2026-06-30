# Build

How to author Plasma **components** — the reusable units that make up packages.

A component is a directory under `src/<layer>/<kind>/<name>/` with metadata, build tasks, defaults, and templates. Plasma standardizes how components are structured, configured, and built, so that anything from a single function to a full application follows the same rules.

## Principles you'll meet everywhere

- **Builders, not raw tooling.** Never call `docker` or `kubectl` directly — components declare intent and a builder produces the artifact.
- **Configure at the service level**, never the application level. Applications orchestrate; services configure.
- **Variables carry environment decisions** (`machine_env`), never `{% if %}` logic inside templates.
- **Prefix every variable** with its component name to avoid collisions.

## In this section

- [**Component anatomy**](component-anatomy.md) — files, metadata (MRN/MRK/MRV), the lifecycle
- [**Configuration**](configuration.md) — the service-level rule, method preference, environment-conditional config
- [**Templates & filters**](templates.md) — Jinja2 templates and Plasma's machine filters
- [**Entity schemas**](schemas.md) — Protobuf as source of truth, JSON Schema generation, the registry
- [**Kubernetes patterns**](kubernetes.md) — manifests, annotations, registry auth, service accounts, ingress/TLS
- [**Defining agents**](agents.md) — triggers, skill repertoires, channel configuration

See also the [Component model](../concepts/component-model.md) concept page for the *why*.
