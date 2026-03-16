# E2E Follow-up: Limited-admin seed and deferred management-web tests

## Purpose

Complete the deferred work from the e2e-spec-improvements batch: add a **limited-admin** management user (no buckets/events permission) to the management-web E2E seed and login helpers, then implement the deferred tests in four specs.

## Source

- Completed plans (now in [.llm/plans/completed/e2e-spec-improvements/](../../e2e-spec-improvements/)) that documented deferred items: mgmt-bucket-admin-edit, mgmt-events, mgmt-buckets, mgmt-buckets-new.

## Prerequisites

- Management-web E2E seed and login helpers exist (e.g. `tools/management-web/` or equivalent; super-admin already seeded).

## Steps to implement

### 1. Seed: add limited-admin management user

- Add a management identity (and any required roles) that has **no** `bucketsCrud` / buckets read and **no** events/audit permission (or equivalent permission that gates `/buckets`, `/events`).
- Ensure this user can log in via the management-web login flow (credentials in seed; login helper can set context for this user).
- Document the user id and how to obtain a session (e.g. `loginAsLimitedAdmin()` or similar in E2E helpers).

### 2. Login / context helpers

- Add a helper (or extend existing) so specs can run as the limited-admin (e.g. `setE2EUserContext(page, 'limited-admin')` or a dedicated login step that uses the limited-admin credentials).
- Ensure the helper is used in management-web E2E where "restricted" or "admin without permission" behavior is under test.

### 3. mgmt-bucket-admin-edit (steps 2–5 from original plan)

- Add management admin **with** `bucketAdminsCrud` (if not already covered) and admin **without** to seed + login helpers.
- Add tests: permitted admin can edit/list as specified; admin without `bucketAdminsCrud` gets redirect or not-found as per product.
- Add test: invalid admin id for non–super-admin → not found or forbidden as per product.
- Run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-admin-edit.spec.ts`.

### 4. mgmt-events

- Add test: limited-admin (no events permission) visits events route → redirect or not found as per product.
- Run: `make e2e_test_management_web_report_spec SPEC=e2e/events.spec.ts`.

### 5. mgmt-buckets

- Add test: limited-admin (no buckets permission) visits buckets route → redirect to dashboard (or as per product).
- Run: `make e2e_test_management_web_report_spec SPEC=e2e/buckets.spec.ts`.

### 6. mgmt-buckets-new

- Add test: limited-admin visits buckets-new → redirect to buckets list (or as per product).
- Run: `make e2e_test_management_web_report_spec SPEC=e2e/buckets-new.spec.ts`.

## Verification

- All four targeted specs pass.
- No regression in existing management-web E2E.

## Skills

- e2e-permission-actor-matrix, e2e-readability (setE2EUserContext, hyphenated terms).

---

## Status: Done

- **Date:** 2025-03-09
- **Done:** Seed adds limited-admin (e2e-limitedadmin), admin-with-bucket-admins (e2e-admin-bucket-admins), admin-without-bucket-admins (e2e-admin-no-bucket-admins). Helpers: loginAsLimitedAdmin(), loginAsManagementAdminWithBucketAdmins(), loginAsManagementAdminWithoutBucketAdmins() in apps/management-web/e2e/helpers/advancedFixtures.ts. Tests added to bucket-admin-edit, events, buckets, buckets-new.
