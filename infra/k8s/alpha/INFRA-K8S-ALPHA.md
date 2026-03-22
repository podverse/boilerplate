# Alpha overlay scaffold

This directory is intentionally scaffold-only for now.

- Local deployment should use `infra/k8s/local/*`.
- Alpha, beta, and prod secrets/config ownership is expected to come from
  `boilerplate-ansible` in a future phase.
- Keep environment manifests separate from `local` from day one.
