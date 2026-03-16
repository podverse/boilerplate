# 05 – Management-web: Bucket detail and messages (shared UI + gating)

## Scope

In management-web, **clicking a bucket** opens the **bucket detail** page that **looks and behaves like the owner view** in the main web app (using shared UI from 03). **Messages** link and **messages route** are visible/accessible only when the admin has **messagesCrud read**. If they do not have read, hide the Messages button and block navigation to bucket messages (redirect or 403).

## Steps

### 1. Bucket detail page (management-web)

- Add route e.g. `(main)/buckets/[id]/page.tsx` (and optionally `[id]/messages/page.tsx`).
- Server component: load management user and permissions; load bucket by id (from management API). If no bucketsCrud read, redirect or 403.
- Render **shared bucket detail** component (from 03) with:
  - Bucket data (id, name, isPublic, …).
  - **showMessagesLink:** `hasReadPermission(permissions, 'messagesCrud')`. When false, shared UI does not show Messages tab/link.
  - Links: back to list (e.g. ROUTES.BUCKETS), edit bucket (if update), settings if applicable; messages URL only passed when showMessagesLink is true.
  - Permissions for inline actions (e.g. edit bucket) from getCrudFlags(..., 'bucketsCrud').
- No breadcrumbs on this public-style bucket view (per earlier requirement); optional “Back to buckets” link in layout for management context.

### 2. Messages link and route gating

- **UI:** Shared component receives `showMessagesLink: boolean`. When false, do not render Messages tab, button, or link. So admins without messagesCrud read never see the entry point.
- **Route:** For `(main)/buckets/[id]/messages/page.tsx` (or equivalent):
  - Server component: check `hasReadPermission(permissions, 'messagesCrud')`. If false, redirect to bucket detail (or return 403).
  - Load messages for the bucket from management API (which already enforces messagesCrud read and only returns allowed messages, e.g. public-only when read is 0; see 02). Render shared messages view with messages and message CRUD flags from messagesCrud.
- Do not register a “Messages” nav item in the main nav for management-web; messages are only reached via bucket detail when read is set.

### 3. Private / non-public messages

- Management API (02) already ensures: when messagesCrud read is 0, list messages and get message return 403 or only public messages per policy. So management-web never “leaks” non-public messages to admins without read.
- In management-web, if the user has read and the API returns both public and non-public messages, show them in the shared messages list. If the API restricts to public-only when read is 0, management-web simply never calls it without read (route gated above).

### 4. Same experience as owner

- Use **only** the shared bucket detail and messages components (from 03). No duplicate layout or custom management-only bucket view; same headers, same structure, same message list UX. The only differences: data from management API, permission-driven visibility of Messages link, and optional “Back to buckets” for management context.

### 5. Edit bucket / delete bucket from detail

- If the shared UI or the management bucket detail page includes “Edit bucket” or “Delete bucket,” gate them with getCrudFlags(..., 'bucketsCrud').update and .delete. Links or actions only visible when the admin has the corresponding bit.

## Key files

- `apps/management-web/src/app/(main)/buckets/[id]/page.tsx` (bucket detail)
- `apps/management-web/src/app/(main)/buckets/[id]/messages/page.tsx` (messages; optional if messages are in same page as a tab)
- Shared package components (bucket detail, messages list) used by both apps
- Permission checks: hasReadPermission(permissions, 'messagesCrud'), getCrudFlags(..., 'bucketsCrud')

## Verification

- Admin **with** messagesCrud read: sees Messages link on bucket detail; can open messages page; sees messages (public + non-public if API allows).
- Admin **without** messagesCrud read: does not see Messages link; direct URL to bucket messages redirects or 403; no way to access private messages.
- Bucket detail layout and messages list match owner experience in web app (same shared UI).
- Edit/delete bucket only visible when bucketsCrud update/delete are set.
