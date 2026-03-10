# E2E CRUD Permission Permutations – Spec Alignment Plan

## Purpose

Bring all E2E specs into alignment with the thorough CRUD permission permutation test process. Reference: [apps/web/e2e/bucket-admin-edit-unauthenticated.spec.ts](apps/web/e2e/bucket-admin-edit-unauthenticated.spec.ts) (and other per-actor files) and the **e2e-permission-actor-matrix** skill.

**Spec layout:** E2E specs are split by user: one file per actor per feature, named `<feature>-<user>.spec.ts` (e.g. `bucket-admin-edit-unauthenticated.spec.ts`, `bucket-admin-edit-seeded-bucket-owner.spec.ts`). The tables below refer to the feature; each row may correspond to multiple spec files (one per actor).

## Alignment criteria

A spec is **aligned** when it has:

- API/source-of-truth documented or clear from context.
- Actor matrix: unauthenticated, fully privileged, privileged non-owner (if applicable), restricted (no permission), non-admin (if applicable).
- Seed + login helpers for each actor used.
- Tests for each actor × outcome (redirect, not found, read-only, form with Save, etc.).
- Flow tests: list→edit, Cancel→list (and Save→list where relevant); invalid id → not found.

## Legend

- **Aligned:** Matches the full actor-matrix + flow process (e.g. bucket-admin-edit web).
- **Partial:** Some actor/flow coverage but missing one or more permutations.
- **Needs alignment:** Permission-gated but only one actor or minimal coverage.
- **N/A:** Not permission-gated in the same way (e.g. public auth screens, list-only without edit).

---

## apps/web/e2e

Specs are split by user: `<feature>-<user>.spec.ts` (e.g. bucket-admin-edit-unauthenticated.spec.ts, bucket-admin-edit-seeded-bucket-owner.spec.ts).

| Feature (specs: \<feature\>-\<user\>.spec.ts) | Permission-gated? | Status | Notes |
|------|-------------------|--------|-------|
| bucket-admin-edit | Yes (owner, bucket-admins permission) | **Aligned** | Reference implementation. |
| bucket-role-edit | Yes (bucket settings/roles) | **Aligned** | Full actor matrix; list→edit, Cancel→list, Save→list; invalid id → not found. |
| bucket-role-new | Yes (bucket settings/roles) | **Aligned** | Full actor matrix; list→new, Cancel→list, invalid bucket id → not found; admin-without-permission test skipped until route is permission-gated server-side. |
| bucket-settings | Yes (bucket access) | **Aligned** | Tab access (general, admins, roles) by actor; invalid bucket id → not found; admin-without-permission test skipped until server-side gating. |
| bucket-message-edit | Yes (message CRUD by bucket permission) | **Aligned** | Owner and admin with message update: list→edit, Save→detail, Cancel→detail; invalid id → not found; admin without permission and non-admin → not found. |
| bucket-messages | Yes (bucket access) | **Aligned** | Full actor matrix; invalid bucket id → not found; detail→messages flow for owner and admin. |
| bucket-detail | Yes (bucket access) | **Aligned** | Full actor matrix; invalid bucket id → not found; list→detail flow for owner and admin. |
| bucket-child-new | Yes (bucket create) | **Aligned** | Full actor matrix; invalid parent id → not found; detail→new, Cancel→detail for owner and admin. |
| bucket-nested-new | Yes (bucket create) | **Aligned** | Full actor matrix; invalid parent id → not found; detail→new, Cancel→detail for owner and admin. |
| buckets-new | Yes (bucket create) | **Aligned** | Unauthenticated redirect; owner form, Cancel→list, list→new; non-admin → not found. |
| buckets | Yes (list by ownership/admin) | **Aligned** | Full actor matrix; unauthenticated redirect, owner/admin/non-admin list visibility. |
| short-bucket | Yes (bucket access) | **Aligned** | Full actor matrix; unauthenticated/owner/admin/non-admin; invalid id and private bucket in unauthenticated. |
| send-message | Yes (message create) | **Aligned** | Full actor matrix (public URL); unauthenticated/owner/admin/non-admin; invalid id and private bucket → not found. |
| invite | Yes (token + auth) | **Aligned** | Full actor matrix; invalid token and valid token (login/accept-reject) for unauthenticated, owner, admin, non-admin. |
| profile | Yes (authenticated, self) | **Aligned** | Unauthenticated redirect; owner and non-admin see own profile (redirect to settings). |
| settings | Yes (authenticated, self) | **Aligned** | Unauthenticated redirect; owner and non-admin see own settings. |
| login | Auth only | N/A | Redirect when already logged in; safe/unsafe returnUrl. |
| signup | Auth only | N/A | Validation and success path. |
| forgot-password | Auth only | N/A | Validation and success path. |
| reset-password | Auth only | N/A | Token invalid/valid and success path. |
| dashboard | Auth only | **Aligned** | Unauthenticated redirect; owner and non-admin see dashboard after login. |
| home | Public/auth | **Aligned** | Unauthenticated redirect to login; owner and non-admin redirect to dashboard. |

---

## apps/management-web/e2e

Specs are split by user: `<feature>-<user>.spec.ts` (e.g. bucket-admin-edit-unauthenticated.spec.ts, bucket-admin-edit-super-admin-full-crud.spec.ts).

