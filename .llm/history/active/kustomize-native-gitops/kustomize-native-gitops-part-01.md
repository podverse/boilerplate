### Metadata

- Started: 2026-03-30
- Author: Agent
- Context: Complete Kustomize-native GitOps script rollout (CI + docs + verification)

### Session 1 - 2026-03-30

#### Prompt (Developer)

implement

#### Key Decisions

- Add `imranismail/setup-kustomize@v2` with pinned `v5.5.0` to bump workflow so `kustomize edit` is on PATH.
- Update REMOTE-K8S-GITOPS.md Step 1 and Step 13: distinguish `kubectl kustomize` (build) vs standalone `kustomize` (edit scripts); Ruby already required for render, also used by bump/align helpers.
- Document prerequisites in BOILERPLATE-PUBLISH-GITOPS-BUMP-CHECKLIST, BOILERPLATE-GITOPS-PINS, GITOPS-BOOTSTRAP.
- Use `--` before resource arguments in `kustomize edit remove/add resource` for safe parsing.
- Skip `kustomize edit set image` when every `images[].newTag` already equals the target tag (no-op dry-run stays quiet).

#### Files Modified

- k.podcastdj.com/.github/workflows/bump-boilerplate-alpha-pins.yml
- k.podcastdj.com/scripts/lib/kustomize-overlay.inc.sh
- boilerplate/docs/development/REMOTE-K8S-GITOPS.md
- boilerplate/docs/development/BOILERPLATE-PUBLISH-GITOPS-BUMP-CHECKLIST.md
- k.podcastdj.com/docs/BOILERPLATE-GITOPS-PINS.md
- k.podcastdj.com/docs/GITOPS-BOOTSTRAP.md
- boilerplate/.llm/history/active/kustomize-native-gitops/kustomize-native-gitops-part-01.md

### Session 2 - 2026-04-03

#### Prompt (Developer)

implement

#### Key Decisions

- Align remaining docs and Makefile comments with **`boilerplate-*-config.bundle/`** (per-file keys + inner **`configMapGenerator`** **`files:`**), not **`boilerplate-*-config.env`** / parent-overlay **`envs:`** (Kustomize `envs` mangles quoted values).
- Drift validation narrative: **`diff -qr`** on bundle trees.

#### Files Modified

- boilerplate/docs/development/K8S-ENV-RENDER.md
- boilerplate/docs/development/REMOTE-K8S-GITOPS.md
- boilerplate/makefiles/gitops/Makefile.gitops-env.mk
- boilerplate/.llm/history/active/kustomize-native-gitops/kustomize-native-gitops-part-01.md

### Session 3 - 2026-04-03

#### Prompt (Developer)

drop the number prefixes in k8s file names

#### Key Decisions

- Renamed per-component base manifests from **`01-`…`05-`** to descriptive names (`service.yaml`, `deployment.yaml`, `pvc-postgres.yaml`, etc.); **`kustomization.yaml`** `resources` lists updated.
- Local stack **`postgres-init/`**: dropped numeric prefixes on shell scripts; renamed bundled SQL to **`z_load_app_schema.sql`** / **`z_load_management_schema.sql`** so **`docker-entrypoint-initdb.d/`** lex order stays create users → setup management DB → app schema → management schema (documented in **`base/stack/kustomization.yaml`** comment).

#### Files Modified

- infra/k8s/base/api/{service,deployment}.yaml (renamed from 02-/03-)
- infra/k8s/base/management-api/{service,deployment}.yaml
- infra/k8s/base/db/{pvc-postgres,service-postgres,deployment-postgres}.yaml
- infra/k8s/base/keyvaldb/{pvc-valkey,service-valkey,deployment-valkey}.yaml
- infra/k8s/base/web/{service-web,service-web-sidecar,deployment-web,deployment-web-sidecar}.yaml
- infra/k8s/base/management-web/{service-management-web,service-management-web-sidecar,deployment-management-web,deployment-management-web-sidecar}.yaml
- infra/k8s/base/stack/postgres-init/{create_app_db_users,setup_management_database}.sh, z_load_{app,management}_schema.sql
- infra/k8s/base/{api,management-api,db,keyvaldb,web,management-web,stack}/kustomization.yaml
- docs/development/REMOTE-K8S-POSTGRES-REINIT.md
- scripts/local-env/local-management-db.sh
- makefiles/local/Makefile.local.env.mk
- .llm/history/active/kustomize-native-gitops/kustomize-native-gitops-part-01.md
