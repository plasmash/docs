# Contributing

Plasma is built in the open at [github.com/plasmash](https://github.com/plasmash), under the [EUPL-1.2](https://github.com/plasmash/.github/blob/main/LICENSE) license. Contributions are welcome.

## Ways to contribute

- **Code** — fix a bug or add a capability in the toolchain or a package, and open a pull request.
- **Documentation** — these docs live in [`plasmash/docs`](https://github.com/plasmash); corrections and new guides are especially welcome.
- **Bug reports & feature requests** — open an issue on the relevant repository.
- **Discussion** — ask questions and share ideas in [Discussions](https://github.com/orgs/plasmash/discussions).

## The development loop

Working on a component follows the same cycle the platform uses to deploy:

```sh
# 1. edit a component, then commit
git commit -m "feat: add metric X"

# 2. version the change and propagate it
plasmactl component:bump
plasmactl component:sync

# 3. deploy to a target to verify
plasmactl platform:deploy <env> <target>
```

## Conventions

- **Conventional Commits** — commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) format (`feat:`, `fix:`, `docs:`, …). Releases and changelogs are generated from them, so the format matters.
- **Pull requests** — keep changes focused; the core platform repositories are reviewed carefully because a change there affects every deployment.

## Compliance & data sovereignty

Plasma is designed for organizations that must keep control of their data:

- **Self-hosted & air-gapped** — runs entirely on infrastructure you own, with no managed control plane and no required outbound connectivity.
- **Data sovereignty** — data never leaves your perimeter unless you route it there.
- **Auditability** — access is role-based and centralized (see [Security](../operate/security.md)), and every platform *is* a queryable [graph](../reference/graph.md), so what runs where is always inspectable.
- **Privacy regulations** — the platform is built to support **GDPR** and **CCPA** obligations such as data locality and access control.

→ See [Open-core](open-core.md) for what's open versus commercial.
