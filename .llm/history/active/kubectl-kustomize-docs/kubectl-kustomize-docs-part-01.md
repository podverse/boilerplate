# kubectl-kustomize-docs

### Session 1 - 2026-03-26

#### Prompt (Developer)

Align docs with kubectl built-in Kustomize

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Step 1 in `REMOTE-K8S-GITOPS.md` drops standalone **kustomize** from the install list; adds a **Kustomize** paragraph
  pointing to **`kubectl kustomize <path>`** and notes the standalone CLI is optional.
- Step 13 replaces **`kustomize build`** with **`kubectl kustomize`** for local overlay validation.
- Makefiles and `scripts/k8s-env/` already did not invoke `kustomize`; no code changes.

#### Files Created/Modified

- `docs/development/REMOTE-K8S-GITOPS.md`
- `.llm/history/active/kubectl-kustomize-docs/kubectl-kustomize-docs-part-01.md`

### Session 2 - 2026-03-26

#### Prompt (Developer)

update the REMOTE-K8S-GITOPS file so that if you give instructions like "verify" that you provide the actual commands to verify it. also note that kustomize will be used from kubectl so verify is not needed

#### Key Decisions

- Step 1: concrete **Verify tooling** / **Verify Git push** / **Verify registry pull** command blocks; Kustomize
  called out as kubectl-only (no separate binary to install or verify).
- Step 3: **Verify cluster and Argo CD**, **Verify DNS**, **Verify cert-manager** command blocks.
- Step 13: renamed to “Verify deployment”; explicit kubectl/curl commands; optional `kubectl kustomize` overlay
  check labeled optional; states no separate `kustomize` verify.

#### Files Created/Modified

- `docs/development/REMOTE-K8S-GITOPS.md`
- `.llm/history/active/kubectl-kustomize-docs/kubectl-kustomize-docs-part-01.md`
