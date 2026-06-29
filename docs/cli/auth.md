# plasmactl-auth

A [Launchr](https://github.com/launchrctl/launchr) plugin for [Plasmactl](https://github.com/plasmash/plasmactl) that provides provider authentication for Plasma platforms.

## Overview

`plasmactl-auth` stores cloud provider credentials in the launchr keyring, resolves them at runtime through a keyring → environment → ansible-vault chain, and exposes them to Terraform/OpenTofu (via `plasmactl-platform`) and to direct API clients (via an authenticated `*http.Client`).

## Features

- **Provider-agnostic**: pluggable interface so adding a new provider is one Go file
- **Three-tier resolution**: keyring (interactive), env vars (CI), ansible-vault (committed-encrypted)
- **OAuth2 minting**: OVH credentials yield a Bearer-token-aware HTTP client via `golang.org/x/oauth2/clientcredentials`
- **Static-key passthrough**: Scaleway credentials yield an `X-Auth-Token`-injecting HTTP client
- **Validation**: every login round-trips a cheap authenticated API call before storing
- **Secret hygiene**: stored fields never round-trip through JSON; error messages scrub credential values

## Supported Providers

| Provider   | Stored fields                                  | Validation endpoint                                |
|------------|------------------------------------------------|----------------------------------------------------|
| `ovh`      | `client_id`, `client_secret`, `account_region` | OAuth2 token mint at `{region}/auth/oauth2/token`  |
| `scaleway` | `access_key`, `secret_key`                     | `GET https://api.scaleway.com/iam/v1alpha1/users`  |

`account_region` is one of `eu`, `ca`, `us` — each OVH universe is a separate IAM realm, so the credential is bound to the universe in which it was minted.

## Commands

### auth:login

Store and validate provider credentials.

```bash
plasmactl auth:login ovh --from-file ./creds.yaml
plasmactl auth:login scaleway --from-file ./creds.yaml
```

The `--from-file` argument points to a yaml file whose top-level keys match the provider's field names:

```yaml
# OVH
client_id: <APPLICATION_KEY>
client_secret: <APPLICATION_SECRET>
account_region: eu
```

```yaml
# Scaleway
access_key: <ACCESS_KEY>
secret_key: <SECRET_KEY>
```

The plugin validates the credentials with a single API call before storing anything.

### auth:logout

Remove all stored credential fields for a provider.

```bash
plasmactl auth:logout ovh
```

### auth:status

Show credential health for one or all providers.

```bash
plasmactl auth:status            # all registered providers
plasmactl auth:status scaleway   # one provider
```

Output reports per-field source (`keyring` / `env` / missing) and overall health (`OK` / `MISSING` / `INVALID`).

## Credential Resolution

For each provider field, the resolver walks these tiers in order and stops at the first hit:

1. **Keyring** — `Keyring.GetForKey("<provider>_<field>")`, e.g. `ovh_client_id`. Populated by `auth:login` or directly via `plasmactl keyring:set`.
2. **Environment variable** — `PLASMA_<PROVIDER>_<FIELD>` (uppercase), e.g. `PLASMA_OVH_CLIENT_ID`. Recommended for CI.
3. **Ansible-vault** — `platforms/<platform>/group_vars/platform/vault.yaml`, keyed as `vault_<provider>_<field>`. Plain yaml is fully supported; encrypted files require `ANSIBLE_VAULT_PASSWORD` or `ANSIBLE_VAULT_PASSWORD_FILE` env to be set.

If all tiers miss a required field, the resolver returns `auth: missing required field "<field>" for provider "<provider>" (tried: keyring, env, vault)`.

## CI / Headless Use

In CI, store the credential fields in the runner's native secret store and expose them as environment variables:

```yaml
# GitLab CI
variables:
  PLASMA_OVH_CLIENT_ID: $OVH_CLIENT_ID
  PLASMA_OVH_CLIENT_SECRET: $OVH_CLIENT_SECRET
  PLASMA_OVH_ACCOUNT_REGION: eu
```

```yaml
# GitHub Actions
env:
  PLASMA_OVH_CLIENT_ID: ${{ secrets.OVH_CLIENT_ID }}
  PLASMA_OVH_CLIENT_SECRET: ${{ secrets.OVH_CLIENT_SECRET }}
  PLASMA_OVH_ACCOUNT_REGION: eu
```

No keyring is needed — the resolver reads env vars directly at provisioning time.

## OVH Setup

Create an OAuth2 application in the universe matching your account:

| Region | URL                                    |
|--------|----------------------------------------|
| EU     | https://eu.api.ovh.com/createApp/      |
| CA     | https://ca.api.ovh.com/createApp/      |
| US     | https://us.api.ovhcloud.com/createApp/ |

Copy the resulting `applicationKey` (→ `client_id`) and `applicationSecret` (→ `client_secret`), then attach an IAM policy granting the scopes your provisioning needs (`dedicated/server/*`, `vrack/*`, etc.).

## Scaleway Setup

In the Scaleway console: **Identity and Access Management → API keys → Create**. Copy the access key and secret key.

## Security

- Credential fields are tagged `json:"-"` everywhere they live in shared schemas; they cannot be serialized to JSON by accident.
- Terraform variables carrying credentials are emitted as `sensitive = true`.
- Per-run credentials are written to `credentials.auto.tfvars.json` at mode `0600` and removed at end of run.
- Validation HTTP failures report only the status code; response bodies are never logged.
- OAuth2 errors pass through a redaction helper before surfacing.

## Related Plugins

| Plugin                                                                  | Purpose                                |
|-------------------------------------------------------------------------|----------------------------------------|
| [plasmactl-platform](https://github.com/plasmash/plasmactl-platform)    | Platform lifecycle and Terraform glue  |
| [plasmactl-node](https://github.com/plasmash/plasmactl-node)            | Node provisioning consumers            |
| [launchrctl/keyring](https://github.com/launchrctl/keyring)             | Underlying credential storage          |

## Documentation

- [Plasmactl](https://github.com/plasmash/plasmactl) — main CLI tool
- [Plasma Platform](https://plasma.sh) — platform documentation

## License

[European Union Public License 1.2 (EUPL-1.2)](https://github.com/plasmash/.github/blob/main/LICENSE)
