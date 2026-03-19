# k3s + ArgoCD + full Boilerplate infra (local, step-by-step)

This guide gets a full Boilerplate stack running locally: k3s (via k3d), ArgoCD, API, web, management API, management web, Postgres, and Valkey. All commands are run from the **Boilerplate repo root**.

## What you get

- A local k3d (k3s-in-Docker) cluster.
- ArgoCD installed and a root app pointing at the Boilerplate repo.
- Boilerplate workloads in namespace `boilerplate-local`: API, web (with sidecar), management API, management web (with sidecar), Postgres, Valkey.
- Env and secrets generated from templates (no Ansible; local only).

## Prerequisites

### Preferred: Nix / NixOS

We recommend using **Nix** or **NixOS** to get a reproducible environment with the right tools.

**Docker: use the host, not Nix.** To avoid two Docker runtimes and socket/context issues, **Docker (daemon + CLI) should come from your machine**, not from the Nix flake. The Boilerplate flake provides `k3d`, `kubectl`, and `age` only. k3d will use whatever `docker` is on your PATH (e.g. Docker Desktop). So: keep Docker Desktop (or system Docker) installed and running; use Nix only for k3d, kubectl, and age. No special config or override is required.

- **With Nix (macOS/Linux, e.g. Docker Desktop already installed):** From repo root run `nix develop` (or `direnv allow` if you use direnv). The [flake.nix](../../flake.nix) supplies Node, k3d, kubectl, and age. Ensure Docker Desktop is running, then run `make local_k3d_up`. The script will use the host’s `docker` and the Nix-provided `k3d`/`kubectl`.
- **On NixOS:** Add `docker` (or your chosen Docker daemon), `k3d`, `kubectl`, and optionally `age` to `environment.systemPackages`, and enable the Docker daemon (`virtualisation.docker.enable = true`). Then run the steps from this guide from that system.

### Alternative: install without Nix

| Tool    | Purpose                  | Install (macOS)                                                                                 | Install (Linux)                                          |
| ------- | ------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Docker  | k3d and container images | [Docker Desktop](https://docs.docker.com/desktop/install/mac-install/) or `brew install docker` | `apt install docker.io` / distro docs                    |
| k3d     | k3s cluster in Docker    | `brew install k3d`                                                                              | [k3d install](https://k3d.io/v5.6.0/usage/installation/) |
| kubectl | Kubernetes CLI           | `brew install kubectl`                                                                          | `apt install kubectl` / distro                           |

**Optional (only for SOPS/age in non-local envs):** `age` — e.g. `brew install age`. You do **not** need it for the local-only flow below.

## Step-by-step

### Step 1: Clone and go to repo root

```bash
git clone https://github.com/podverse/boilerplate.git
cd boilerplate
```

(Or use your fork; same steps.)

### Step 2: Bring up the full local stack

One command runs the full sequence (env setup, image build, cluster create, secrets, ArgoCD install, stack apply). If you use the Nix dev shell, run `nix develop` at repo root (so k3d and kubectl are on PATH), ensure Docker Desktop is running, then run:

```bash
make local_k3d_up
```

This script (`scripts/infra/k3d/local-up.sh`) does the following in order:

1. **Env setup** – `scripts/local-env/setup.sh`: ensures `infra/config/local/*.env` and app `.env` files exist (copies from templates if missing; applies overrides from `dev/env-overrides/local/` if present).
2. **Build images** – builds local Docker images (api, management-api, web, web-sidecar, management-web, management-web-sidecar) and tags them for k3d.
3. **Create k3d cluster** – creates cluster `boilerplate-local` if it does not exist, with ports 4000, 4002, 4100, 4102, 5433, 6380 exposed.
4. **Import images** – loads the built images into the k3d cluster.
5. **Create Kubernetes secrets** – `scripts/infra/k3d/create-local-secrets.sh`: creates secrets in `boilerplate-local` from `infra/config/local/*.env`.
6. **Install ArgoCD** – installs ArgoCD in the `argocd` namespace and waits for the server.
7. **Bootstrap ArgoCD** – applies `infra/k8s/argocd-project.yaml` and `infra/k8s/local-application.yaml` (app-of-apps).
8. **Apply local stack** – `kubectl apply -k infra/k8s/local/stack` so the stack is up even before ArgoCD sync from the repo.

When it finishes, it prints the app URLs.

### Step 3: Verify workloads

```bash
make local_k3d_status
```

You should see pods and services in `boilerplate-local`. Wait until pods are `Running` (and optionally `Ready`). First run can take a minute while images start.

### Step 4: Use the apps

| App            | URL                   |
| -------------- | --------------------- |
| API            | http://localhost:4000 |
| Web            | http://localhost:4002 |
| Management API | http://localhost:4100 |
| Management Web | http://localhost:4102 |
| Postgres       | localhost:5433        |
| Valkey         | localhost:6380        |

### Step 5: Open ArgoCD UI (optional)

```bash
make local_argocd_port_forward
```

Then open **https://localhost:8080** in a browser (accept the TLS warning for local). The local app-of-apps points at the Boilerplate repo; you can inspect sync and apps here.

### Step 6: Tear down

When you are done:

```bash
make local_k3d_down
```

This removes the k3d cluster and all resources in it.

---

## Troubleshooting

- **Cluster already exists:** `make local_k3d_up` is idempotent for cluster create (skips if `boilerplate-local` exists). It will still run env setup, build images, import them, recreate secrets, re-apply ArgoCD and the local stack.
- **Ports in use:** Ensure 4000, 4002, 4100, 4102, 5433, 6380, and (for ArgoCD) 8080 are free. Change k3d port mapping in `scripts/infra/k3d/local-up.sh` if you need different host ports.
- **Pods not ready:** Run `make local_k3d_status` and `kubectl -n boilerplate-local describe pod <name>` for events. Check that DB and Valkey pods are up first; API and web depend on them.
- **ArgoCD sync:** Local stack is applied directly with `kubectl apply -k infra/k8s/local/stack`, so the apps run without waiting for ArgoCD. ArgoCD may show the app as out of sync; that is expected if you are on a branch or commit that differs from the configured repo revision.

## Notes

- Local flow uses `scripts/local-env/setup.sh` and `infra/config/local/*.env`; it does not use Ansible.
- `infra/k8s/local-application.yaml` points at the Boilerplate repo (e.g. `https://github.com/podverse/boilerplate.git`). Align branch/revision with your workflow if you rely on ArgoCD sync.
- For more on infra layout and k8s, see [infra/k8s/INFRA-K8S.md](../../infra/k8s/INFRA-K8S.md) and [infra/INFRA.md](../../infra/INFRA.md).

## SOPS + age (optional; for non-local envs)

For **local-only** use you do not need SOPS or age. Secrets are plain env files under `infra/config/local/`.

When you later add **non-local** environments (e.g. alpha), you can:

1. Generate an age key: `bash scripts/infra/sops/generate-age-key.sh` (writes `.secrets/age.key`).
2. Replace placeholders in `infra/k8s/secrets/local/` and `infra/k8s/secrets/alpha/` with SOPS-encrypted values as needed.
