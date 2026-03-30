# Remote Kubernetes (GitOps)

**Start here** for deploying Boilerplate to a **remote** cluster with GitOps and Argo CD (thin overlays, env render, SOPS). For local k3d, see [K3D-ARGOCD-LOCAL.md](K3D-ARGOCD-LOCAL.md).

End-to-end steps from a **clean slate** to a working Boilerplate stack on **your** cluster and **your** domains, using a **separate GitOps repository** for Kustomize overlays, Argo CD `Application` resources, and (after env render) generated ConfigMaps and Secret patches.

This repository holds application source, [`infra/env/classification`](../../infra/env/classification/), and `make alpha_env_render`. The GitOps repo is yours: layout, namespace names, and hostnames are conventions you choose and keep consistent with Argo CD and ingress.

## Dry runs first (recommended)

Where a **dry run** exists, use it **before** the real command so you catch mistakes without writing to Git, the cluster, or the registry.

| When                                                        | Dry run (use this first)                                                                                                | Then                                                                                    |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Git push** (GitOps **`main`**)                            | `git push --dry-run origin main`                                                                                        | `git push`                                                                              |
| **Pin images + Boilerplate `?ref=`** (e.g. k.podcastdj.com) | `./scripts/bump-boilerplate-alpha-pins.sh <VERSION_TAG> --dry-run`                                                      | `./scripts/bump-boilerplate-alpha-pins.sh <VERSION_TAG> --push` or manual edit + commit |
| **Env render** (Boilerplate root)                           | `make alpha_env_render_dry_run` (optional: set `BOILERPLATE_K8S_OUTPUT_REPO` to match validate/render)                  | `make alpha_env_validate` then `make alpha_env_render`                                  |
| **Apply Argo `Application` / `AppProject` YAML**            | `kubectl apply --dry-run=server -f …` (or `=client` if server dry-run is unavailable)                                   | `kubectl apply -f …`                                                                    |
| **Apply decrypted Secret YAML**                             | `sops -d secrets/… \| kubectl apply --dry-run=server -n <namespace> -f -`                                               | `sops -d … \| kubectl apply -n <namespace> -f -`                                        |
| **Compile overlays locally**                                | `kubectl kustomize apps/boilerplate-<env>/api --load-restrictor LoadRestrictionsNone >/dev/null` (repeat per component) | Push GitOps and sync Argo                                                               |
| **Argo CD sync** (CLI)                                      | `argocd app sync <app> --dry-run` when your Argo CD version supports it                                                 | Normal sync (UI or CLI)                                                                 |

**Boilerplate remote bases:** Pin **`?ref=`** to an **immutable tag** (e.g. **`X.Y.Z-staging.N`** from publish), not a branch name, for production-style alpha overlays—see [BOILERPLATE-PUBLISH-GITOPS-BUMP-CHECKLIST.md](BOILERPLATE-PUBLISH-GITOPS-BUMP-CHECKLIST.md).

## Terminology (examples)

Throughout this doc, replace placeholders with your own names:

| Placeholder                     | Meaning                                                                                                                                                                                                                          |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GitOps repo**                 | Repository Argo CD syncs (clone URL you control).                                                                                                                                                                                |
| **`apps/boilerplate-<env>/`**   | Per-component overlays (e.g. `alpha`, `beta`, `prod`). Render output paths use the same `<env>` as `dev/env-overrides/<env>/` in this repo. The SemVer segment **`-staging.N`** on **images** is not a cluster environment name. |
| **`argocd/boilerplate-<env>/`** | Argo `Application` manifests for that environment.                                                                                                                                                                               |
| **`<namespace>`**               | Kubernetes namespace for workloads (often matches env, e.g. `boilerplate-alpha`).                                                                                                                                                |
| **Public URLs**                 | e.g. `https://app.example.com`, `https://api.example.com`, `https://management.example.com` — must match ingress, TLS, CORS, and cookie settings in overrides.                                                                   |

## What you are wiring

