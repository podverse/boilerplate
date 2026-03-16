# Permission-actor alignment – management-web E2E

- **Started:** 2025-03-09
- **Context:** Plan [permission-actor-alignment-management-web.md](.llm/plans/active/e2e-spec-improvements-follow-up/permission-actor-alignment-management-web.md). Prerequisite (deferred limited-admin seed + helpers) completed.

## Session 1 - 2025-03-09

#### Prompt (Developer)

@boilerplate/.llm/plans/active/e2e-spec-improvements-follow-up/permission-actor-alignment-management-web.md implement

#### Key Decisions

- Batch 1: bucket-admin-edit (already aligned), bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit. Settings layout uses bucketsCrud read → redirect dashboard; message-edit uses canReadBuckets then bucketMessagesCrud update → redirect buckets.
- Limited-admin (no buckets read) → redirect to dashboard for settings/role-edit/role-new/message-edit. Admin-with-bucket-admins (buckets read) → sees settings tabs and role form; admin without message update → redirect to /buckets on message-edit.
- bucket-message-edit “admin without update” test: create message as super-admin, then login as admin-with-bucket-admins and open message-edit URL → expect redirect /buckets.

#### Files Created/Modified

- apps/management-web/e2e/bucket-role-edit.spec.ts (doc comment, limited-admin redirect test, admin-with-bucket-admins list→edit test)
- apps/management-web/e2e/bucket-role-new.spec.ts (doc comment, limited-admin redirect, admin-with-bucket-admins form visible)
- apps/management-web/e2e/bucket-settings.spec.ts (doc comment, limited-admin redirect, admin-with-bucket-admins tabs visible)
- apps/management-web/e2e/bucket-message-edit.spec.ts (doc comment, limited-admin redirect, admin without message update → redirect /buckets)
- .llm/plans/active/e2e-spec-improvements-follow-up/permission-actor-alignment-management-web.md (status Batch 1 done, table updated)
- .llm/history/active/permission-actor-alignment-mgmt-web/permission-actor-alignment-mgmt-web-part-01.md (created)

## Session 2 - 2025-03-09

#### Prompt (Developer)

@boilerplate/.llm/plans/active/e2e-spec-improvements-follow-up/permission-actor-alignment-management-web-remaining.md implement. after you are finished, move to completed.

#### Key Decisions

- Implemented full remaining plan: P1 bucket-edit; P2 admin-edit, admin-detail, user-edit, user-detail; P3 bucket-detail, bucket-child-new, buckets-new, bucket-messages, buckets; P4 admin-role-new, admins-new, admins, users-new, users; P5 profile, settings, events, dashboard, home. Added API/actor-matrix doc comments and tests for limited-admin and admin-with-bucket-admins (or admin-without-admins/users) redirect/visibility. Plan moved to completed.

#### Files Created/Modified

- apps/management-web/e2e/bucket-edit.spec.ts, bucket-detail.spec.ts, bucket-child-new.spec.ts, buckets-new.spec.ts, bucket-messages.spec.ts, buckets.spec.ts
- apps/management-web/e2e/admin-edit.spec.ts, admin-detail.spec.ts, admin-role-new.spec.ts, admins-new.spec.ts, admins.spec.ts
- apps/management-web/e2e/user-edit.spec.ts, user-detail.spec.ts, users-new.spec.ts, users.spec.ts
- apps/management-web/e2e/profile.spec.ts, settings.spec.ts
- .llm/plans/completed/e2e-spec-improvements-follow-up/permission-actor-alignment-management-web-remaining.md (created), 00-README.md (updated)
- .llm/plans/active/e2e-spec-improvements-follow-up/permission-actor-alignment-management-web-remaining.md (deleted), 00-README.md (updated)
