# Nodes & topology

A platform runs on **nodes** — physical or virtual machines — and the [topology](../concepts/topology.md) decides which components land on each. This page is the operational side: how nodes are described and how they map to zones.

## Node files are the source of truth

Each machine is one file:

```
platforms/<platform>/nodes/<hostname>.yaml
```

It holds **all** per-node state: the zones it serves, its network (public/private IPs, MACs), its disks, and provider metadata. Nothing about a node lives anywhere else.

## platform.yaml holds constants only

`platform.yaml` carries configuration constants set at `platform:create` time — never derived state. Anything that can be computed from the node files (counts, endpoint lists, VIPs) is computed, not stored.

## The inventory is a dumb aggregator

An inventory plugin reads the node files and builds Ansible groups automatically from the zone paths — it derives, it doesn't decide. From the nodes it produces:

- **Host variables** — per node: `hostname`, `ansible_host`, `public_ip`, `private_ip`, `disks`, `host_id`, …
- **Group variables** — aggregated onto the `platform` group: `machine_hosts`, `machine_nodes_count`, `machine_etcd_endpoints`, storage disk counts, ingress IPs, …

Components read these to configure themselves for the actual machines they're running on.

## Allocating nodes to zones

A node declares the zones it serves; the topology distributes the right components onto it. Manage zones with [`plasmactl zone`](../cli/zone.md) and nodes with [`plasmactl node`](../cli/node.md).

## Providers: private cloud vs public cloud

Plasma supports two infrastructure shapes, and keeps all provider-specific logic in `plasmactl` so that Ansible stays provider-agnostic:

- **Private cloud / bare-metal** — a VLAN-based private network stack (public + private NICs, a private VLAN, a virtual IP). Provider-specific values (VLAN IDs, MTU, NTP/DNS) are set in platform variables.
- **Public cloud (VMs)** — a single interface with a private IP from the VPC; no VLAN stack. Detected automatically when a node has no private MAC.

→ Next: [Deploying](deploying.md) and [Investigating a platform](investigating.md).
