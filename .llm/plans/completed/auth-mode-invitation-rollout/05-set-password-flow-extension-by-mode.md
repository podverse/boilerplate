# 05 - Set-password flow extension by mode

## Scope

Extend the existing set-password invitation completion flow so admin-created users can provide
required identity fields based on auth mode, without creating a new invitation route family.

## Steps

1. Reuse `set_password` token flow as the invitation completion mechanism.
2. Extend API payload validation for set-password completion by mode:
   - `admin_only_username`: require `username` + `password`; email not required.
   - `admin_only_email`: require `email` + `username` + `password`.
3. Update controller completion logic:
   - apply mode-specific required fields.
   - enforce uniqueness checks for email/username as needed.
   - keep token consume-on-success behavior.
4. Update web set-password UI to collect only required fields for active mode:
   - mode-aware form fields.
   - mode-aware validation messages.
5. Ensure secure behavior remains intact:
   - invalid/expired links are rejected.
   - token is single-use.
   - sensitive values are never exposed.

## Key files

- `apps/api/src/controllers/authController.ts`
- `apps/api/src/schemas/auth.ts`
- `packages/orm/src/services/VerificationTokenService.ts`
- `apps/web/src/app/(auth)/reset-password/page.tsx` (or set-password page component used in flow)
- `packages/helpers-requests/src/web/auth.ts`
- `packages/helpers-requests/src/types/auth-types.ts`

## Acceptance criteria

- Admin-invited user can complete account setup with mode-required fields.
- Username-only mode does not require email on invite completion.
- Admin-only-email mode requires and persists email and username correctly.
- Existing password reset flow is not broken by set-password updates.

## Verification

From repo root:

```bash
./scripts/nix/with-env npm run build
./scripts/nix/with-env npm run lint
./scripts/nix/with-env npm run test -- apps/api/src/test
make e2e_test_web_report_spec SPEC=e2e/reset-password-unauthenticated.spec.ts
```

Complete mode matrix validation is performed in plans 07 and 08.
