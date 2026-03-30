# k8s-env-render-prune

### Session 1 - 2026-03-24

#### Prompt (Developer)

K8s env render: pruning on by default

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Added `scripts/k8s-env/k8s-env-render-manifest.inc.sh` with workload helpers, `K8S_ENV_RENDER_WORKLOADS`, `k8s_env_render_configmap_relpaths_under_overlay`, and `k8s_env_render_owned_paths_relative_to_output_repo` so drift validation and prune targets stay aligned.
- `render-k8s-env.sh` sources the manifest, drops duplicate helpers, prunes owned paths before `render_one` when not `--dry-run` and not `--no-prune`; default is prune-on.
- `validate-k8s-env-drift.sh` uses `mapfile` from `k8s_env_render_configmap_relpaths_under_overlay` instead of a hardcoded ConfigMap list.
- Documented behavior in `docs/development/K8S-ENV-RENDER.md`.

#### Files Created/Modified

- `scripts/k8s-env/k8s-env-render-manifest.inc.sh`
- `scripts/k8s-env/render-k8s-env.sh`
- `scripts/k8s-env/validate-k8s-env-drift.sh`
- `docs/development/K8S-ENV-RENDER.md`