| Piece                       | Role                                                                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kubernetes cluster**      | Runs workloads; typically has **Argo CD**, **cert-manager**, and an **ingress controller** (Traefik, nginx, etc.).                                 |
| **GitOps repo**             | Kustomize overlays, Argo `Application` CRs, encrypted registry/pull secrets, and (after render) ConfigMaps + `deployment-secret-env.yaml` patches. |
| **This (Boilerplate) repo** | Source code, env classification, `make alpha_env_*`, image build (CI or local), and `BOILERPLATE_K8S_OUTPUT_REPO` pointing at your GitOps clone.   |
| **Container registry**      | Hosts images (e.g. GitHub Container Registry); cluster needs an image pull secret if the registry is private.                                      |

### GitOps repo vs public domains (Podverse reference)

The **GitOps** repository (**k.podcastdj.com**) holds overlays, ingress, and Argo CD `Application`
CRs. **Browser and API hostnames** for Boilerplate alpha are on **metaboost.cc** (same cluster,
different DNS/TLS names). Keep **`alpha_env_render`** overrides, ingress rules, CORS, and cookie
domains consistent with those public hosts. See also [ARGOCD-GITOPS-BOILERPLATE.md](ARGOCD-GITOPS-BOILERPLATE.md).

### Publish order after changing Boilerplate bases

When you change manifests under **`infra/k8s/base/`** in this repo, or ship new images:

1. After a successful **Publish staging** run in **this** repository, a **Git tag** **`X.Y.Z-staging.N`**
   exists (same string as GHCR; see [ARGOCD-GITOPS-BOILERPLATE.md](ARGOCD-GITOPS-BOILERPLATE.md)).
2. In your **GitOps** repo, set overlay **`images[].newTag`** and remote Boilerplate base **`?ref=`** to
   that **immutable tag** (scripted or manual)—see
   [BOILERPLATE-PUBLISH-GITOPS-BUMP-CHECKLIST.md](BOILERPLATE-PUBLISH-GITOPS-BUMP-CHECKLIST.md). **Dry run**
   the pin bump when a script supports it (e.g. **`--dry-run`**) before **`--push`** / commit.
3. **Argo `Application.spec.source.targetRevision`** on the GitOps repo should be **`main`** (not
   Boilerplate). **Alpha / beta / prod** are **path prefixes** (`apps/boilerplate-alpha`, …), not
   extra long-lived branches on the GitOps repo. **`?ref=`** on Boilerplate URLs still uses the
   immutable tag **`X.Y.Z-staging.N`**. Keep **GitOps `targetRevision`** and **Boilerplate `?ref=`**
   mentally separate.
4. From **Boilerplate** root: **`make alpha_env_render_dry_run`**, then **`make alpha_env_validate`**, then
   **`make alpha_env_render`** when env/classification/overrides changed (port + ingress patches run at the
   end of render). Skip render if this release is images-only with no env changes.
5. **SOPS-encrypt** any new or changed Secret YAML under **`secrets/`**, commit **encrypted** files and
   overlay updates in the GitOps repo.
6. **Push** **`main`** on the GitOps repo (matching **`targetRevision`**), then **sync** Applications in
   dependency order (Step 11). Prefer **dry-run sync** when available (see table above).

## Step 1 — Tooling and access

**Do this:** Install **kubectl**, **SOPS**, **age** (encrypt/decrypt), **Docker** (optional local builds),
**Ruby** (stdlib; used by render scripts), **Git**, and **make**. Ensure you can **push** **`main`** on the
GitOps remote Argo CD syncs and **pull** images from your registry (e.g. PAT with `read:packages` for GHCR pull
secrets).

**Kustomize:** Kustomize is **embedded in kubectl**. This guide uses **`kubectl kustomize <path>`** only. You do
**not** install or verify a separate **`kustomize`** binary for the workflows here.

**Verify tooling** (from any shell; versions should print and exit 0):

