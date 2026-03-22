# Git hooks – Copy-Pasta

## Agent: Git hooks (Podverse-aligned)

Read and execute `.llm/plans/active/git-hooks/26-git-hooks.md`. Set up
scripts/git-hooks/ with install-hooks.sh, pre-commit (lint-staged), commit-msg (issue ref),
pre-push (block direct push to develop; branch naming). Add root package.json "prepare" and
lint-staged config; add scripts/git-hooks/ to .dockerignore. Document in README or
GITFLOW.md. Verify hooks install on npm install and block/behave as specified.
