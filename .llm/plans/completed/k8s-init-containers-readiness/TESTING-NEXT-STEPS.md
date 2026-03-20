# Testing: Init containers and readiness (next steps)

Use these steps to verify the implementation after bringing up the local k3d stack.

## Prerequisites

- Cluster is up: `make local_k3d_up` (or already running).
- Images built and loaded (Makefile/local scripts handle this when using the standard flow).

## 1. Check pod status

```bash
kubectl -n boilerplate-local get pods
```

Expect: postgres, valkey, api, management-api, web-sidecar, web, management-web-sidecar, management-web all **Running** and **Ready** (1/1 or 2/2 for those with inits). No CrashLoopBackOff. Init containers should show as Completed.

## 2. Watch startup (optional)

After a fresh `make local_k3d_up`, in another terminal:

```bash
kubectl -n boilerplate-local get pods -w
```

Expect: api and management-api go from Init:0/2 to Running; web and management-web go from Init:0/1 to Running. No repeated restarts.

## 3. Check endpoints

```bash
kubectl -n boilerplate-local get endpoints
```

Pods that are Ready should appear in their Service endpoints. Not-ready pods are excluded from Services.

## 4. Browser

- **Web:** http://localhost:4002 — should load without connection reset or 500.
- **Management web:** http://localhost:4102 — same.

(Ensure port-forwards or ingress are in place per your local setup; e.g. `make local_k3d_status` or docs in `docs/development/K3D-ARGOCD-LOCAL.md`.)

## 5. Full cycle (optional)

Tear down and bring up again to test cold start:

```bash
make local_k3d_down
make local_k3d_up
kubectl -n boilerplate-local get pods -w
```

Wait until all app pods are Running and Ready (postgres may take 1–2 minutes; api/management-api inits block until postgres and valkey are up). Then open http://localhost:4002 and http://localhost:4102.

## 6. Restart rollouts (optional)

To confirm probes and inits on a running cluster:

```bash
kubectl -n boilerplate-local rollout restart deployment/api deployment/management-api deployment/web deployment/management-web
kubectl -n boilerplate-local get pods -w
```

Pods should become Ready again without CrashLoopBackOff.