```bash
kubectl version --client=true
sops --version
age --version
age-keygen --version
docker --version
ruby --version
git --version
make --version
kubectl kustomize --help >/dev/null && echo "kubectl kustomize: ok"
```

**Verify Git push** to **`main`** on the GitOps remote Argo CD tracks. **Always dry-run push first**
when automating or before a large promotion:

```bash
git remote -v
git fetch origin
git push --dry-run origin main
```

**Verify registry pull** (optional; requires credentials with `read:packages` for GHCR):

```bash
docker login ghcr.io
docker pull <registry>/<image>:<tag>
```

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

**Do this:** Ensure **Argo CD** is installed (e.g. namespace `argocd`), your **kubeconfig** points at the target
cluster, and **DNS** for your public hostnames resolves to the ingress entrypoint. Align **cert-manager**
ClusterIssuer / ingress annotations in your GitOps **Ingress** resources with your DNS and CA workflow
(HTTP-01, DNS-01, or your provider’s pattern).

**Verify cluster and Argo CD:**

```bash
kubectl config current-context
kubectl cluster-info
kubectl get ns argocd
kubectl get pods -n argocd
```

**Verify DNS** (replace with your real API or app hostname):

```bash
dig +short api.example.com
# or: nslookup api.example.com
```

**Verify cert-manager** (if you use it):

```bash
kubectl get clusterissuer
kubectl -n <namespace> get certificate
```

**Why:** Wrong TLS or ingress class prevents HTTPS and breaks browser API calls until manifests match your platform.

---

## Step 4 — Align Argo CD `Application` sources with your Git remote

### One-time bootstrap (your GitOps remote)

After a **fresh clone or fork** of your GitOps repository, each Argo `Application` under
`argocd/boilerplate-<env>/` must use **`spec.source.repoURL`** and **`targetRevision`** for **your**
Git remote URL and **`main`** — not a template or another operator’s fork.

Run all commands from the **root of your GitOps repository** (where `scripts/` and `argocd/` live).
Replace placeholders (`<org>`, `<gitops-repo>`, `<env>`, tags) with your values. More detail lives in
your clone’s **`docs/GITOPS-BOOTSTRAP.md`** and **`docs/BOILERPLATE-GITOPS-PINS.md`** when present.

**1. Preview** Argo `Application` sources (no writes) — one env or all `argocd/boilerplate-*/`
directories:

```bash
./scripts/align-argocd-application-sources.sh \
  --repo-url 'https://github.com/<org>/<gitops-repo>.git' \
  --revision main \
  --env <env> \
  --dry-run
```

```bash
./scripts/align-argocd-application-sources.sh \
  --repo-url 'https://github.com/<org>/<gitops-repo>.git' \
  --revision main \
  --all-boilerplate \
  --dry-run
```

**2. Apply** when the diff is correct (skip if dry-run showed no diff — already aligned):

```bash
./scripts/align-argocd-application-sources.sh \
  --repo-url 'https://github.com/<org>/<gitops-repo>.git' \
  --revision main \
  --env <env>
```

```bash
./scripts/align-argocd-application-sources.sh \
  --repo-url 'https://github.com/<org>/<gitops-repo>.git' \
  --revision main \
  --all-boilerplate
```

**Interactive:** On a TTY you may omit **`--repo-url`** and **`--revision`** (script prompts); you
must still pass **`--env`**, **`--all-boilerplate`**, or **`--dir`**. Use **`--interactive`** to
force prompts when stdin is not a TTY. See **`./scripts/align-argocd-application-sources.sh --help`**.

**Manual:** Edit each YAML under `argocd/boilerplate-<env>/` and set **`repoURL`** and
**`targetRevision`** explicitly.

**Why:** Argo CD must sync **your** GitOps repo; a stale `repoURL` points at the wrong repository.

### Optional: Boilerplate fork (remote base URL only)

If overlays must pull bases from **your** Boilerplate fork, rewrite the repo **prefix** on remote
`resources:` URLs (does **not** change **`?ref=`** or image tags).

**1. Preview:**

