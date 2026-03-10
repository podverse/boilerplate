# Permission-actor alignment – apps/web (remaining)

- **Started:** 2025-03-09
- **Context:** Plan permission-actor-alignment-web-remaining (batches 2–3). Batch 1 was documented in completed permission-actor-alignment-web.md.

## Session 1 - 2025-03-09

#### Prompt (Developer)

implement Permission-actor alignment – apps/web (remaining)

#### Key Decisions

- Added API/actor-matrix doc comments to all batch 2 and 3 specs. Added tests: bucket-child-new and bucket-nested-new (non-owner admin without bucket create → not found); buckets (non-admin sees list or empty state). Used existing helpers loginAsWebE2EAdminWithoutPermission, loginAsWebE2ENonAdmin.
- Plan moved to completed after implementation.

#### Files Created/Modified

- apps/web/e2e/bucket-detail.spec.ts, bucket-messages.spec.ts, bucket-child-new.spec.ts, bucket-nested-new.spec.ts, buckets-new.spec.ts, buckets.spec.ts, short-bucket.spec.ts, send-message.spec.ts, invite.spec.ts, profile.spec.ts, settings.spec.ts, dashboard.spec.ts, home.spec.ts
- .llm/plans/completed/e2e-spec-improvements-follow-up/permission-actor-alignment-web-remaining.md (created), 00-README.md (updated)
- .llm/plans/active/e2e-spec-improvements-follow-up/permission-actor-alignment-web-remaining.md (deleted), 00-README.md (updated)
- .llm/history/active/permission-actor-alignment-web-remaining/permission-actor-alignment-web-remaining-part-01.md (created)
