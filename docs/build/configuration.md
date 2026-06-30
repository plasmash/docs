# Configuration

!!! info "Work in progress"
    This page is being written. The outline below is what it will cover — the knowledge exists, it just needs publishing here.

The rules that keep configuration predictable across hundreds of components.

## Planned contents

- Service-level configuration only — never at the application level
- Method preference: config files > env vars > ConfigMaps
- Environment-conditional config via `machine_env`
- Variable naming: component-prefixed variables
- The three-tier resolution: defaults → zone group_vars → vault