```bash
./scripts/align-boilerplate-git-base.sh \
  --from 'https://github.com/<upstream-org>/boilerplate' \
  --to 'https://github.com/<your-org>/boilerplate' \
  --env <env> \
  --dry-run
```

**2. Apply** without **`--dry-run`** (skip if you keep upstream Boilerplate bases):

```bash
./scripts/align-boilerplate-git-base.sh \
  --from 'https://github.com/<upstream-org>/boilerplate' \
  --to 'https://github.com/<your-org>/boilerplate' \
  --env <env>
```

### Recurring: pin Boilerplate bases and images

After **Boilerplate** publish, **`?ref=`** on remote bases and **`images[].newTag`** must use the
same immutable tag as Git and GHCR.

**1. Preview:**

```bash
./scripts/bump-boilerplate-alpha-pins.sh '<X.Y.Z-staging.N>' --dry-run
```

**2. Apply** (writes files):

```bash
./scripts/bump-boilerplate-alpha-pins.sh '<X.Y.Z-staging.N>'
```

Then **`git diff`**, commit, and push. For scripted **topic branch** + push (e.g. PR flow), use
**`--push`** as documented in your GitOps repo’s **`docs/BOILERPLATE-GITOPS-PINS.md`**.

**Fork:** When pins target a Boilerplate fork, set **`BOILERPLATE_GIT_BASE`** (no trailing slash) on
the same command line:

```bash
BOILERPLATE_GIT_BASE='https://github.com/<your-org>/boilerplate' \
  ./scripts/bump-boilerplate-alpha-pins.sh '<X.Y.Z-staging.N>' --dry-run
```

```bash
BOILERPLATE_GIT_BASE='https://github.com/<your-org>/boilerplate' \
  ./scripts/bump-boilerplate-alpha-pins.sh '<X.Y.Z-staging.N>'
```

Details: your GitOps repo’s **`docs/BOILERPLATE-GITOPS-PINS.md`**.

### Optional: compile overlays locally

```bash
kubectl kustomize apps/boilerplate-<env>/api \
  --load-restrictor LoadRestrictionsNone >/dev/null
kubectl kustomize apps/boilerplate-<env>/web \
  --load-restrictor LoadRestrictionsNone >/dev/null
kubectl kustomize apps/boilerplate-<env>/management-api \
  --load-restrictor LoadRestrictionsNone >/dev/null
kubectl kustomize apps/boilerplate-<env>/management-web \
  --load-restrictor LoadRestrictionsNone >/dev/null
kubectl kustomize apps/boilerplate-<env>/db \
  --load-restrictor LoadRestrictionsNone >/dev/null
kubectl kustomize apps/boilerplate-<env>/keyvaldb \
  --load-restrictor LoadRestrictionsNone >/dev/null
kubectl kustomize apps/boilerplate-<env>/common \
  --load-restrictor LoadRestrictionsNone >/dev/null
```

### Kustomize remote bases (thin overlays)

If component overlays in your GitOps repo **pull** shared bases from this repository via
`resources:` (instead of duplicating Deployments), each entry must be a **remote git URL**
Kustomize can clone, not a bare `github.com/org/repo/...` string (that form is treated as a
**relative path** and breaks `kubectl kustomize`).

**Use:**

```text
https://github.com/<org>/boilerplate//infra/k8s/base/<component>?ref=<immutable-tag-or-commit>
```

Note the **`//`** after the repository segment: it separates the repo URL from the path **inside**
the repo. Optional query params include `ref` (immutable tag or full commit hash) and `timeout`.

**Pin `ref`:** `kubectl kustomize` and Argo CD only resolve manifests that **exist at that
revision**. For production-style overlays, set **`ref`** to the **immutable publish tag**
**`X.Y.Z-staging.N`** (same as GHCR), not a moving branch name.

---

## Step 5 — Register the Argo CD project and applications

**Do this:** From the **GitOps** repo root, with kubectl context set to the remote cluster, apply your **AppProject** and the **Application** set for Boilerplate (paths depend on how you organized the repo). **Dry-run apply first** so the API rejects invalid YAML before anything is stored:

