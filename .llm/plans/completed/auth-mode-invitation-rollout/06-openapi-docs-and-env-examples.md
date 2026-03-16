# 06 - OpenAPI docs and env examples

## Scope

Publish the finalized contract after implementation and tests by updating OpenAPI, env examples,
and testing docs to match mode-driven auth behavior.

## Steps

1. Update OpenAPI auth endpoint descriptions and response docs:
   - signup availability by mode
   - forgot/reset/email-change/verify availability by mode
   - invitation completion behavior where relevant
2. Update API env examples:
   - `AUTH_MODE` values and meaning
   - remove `MAILER_ENABLED` usage guidance
   - clarify mailer-required modes
3. Update management-api env examples:
   - document `USER_INVITATION_TTL_HOURS` with default `24`.
4. Update testing documentation:
   - mode-specific E2E strategy
   - deterministic single-outcome policy by mode
   - commands for admin-only and signup-enabled runs
5. Ensure docs reference actual implemented behavior from plans 02-05 and tests 07-08.

## Key files

- `apps/api/src/openapi.ts`
- `apps/api/.env.example`
- `apps/management-api/.env.example`
- `docs/testing/E2E-PAGE-TESTING.md`
- `AGENTS.md` (only if test/doc section needs mode update)

## Acceptance criteria

- Public API documentation matches endpoint behavior in all three modes.
- Env examples no longer imply runtime `MAILER_ENABLED` behavior toggling.
- Invite TTL env is documented with default and expected effect.
- E2E documentation clearly explains mode-specific runs.

## Verification

From repo root:

```bash
./scripts/nix/with-env npm run build
./scripts/nix/with-env npm run lint
make e2e_test_home_report
```
