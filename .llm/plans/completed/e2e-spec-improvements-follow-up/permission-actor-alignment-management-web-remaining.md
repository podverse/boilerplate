# E2E: Permission-actor alignment – apps/management-web (remaining)

## Purpose

Complete the **remaining** management-web permission-actor alignment after batch 1. Batch 1 (bucket-admin-edit, bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit) is done; see the closed plan in [permission-actor-alignment-management-web.md](permission-actor-alignment-management-web.md).

## Reference

- **Web reference:** [apps/web/e2e/bucket-admin-edit.spec.ts](../../../apps/web/e2e/bucket-admin-edit.spec.ts) (actor-matrix pattern).
- **Alignment doc:** [e2e-crud-permission-permutations-alignment.md](../../active/e2e-crud-permission-permutations-alignment.md)
- **Prerequisite:** Limited-admin and admin-with/without-bucket-admins already in seed and helpers (from deferred-limited-admin plan).

## Alignment criteria (summary)

API/source-of-truth documented; actor matrix (unauthenticated, super-admin, role with/without permission, limited-admin); seed + login helpers; tests for each actor × outcome; flow tests list→edit, Cancel→list, invalid id → not found.

## Specs implemented

- **P1:** bucket-edit (doc, limited-admin → dashboard, admin-with-bucket-admins → settings form).
- **P2:** admin-edit, admin-detail, user-edit, user-detail (doc, admin-without-admins/users CRUD → redirect; limited-admin sees detail where has read).
- **P3:** bucket-detail, bucket-child-new, buckets-new, bucket-messages, buckets (doc, limited-admin redirect; admin-with-bucket-admins sees list/detail or notFound for create).
- **P4:** admin-role-new, admins-new, admins, users-new, users (doc, limited-admin sees list; admin-without-admins/users → redirect).
- **P5:** profile, settings, events, dashboard, home (actor-matrix comments; events already had limited-admin test).

## Skills

- e2e-permission-actor-matrix, e2e-authz-matrix, e2e-crud-state-matrix, e2e-readability.

---

## Status: Done

- **Date:** 2025-03-09
- **Done:** All remaining management-web specs aligned with API/actor-matrix comments and tests for limited-admin and admin-with-bucket-admins (or admin-without-admins/users) as applicable. Profile, settings, events, dashboard, home have actor comments; no new tests added for auth-only pages beyond existing unauthenticated redirect.