```bash
kubectl apply --dry-run=server -f argocd/apps/<your-project>.yaml
kubectl apply --dry-run=server -f argocd/boilerplate-<env>/
kubectl apply -f argocd/apps/<your-project>.yaml
kubectl apply -f argocd/boilerplate-<env>/
```

**Why:** Creates the Argo **AppProject** and one **Application** per slice (common, db, keyvaldb, api, management-api, web, management-web, etc.). Document sync order and any team-specific steps in **your GitOps repo** (e.g. `docs/DEPLOYMENT.md`).

---

## Step 6 — Container registry pull secret (`<namespace>`)

**Do this:** Create a **`docker-registry`** Secret in **`<namespace>`** so workloads can pull **private**
images. Many GitOps repos that ship Boilerplate overlays include a **GitHub Container Registry (GHCR)**
helper; otherwise create the Secret by hand, encrypt with **SOPS** before commit, and apply decrypted YAML
when bootstrapping.

### GitHub Container Registry (when `create_github_registry_secret.sh` exists)

From **your GitOps repository root**, if **`./scripts/create_github_registry_secret.sh`** is present:

1. Run **`./scripts/create_github_registry_secret.sh`** (it **prompts** for GitHub username, a **Personal
   Access Token**, and namespace — use **`<namespace>`** e.g. **`boilerplate-alpha`**). The PAT needs
   **`read:packages`** (and **`write:packages`** only if you push images with that token).
2. The script writes **`secrets/<namespace>/github-registry-secret.enc.yaml`** (SOPS-encrypted
   **`docker-registry`** secret for **`ghcr.io`**, name **`github-registry-secret`**). Commit the **encrypted**
   file only; requires repo **`.sops.yaml`** / age keys like your other secrets.
3. Apply to the cluster:

```bash
sops -d secrets/<namespace>/github-registry-secret.enc.yaml | kubectl apply -f -
```

The manifest includes **`metadata.namespace`**; **`kubectl apply -f -`** targets that namespace.

**`imagePullSecrets`:** Pod templates (or the **`ServiceAccount`** they use) must reference
**`github-registry-secret`** (or whatever name your script uses). Wire this in your GitOps overlays or
patches — see **your GitOps repo** README or deployment docs.

### Other registries or no helper script

Create a **`docker-registry`** Secret manifest without applying cleartext to the cluster, then encrypt and
commit:

```bash
kubectl create secret docker-registry <secret-name> \
  --docker-server=<registry-host> \
  --docker-username=<user> \
  --docker-password=<token> \
  --namespace=<namespace> \
  --dry-run=client -o yaml > temp-secret.yaml
# encrypt temp-secret.yaml with sops to secrets/<namespace>/<file>.enc.yaml, commit, remove temp-secret.yaml
```

Apply when bootstrapping:

```bash
sops -d secrets/<path-to-encrypted-pull-secret>.yaml | kubectl apply -f -
```

**Why:** Without pull credentials, pods remain in **`ImagePullBackOff`**.

---

## Step 7 — Env overrides (`remote_k8s` + GitOps overlay)

**Do this:**

1. **GitOps repo (per environment):** Add or edit **`apps/boilerplate-<env>/env/remote-k8s.yaml`** — same YAML shape as the monorepo’s [`infra/env/overrides/remote-k8s.yaml`](../../infra/env/overrides/remote-k8s.yaml) (`version` + `env_groups`). Put **deployment-specific** defaults here: **`WEB_BASE_URL`**, **`MANAGEMENT_WEB_BASE_URL`**, **`API_PUBLIC_BASE_URL`**, **`MANAGEMENT_API_PUBLIC_BASE_URL`**, **`API_COOKIE_DOMAIN`**, **`API_CORS_ORIGINS`**, **`MANAGEMENT_API_COOKIE_DOMAIN`**, **`MANAGEMENT_API_CORS_ORIGINS`**, etc. Use **`https://`** where ingress serves TLS. Commit this file in the GitOps repo (not under **`secrets/`**).

