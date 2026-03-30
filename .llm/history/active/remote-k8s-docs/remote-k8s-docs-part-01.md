# Remote K8s deployment docs (discoverability + accuracy)

Started: 2026-03-28
Context: Implement plan to fix REMOTE-K8S-GITOPS typo, align INFRA-K8S-BASE URL, AGENTS pointer, start-here blurb.

## Session 1 - 2026-03-28

### Prompt (Developer)

Remote Boilerplate K8s deployment documentation

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

### Key Decisions

- Fixed Step 9 garbled **`plain/`** markdown in REMOTE-K8S-GITOPS.md; added one-line **Start here** blurb with contrast link to K3D local doc.
- INFRA-K8S-BASE.md remote base example now uses canonical `https://github.com/<org>/boilerplate//infra/k8s/base/<component>?ref=...` and links to REMOTE-K8S-GITOPS Step 4.
- AGENTS.md **K8s / Argo CD** skill row now points to REMOTE-K8S-GITOPS.md as the remote runbook first.

### Files Created/Modified

- docs/development/REMOTE-K8S-GITOPS.md
- infra/k8s/INFRA-K8S-BASE.md
- AGENTS.md
- .llm/history/active/remote-k8s-docs/remote-k8s-docs-part-01.md
