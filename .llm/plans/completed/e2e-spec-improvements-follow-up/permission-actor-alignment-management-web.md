# E2E Follow-up: Permission-actor alignment – apps/management-web

## Purpose

Bring apps/management-web E2E specs to **full permission-actor alignment** as defined in [e2e-crud-permission-permutations-alignment.md](../../active/e2e-crud-permission-permutations-alignment.md) and the **e2e-permission-actor-matrix** skill.

## Reference

- **Web reference:** [apps/web/e2e/bucket-admin-edit.spec.ts](../../../../apps/web/e2e/bucket-admin-edit.spec.ts) (actor-matrix pattern).
- **Alignment doc:** [e2e-crud-permission-permutations-alignment.md](../../active/e2e-crud-permission-permutations-alignment.md)

## Prerequisite

- Complete [deferred-limited-admin-and-mgmt-tests.md](deferred-limited-admin-and-mgmt-tests.md) first so limited-admin (and any other management actors) exist in seed/helpers.

## Alignment criteria (from alignment doc)

- API/source-of-truth documented or clear from context.
- Actor matrix: unauthenticated, super-admin, management roles with/without specific CRUD (e.g. bucketAdminsCrud, bucketsCrud), limited-admin where applicable.
- Seed + login helpers for each actor.
- Tests for each actor × outcome; flow tests list→edit, Cancel→list, invalid id → not found.

## Specs and current status (from alignment doc)

| Spec | Status | Notes |
|------|--------|------|
| bucket-admin-edit.spec.ts | **Aligned** | Deferred plan: admin with/without bucketAdminsCrud, invalid id; limited-admin N/A (no buckets read). |
| bucket-role-edit.spec.ts | **Aligned** | Doc + limited-admin → redirect dashboard; admin-with-bucket-admins → list→edit, form visible. |
| bucket-role-new.spec.ts | **Aligned** | Doc + limited-admin → redirect dashboard; admin-with-bucket-admins → form visible. |
| bucket-settings.spec.ts | **Aligned** | Doc + limited-admin → redirect dashboard; admin-with-bucket-admins → tabs visible. |
| bucket-message-edit.spec.ts | **Aligned** | Doc + limited-admin → redirect dashboard; admin without message update → redirect /buckets. |
| bucket-messages.spec.ts | Partial | List visibility by role. |
| bucket-detail.spec.ts | Partial | Detail and actions by role. |
| bucket-edit.spec.ts | Needs alignment | Who can edit bucket. |
| bucket-child-new.spec.ts | Needs alignment | Management role for create. |
| buckets-new.spec.ts | Partial | Management role for create. |
| buckets.spec.ts | Partial | List and filters by role. |
| admin-edit.spec.ts | Needs alignment | Superadmin vs other roles. |
| admin-detail.spec.ts | Needs alignment | Role × visibility/actions. |
| admin-role-new.spec.ts | Needs alignment | Who can create admin roles. |
| admins-new.spec.ts | Partial | Role for create. |
| admins.spec.ts | Partial | List visibility by role. |
| user-edit.spec.ts | Needs alignment | Role × edit/self-protection. |
| user-detail.spec.ts | Needs alignment | Role × visibility. |
| users-new.spec.ts | Partial | Role for create. |
| users.spec.ts | Partial | List by role. |
| profile.spec.ts | Partial | Unauthenticated redirect. |
| settings.spec.ts | Partial | Unauthenticated redirect. |
| events.spec.ts | Partial | Visibility by role. |
| login.spec.ts | N/A | Auth only. |
| dashboard.spec.ts | Partial | Unauthenticated redirect. |
| home.spec.ts | Partial | Unauthenticated vs authenticated. |

## Suggested execution order (from alignment doc)

1. bucket-admin-edit, bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit, bucket-edit
2. admin-edit, admin-detail, user-edit, user-detail
3. List and create specs: admins, users, buckets, bucket-detail, bucket-messages, bucket-child-new, buckets-new, etc.
4. profile, settings, events, dashboard, home

## Steps to implement (per spec)

For each spec that is Partial or Needs alignment:

1. Document or confirm API/source-of-truth for management permissions.
2. Identify required actors (unauthenticated, super-admin, role with permission, role without, limited-admin).
3. Ensure seed + login helpers exist for each actor (including limited-admin from deferred plan).
4. Add tests for each actor × outcome; flow tests list→edit, Cancel→list, invalid id.
5. Run targeted spec: `make e2e_test_management_web_report_spec SPEC=e2e/<spec>.spec.ts`.
6. Apply e2e-readability (setE2EUserContext, hyphenated terms).

## Skills

- e2e-permission-actor-matrix, e2e-authz-matrix, e2e-crud-state-matrix, e2e-readability.

---

## Status: Batch 1 done (plan closed; remaining work in permission-actor-alignment-management-web-remaining.md)

- **Date:** 2025-03-09
- **Done:** bucket-admin-edit (from deferred plan), bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit. API/actor-matrix comments added; limited-admin redirect-to-dashboard and admin-with-bucket-admins (or without message update) tests added.
- **Remaining:** bucket-edit, admin-edit, user-edit, list/create, profile/settings/events/dashboard/home → see [permission-actor-alignment-management-web-remaining.md](../../active/e2e-spec-improvements-follow-up/permission-actor-alignment-management-web-remaining.md).
