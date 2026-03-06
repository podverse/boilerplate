# 06 – Bucket display: username (displayName) instead of email

## Scope

Everywhere bucket owners and admins are displayed, show **username** and in parentheses
**display name** when set (i.e. “username (displayName)” or just “username”). For users
without a username (legacy), fall back to email-based display. Update management-api
formatOwnerDisplayName; web bucket detail (and related) pages; packages/ui BucketAdminsView;
NavBar user label. Ensure API responses (userToJson, bucket admins list) include username
so clients can render consistently (already in 02).

## Steps

### 1. Shared display helper

- Introduce a single helper (e.g. in packages/helpers or apps/api or shared in
  packages/ui): `formatUserLabel(user: { username?: string | null; email?: string |
  null; displayName?: string | null }): string`. Logic: if username is set, return
  “username (displayName)” when displayName is set and non-empty, else “username”. If no
  username, fall back to “email (displayName)” or “email”. Use this everywhere we need
  to show “owner” or “admin” label. Optionally export from helpers or ui so web and
  management-api can use same logic; or duplicate minimal logic in API (management + main)
  and in UI.

### 2. Management-api bucket owner display

- In `apps/management-api/src/controllers/bucketsController.ts`: `formatOwnerDisplayName`
  currently uses email and displayName. Change to use username when present, else email;
  format “username (displayName)” or “username” / “email (displayName)” or “email”.
  Ensure UserService.findById returns user with credentials.username and credentials.email
  (from 01/02). Same for listBuckets/getBucket where ownerDisplayName is set.

### 3. Main API bucket admins list

- In `apps/api/src/controllers/bucketAdminsController.ts`: adminToJson uses userToJson(user).
  userToJson already returns username and email (from 02). No change needed here if
  clients use a shared formatUserLabel with that shape.

### 4. Web bucket detail pages

- In `apps/web/src/app/(main)/bucket/[id]/page.tsx` and any other bucket pages where
  owner/admins are shown (e.g. messages, settings):
  - Replace formatEmailDisplayName / formatAdminLabel usage with the new convention:
    show username (displayName) or username; fallback to email (displayName) or email when
    username is missing. Use the shared formatUserLabel helper or inline the same logic.
  - Ensure owner label and admins list use the same helper so “Owner” and “Admins”
    columns show consistently.

### 5. packages/ui BucketAdminsView

- In `packages/ui/src/components/bucket/BucketAdminsView/BucketAdminsView.tsx`: type
  BucketAdminRow has user: { id, shortId, email, displayName }. Extend to include
  username (optional). Replace formatEmailDisplayName(a.user.email, a.user.displayName)
  with formatUserLabel({ username: a.user.username, email: a.user.email, displayName:
  a.user.displayName }) so we show “username (displayName)” or “username” with email
  fallback.

### 6. Web bucket settings admins

- In `apps/web/src/app/(main)/bucket/[id]/BucketAdminsClient.tsx` and any bucket
  settings admin list: ensure admin rows receive user with username and use the same
  display logic (formatUserLabel or equivalent).

### 7. NavBar user label

- In `packages/ui/src/components/navigation/NavBar/NavBar.tsx`: currently shows
  `user.displayName ?? user.email`. Change to prefer username for display: e.g. if
  user.username set show “username (displayName)” or “username”, else
  displayName ?? email. Use same formatUserLabel if NavBar receives full user object
  with username and email.

### 8. Types: BucketAdminRow and ServerUser

- In `apps/web/src/lib/buckets.ts` BucketAdminRow type: user has email, displayName; add
  username (optional). In ServerUser (or equivalent) used for session: add username so
  settings and NavBar can use it.

## Key files

- `apps/management-api/src/controllers/bucketsController.ts` (formatOwnerDisplayName)
- `apps/web/src/app/(main)/bucket/[id]/page.tsx`
- `packages/ui/src/components/bucket/BucketAdminsView/BucketAdminsView.tsx`
- `packages/ui` (formatUserLabel export if shared)
- `apps/web/src/app/(main)/bucket/[id]/BucketAdminsClient.tsx`
- `packages/ui/src/components/navigation/NavBar/NavBar.tsx`
- `apps/web/src/lib/buckets.ts` (BucketAdminRow type)
- ServerUser / auth context type (username field)

## Verification

- Bucket detail (and related pages): Owner and Admins show “username (displayName)” or
  “username”; for users without username, “email (displayName)” or “email”.
- Management-api bucket list/detail: ownerDisplayName uses same convention.
- BucketAdminsView in web and any management-web bucket settings: admin list shows
  username-first labels.
- NavBar: logged-in user label shows username when set, else email/displayName as before.
