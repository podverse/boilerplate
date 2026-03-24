# boilerplate-k8s-env-alpha

### Session 1 - 2026-03-23

#### Prompt (Developer)

Boilerplate alpha (and future beta/prod) K8s env automation

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Added `infra/k8s/env/classification.yaml`, scripts under `scripts/k8s-env/`, Make targets `alpha_env_*` / `k8s_env_*`, `dev/env-overrides/alpha/` examples.
- k.podcastdj.com: ConfigMap YAML in app overlays, Deployments use `configMapRef` + `secretRef`; cleartext Secrets under `secrets/alpha-boilerplate/plain/` (parent `secrets/` gitignored).
- Web / management-web main containers: removed `envFrom` (only literals); valkey uses Secret only.

#### Files Created/Modified

- Boilerplate: `infra/k8s/env/classification.yaml`, `scripts/k8s-env/*`, `makefiles/local/Makefile.local.k8s-env.mk`, `makefiles/local/Makefile.local.mk`, `dev/env-overrides/alpha/*`, `docs/development/K8S-ENV-RENDER.md`, `docs/development/LOCAL-ENV-OVERRIDES.md`, `.llm/plans/completed/boilerplate-k8s-env-alpha/*`
- k.podcastdj.com: `apps/alpha-boilerplate/*/kustomization.yaml`, deployments, generated `configmap*.yaml`, `secrets/alpha-boilerplate/README.md`, `docs/ALPHA-BOILERPLATE-DEPLOYMENT.md`, `secrets/beta-boilerplate/README.md`

### Session 2 - 2026-03-23

#### Prompt (Developer)

Implement classification per `boilerplate/.llm/plans/completed/boilerplate-k8s-env-alpha/01-classification-and-contract.md` and `infra/k8s/env/classification.yaml`.

#### Key Decisions

- Confirmed `classification.yaml` against all `source_files`; removed `VALKEY_PASSWORD` from
  `management-api` keys (not in `apps/management-api/.env.example`, app does not use Valkey).
- Expanded `01-classification-and-contract.md` with schema table and verification commands; fixed
  relative link to `../../../../infra/k8s/env/classification.yaml`.

#### Files Created/Modified

- `infra/k8s/env/classification.yaml`
- `.llm/plans/completed/boilerplate-k8s-env-alpha/01-classification-and-contract.md`
- `.llm/history/completed/boilerplate-k8s-env-alpha/boilerplate-k8s-env-alpha-part-01.md`

### Session 3 - 2026-03-23

#### Prompt (Developer)

Implement scripts per `02-boilerplate-render-scripts.md` and wire Make targets.

#### Key Decisions

- Extended `Makefile.local.k8s-env.mk`: `alpha_env_prepare_link`, `alpha_env_render_dry_run`, generic
  `k8s_env_prepare_link` / `k8s_env_render_dry_run`; pass `BOILERPLATE_K8S_OUTPUT_REPO` through Make to
  `--output-repo`; single-line recipes; header comments.
- Updated `Makefile.local.mk` main comment block, `K8S-ENV-RENDER.md`, and plan `02-boilerplate-render-scripts.md`
  (paths + verification).

#### Files Created/Modified

- `makefiles/local/Makefile.local.k8s-env.mk`
- `makefiles/local/Makefile.local.mk`
- `docs/development/K8S-ENV-RENDER.md`
- `.llm/plans/completed/boilerplate-k8s-env-alpha/02-boilerplate-render-scripts.md`

### Session 4 - 2026-03-23

#### Prompt (Developer)

(Handoff / completion) Polish plan `03-kpcastdj-manifests-and-sops.md` with manifest table, SOPS notes, verification; add SOPS encrypt/apply example to `k.podcastdj.com` `ALPHA-BOILERPLATE-DEPLOYMENT.md`.

#### Key Decisions

- `03-kpcastdj-manifests-and-sops.md`: workload → ConfigMap/Secret table, kustomize verify commands, Argo note; links to sibling repo via `../../../../../k.podcastdj.com/...`.
- `ALPHA-BOILERPLATE-DEPLOYMENT.md`: bootstrap step 3 expanded with `plain/` → encrypt → `kubectl apply` example.

