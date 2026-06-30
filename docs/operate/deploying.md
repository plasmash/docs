# Deployment

Plasma runs anywhere you can run containers — **on-premise, private cloud, public cloud (AWS, Azure, GCP), hybrid, multi-cloud, or fully air-gapped**. You own the infrastructure; there is no managed control plane or vendor lock-in.

## The workflow

```
compose.yaml → model:compose → model:prepare → model:bundle → platform:up
```

1. **Compose** — declare package dependencies in `compose.yaml`, then `plasmactl model:compose` merges them.
2. **Prepare** — `plasmactl model:prepare` builds the Ansible runtime.
3. **Bundle** — `plasmactl model:bundle` produces a deployable Platform Model (`.pm`) artifact.
4. **Up** — `plasmactl platform:up <env> <target>` runs the full pipeline (bump → compose → prepare → deploy).

## Infrastructure

- **Nodes** are provisioned and managed with [`plasmactl node`](../cli/node.md) across providers.
- **Zones** map logical architecture to physical resources — together they form the platform's topology — managed with the [`plasmactl zone`](../cli/zone.md) commands.
- Plasma targets **Kubernetes** for orchestration, with `etcd`, `Ceph`, and `Flannel` in the Foundation layer.

## Managed option

Prefer not to run it yourself? **[Plasma Cloud](https://www.skilld.cloud/plasma-cloud)** offers fully managed Plasma — infrastructure, updates, monitoring, and support — operated by Skilld, the creators of Plasma.

For the complete command set, see the [CLI reference](../cli/index.md).
