# Remote Kubernetes (GitOps)

End-to-end steps from a **clean slate** to a working Boilerplate stack on **your** cluster and **your** domains, using a **separate GitOps repository** for Kustomize overlays, Argo CD `Application` resources, and (after env render) generated ConfigMaps and Secret patches.

This repository holds application source, [`infra/env/classification`](../../infra/env/classification/), and `make alpha_env_render`. The GitOps repo is yours: layout, namespace names, and hostnames are conventions you choose and keep consistent with Argo CD and ingress.

## Terminology (examples)

Throughout this doc, replace placeholders with your own names:

| Placeholder                     | Meaning                                                                                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GitOps repo**                 | Repository Argo CD syncs (clone URL you control).                                                                                                              |
| **`apps/boilerplate-<env>/`**   | Per-component overlays (e.g. `alpha`, `staging`). Render output paths use the same `<env>` as `dev/env-overrides/<env>/` in this repo.                         |
| **`argocd/boilerplate-<env>/`** | Argo `Application` manifests for that environment.                                                                                                             |
| **`<namespace>`**               | Kubernetes namespace for workloads (often matches env, e.g. `boilerplate-alpha`).                                                                              |
| **Public URLs**                 | e.g. `https://app.example.com`, `https://api.example.com`, `https://management.example.com` — must match ingress, TLS, CORS, and cookie settings in overrides. |

## What you are wiring

| Piece                       | Role                                                                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kubernetes cluster**      | Runs workloads; typically has **Argo CD**, **cert-manager**, and an **ingress controller** (Traefik, nginx, etc.).                                 |
| **GitOps repo**             | Kustomize overlays, Argo `Application` CRs, encrypted registry/pull secrets, and (after render) ConfigMaps + `deployment-secret-env.yaml` patches. |
| **This (Boilerplate) repo** | Source code, env classification, `make alpha_env_*`, image build (CI or local), and `BOILERPLATE_K8S_OUTPUT_REPO` pointing at your GitOps clone.   |
| **Container registry**      | Hosts images (e.g. GitHub Container Registry); cluster needs an image pull secret if the registry is private.                                      |

## Step 1 — Tooling and access

**Do this:** Install or verify **kubectl**, **kustomize**, **SOPS**, **age** (encrypt/decrypt), **Docker** (optional local builds), **Ruby** (stdlib; used by render scripts), **Git**, and **make**. Ensure you can **push** to the Git remote Argo CD tracks and **pull** images from your registry (e.g. PAT with `read:packages` for GHCR pull secrets).

**Why:** Render and validation run from this repo; secrets must be encrypted before commit; Argo CD and kubectl need a working kubeconfig.

---

## Step 2 — Clone both repositories

**Do this:**

```bash
git clone <url-to-your-boilerplate-fork-or-upstream>
git clone <url-to-your-gitops-repo>
```

**Why:** Env render writes into the GitOps working tree; you edit overlays and Argo apps alongside the application repo.

---

## Step 3 — Cluster and ingress assumptions

**Do this:** Confirm **Argo CD** is installed (e.g. namespace `argocd`), your **kubeconfig** points at the target cluster, and **DNS** for your public hostnames resolves to the ingress entrypoint. Align **cert-manager** ClusterIssuer / ingress annotations in your GitOps **Ingress** resources with your DNS and CA workflow (HTTP-01, DNS-01, or your provider’s pattern).

**Why:** Wrong TLS or ingress class prevents HTTPS and breaks browser API calls until manifests match your platform.

---

## Step 4 — Align Argo CD `Application` sources with your Git remote

**Do this:** In each Argo `Application` under `argocd/boilerplate-<env>/`, set **`spec.source.repoURL`** and **`targetRevision`** to the Git URL and branch your Argo CD instance should track.

**Why:** A fresh clone must not still reference someone else’s fork or branch.

---

## Step 5 — Register the Argo CD project and applications

**Do this:** From the **GitOps** repo root, with kubectl context set to the remote cluster, apply your **AppProject** and the **Application** set for Boilerplate (paths depend on how you organized the repo), for example:

```bash
kubectl apply -f argocd/apps/<your-project>.yaml
kubectl apply -f argocd/boilerplate-<env>/
```

**Why:** Creates the Argo **AppProject** and one **Application** per slice (common, db, keyvaldb, api, management-api, web, management-web, etc.). Document sync order and any team-specific steps in **your GitOps repo** (e.g. `docs/DEPLOYMENT.md`).

---

## Step 6 — Container registry pull secret (`<namespace>`)

**Do this:** Create a **docker-registry** (or equivalent) Secret in `<namespace>` so Deployments can pull private images. If you use a helper script in the GitOps repo, run it with your registry credentials and target namespace. Encrypt with **SOPS** before commit if you store manifests in Git; apply decrypted YAML to the cluster when bootstrapping:

```bash
sops -d secrets/<path-to-encrypted-pull-secret>.yaml | kubectl apply -f -
```

**Why:** Without pull credentials, pods remain in `ImagePullBackOff`.

---

## Step 7 — Env overrides in this repo (`remote_k8s`)

**Do this:** In **Boilerplate** repo root:

1. `make alpha_env_prepare` — creates **`~/.config/boilerplate/alpha-env-overrides/`** stub files (non-destructive).
2. `make alpha_env_link` — symlinks **`dev/env-overrides/alpha/*.env`** to those home files.
3. Edit overrides so **public URLs, cookies, and CORS** match your real hosts. The **`remote_k8s`** overlay in [`infra/env/overrides/remote-k8s.yaml`](../../infra/env/overrides/remote-k8s.yaml) clears localhost-oriented defaults; you supply production values via overrides: **`WEB_BASE_URL`**, **`MANAGEMENT_WEB_BASE_URL`**, **`API_PUBLIC_BASE_URL`**, **`API_COOKIE_DOMAIN`**, **`API_CORS_ORIGINS`**, **`MANAGEMENT_API_*`**, JWT secrets, DB passwords, Valkey password, mailer if used, etc. Use **`https://`** where ingress serves TLS.