2. **Boilerplate monorepo:** [`infra/env/overrides/remote-k8s.yaml`](../../infra/env/overrides/remote-k8s.yaml) stays **portable** (in-cluster **`postgres`** / **`valkey`** hostnames, empty URL shells). Forks do not need to fork site-specific hosts.

3. **Optional `.env` layers:** In **Boilerplate** repo root, **`make alpha_env_prepare`** / **`make alpha_env_link`** then edit **`~/.config/boilerplate/alpha-env-overrides/*.env`** for secrets and any keys you do not want in Git (JWT, DB passwords, Valkey password, mailer, etc.).

**Why:** Classification drives ConfigMaps and Secret key sets; public URLs and cookies must match ingress. Keeping site defaults in the GitOps overlay keeps the Boilerplate clone generic; `make alpha_env_render` merges the GitOps file automatically when **`BOILERPLATE_K8S_OUTPUT_REPO`** points at that clone (see **[K8S-ENV-RENDER.md](K8S-ENV-RENDER.md)**).

---

## Step 8 — Render ConfigMaps and Secret patches into the GitOps repo

**Do this:** From **Boilerplate** root, **in order** (dry run before writing files):

```bash
export BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/your/gitops-repo
make alpha_env_render_dry_run   # always first: prints rendered YAML; does not write
make alpha_env_validate         # classification + drift vs committed overlay (needs output repo)
make alpha_env_render           # writes ConfigMaps, deployment-secret-env.yaml, port/ingress patches, secrets/.../plain/
```

**Why:** Keeps overlay ConfigMaps and **`deployment-secret-env.yaml`** in sync with [`infra/env/classification`](../../infra/env/classification). Full reference: **[K8S-ENV-RENDER.md](K8S-ENV-RENDER.md)**.

---

## Step 9 — Encrypt Secret YAML and commit (never commit cleartext)

**Do this:** For each cleartext file under **`secrets/.../plain/`** (and any other tracked Secret), encrypt with **SOPS** (team **`.sops.yaml`** / age keys). Commit **encrypted** manifests and updated **`apps/boilerplate-<env>/**`** files. Do **not** commit the **`plain/`\*\* directory if it is gitignored (or otherwise keep cleartext out of Git).

**Why:** The GitOps repo stays safe; the cluster receives cleartext only via `sops -d | kubectl apply`, a secrets operator, or your org’s standard pattern.

Apply encrypted secrets to the cluster (repeat per file as documented in your GitOps repo). **Dry-run
apply first** when you want the API server to validate objects without persisting them:

```bash
sops -d secrets/<path>/boilerplate-api-secrets.enc.yaml | kubectl apply --dry-run=server -n <namespace> -f -
sops -d secrets/<path>/boilerplate-api-secrets.enc.yaml | kubectl apply -n <namespace> -f -
# ... db, valkey, management-api, web, management-web, sidecars as applicable
```

---

## Step 10 — Build and publish container images

**Do this:** Push images to your registry with tags referenced in GitOps Kustomize **`images[].newTag`** (e.g. per-app `kustomization.yaml`). Typical path: CI runs **Publish staging** and publishes pre-release tags **`X.Y.Z-staging.N`**. Alternatively build and push locally with the same tag scheme.

**Why:** Argo CD syncs Deployments that point at immutable tags; missing tags cause pull failures.

**Image names:** Point **`images[].name`** / **`newName`** in overlays at **your** registry and repository path (forks and orgs differ).

---

## Step 11 — Push GitOps; sync Argo CD in order

**Do this:** **Dry-run `git push`** to **`main`** on the GitOps remote (Step 1 table), then push for real.
In Argo CD, sync in dependency order (datastores before APIs, APIs before web), e.g.:

1. **common** (namespace, ingress, TLS hosts)
2. **db**, **keyvaldb**
3. **api**, **management-api**
4. **web**, **management-web**