#### Files Created/Modified

- `.llm/plans/completed/boilerplate-k8s-env-alpha/03-kpcastdj-manifests-and-sops.md`
- `k.podcastdj.com/docs/ALPHA-BOILERPLATE-DEPLOYMENT.md` (path relative to workspace: `/Users/mitcheldowney/repos/pv/k.podcastdj.com/docs/ALPHA-BOILERPLATE-DEPLOYMENT.md`)

### Session 5 - 2026-03-23

#### Prompt (Developer)

Add drift validation and docs per `04-validation-drifts-and-docs.md`.

#### Key Decisions

- Added `scripts/k8s-env/validate-k8s-env-drift.sh`: temp render + `cmp` of five ConfigMap paths vs GitOps repo; skip when
  repo missing; secrets not compared.
- `make alpha_env_validate` / `make k8s_env_validate` run classification then drift (`BOILERPLATE_K8S_OUTPUT_REPO` passed
  through).
- Docs: `K8S-ENV-RENDER.md` (Validation and drift), `04-validation-drifts-and-docs.md`, `ALPHA-BOILERPLATE-DEPLOYMENT.md`
  (ConfigMap drift section).

#### Files Created/Modified

- `scripts/k8s-env/validate-k8s-env-drift.sh`
- `makefiles/local/Makefile.local.k8s-env.mk`
- `docs/development/K8S-ENV-RENDER.md`
- `.llm/plans/completed/boilerplate-k8s-env-alpha/04-validation-drifts-and-docs.md`
- `k.podcastdj.com/docs/ALPHA-BOILERPLATE-DEPLOYMENT.md`

### Session 6 - 2026-03-23

#### Prompt (Developer)

Standardize `<app>-<env>` paths in k.podcastdj.com

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- k.podcastdj.com: `apps/boilerplate-alpha`, `apps/podverse-alpha`, `argocd/boilerplate-alpha`, `argocd/podverse-alpha`; secrets under `secrets/boilerplate-alpha` (merged former `secrets/alpha-boilerplate`), `secrets/boilerplate-beta`; doc renamed to `docs/BOILERPLATE-ALPHA-DEPLOYMENT.md`.
- Boilerplate: `render-k8s-env.sh` / `validate-k8s-env-drift.sh` use `OVERLAY=apps/boilerplate-${ENV_NAME}`, `SECRETS_DIR=.../secrets/boilerplate-${ENV_NAME}`; `K8S-ENV-RENDER.md` updated.
- Plans `03-kpcastdj-manifests-and-sops.md`, `04-validation-drifts-and-docs.md` link to new paths.

#### Files Created/Modified

- k.podcastdj.com: git mv app/argocd trees; `docs/BOILERPLATE-ALPHA-DEPLOYMENT.md` (from ALPHA-BOILERPLATE-DEPLOYMENT); `argocd/boilerplate-alpha/*.yaml`, `argocd/podverse-alpha/*.yaml`; `secrets/boilerplate-alpha/README.md`; `secrets/boilerplate-beta/README.md`
- Boilerplate: `scripts/k8s-env/render-k8s-env.sh`, `scripts/k8s-env/validate-k8s-env-drift.sh`, `docs/development/K8S-ENV-RENDER.md`, `.llm/plans/completed/boilerplate-k8s-env-alpha/03-kpcastdj-manifests-and-sops.md`, `.llm/plans/completed/boilerplate-k8s-env-alpha/04-validation-drifts-and-docs.md`, `.llm/history/completed/boilerplate-k8s-env-alpha/boilerplate-k8s-env-alpha-part-01.md`

### Session 7 - 2026-03-23

#### Prompt (Developer)