| Feature (specs: \<feature\>-\<user\>.spec.ts) | Permission-gated? | Status | Notes |
|------|-------------------|--------|-------|
| bucket-admin-edit | Yes (management bucket admins) | **Aligned** | Full role matrix (super-admin, admin with bucketAdminsCrud, admin without); invalid admin id → not found; list→edit, Cancel→list, Save→list for super-admin and admin-with-permission. |
| bucket-role-edit | Yes (bucket roles) | **Aligned** | Full role matrix; invalid role id handling; list→edit and Cancel→list for super-admin and admin-with-permission. |
| bucket-role-new | Yes (bucket roles) | **Aligned** | Full role matrix; invalid bucket id handling; settings roles-tab→new and Cancel→list for super-admin and admin-with-permission. |
| bucket-settings | Yes (bucket access) | **Aligned** | Full role matrix; invalid bucket id handling; tabs general/admins/roles (including tab query state) by role. |
| bucket-message-edit | Yes (message CRUD) | **Aligned** | Super-admin full flows (list→edit, Cancel, Save, invalid id); restricted roles redirect to dashboard or buckets per policy. |
| bucket-messages | Yes (bucket access) | **Aligned** | Full role matrix; super-admin and admin-with-permission cover invalid id and messages-tab flows; restricted role redirects per policy. |
| bucket-detail | Yes (bucket access) | **Aligned** | Full role matrix; super-admin and admin-with-permission cover invalid id and list→detail flows; restricted role redirects per policy. |
| bucket-edit | Yes (bucket update) | **Aligned** | Full role matrix; invalid bucket id handling; list→edit and Cancel flow for super-admin and admin-with-permission. |
| bucket-child-new | Yes (bucket create) | **Aligned** | Full role matrix; super-admin invalid parent id and detail→new flow; restricted create/read roles are denied per policy. |
| buckets-new | Yes (bucket create) | **Aligned** | Unauthenticated redirect; super-admin list→new, Cancel→list, validation and create flow; restricted roles denied per policy. |
| buckets | Yes (list by role) | **Aligned** | Full role matrix; super-admin and admin-with-permission list/detail navigation covered; restricted roles redirect per policy. |
| admin-edit | Yes (management admins) | **Aligned** | Full role matrix; super-admin invalid id, list→edit, Cancel→list, Save→list; restricted role redirects per policy. |
| admin-detail | Yes (management admins) | **Aligned** | Full role matrix; super-admin and limited-admin have invalid-id and list→detail coverage; restricted role redirects per policy. |
| admin-role-new | Yes (management roles) | **Aligned** | Full role matrix; super-admin has list→new, Cancel→list, create flow; restricted role redirects per policy. |
| admins-new | Yes (management admins create) | **Aligned** | Unauthenticated redirect; super-admin form/validation/create covered; restricted no-admins-crud role denied per policy. |
| admins | Yes (list by role) | **Aligned** | Full role matrix; super-admin list/new/delete coverage plus limited-admin list→detail flow; restricted role denied per policy. |
| user-edit | Yes (management users) | **Aligned** | Full role matrix; super-admin invalid id, list→edit, Cancel→list, Save→list; restricted role redirects per policy. |
| user-detail | Yes (management users) | **Aligned** | Full role matrix; super-admin and limited-admin have invalid-id and list→detail coverage; restricted role redirects per policy. |
| users-new | Yes (user create) | **Aligned** | Unauthenticated redirect; super-admin create flow covered; restricted no-users-crud role denied per policy. |
| users | Yes (list by role) | **Aligned** | Full role matrix; super-admin list/new/cancel-delete coverage and limited-admin list→detail flow; restricted role denied per policy. |
| profile | Yes (authenticated, self) | **Aligned** | Unauthenticated redirect; super-admin and limited-admin authenticated profile/settings-tab visibility covered. |
| settings | Yes (authenticated) | **Aligned** | Unauthenticated redirect; super-admin and limited-admin settings tab visibility covered. |
| events | Yes (audit by role) | **Aligned** | Unauthenticated redirect; super-admin and limited-admin events visibility/query-state covered. |
| login | Auth only | N/A | Redirect and credentials. |
| dashboard | Auth only | **Aligned** | Unauthenticated redirect; super-admin login path and limited-admin authenticated dashboard visibility covered. |
| home | Public/auth | **Aligned** | Unauthenticated redirect to login; super-admin and limited-admin authenticated home→dashboard redirect covered. |

---

## Execution order (suggested)

1. **Web – permission-gated edit/detail (high impact)**  
   bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit, then bucket-messages, bucket-detail, bucket-child-new, bucket-nested-new, buckets-new, buckets, short-bucket, send-message, invite.

2. **Management-web – permission-gated edit/detail**  
   bucket-admin-edit, bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit, bucket-edit, admin-edit, admin-detail, user-edit, user-detail, then list and create specs (admins, users, buckets, etc.).

3. **Auth-only and public**  
   dashboard, home, profile, settings (ensure unauthenticated + self-only where relevant).

---

## Skills to apply

- **e2e-permission-actor-matrix:** Full actor × outcome and flow process (reference: bucket-admin-edit-*.spec.ts per-actor files).
- **e2e-authz-matrix:** Visibility and disabled states by role.
- **e2e-crud-state-matrix:** CRUD and validation/empty/loading/error branches.
- **e2e-readability:** Verbose steps and `setE2EUserContext` for reports.
