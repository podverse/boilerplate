---
name: boilerplate-documentation-conventions
description: Documentation file naming for the Boilerplate repo. Use when creating or modifying docs, README, or markdown.
version: 1.0.0
---

# Documentation Conventions

## Single README

- **One** `README.md` at repository root.
- **Only one file in the entire repository may be named README** (the root `README.md`). Subdirectories must use descriptive names (e.g. `scripts/github/SCRIPTS-GITHUB.md`, not `README.md`).

## Directory-Specific Docs

Name after the full path from root (uppercase, slashes → hyphens):

- `apps/api/` → `APPS-API.md`
- `apps/web/` → `APPS-WEB.md`
- `scripts/github/` → `SCRIPTS-GITHUB.md`
- `.llm/` → `LLM.md`

Pattern: `[FULL-PATH-WITH-HYPHENS].md`. Do not add multiple `README.md` files per directory.
