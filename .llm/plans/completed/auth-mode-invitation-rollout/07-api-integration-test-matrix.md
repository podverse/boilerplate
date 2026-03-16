# 07 - API integration test matrix

## Scope

Add and update API and management-api integration tests for deterministic mode behavior,
startup validation, invite-link policy, and invite completion field requirements.

## Test matrix

### Mode: admin_only_username

- `POST /auth/signup` -> 403 registration disabled.
- `POST /auth/forgot-password` -> 403 email flow unavailable.
- `POST /auth/reset-password` -> 403 email flow unavailable.
- `POST /auth/request-email-change` -> 403 email flow unavailable.
- `POST /auth/confirm-email-change` -> 403 email flow unavailable.
- management create-user returns invite link with expected TTL.
- set-password invite completion requires username + password and succeeds without email.

### Mode: admin_only_email

- `POST /auth/signup` -> 403 registration disabled.
- forgot/reset/request-email-change/confirm-email-change behave as enabled flows.
- management create-user returns invite link with expected TTL.
- set-password invite completion requires email + username + password.

### Mode: user_signup_email

- signup flow works (existing behavior).
- forgot/reset/request-email-change/confirm-email-change work.
- management create-user does not return invite link.

## Steps

1. Update API test setup helpers to support the three explicit modes in deterministic files.
2. Replace or rename legacy mode-specific files that assume `admin_only` or mailer toggle naming.
3. Add mode-targeted integration suites for:
   - auth route availability
   - startup validation requirements
   - set-password completion requirements by mode
4. Add/extend management-api integration tests for create-user invitation behavior and TTL.
5. Ensure tests mock mailer where needed, without reintroducing runtime mailer toggles.

## Key files

- `apps/api/src/test/setup.ts`
- `apps/api/src/test/auth-no-mailer.test.ts` (rename or replace if semantics change)
- `apps/api/src/test/auth-mailer.test.ts`
- `apps/api/src/test/auth-signup-mode-no-mailer.test.ts` (replace with explicit mode file)
- `apps/api/src/test/auth-rate-limit.test.ts` (update mode assumptions)
- `apps/management-api/src/test/setup.ts`
- new test files under:
  - `apps/api/src/test/`
  - `apps/management-api/src/test/`

## Acceptance criteria

- Every mode has deterministic endpoint-availability coverage.
- Startup validation tests enforce mode requirements.
- Management create-user invitation behavior is covered for all modes.
- Invitation TTL is validated by integration tests.

## Verification

From repo root:

```bash
./scripts/nix/with-env npm run test -- apps/api/src/test
./scripts/nix/with-env npm run test -- apps/management-api/src/test
```

If local test dependencies are not running first:

```bash
make test_deps
```
