# 04 - Web mode-aware auth surface

## Scope

Align web auth-page visibility, links, and route outcomes with mode-specific API capabilities so
users do not see dead links or unavailable auth flows.

## Steps

1. Introduce a web-consumable auth capability source:
   - derive from runtime config endpoint or existing server-side config mechanism.
   - avoid hardcoding mode logic in multiple pages.
2. Update login page links by mode:
   - show signup link only in `user_signup_email`.
   - show forgot-password link only when email flows are enabled.
3. Update auth page handling:
   - `/signup` should redirect or show unavailable state in admin-only modes.
   - `/forgot-password` and `/reset-password` should be unavailable in username-only mode.
4. Keep public route/guard definitions consistent with effective mode behavior:
   - avoid advertising unavailable routes.
5. Ensure invitation login/entry contexts keep working with mode-aware link visibility.

## Key files

- `apps/web/src/app/(auth)/login/page.tsx`
- `apps/web/src/app/(auth)/signup/page.tsx`
- `apps/web/src/app/(auth)/forgot-password/page.tsx`
- `apps/web/src/app/(auth)/reset-password/page.tsx`
- `apps/web/src/lib/routes.ts`
- `apps/web/src/proxy.ts`
- `packages/ui/src/components/form/AuthForms/LoginForm/LoginForm.tsx`

## Acceptance criteria

- Web displays only auth actions valid for the current mode.
- Unavailable routes have one deterministic behavior (redirect or explicit blocked UI).
- No dangling signup/forgot links in modes where those routes are disabled by API.
- Existing invite and login flows continue to function with updated link rendering.

## Verification

From repo root:

```bash
./scripts/nix/with-env npm run build
./scripts/nix/with-env npm run lint
make e2e_test_web_report_spec SPEC=e2e/signup-unauthenticated.spec.ts,e2e/forgot-password-unauthenticated.spec.ts,e2e/reset-password-unauthenticated.spec.ts
```

Comprehensive mode-specific E2E coverage is completed in plan 08.
