# Templates & filters

Plasma renders component templates with **Jinja2**, plus a set of **machine filters** that make templates concise and infrastructure-aware. Templates should stay env-agnostic and data-driven (see [Configuration](configuration.md)) — they render whatever the variables resolve to.

## Machine filters

These filters are the ones you'll reach for constantly.

**`cluster_dns_name`** — full in-cluster DNS name for fast resolution:

```jinja
{{ resource | cluster_dns_name }}   {# → service.namespace.svc.cluster.local #}
```

**`build` / `state` / `exists`** — gate operations on a resource's deployment state:

```yaml
when: component | build
```

**`image_uri` / `image_path`** — parse a Docker image reference:

```jinja
{{ mri | image_uri }}    {# registry.example.com/namespace/image #}
{{ mri | image_path }}   {# namespace/image #}
```

**`requires_lookup`** — resolve a component's dependencies:

```jinja
{{ resource | requires_lookup(hostvars, 'service') }}
```

**Component-type filters** — extract type-specific attributes: `resource`, `application`, `service`, `software`, `agent`, `skill`, `function`, …

### Best practices

1. Always use `cluster_dns_name` for service references — it's faster than short names.
2. Check state with `build` before doing work.
3. Use type filters to keep templates clean.

## Executable template files

If a template will be executed (an entrypoint or init script, e.g. `entrypoint.sh.j2`), **mark the template file executable in the repository** (`chmod +x`). Docker `COPY` preserves the permission, so you don't need a `RUN chmod` in the Dockerfile.

Benefits: executable files are visibly executable before deployment, you avoid permission errors on read-only build filesystems, and Dockerfiles stay simpler. (When the source can't be made executable, use `COPY --chmod=755`.)

## The single-line Dockerfile quirk

!!! warning "Add a WORKDIR to single-directive Dockerfiles"
    Plasma's `image_builder` automatically appends `WORKDIR /tmp` to any Dockerfile that contains only a single line (typically just `FROM`), to guarantee the image has a distinct layer. This **breaks** images that rely on their base image's working directory.

    Always include at least one more directive — usually an explicit `WORKDIR`:

    ```dockerfile
    FROM {{ base_image }}

    # Preserve the base image's working directory
    # (without this, the builder would set WORKDIR /tmp)
    WORKDIR /app
    ```

→ Next: [Entity schemas](schemas.md).
