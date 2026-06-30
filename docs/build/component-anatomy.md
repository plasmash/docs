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

`meta/plasma.yaml` carries the component's identity. The key fields (MR = *Machine Resource*):

| Field | Meaning |
|---|---|
| `mrn` | Full name — `interaction.applications.dashboards` |
| `mrsn` | Short name — `dashboards` |
| `mrk` | Kind — `application`, `service`, `agent`, … |
| `mrv` | Version — the **git commit hash** at last change |
| `mrt` | Tags |
| `mri` | Docker image map |

```yaml
plasma:
  author: Your Name
  categories: [machine, kind.service]
  description: One-line description of the component
  license: EUPL-1.2
  version: 4fc38a21d392f   # mrv — set by plasmactl
```

## The standardized task structure

Every component's `tasks/main.yaml` follows the same pattern: create a working dir, invoke the right **builder**, clean up, and record the new build state.

```yaml
- name: Create working directory
  file: path=/tmp/{{ component.mrn }} state=directory
  when: component | build

- name: Build
  include_role:
    name: platform.helpers.{component_type}_builder
  vars:
    {component_type}_builder_resource: "{{ component }}"
    {component_type}_builder_context: cluster   # or image
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
