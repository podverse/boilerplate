# E2E Follow-up: Permission-actor alignment – apps/web

## Purpose

Bring apps/web permission-gated E2E specs to **full permission-actor alignment** as defined in [e2e-crud-permission-permutations-alignment.md](../../active/e2e-crud-permission-permutations-alignment.md) and the **e2e-permission-actor-matrix** skill.

## Reference

- **Aligned reference:** [apps/web/e2e/bucket-admin-edit.spec.ts](../../../../apps/web/e2e/bucket-admin-edit.spec.ts)
- **Alignment doc:** [e2e-crud-permission-permutations-alignment.md](../../active/e2e-crud-permission-permutations-alignment.md)

## Alignment criteria (from alignment doc)

A spec is aligned when it has:

- API/source-of-truth documented or clear from context.
- Actor matrix: unauthenticated, fully privileged, privileged non-owner (if applicable), restricted (no permission), non-admin (if applicable).
- Seed + login helpers for each actor used.
- Tests for each actor × outcome (redirect, not found, read-only, form with Save, etc.).
- Flow tests: list→edit, Cancel→list (and Save→list where relevant); invalid id → not found.

## Specs and current status (from alignment doc)

| Spec | Status | Notes |
|------|--------|------|
| bucket-admin-edit.spec.ts | **Aligned** | Reference; no work. |
| bucket-role-edit.spec.ts | Partial | Add non-owner with/without permission, non-admin, list→edit, Cancel→list. |
| bucket-role-new.spec.ts | Partial | Add actor matrix for who can create roles. |
| bucket-settings.spec.ts | Needs alignment | Tab access and admins/roles by actor. |
| bucket-message-edit.spec.ts | Needs alignment | Owner vs admin with message update vs without vs non-admin. |
| bucket-messages.spec.ts | Partial | List visibility by actor. |
| bucket-detail.spec.ts | Partial | Detail visibility and action gating by actor. |
| bucket-child-new.spec.ts | Needs alignment | Who can create child bucket. |
| bucket-nested-new.spec.ts | Needs alignment | Same as child. |
| buckets-new.spec.ts | Partial | Add role/ownership if applicable. |
| buckets.spec.ts | Partial | List visibility by actor. |
| short-bucket.spec.ts | Partial | Short URL resolve by actor. |
| send-message.spec.ts | Needs alignment | Who can send message. |
| invite.spec.ts | Partial | Invalid/expired token, auth required. |
| profile.spec.ts | Partial | Unauthenticated redirect; self only. |
| settings.spec.ts | Partial | Unauthenticated redirect; self only. |
| dashboard.spec.ts | Partial | Unauthenticated redirect. |
| home.spec.ts | Partial | Unauthenticated vs authenticated content. |

Auth-only (login, signup, forgot-password, reset-password) are N/A for this alignment.

## Suggested execution order (from alignment doc)

1. bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit
2. bucket-messages, bucket-detail, bucket-child-new, bucket-nested-new, buckets-new, buckets, short-bucket, send-message, invite
3. profile, settings, dashboard, home (ensure unauthenticated + self-only where relevant)

## Steps to implement (per spec)

For each spec that is Partial or Needs alignment:

1. Document or confirm API/source-of-truth for permissions.
2. Identify required actors (unauthenticated, owner, non-owner with permission, restricted, non-admin).
3. Ensure seed + login helpers exist for each actor; add if missing.
4. Add tests for each actor × outcome (redirect, not found, read-only, form with Save, list→edit, Cancel→list, invalid id).
5. Run targeted spec: `make e2e_test_web_report_spec SPEC=e2e/<spec>.spec.ts`.
6. Apply e2e-readability (setE2EUserContext, hyphenated terms, full-sentence describe).

## Skills

- e2e-permission-actor-matrix, e2e-authz-matrix, e2e-crud-state-matrix, e2e-readability.

---

## Status: Batch 1 documented (plan closed; remaining work in permission-actor-alignment-web-remaining.md)

- **Date:** 2025-03-09
- **Done:** Batch 1 (bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit): added API/source-of-truth and actor-matrix comments to all four; clarified skipped tests (admin-without-permission for bucket-settings and bucket-role-new remain skipped until app gates those routes server-side). No new tests added; specs already had full actor coverage except the two skipped.
- **Remaining:** Batches 2 and 3 → see [permission-actor-alignment-web-remaining.md](../../active/e2e-spec-improvements-follow-up/permission-actor-alignment-web-remaining.md).