Use **dry-run sync** first when your tooling supports it (e.g. **`argocd app sync <app> --dry-run`**), then
sync for real (UI or CLI).

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

## Step 13 — Verify deployment

**Do this:** Run the checks below with your real `<namespace>` and public hostnames. Kustomize is part of
kubectl (Step 1); there is **no** separate `kustomize` install to verify here.

**Verify workloads and ingress in the cluster:**

```bash
kubectl -n <namespace> get pods,svc,ingress
kubectl -n <namespace> get certificate   # if using cert-manager Certificate resources
```

**Verify API health** (replace URL with your API base and path):

```bash
curl -sI https://api.example.com/v1/health
```

**Recommended before push — validate Kustomize overlays locally** (from your **GitOps** repo root; same
engine Argo uses via kubectl). This is a **dry run** of manifest compilation (no cluster writes):

```bash
kubectl kustomize apps/boilerplate-<env>/api --load-restrictor LoadRestrictionsNone >/dev/null && echo "kustomize api overlay: ok"
# repeat per component: db, keyvaldb, management-api, web, management-web, common, …
```

**Remote git bases:** Overlays that use `resources:` URLs into this repo need
**`--load-restrictor LoadRestrictionsNone`** so kubectl’s Kustomize can read cloned paths outside
the overlay root (same behavior Argo CD uses for remote bases).

Open your web and management URLs in a browser.

**Why:** Confirms TLS, routing, and readiness.

---

## Quick reference — same commands in sequence

```bash
# Repos
git clone <boilerplate> && git clone <gitops-repo>

# GitOps registration (gitops repo root, correct kube context)
kubectl apply --dry-run=server -f argocd/apps/<project>.yaml
kubectl apply --dry-run=server -f argocd/boilerplate-<env>/
kubectl apply -f argocd/apps/<project>.yaml
kubectl apply -f argocd/boilerplate-<env>/

# Registry secret (your process; then apply encrypted)
# ...

# Boilerplate: alpha env + render
cd boilerplate
make alpha_env_prepare_link
# edit ~/.config/boilerplate/alpha-env-overrides/*.env
export BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/gitops-repo
make alpha_env_render_dry_run && make alpha_env_validate && make alpha_env_render

# GitOps: sops encrypt plain secrets, commit, push
# kubectl apply --dry-run=server … then kubectl apply decrypted secrets to <namespace>

# Images: CI or local push; tags must match kustomization newTag

# Argo CD: sync common → db/keyvaldb → apis → webs
# Then: create-super-admin for management

# Optional: kustomize check from GitOps root (remote bases need LoadRestrictionsNone)
# kubectl kustomize apps/boilerplate-<env>/api --load-restrictor LoadRestrictionsNone >/dev/null
```

---

## Related docs

- **Pins after each publish:** [BOILERPLATE-PUBLISH-GITOPS-BUMP-CHECKLIST.md](BOILERPLATE-PUBLISH-GITOPS-BUMP-CHECKLIST.md).
- **Env render / make targets:** [K8S-ENV-RENDER.md](K8S-ENV-RENDER.md).
- **Variable catalog:** [ENV-REFERENCE.md](ENV-REFERENCE.md).
- **Local k3d (contrast):** [K3D-ARGOCD-LOCAL.md](K3D-ARGOCD-LOCAL.md).
- **Where Argo Applications live:** [ARGOCD-GITOPS-BOILERPLATE.md](ARGOCD-GITOPS-BOILERPLATE.md).
- **Future beta/prod GitOps notes (placeholder):**
  [GITOPS-FUTURE-ENVIRONMENTS.md](GITOPS-FUTURE-ENVIRONMENTS.md).
- **Staging cutover:** [GITOPS-CUTOVER-STAGING-CHECKLIST.md](GITOPS-CUTOVER-STAGING-CHECKLIST.md).
- **Deployment checklist, sync order, team scripts:** maintain in **your GitOps repository** (this open-source Boilerplate repo does not ship org-specific manifests).
