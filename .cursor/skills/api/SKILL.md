---
name: boilerplate-api-patterns
description: Common patterns for the Boilerplate HTTP API (Express)
version: 1.0.0
---

# Boilerplate API Patterns

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
- **Env alignment**: All `.env` files (including `infra/config/local/*.env`) must match the organization, section comments, and variable order of their authoritative `.env.example`; only values may differ.

### Async handlers

Wrap async route handlers to avoid unhandled rejections (e.g. try/catch and pass errors to Express error middleware, or use a small `asyncHandler` wrapper).

### Request body validation and controller typing

- **Validate at the route**: Use `validateBody(schema)` middleware (Joi) on any route that accepts a JSON body. Validation runs before the controller; invalid requests get 400 with details and never reach the controller.
- **Type the validated body**: In the schema file, export an interface that matches the shape Joi validates (e.g. `CreateAdminBody` for `createAdminSchema`). Use `.default()` in Joi so optional fields have a known shape after validation.
- **Controllers assume valid body**: In the controller, cast `req.body` to the exported type (e.g. `req.body as CreateAdminBody`). Do **not** repeat “field is required” or “field must be a string” checks for fields that are required and validated by the schema; those errors are already handled by the middleware. Controllers only do business checks (e.g. “email already in use”, “display name already in use”, auth checks).
- **Same pattern in management-api**: Apply the same pattern in `apps/management-api`: schemas in `schemas/*.ts` with exported body types, routes using `validateBody(schema)`, controllers using the types and no redundant presence/type checks for validated fields.

## Scripts

- `npm run dev` – Build and run (from `apps/api`)
- `npm run dev:api` – From repo root
- **Tests:** When adding or changing routes or auth behavior, add or update integration tests. Use the **api-testing** skill for file layout (auth.test.ts vs auth-no-mailer vs auth-mailer), base URL (`config.apiVersionPath`), and clean-slate/requirements.
