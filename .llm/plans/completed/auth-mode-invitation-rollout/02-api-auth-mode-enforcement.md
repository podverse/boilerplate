# 02 - API auth mode enforcement

## Scope

Implement mode-aware behavior in API auth routing and controller logic so each endpoint has one
deterministic outcome per mode.

## Steps

1. Introduce mode capability usage in API app wiring:
   - compute capabilities once during startup/bootstrap.
   - pass capability flags into auth router construction.
2. Update auth routes so mode contracts are enforced at route boundaries:
   - `/auth/signup` enabled only for `user_signup_email`.
   - `/auth/forgot-password`, `/auth/reset-password`, `/auth/request-email-change`,
     `/auth/confirm-email-change`, `/auth/verify-email` enabled only when email flows are allowed.
3. Ensure route-disabled responses are explicit and mode-correct:
   - signup disabled message for admin-only modes.
   - email-flow-disabled message for username-only mode.
4. Align controller validations with mode capabilities:
   - prevent email-only operations in username-only mode.
   - preserve anti-enumeration behavior where already used.
5. Remove remaining direct mailer-enable toggles from route/controller behavior decisions.

## Key files

- `apps/api/src/app.ts`
- `apps/api/src/routes/auth.ts`
- `apps/api/src/controllers/authController.ts`
- `apps/api/src/config/index.ts`
- `apps/api/src/lib/mailer/send.ts`
- `apps/api/src/schemas/auth.ts`

## Acceptance criteria

- Endpoint behavior matches the matrix from 01 in all three modes.
- Username-only mode cannot trigger forgot/reset/email-change/verify behavior.
- Signup is unavailable in both admin-only modes with deterministic 403 behavior.
- Existing supported flows retain previous response semantics where mode allows them.

## Verification

From repo root:

```bash
./scripts/nix/with-env npm run build
./scripts/nix/with-env npm run lint
./scripts/nix/with-env npm run test -- apps/api/src/test/auth.test.ts
```

Follow-up verification is completed in plan 07 with full mode-matrix integration tests.
