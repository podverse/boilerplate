# AI Development Guide – Boilerplate

Quick reference for AI assistants working on the Boilerplate repo (HTTP API + Next.js app).

## Stack

- Node.js 24+ (see `.nvmrc`)
- npm workspaces: `apps/api`, `apps/web`, `apps/web/sidecar`
- TypeScript strict, ESM

## Commands

```bash
npm install
npm run build
npm run lint
npm run dev:api          # API only (default port 3000)
npm run dev:web          # Next.js only
npm run dev:web-sidecar  # Build sidecar + run web with sidecar
```

## Structure

- `apps/api/` – Standalone Express HTTP API
- `apps/web/` – Next.js app (fetches runtime config from sidecar when `RUNTIME_CONFIG_URL` is set)
- `apps/web/sidecar/` – Runtime-config sidecar (serves env-derived config for the Next.js app)

## LLM History

See [.llm/LLM.md](.llm/LLM.md) for full guidelines. Use the **llm-history** skill when updating history or starting feature work.

- **Before file-modifying work:** If the current branch matches an existing `.llm/history/active/[feature]/` (e.g. branch `chore/first-test-issue` → `first-test-issue`), update that history file; no exception for small changes.

## Code Quality

- Strict equality (`===` / `!==` only)
- Avoid type assertions (`as`); prefer types and narrowing
- Semicolons in JS/TS

## Skills and Rules

- **.cursor/skills/** – Project skills (llm-history, api, web, global, etc.)
- **.cursor/rules/** – Glob-triggered rules (eqeqeq, avoid-type-assertions, llm-history-tracking, etc.)

All configuration is project-scoped (no home-directory skills or rules).
