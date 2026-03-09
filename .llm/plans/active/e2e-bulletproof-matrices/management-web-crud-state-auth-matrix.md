# Management-Web E2E CRUD/State/Auth Matrix

## Purpose

This matrix is the execution checklist for `apps/management-web/e2e` bulletproof coverage.

## Legend

- `Covered`: existing deterministic assertion in current specs.
- `Gap`: missing or permissive coverage that should be implemented.
- `Target`: spec file to extend.

## Matrix

| Surface | Create | Read | Update | Delete | Show/Hide + Enable/Disable | Validation + Error/Empty/Loading | URL/Auth Edge | Status | Target |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Users list (`/users`) | Covered (`users-new`) | Covered (`users`) | Gap (edit persistence from list) | Gap (delete lifecycle) | Gap (action visibility by CRUD flags) | Gap (deterministic empty/error/loading) | Covered (auth redirect) | Gap | `apps/management-web/e2e/users.spec.ts`, `apps/management-web/e2e/user-edit.spec.ts` |
| Admins list (`/admins`) | Covered (`admins-new`) | Covered (`admins`) | Gap (edit persistence) | Gap (delete lifecycle incl. self/superadmin restrictions) | Gap (row-level action gating) | Gap (error branch checks) | Covered (auth redirect) | Gap | `apps/management-web/e2e/admins.spec.ts`, `apps/management-web/e2e/admin-edit.spec.ts` |
| Buckets list (`/buckets`) | Covered (`buckets-new`) | Covered (`buckets`) | Covered (`bucket-edit`) | Gap (delete lifecycle) | Gap (CRUD-flag action visibility) | Gap (empty/error/loading deterministic checks) | Covered (auth redirect) | Gap | `apps/management-web/e2e/buckets.spec.ts`, `apps/management-web/e2e/bucket-edit.spec.ts` |
| Bucket settings (`/bucket/:id/settings`) | Covered (route + form controls) | Covered | Gap (save persistence assertions across tabs) | Gap (admin/role/message delete paths) | Gap (permission-driven hide/disable assertions) | Gap (API failure branch checks) | Covered (`tab`) | Gap | `apps/management-web/e2e/bucket-settings.spec.ts`, `apps/management-web/e2e/bucket-role-edit.spec.ts` |
| Events list (`/events`) | N/A | Covered | N/A | N/A | Gap (table control state assertions) | Gap (empty/error/loading deterministic checks) | Partial (query params tested) | Gap | `apps/management-web/e2e/events.spec.ts` |
| Auth screens (`/login`) | N/A | Covered | Covered (invalid creds) | N/A | Gap (limited-role authZ route denial checks) | Gap (429/rate-limit branches) | Covered (unauth redirects) | Gap | `apps/management-web/e2e/login.spec.ts` + resource specs |

## Immediate Implementation Priorities

1. Add delete lifecycle coverage for users/admins/buckets lists (confirm/cancel/success row removal).
2. Strengthen edit specs to verify persistence after save + reload.
3. Expand events/users/admins URL-state and deterministic table-state assertions.
4. Add at least one authZ-oriented management assertion path where UI permissions are surfaced.
