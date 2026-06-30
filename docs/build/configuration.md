# Configuration

A few rules keep configuration predictable across hundreds of components. They're worth internalizing early — most "why is this broken?" moments trace back to one of them.

## Configure at the service level, never the application

**Applications orchestrate services; services configure software.** Configuration belongs in the service role.

- ✅ Add environment variables in `connect_temporal/templates/Dockerfile.j2` (the service)
- ❌ Add them in `connect/templates/manifests.yaml.j2` (the application)

If a pod is crashing on a config error, fix it in the **service** role — not the application that orchestrates it. The application only wires services together.

## Method preference

When configuring a service, prefer methods in this order:

1. **Configuration files** (mounted via templates/ConfigMap) — explicit, versioned, reviewable, and they survive restarts.
2. **Environment variables** — for simple key-value settings.
3. **ConfigMaps** — for Kubernetes-native runtime configuration.

Config files are easiest to debug and diff. Env vars can interact in surprising ways (precedence between multiple sources), so reserve them for the simple cases.

## Environment-conditional configuration

Environments (`dev` / `prod` / `sandbox`) are selected at deploy time. The canonical discriminator is **`machine_env`**.

**The rule:** express "do X only on environment Y" in the component's **variables**, never as `{% if %}` logic inside a template.

```yaml
# ✅ The variable carries the env decision (in defaults or zone group_vars)
app_sso_enable: "{{ machine_env != 'prod' }}"
app_public_alternate_domains: "{{ ['example.com'] if machine_env == 'prod' else [] }}"
```

```jinja
{# ✅ The template just renders the data — it names no environment #}
{% if app_sso_enable %} ... {% endif %}

{# ❌ WRONG — env logic hard-coded in the template #}
{% if machine_env == 'dev' %} ... {% endif %}
```

Why: one place owns env behavior, so adding or retargeting an environment is a *data* change, not a template edit. An empty list or `false` already renders nothing — so guarding on the variable's value **is** the environment switch.

## Variable naming

**Every variable is prefixed with its component name** to avoid collisions:

```yaml
# in connect/defaults/main.yaml
connect_airbyte_worker_internal_api_host: "connect-airbyte-server:8001"
connect_temporal_base_image: "temporalio/auto-setup:1.28.1"
```

## The three-tier resolution

Values resolve through three layers, each overriding the last:

1. **`defaults/main.yaml`** in the package — a safe literal fallback.
2. **Zone `group_vars`** in the platform repo — environment/zone-specific overrides (e.g. mapping a generic name to a cluster-specific one).
3. **Vault** — secrets.

```yaml
# package default
myapp_images_secret: "images"
# platform group_vars override (group_vars/platform.layer.zone/vars.yaml)
myapp_images_secret: "{{ cluster_images_registry_secret }}"
```

This same pattern governs registry credentials, service accounts, and any value that differs per platform.

→ Next: [Templates & filters](templates.md).
