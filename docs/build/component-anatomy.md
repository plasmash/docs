# Component anatomy

A component is a directory under `src/<layer>/<kind>/<name>/`. Whatever its kind — function, skill, agent, software, service, application, entity, library — it follows the same shape.

## Files

```
src/<layer>/<kind>/<name>/
├── meta/plasma.yaml      # metadata (required)
├── tasks/main.yaml       # build/lifecycle logic (required)
├── defaults/main.yaml    # default variable values
├── templates/            # Jinja2 templates (manifests, Dockerfiles, configs)
└── files/                # static files (code, protobuf schemas, …)
```

Application components also add `tasks/readiness.yaml` and `tasks/configuration.yaml`; service components add `tasks/dependencies.yaml`.

## Metadata

The one file you author for identity is `meta/plasma.yaml` — a single `plasma:` block. The component's **kind** is carried in `categories` as `kind.<type>`:

```yaml
plasma:
  author: Your Name
  categories: [machine, kind.service]   # kind.function / kind.skill / kind.agent / …
  description: One-line description of the component
  license: EUPL-1.2
  version: 4fc38a21d392f                # the git commit hash — set by plasmactl
```

At **runtime** each component becomes a **Machine Resource (MR)** whose attributes are derived from its path and metadata and referenced in tasks and templates:

| Attribute | Meaning |
|---|---|
| `mrn` | Full name — `integration__skills__erp_person_registrar` |
| `mrc` | The component's **channel** — `platform.integration.…` |
| `version` | The git commit hash at last change |
| `state` | Per-tag build state (drives the `when:` guards in tasks) |

## The standardized task structure

Every component's `tasks/main.yaml` follows the same pattern: create a working dir, invoke the right **builder**, clean up, and record the new build state.

```yaml
- name: Create working directory
  file: path=/tmp/{{ component.mrn }} state=directory
  when: component.state[machine_resource_default_tag]['build']

- name: Build
  include_role:
    name: integration.builders.skill        # <layer>.builders.<kind>
  vars:
    skill_resource: "{{ component }}"        # <kind>_resource
  when: component.state[machine_resource_default_tag]['build']
```

!!! warning "Always use builders"
    Never call `docker` or `kubectl` directly. Components declare intent; a [builder](kubernetes.md) produces the artifact. This keeps every component consistent and reproducible.

## Versioning

A component's version (`mrv`) **is** its git commit hash. Before pushing, always:

```sh
plasmactl component:bump
```

`component:bump` detects what changed, stamps the new hash, and **cascades** the bump through the dependency tree (a software change bumps its service, which bumps its application). Platform *releases*, by contrast, are SemVer tags — curated snapshots, not per-change.

→ Next: [Configuration](configuration.md).
