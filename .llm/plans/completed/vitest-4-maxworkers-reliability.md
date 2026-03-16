# Vitest 4 – maxWorkers fix for auth-mailer test reliability

## Problem

After upgrading to Vitest 4, `make e2e_test_report E2E_API_GATE_MODE=on` failed with:
- **Socket hang up** in auth-mailer.test.ts ("returns 200 with captured token")
- **405 Method Not Allowed** on POST /auth/verify-email (expected 400)
- **401 Unauthorized** on POST /auth/forgot-password (expected 200)

## Root cause

Vitest 4 **removed the `minWorkers` option** (see [Migration Guide](https://main.vitest.dev/guide/migration)). The config had:

```ts
minWorkers: 1,
maxWorkers: 3,
```

With `minWorkers` removed, Vitest 4 ignored it and could spawn multiple workers, causing connection pressure (DB/Valkey/supertest) and socket hang ups. Module/config isolation between workers could also explain 405/401.

## Fix

- **Remove** `minWorkers: 1` (invalid in Vitest 4).
- **Set** `maxWorkers: 1` for sequential execution and reliability (trade speed for stability).

Applied in:
- [apps/api/vitest.config.ts](apps/api/vitest.config.ts)
- [apps/management-api/vitest.config.ts](apps/management-api/vitest.config.ts)

## Verification

From repo root:

```bash
./scripts/nix/with-env npm run test -w apps/api
./scripts/nix/with-env npm run test -w apps/management-api
# Or full E2E + API gate:
make e2e_test_report E2E_API_GATE_MODE=on
```