**Why:** Classification drives ConfigMaps and Secret key sets; wrong hosts or cookies break auth and browser API calls.

---

## Step 8 — Render ConfigMaps and Secret patches into the GitOps repo

**Do this:** From **Boilerplate** root:

```bash
export BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/your/gitops-repo
make alpha_env_render_dry_run          # optional: inspect stdout
make alpha_env_validate                # classification + drift vs committed overlay
make alpha_env_render                  # writes ConfigMaps, deployment-secret-env.yaml, secrets/.../plain/
```

**Why:** Keeps overlay ConfigMaps and **`deployment-secret-env.yaml`** in sync with [`infra/env/classification`](../../infra/env/classification). Full reference: **[K8S-ENV-RENDER.md](K8S-ENV-RENDER.md)**.

---

## Step 9 — Encrypt Secret YAML and commit (never commit cleartext)

**Do this:** For each cleartext file under **`secrets/.../plain/`** (and any other tracked Secret), encrypt with **SOPS** (team **`.sops.yaml`** / age keys). Commit **encrypted** manifests and updated **`apps/boilerplate-<env>/**`** files. Do **not** commit **`plain/`\*\* if it is gitignored.

**Why:** The GitOps repo stays safe; the cluster receives cleartext only via `sops -d | kubectl apply`, a secrets operator, or your org’s standard pattern.

Apply encrypted secrets to the cluster (repeat per file as documented in your GitOps repo):

```bash
sops -d secrets/<path>/boilerplate-api-secrets.enc.yaml | kubectl apply -n <namespace> -f -
# ... db, valkey, management-api, web, management-web, sidecars as applicable
```

---

## Step 10 — Build and publish container images

**Do this:** Push images to your registry with tags referenced in GitOps Kustomize **`images[].newTag`** (e.g. per-app `kustomization.yaml`). Typical path: CI on a release or staging branch builds and publishes. Alternatively build and push locally with the same tag scheme.

**Why:** Argo CD syncs Deployments that point at immutable tags; missing tags cause pull failures.

**Image names:** Point **`images[].name`** / **`newName`** in overlays at **your** registry and repository path (forks and orgs differ).

---

## Step 11 — Push GitOps; sync Argo CD in order

**Do this:** Push the GitOps repo to the branch **`targetRevision`** references. In Argo CD, sync in dependency order (datastores before APIs, APIs before web), e.g.:

1. **common** (namespace, ingress, TLS hosts)
2. **db**, **keyvaldb**
3. **api**, **management-api**
4. **web**, **management-web**

**Why:** Datastores must be ready before APIs; web depends on APIs and runtime config.

---

## Step 12 — Bootstrap the first management super admin

**Do this:** Remote clusters do **not** run **`make local_infra_up`** or **`create-super-admin.mjs`** automatically. After **management-api** can reach Postgres and the management database exists, create the super admin once, e.g.:

- **Port-forward** Postgres (or management-api), point **`apps/management-api/.env`** at the forwarded host and DB secrets, then from Boilerplate root:  
  `node scripts/management-api/create-super-admin.mjs`  
  (or use **`DB_MANAGEMENT_SUPERUSER_USERNAME`** / **`DB_MANAGEMENT_SUPERUSER_PASSWORD`** in overrides for non-interactive bootstrap — see script header), **or**
- **`kubectl exec`** into a one-off job/pod with the management-api image and env — team-specific.

**Why:** Management web login requires a row in the management DB; schema init does not insert that user.

---

## Step 13 — Verify

**Do this:**

```bash
kubectl -n <namespace> get pods,svc,ingress
kubectl -n <namespace> get certificate   # if using cert-manager Certificate resources
curl -sI https://api.example.com/v1/health   # use your API host and health path
```

Open your web and management URLs in a browser. Use **`kustomize build apps/boilerplate-<env>/<app>`** locally to validate overlays.

**Why:** Confirms TLS, routing, and readiness.

---

## Quick reference — same commands in sequence

```bash
# Repos
git clone <boilerplate> && git clone <gitops-repo>

# GitOps registration (gitops repo root, correct kube context)
kubectl apply -f argocd/apps/<project>.yaml
kubectl apply -f argocd/boilerplate-<env>/

# Registry secret (your process; then apply encrypted)
# ...

# Boilerplate: alpha env + render
cd boilerplate
make alpha_env_prepare_link
# edit ~/.config/boilerplate/alpha-env-overrides/*.env
export BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/gitops-repo
make alpha_env_validate && make alpha_env_render

# GitOps: sops encrypt plain secrets, commit, push
# kubectl apply decrypted secrets to <namespace>

# Images: CI or local push; tags must match kustomization newTag

# Argo CD: sync common → db/keyvaldb → apis → webs
# Then: create-super-admin for management
```

---

## Related docs

- **Env render / make targets:** [K8S-ENV-RENDER.md](K8S-ENV-RENDER.md).
- **Variable catalog:** [ENV-REFERENCE.md](ENV-REFERENCE.md).
- **Local k3d (contrast):** [K3D-ARGOCD-LOCAL.md](K3D-ARGOCD-LOCAL.md).
- **Deployment checklist, sync order, team scripts:** maintain in **your GitOps repository** (this open-source Boilerplate repo does not ship org-specific manifests).
