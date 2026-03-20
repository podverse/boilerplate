# Plan 01: Init containers for api and management-api

## Scope

Add init containers to the **api** and **management-api** deployments in [infra/k8s/base/stack/workloads.yaml](infra/k8s/base/stack/workloads.yaml) so that their main containers do not start until **postgres** (port 5432) and **valkey** (port 6379) are accepting connections. This removes or greatly reduces CrashLoopBackOff on first `make local_k3d_up` and ensures the APIs only start when dependencies are ready.

**Out of scope:** Web, management-web, sidecars (handled in plan 02). No changes to postgres or valkey deployments.

## Steps

1. **Choose a wait image**
   - Use a minimal image that can run a shell and check TCP. Options: `busybox:1.36` (has `nc` with `-z`), or `alpine:3.19` with `nc -z`. Prefer one already commonly used in k8s (busybox is standard). Document the choice in the manifest or a short comment.

2. **Add init containers to the api deployment**
   - In [infra/k8s/base/stack/workloads.yaml](infra/k8s/base/stack/workloads.yaml), under `spec.template.spec` for the api Deployment, add an `initContainers` list **before** `containers`.
   - First init: wait for postgres. Example (adjust image if needed):
     - name: `wait-postgres`
     - image: `busybox:1.36` (or equivalent)
     - command: `['sh', '-c', 'until nc -z postgres 5432; do echo waiting for postgres; sleep 2; done; echo postgres ready']`
   - Second init: wait for valkey. Example:
     - name: `wait-valkey`
     - image: same as above
     - command: `['sh', '-c', 'until nc -z valkey 6379; do echo waiting for valkey; sleep 2; done; echo valkey ready']`
   - Order: wait-postgres, then wait-valkey (or parallel is fine; both must succeed before main container starts).

3. **Add the same init containers to the management-api deployment**
   - Under the management-api Deployment’s `spec.template.spec`, add the same two init containers (`wait-postgres`, `wait-valkey`) with the same image and commands. Management-api also depends on postgres and valkey.

4. **Verify YAML**
   - Ensure `initContainers` is a list and each item has `name`, `image`, and `command`. No `envFrom` or secrets are required for the wait commands (host/port are fixed: postgres, valkey, 5432, 6379).

## Key files

- [infra/k8s/base/stack/workloads.yaml](infra/k8s/base/stack/workloads.yaml) – Only file to edit. Add `initContainers` to the api and management-api Deployment specs.

## Verification

- From repo root, with cluster up: `kubectl -n boilerplate-local get pods -l 'app in (api,management-api)'` and confirm init containers complete (Pod shows Running for main container only after inits succeed).
- Restart the deployments and watch: `kubectl -n boilerplate-local rollout restart deployment/api deployment/management-api` then `kubectl -n boilerplate-local get pods -w` — api and management-api should transition from Init:0/2 to Running without CrashLoopBackOff once postgres and valkey are up.
- Optional: `make local_k3d_down` then `make local_k3d_up` and confirm api and management-api reach Running without multiple crash restarts (postgres may still take 1–2 minutes; inits will block until it is ready).

## Notes

- If `nc -z` is not available in the chosen image, use an equivalent (e.g. `timeout 1 sh -c 'cat < /dev/null > /dev/tcp/postgres/5432'` in bash, or a different minimal image with netcat).
- Init container resource limits are optional; add them if the cluster enforces defaults.
