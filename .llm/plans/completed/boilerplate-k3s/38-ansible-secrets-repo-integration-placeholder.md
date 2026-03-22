# Plan 38: boilerplate-ansible secrets integration (placeholder)

## Scope

Define how `boilerplate-ansible` will integrate with Boilerplate deployment workflows for
non-local environments (`alpha`, `beta`, `prod`) as the source of truth for cleartext infra config
and encrypted secrets.

This is a placeholder planning file only. Do not implement this yet.

## Why this exists

- `boilerplate` k3d + ArgoCD local setup should remain self-contained and use existing
  `local_env_setup` scripts.
- `boilerplate-ansible` is expected to become the environment/secrets control plane for
  non-local k3s/k8s clusters.
- Defining boundaries early avoids coupling local workflows to production secret flows.

## Intended boundaries

- **Local** (`k3d`): no ansible dependency; continue using `make local_env_setup` and local scripts.
- **Alpha/Beta/Prod**: ansible-managed cleartext + encrypted files feed cluster/app deployment
  inputs and secret material.
- **GitOps runtime**: ArgoCD remains the deploy reconciler; ansible prepares/provisions and
  manages environment inputs/secrets outside the local path.

## Future steps (when activated)

1. Document cross-repo contract between `boilerplate` and `boilerplate-ansible`:
   - directory structure,
   - secret naming and key management model,
   - environment variable ownership.
2. Define secret handoff strategy:
   - SOPS encryption scope and key rotation approach,
   - how ansible outputs map to k8s `Secret` resources.
3. Define promotion model across `alpha` -> `beta` -> `prod`:
   - branch/tag conventions,
   - approval gates and rollback expectations.
4. Add CI checks to validate contract compatibility between repos.

## Key files likely affected later

- `boilerplate`: `infra/k8s/alpha/**`, `infra/k8s/beta/**`, `infra/k8s/prod/**` (future),
  deployment docs, and environment bootstrap scripts.
- `boilerplate-ansible`: inventory/group vars, encrypted secrets, and deployment playbooks.

## Verification (future)

- Non-local environments can be deployed reproducibly with ansible-managed inputs.
- ArgoCD syncs cleanly using environment-separated manifests/secrets.
- Local developer workflow remains unchanged and independent from ansible.
