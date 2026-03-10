# E2E: Permission-actor alignment – apps/web (remaining)

## Purpose

Complete **batches 2 and 3** of apps/web permission-actor alignment. Batch 1 (bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit) was documented in the closed plan now in [permission-actor-alignment-web.md](permission-actor-alignment-web.md).

## Reference

- **Aligned reference:** [apps/web/e2e/bucket-admin-edit.spec.ts](../../../apps/web/e2e/bucket-admin-edit.spec.ts)
- **Alignment doc:** [e2e-crud-permission-permutations-alignment.md](../../active/e2e-crud-permission-permutations-alignment.md)
- **Skill:** e2e-permission-actor-matrix

## Specs implemented

- **Batch 2:** bucket-detail, bucket-messages, bucket-child-new, bucket-nested-new (API/actor-matrix comments; non-owner admin without create → not found tests). buckets-new, buckets (actor comments; buckets: non-admin sees list test). short-bucket, send-message, invite (actor comments).
- **Batch 3:** profile, settings, dashboard, home (actor-matrix comments).

## Skills

- e2e-permission-actor-matrix, e2e-authz-matrix, e2e-crud-state-matrix, e2e-readability.

---

## Status: Done

- **Date:** 2025-03-09
- **Done:** All batch 2 and 3 specs updated with API/actor-matrix doc comments. Added tests: bucket-child-new and bucket-nested-new (non-owner admin without bucket create → not found); buckets (non-admin sees list or empty state). Existing coverage retained; no new helpers required (loginAsWebE2EAdminWithoutPermission, loginAsWebE2ENonAdmin already present).
