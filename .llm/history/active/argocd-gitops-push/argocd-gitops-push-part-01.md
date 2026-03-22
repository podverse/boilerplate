# Argo CD GitOps push guidance (skills/rules)

Started: 2025-03-19
Context: Plan to add skill and rule so agent knows when to remind user to push for Argo CD.

## Session 1 - 2025-03-19

### Prompt (Developer)

Argo CD push and version guidance for skills/rules

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

### Key Decisions

- Added skill **argocd-gitops-push** with when-to-use (infra/k8s/, sync targets, canonical sources), what Argo CD syncs, when push is required, response requirement (Push to Git note), and version-updates note.
- Extended **end-with-targeted-make-report-verify** rule with bullet 7: when change includes files under infra/k8s/, add sentence to push to Argo CD–tracked branch; reference argocd-gitops-push skill.
- Added **AGENTS.md** row for K8s / Argo CD → argocd-gitops-push.
- Added **argocd-gitops-push** to .cursor/skills/INDEX.md quick reference.

### Files Created/Modified

- .cursor/skills/argocd-gitops-push/SKILL.md (new)
- .cursor/rules/end-with-targeted-make-report-verify.mdc
- AGENTS.md
- .cursor/skills/INDEX.md
