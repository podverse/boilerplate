# Git hooks – Execution Order

Single-plan set: Podverse-aligned git hooks (pre-commit, commit-msg, pre-push).

## Plan file location

All plans: `.llm/plans/active/git-hooks/`

| File | Description |
| --- | --- |
| [00-SUMMARY.md](00-SUMMARY.md) | Scope |
| [26-git-hooks.md](26-git-hooks.md) | Git hooks |
| [COPY-PASTA.md](COPY-PASTA.md) | Copy-paste prompt |

## Order

1. **26-git-hooks** – Run once. Depends on lint/format (05) and GITFLOW docs (09).
