# Jenkins local – Execution Order

Single-plan set: local Jenkins (deployment-only, folder "local").

## Plan file location

All plans: `.llm/plans/active/jenkins-local/`

| File | Description |
| --- | --- |
| [00-SUMMARY.md](00-SUMMARY.md) | Scope |
| [30-jenkins-local.md](30-jenkins-local.md) | Jenkins local |
| [COPY-PASTA.md](COPY-PASTA.md) | Copy-paste prompt |

## Order

1. **30-jenkins-local** – Run after Phase 14 (Dependabot). Run after all other phases.
