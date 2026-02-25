---
name: metaboost-api-patterns
description: Common patterns for the Metaboost HTTP API (Express)
version: 1.0.0
---

# Metaboost API Patterns

- **Location**: `apps/api/`
- **Stack**: Express, TypeScript, ESM

## Patterns

### Route and handler

```typescript
import { Router, type Request, type Response } from 'express';

const router = Router();

router.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});

export default router;
```

### Config and startup validation

- **Startup validation**: `lib/startup/validation.ts` runs after loadEnv() and before importing config. It validates required env vars (e.g. API_PORT, APP_NAME), logs results by category, and throws if any required are missing or invalid. Pattern aligned with Podverse’s API startup validation.
- Read env in `config/index.ts` only after validation has passed.
- Use `.env.example` for documented variables; non-empty values in `.env` use double quotes; empty/unset use no value after `=`.

### Async handlers

Wrap async route handlers to avoid unhandled rejections (e.g. try/catch and pass errors to Express error middleware, or use a small `asyncHandler` wrapper).

## Scripts

- `npm run dev` – Build and run (from `apps/api`)
- `npm run dev:api` – From repo root
