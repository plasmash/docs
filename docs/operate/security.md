# Security

Plasma is built for **zero-trust, self-hosted, and air-gapped** operation. Identity, access, secrets, and the base images are all part of the platform — provisioned as components in the Foundation layer, not bolted on afterwards.

## Identity & access

Identity is handled by an integrated **IAM** application in the Foundation layer, built on the [Ory](https://www.ory.sh/) stack and an LDAP directory:

| Concern | Component | What it does |
|---|---|---|
| **Identity** | Ory **Kratos** | user identities, self-service login/registration, account recovery |
| **SSO / tokens** | Ory **Hydra** | OAuth2 / OpenID Connect provider — single sign-on and JWT issuance |
| **Access proxy** | Ory **Oathkeeper** | identity & access proxy that enforces authentication at the perimeter |
| **Directory** | **OpenLDAP** | the user and group directory |
| **Policy** | Plasma **authorizer** | evaluates access against LDAP groups |

Applications authenticate through OAuth2 / OpenID Connect, so any OIDC-compatible identity provider can be federated in. Machine-to-machine access uses dedicated service credentials rather than user identities.

## Authorization

Access is **role-based (RBAC)**, resolved two ways:

- **Application access** — the `authorizer` maps a user's **LDAP groups** to what they may see and do. Group membership is the single source of truth for who can reach which application.
- **Cluster access** — Plasma follows a **centralized service-account** pattern on Kubernetes: the platform provisions a single privileged service account that components reference, rather than each component minting its own RBAC resources. This keeps cluster permissions auditable in one place.

!!! note "One model, deliberately"
    Plasma standardizes on RBAC end to end. Fine-grained, per-request policy engines can be layered on through Oathkeeper, but the shipped model is roles and groups — simple to reason about and to audit.

## Secrets & PKI

Secrets are never committed and never left on disk:

- **Three-tier resolution** — credentials resolve from the system **keyring** first, then **environment variables**, then an encrypted **ansible-vault**. Vault values are decrypted **in memory** at run time; temporary credential files are written `0600` and removed when the run ends.
- **Certificates** — an in-cluster PKI issues TLS automatically: a **public issuer** (ACME / Let's Encrypt) for internet-facing endpoints and a **private CA** for internal service-to-service traffic.

## Base images & OS

The attack surface is kept small by construction:

- **Minimal images** — service containers build `FROM scratch` wherever possible, shipping just the binary with no shell or package manager.
- **Immutable OS** — nodes run an immutable, container-optimized Linux base (**Flatcar**), so the host is reproducible and has nothing to patch in place.
- **Private registry** — built images are published to the platform's own private registry, not a public one.

## Posture

- **Agentless** — no runtime agent phones home; operations run over SSH and the Kubernetes API.
- **Air-gap capable** — every dependency can be mirrored inside the perimeter, so a platform runs with no outbound internet access.
- **Perimeter entry** — external traffic enters through the access proxy, giving a single, enforceable authentication boundary.

→ See [Observability](observability.md) for how access and system health are monitored, and [Debugging](debugging.md) for RBAC troubleshooting.
