# 01 - Auth capability matrix and env contract

## Scope

Define the canonical auth-mode capability model and startup contract used by API, management-api,
and web. This plan establishes behavior and validation rules before endpoint/UI implementation.

## Steps

1. Replace old mode assumptions with explicit `AUTH_MODE` values:
   - `admin_only_username`
   - `admin_only_email`
   - `user_signup_email`
2. Introduce a central capability resolver shape (shared pattern, app-local implementation):
   - `canPublicSignup`
   - `canUseEmailVerificationFlows`
   - `canIssueAdminInviteLink`
   - `requiresEmailAtInviteCompletion`
3. Remove `MAILER_ENABLED` from behavior gating and make mode the source of truth.
4. Update startup validation:
   - validate `AUTH_MODE` allowed values.
   - require mailer-related envs when mode requires email flows.
   - block conflicting/unused mailer startup combinations for username-only mode.
5. Update env examples and comments to describe mode-driven behavior and remove deprecated
   `MAILER_ENABLED` guidance.

## Key files

- `apps/api/src/config/index.ts`
- `apps/api/src/lib/startup/validation.ts`
- `apps/api/.env.example`
- `apps/management-api/src/config/index.ts`
- `apps/management-api/src/lib/startup/validation.ts`
- `apps/management-api/.env.example`

## Acceptance criteria

- A single source of truth defines capabilities for each mode.
- Startup fails fast with clear errors when mode requirements are not met.
- No route/controller or page decides behavior directly from `MAILER_ENABLED`.
- Env examples match the new contract and include mode guidance.

## Verification

From repo root:

```bash
./scripts/nix/with-env npm run build
./scripts/nix/with-env npm run lint
```

Manual checks:

- Confirm old `admin_only` literal is removed from active auth mode checks.
- Confirm `MAILER_ENABLED` is no longer referenced in startup contracts or mode decisions.
