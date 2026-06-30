# Kubernetes patterns

Plasma deploys onto Kubernetes, but you rarely write raw manifests by hand — **builders** generate them from your component. These are the conventions every workload follows.

## Builders, not raw tooling

Each component type has a builder:

| Builder | Produces |
|---|---|
| `application_builder` | Kubernetes manifests |
| `service_builder` / `software_builder` | Docker images |
| `function_builder` | Serverless functions |

Never use raw `docker_image` or `kubectl` — always go through the builder abstraction. It keeps every component consistent and reproducible.

## Manifest conventions

- **Resource naming** — name service-owned resources after `service.mrsn`, not an `application.mrsn` suffix.
- **Annotations** — every workload (Deployment, StatefulSet, DaemonSet, Job, CronJob) carries `mrn` / `mrv` / `mrk` / `mrc` annotations. `mrv` must be **quoted** (it's a hash, not a number).
- **Init containers** — use a platform utility image (busybox), not the service's own image.
- **Service accounts** — only set `serviceAccountName` when the workload actually needs cluster permissions.

## Private registry authentication

The platform provides a private Docker registry that requires auth. Add `imagePullSecrets` to every pod spec, resolving the secret name through the [three-tier pattern](configuration.md#the-three-tier-resolution):

```yaml
# package default
myapp_images_secret: "images"
```
```yaml
# platform group_vars override
myapp_images_secret: "{{ cluster_images_registry_secret }}"
```
```yaml
# manifest
spec:
  imagePullSecrets:
    - name: {{ myapp_images_secret }}
```

Without this, pods fail with `ImagePullBackOff`.

## Service accounts: the centralized pattern

Plasma uses **one centralized, sudo-like service account** rather than per-application RBAC.

```yaml
# default
connect_service_account_name: "sudo"
# platform group_vars override
connect_service_account_name: "{{ cluster_sudo_service_account_name }}"
# manifest
spec:
  serviceAccountName: {{ connect_service_account_name }}
```

!!! danger "Anti-patterns"
    - ❌ Don't create custom `ServiceAccount` / `Role` / `RoleBinding` resources.
    - ❌ Don't hard-code service account names in manifests.
    - ❌ Don't put platform variables directly in component defaults.

    Symptoms of getting this wrong: `CrashLoopBackOff` with "access denied" / "Service Account permissions" errors. Fix by removing custom RBAC and adopting the centralized account.

## Ingress & TLS

**cert-manager** provisions certificates automatically. Two issuers:

- `pki-public` — Let's Encrypt, for public-facing services
- `pki-private` — a self-signed CA, for internal services

```yaml
metadata:
  annotations:
    cert-manager.io/cluster-issuer: pki-public   # or pki-private
spec:
  tls:
    - hosts: [ "{{ component.public_uri }}" ]
      secretName: {{ component.mrsn }}-tls
```

## Object storage

S3-compatible storage is provisioned through an **ObjectBucketClaim** (Ceph RGW). Applications create and manage their own deterministic S3 credentials during their `tasks/configuration.yaml` phase, after deployment.

→ Next: [Defining agents](agents.md).
