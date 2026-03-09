# E2E CRUD Permission Permutations – Spec Alignment Plan

## Purpose

Bring all E2E specs into alignment with the thorough CRUD permission permutation test process. Reference: [apps/web/e2e/bucket-admin-edit.spec.ts](apps/web/e2e/bucket-admin-edit.spec.ts) and the **e2e-permission-actor-matrix** skill.

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

| Spec | Permission-gated? | Status | Notes |
|------|-------------------|--------|-------|
| bucket-admin-edit.spec.ts | Yes (owner, bucket-admins permission) | **Aligned** | Reference implementation. |
| bucket-role-edit.spec.ts | Yes (bucket settings/roles) | Partial | Unauthenticated + invalid id + owner save; add non-owner with/without permission, non-admin, list→edit, Cancel→list. |
| bucket-role-new.spec.ts | Yes (bucket settings/roles) | Partial | Add actor matrix for who can create roles. |
| bucket-settings.spec.ts | Yes (bucket access) | Needs alignment | Tab access and admins/roles by actor. |
| bucket-message-edit.spec.ts | Yes (message CRUD by bucket permission) | Needs alignment | Owner vs admin with message update vs without vs non-admin. |
| bucket-messages.spec.ts | Yes (bucket access) | Partial | List visibility by actor. |
| bucket-detail.spec.ts | Yes (bucket access) | Partial | Detail visibility and action gating by actor. |
| bucket-child-new.spec.ts | Yes (bucket create) | Needs alignment | Who can create child bucket. |
| bucket-nested-new.spec.ts | Yes (bucket create) | Needs alignment | Same as child. |
| buckets-new.spec.ts | Yes (bucket create) | Partial | Auth; add role/ownership if applicable. |
| buckets.spec.ts | Yes (list by ownership/admin) | Partial | List visibility by actor. |
| short-bucket.spec.ts | Yes (bucket access) | Partial | Short URL resolve by actor. |
| send-message.spec.ts | Yes (message create) | Needs alignment | Who can send message. |
| invite.spec.ts | Yes (token + auth) | Partial | Invalid/expired token, auth required. |
| profile.spec.ts | Yes (authenticated, self) | Partial | Unauthenticated redirect; self only. |
| settings.spec.ts | Yes (authenticated, self) | Partial | Unauthenticated redirect; self only. |
| login.spec.ts | Auth only | N/A | Redirect when already logged in; safe/unsafe returnUrl. |
| signup.spec.ts | Auth only | N/A | Validation and success path. |
| forgot-password.spec.ts | Auth only | N/A | Validation and success path. |
| reset-password.spec.ts | Auth only | N/A | Token invalid/valid and success path. |
| dashboard.spec.ts | Auth only | Partial | Unauthenticated redirect. |
| home.spec.ts | Public/auth | Partial | Unauthenticated vs authenticated content. |

---

## apps/management-web/e2e

| Spec | Permission-gated? | Status | Notes |
|------|-------------------|--------|-------|
| bucket-admin-edit.spec.ts | Yes (management bucket admins) | Needs alignment | Currently unauthenticated + invalid id + superadmin owner row; add management role matrix (e.g. bucketAdminsCrud, bucketsCrud) and list→edit, Cancel→list. |
| bucket-role-edit.spec.ts | Yes (bucket roles) | Needs alignment | Actor matrix for management roles. |
| bucket-role-new.spec.ts | Yes (bucket roles) | Needs alignment | Who can create roles. |
| bucket-settings.spec.ts | Yes (bucket access) | Needs alignment | Tabs and admins/roles by management role. |
| bucket-message-edit.spec.ts | Yes (message CRUD) | Needs alignment | Management permission for message update. |
| bucket-messages.spec.ts | Yes (bucket access) | Partial | List visibility by role. |
| bucket-detail.spec.ts | Yes (bucket access) | Partial | Detail and actions by role. |
| bucket-edit.spec.ts | Yes (bucket update) | Needs alignment | Who can edit bucket. |
| bucket-child-new.spec.ts | Yes (bucket create) | Needs alignment | Management role for create. |
| buckets-new.spec.ts | Yes (bucket create) | Partial | Management role for create. |
| buckets.spec.ts | Yes (list by role) | Partial | List and filters by role. |
| admin-edit.spec.ts | Yes (management admins) | Needs alignment | Superadmin vs other roles. |
| admin-detail.spec.ts | Yes (management admins) | Needs alignment | Role × visibility/actions. |
| admin-role-new.spec.ts | Yes (management roles) | Needs alignment | Who can create admin roles. |
| admins-new.spec.ts | Yes (management admins create) | Partial | Role for create. |
| admins.spec.ts | Yes (list by role) | Partial | List visibility by role. |
| user-edit.spec.ts | Yes (management users) | Needs alignment | Role × edit/self-protection. |
| user-detail.spec.ts | Yes (management users) | Needs alignment | Role × visibility. |
| users-new.spec.ts | Yes (user create) | Partial | Role for create. |
| users.spec.ts | Yes (list by role) | Partial | List by role. |
| profile.spec.ts | Yes (authenticated, self) | Partial | Unauthenticated redirect. |
| settings.spec.ts | Yes (authenticated) | Partial | Unauthenticated redirect. |
| events.spec.ts | Yes (audit by role) | Partial | Visibility by role. |
| login.spec.ts | Auth only | N/A | Redirect and credentials. |
| dashboard.spec.ts | Auth only | Partial | Unauthenticated redirect. |
| home.spec.ts | Public/auth | Partial | Unauthenticated vs authenticated. |

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

- **e2e-permission-actor-matrix:** Full actor × outcome and flow process (reference: bucket-admin-edit.spec.ts).
- **e2e-authz-matrix:** Visibility and disabled states by role.
- **e2e-crud-state-matrix:** CRUD and validation/empty/loading/error branches.
- **e2e-readability:** Verbose steps and `setE2EUserContext` for reports.
