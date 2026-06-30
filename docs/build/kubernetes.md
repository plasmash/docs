# Kubernetes patterns

!!! info "Work in progress"
    This page is being written. The outline below is what it will cover — the knowledge exists, it just needs publishing here.

The manifest conventions every workload follows.

## Planned contents

- Resource naming and required annotations (mrn/mrv/mrk/mrc)
- Init containers and the builder abstraction
- Private registry auth (`imagePullSecrets`)
- The centralized service-account pattern (and anti-patterns)
- Ingress & TLS with cert-manager (pki-public / pki-private)
- Object storage via ObjectBucketClaim