Align alpha K8s overrides with `~/.config/boilerplate/` (home-first)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Renamed `prepare-overrides.sh` / `link-overrides.sh` → `prepare-local-env-overrides.sh` / `link-local-env-overrides.sh`; `prepare-env-overrides.sh` / `link-env-overrides.sh` → `prepare-k8s-env-overrides.sh` / `link-k8s-env-overrides.sh`.
- `prepare-k8s-env-overrides.sh` now seeds `~/.config/boilerplate/<env>-env-overrides/` from `*.env.example` first (parity with local prepare); link unchanged except messages and usage strings.
- Updated `Makefile.local.env.mk`, `Makefile.local.k8s-env.mk`, `K8S-ENV-RENDER.md`, `LOCAL-ENV-OVERRIDES.md`, plan `02-boilerplate-render-scripts.md`.

#### Files Created/Modified

- `scripts/k8s-env/prepare-k8s-env-overrides.sh`, `scripts/k8s-env/link-k8s-env-overrides.sh`
- `scripts/local-env/prepare-local-env-overrides.sh`, `scripts/local-env/link-local-env-overrides.sh` (renamed from prepare-overrides / link-overrides)
- `makefiles/local/Makefile.local.env.mk`, `makefiles/local/Makefile.local.k8s-env.mk`
- `docs/development/K8S-ENV-RENDER.md`, `docs/development/LOCAL-ENV-OVERRIDES.md`
- `.llm/plans/completed/boilerplate-k8s-env-alpha/02-boilerplate-render-scripts.md`
- `.llm/history/completed/boilerplate-k8s-env-alpha/boilerplate-k8s-env-alpha-part-01.md`

### Session 8 - 2026-03-23

#### Prompt (Developer)

Unify env override layout (shared examples + per-env `.env`)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Canonical `*.env.example` files live under `dev/env-overrides/examples/`; removed duplicate examples from `local/` and `alpha/`.
- `prepare-local-env-overrides.sh` and `prepare-k8s-env-overrides.sh` delegate to `scripts/env-overrides/prepare-home-env-overrides.sh`; link scripts iterate `examples/` and write symlinks under `dev/env-overrides/local/` or `dev/env-overrides/<env>/`.
- `.gitignore`: track `examples/*.env.example`; ignore `alpha/*.env` like `local/*.env`. Docs, Make headers, `AGENTS.md`, `env-templates` skill, `env-file-formatting` globs updated.

#### Files Created/Modified

- `dev/env-overrides/examples/*.env.example`, deleted `dev/env-overrides/local/*.env.example`, `dev/env-overrides/alpha/*.env.example`
- `scripts/env-overrides/prepare-home-env-overrides.sh`, `scripts/local-env/prepare-local-env-overrides.sh`, `scripts/k8s-env/prepare-k8s-env-overrides.sh`, `scripts/local-env/link-local-env-overrides.sh`, `scripts/k8s-env/link-k8s-env-overrides.sh`
- `.gitignore`, `docs/development/LOCAL-ENV-OVERRIDES.md`, `docs/development/K8S-ENV-RENDER.md`, `AGENTS.md`, `makefiles/local/Makefile.local.mk`, `makefiles/local/Makefile.local.k8s-env.mk`
- `.cursor/skills/env-templates/SKILL.md`, `.cursor/rules/env-file-formatting.mdc`, `.llm/plans/completed/boilerplate-k8s-env-alpha/02-boilerplate-render-scripts.md`
- `.llm/history/completed/boilerplate-k8s-env-alpha/boilerplate-k8s-env-alpha-part-01.md`

### Session 9 - 2026-03-23

#### Prompt (Developer)

if this history and plans are completed, move to completed

#### Key Decisions

- Moved `.llm/plans/active/boilerplate-k8s-env-alpha/` → `.llm/plans/completed/boilerplate-k8s-env-alpha/` (entire plan set).
- Moved `.llm/history/active/boilerplate-k8s-env-alpha/` → `.llm/history/completed/boilerplate-k8s-env-alpha/`.
- Updated in-repo path references in `boilerplate-k8s-env-alpha-part-01.md` and `COPY-PASTA.md` from `active/` to `completed/`.

#### Files Created/Modified

- `.llm/plans/completed/boilerplate-k8s-env-alpha/*` (moved from `active/`)
- `.llm/history/completed/boilerplate-k8s-env-alpha/boilerplate-k8s-env-alpha-part-01.md`
- `.llm/plans/completed/boilerplate-k8s-env-alpha/COPY-PASTA.md`
