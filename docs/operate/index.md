# Operate

How to run a Plasma **platform** — compose it, deploy it, investigate it, and debug it.

A platform is a [model](../concepts/component-model.md) materialized on your nodes. You declare packages in `compose.yaml`, merge and prepare them, then bring the platform up against your infrastructure with `plasmactl`.

## The golden rule of investigation

To understand a running platform, **never** read files by hand. Run:

```bash
plasmactl platform:graph
```

It returns the complete picture — nodes, zone allocations, component distribution, dependency edges — in seconds. → [Investigating a platform](investigating.md)

## In this section

- [**Platform lifecycle**](lifecycle.md) — `compose → prepare → bundle → up`
- [**Nodes & topology**](nodes.md) — node files, zones, allocation, `platform.yaml`
- [**Deploying**](deploying.md) — zone targets, the full pipeline, the managed option
- [**Security**](security.md) — identity, access, secrets, hardened images
- [**Observability**](observability.md) — metrics, logs, traces, dashboards, alerting
- [**Investigating a platform**](investigating.md) — `platform:graph`, `check`, `impact`
- [**Debugging**](debugging.md) — deployment issues, agent flows, RBAC

For the full command set, see the [CLI reference](../cli/index.md).
