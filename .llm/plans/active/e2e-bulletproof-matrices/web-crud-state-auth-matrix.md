# Web E2E CRUD/State/Auth Matrix

## Purpose

This matrix is the execution checklist for `apps/web/e2e` bulletproof coverage.

## Legend

- `Covered`: existing deterministic assertion in current specs.
- `Gap`: missing or permissive coverage that should be implemented.
- `Target`: spec file to extend.

## Matrix

| Surface | Create | Read | Update | Delete | Show/Hide + Enable/Disable | Validation + Error/Empty/Loading | URL/Auth Edge | Status | Target |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Buckets list (`/buckets`) | Covered (`buckets-new`) | Covered (`buckets`) | Gap (sort/filter/pagination interactions) | Gap (delete lifecycle) | Gap (action visibility by CRUD flags) | Gap (deterministic empty/error/loading) | Gap (sort/search/page persistence) | Gap | `apps/web/e2e/buckets.spec.ts` |
| Bucket detail (`/bucket/:id`) | Covered (child/nested creates) | Covered (`bucket-detail`) | Covered (`bucket-settings`, `bucket-message-edit`) | Gap (delete message/topic paths) | Gap (action gating by permissions) | Gap (explicit loading/error branch checks) | Covered (auth redirect) | Gap | `apps/web/e2e/bucket-detail.spec.ts`, `apps/web/e2e/bucket-message-edit.spec.ts` |
| Bucket roles tab | Covered (`bucket-role-new`) | Covered (`bucket-role-new/edit`) | Covered (`bucket-role-edit`) | Gap (delete custom role confirm/cancel/success/failure) | Gap (dependent checkbox matrix assertions) | Gap (delete failure/error message) | Covered (auth redirect + invalid id) | Gap | `apps/web/e2e/bucket-role-edit.spec.ts`, `apps/web/e2e/bucket-role-new.spec.ts` |
| Bucket admins tab | Covered (invitation link generation) | Covered (`bucket-settings`) | Covered (`bucket-admin-edit` route-level) | Gap (delete invitation/admin + owner protection branch assertions) | Gap (admin action visibility by ownership/permission) | Gap (error branch from delete handlers) | Covered (auth redirect) | Gap | `apps/web/e2e/bucket-settings.spec.ts`, `apps/web/e2e/bucket-admin-edit.spec.ts` |
| Invite flow (`/invite/:token`) | Covered (invalid + login-required) | Covered | Covered (accept/reject state visibility) | N/A | Gap (branches for owner/admin already accepted) | Gap (expired token deterministic check) | Gap (post-action navigation states) | Gap | `apps/web/e2e/invite.spec.ts` |
| Settings (`/settings`) | N/A | Covered | Covered (password mismatch + email tab controls) | N/A | Gap (tab active state + control enable/disable transitions) | Gap (request failure branches) | Covered (`tab`, login returnUrl) | Gap | `apps/web/e2e/settings.spec.ts`, `apps/web/e2e/profile.spec.ts` |
| Auth screens (`login/signup/forgot/reset`) | Covered | Covered | Covered (login returnUrl, forgot flows) | N/A | Covered (signup/send-message disabled state baseline) | Gap (429/rate-limit where feasible) | Covered (safe/unsafe returnUrl) | Gap | `apps/web/e2e/login.spec.ts`, `apps/web/e2e/signup.spec.ts`, `apps/web/e2e/forgot-password.spec.ts`, `apps/web/e2e/reset-password.spec.ts` |

## Immediate Implementation Priorities

1. Bucket role delete lifecycle and dependency-grid assertions.
2. Bucket admin invitation/admin deletion + owner protection assertions.
3. Buckets list URL-state sort/search/page persistence and deterministic table-state assertions.
4. Invite deterministic action/result branches and settings tab behavior hardening.
