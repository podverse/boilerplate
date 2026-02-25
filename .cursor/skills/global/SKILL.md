---
name: metaboost-global-patterns
description: Global patterns for the Metaboost repo (API + Next.js app)
version: 1.0.0
---

# Global Patterns

## Structure

- **API**: `apps/api/` – Standalone Express HTTP API
- **Web**: `apps/web/` – Next.js app
- **Sidecar**: `apps/web/sidecar/` – Runtime-config server for the Next.js app

## TypeScript

- Extend `tsconfig.base.json` in apps. Use ESM (NodeNext). Avoid type assertions (`as`) when a better approach exists.

## Plan Management

- Plans go in `.llm/plans/active/` (not `.cursor/plans/`).
- **300 line limit** per plan. Split into sub-plans in the same directory if larger.

## LLM History

- 10-session maximum per history file. See **.cursor/skills/llm-history/SKILL.md** and `.llm/LLM.md`.
- When modifying code, update `.llm/history/active/[feature]/[feature]-part-NN.md`.

## Code Quality

- Strict equality (`===` / `!==` only). Semicolons in JS/TS. Prefer `import type` for type-only imports.
