---
name: boilerplate-global-patterns
description: Global patterns for the Boilerplate repo (API + Next.js app)
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
- **Exports:** Do not re-export symbols from app code (e.g. `lib/validation.ts`) when they are already exported by a shared package (e.g. `@boilerplate/helpers`). Callers should import from the canonical source; unnecessary re-exports add indirection and maintenance cost.
- **Catch blocks:** If the error value is not used, use `catch { ... }` (no variable). See **.cursor/skills/catch-unused-error/SKILL.md**.
- **Component props:** Do not pass `undefined` explicitly to components. Allow `null` as a value for optional props so callers can pass `prop={value}` directly; components treat `null` (and `undefined`) as "not set" / default behavior. When checking optional string props (e.g. error messages) for "has value", use a simple falsy check (`Boolean(value)` or `if (value)`) instead of explicit `!== undefined && !== null && !== ''`.
- **No inline styles:** Do not use `style={{ ... }}` for layout or appearance. Use CSS classes instead: component or page SCSS modules (e.g. `ComponentName.module.scss`), or shared utility classes where appropriate. Keeps styling maintainable and consistent.
