# CLI reference

`plasmactl` is the single CLI for all Plasma operations. It is built on [Launchr](https://github.com/launchrctl/launchr) and a set of plugins, each owning a command namespace (`noun:verb`).

| Plugin | Namespace | Purpose |
|---|---|---|
| [plasmactl](plasmactl.md) | — | Core CLI framework and platform actions |
| [plasmactl-model](model.md) | `model:` | Compose packages and prepare/bundle/release platform models |
| [plasmactl-component](component.md) | `component:` | Component versioning, dependencies, attach/detach |
| [plasmactl-platform](platform.md) | `platform:` | Platform lifecycle — create, up, deploy, destroy |
| [plasmactl-node](node.md) | `node:` | Node provisioning across providers |
| [plasmactl-topology](topology.md) | `zone:` | Topology structure — zones and node allocations |
| [plasmactl-auth](auth.md) | `auth:` | Provider authentication — login, logout, status |
| [plasmactl-processors](processors.md) | — | Template processors (e.g. Ansible Vault) |

Credential storage is handled by the `keyring:` namespace (from [launchr](https://github.com/launchrctl/launchr)) — `keyring:login`, `keyring:set`, `keyring:list`, and friends.

Install the CLI with:

```sh
curl -sSL https://get.plasma.sh | sh
```

The pages in this section are sourced from each plugin's repository README on [github.com/plasmash](https://github.com/plasmash).
