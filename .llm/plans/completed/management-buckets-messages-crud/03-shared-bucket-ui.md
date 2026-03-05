# 03 – Shared bucket (and messages) UI

## Scope

The **bucket detail** and **messages** experience in management-web must match what the **owner** sees in the main web app. To avoid duplication and drift, bucket-related pages/components should live in a **shareable package** (or clearly shared modules) used by both **apps/web** and **apps/management-web**. This plan covers what to extract, where it lives, and how both apps use it.

## Steps

### 1. Identify what to share

- **Bucket detail page:** Content and layout the owner sees on the bucket page (e.g. bucket name, topics, admins, messages link, settings link). May include: header, tabs or links (Messages, Settings), summary cards, action buttons.
- **Messages view:** List of messages for the bucket (and possibly create/edit/delete message UI). May include: message list component, empty state, “Add message” or submit entry point.
- **Data fetching:** Shared UI can be presentational (receives data as props) or accept a data-provider/context so each app supplies data (web: main API with user auth; management-web: management API with management auth). Prefer **presentational components + data fetched in each app** so API and auth stay in the app.

### 2. Choose package location

- **Option A:** New package e.g. `packages/bucket-views` (or `packages/bucket-ui`) that exports bucket detail and messages view components. Both apps depend on it; apps pass in routes, labels, and data (or fetch in app and pass props).
- **Option B:** Move shared components into `packages/ui` under a clear namespace (e.g. `BucketDetailContent`, `BucketMessagesContent`). Same idea: presentational or with minimal app-specific injection (routes, permissions, data).
- Prefer Option A if the set of components is large or will grow; Option B if it’s a small set and fits “UI only.”

### 3. Extract from apps/web

- From `apps/web/src/app/(main)/buckets/[id]/` (and messages, settings if needed for “same experience”):
  - Identify page structure: layout, breadcrumbs (or not), title, tabs, content areas.
  - Extract the **content** that should look identical (bucket info, message list, etc.) into the shared package. Keep in app: route, auth, data fetching, redirects, app-specific links (e.g. back to management buckets list).
  - Shared components should accept props for: bucket (id, name, isPublic, …), messages array, permissions (canEdit, canDelete, …), links (messagesUrl, settingsUrl, submitUrl, …), and labels/translations or i18n keys.
  - If both apps use next-intl, shared package can use `useTranslations` with a fixed namespace; else pass labels as props.

### 4. Use in apps/web

- Web bucket detail and messages pages: import shared components from the new package; fetch data as today; pass bucket, messages, permissions, and links. Keep web-specific layout (e.g. breadcrumbs) in the app.

### 5. Use in apps/management-web

- Management-web bucket detail page (and messages sub-page): same shared components. Management-web fetches bucket/messages from management API; passes permissions derived from bucketsCrud/messagesCrud; passes links (e.g. back to management buckets list, messages route only if messagesCrud read). No breadcrumbs on public-facing bucket view; management can add “Buckets” or “Back to list” in the layout if desired.
- Ensure the only difference between web and management-web for the “bucket + messages” view is data source and surrounding nav (and permission-driven visibility of Messages link), not the inner UI.

### 6. Messages link visibility

- Shared layout or bucket detail component can accept a prop e.g. `showMessagesLink: boolean`. Web always true for owner; management-web sets it from `hasReadPermission(permissions, 'messagesCrud')`. When false, do not render the Messages tab/button and do not expose the messages route in management-web (or redirect to bucket detail with 403).

## Key files

- New or existing package under `packages/` (bucket-views or ui)
- `apps/web/src/app/(main)/buckets/[id]/page.tsx` and messages page (refactor to use shared)
- `apps/management-web/src/app/(main)/buckets/[id]/` (and messages) – new pages using shared components
- Package exports and app dependencies in root `package.json` / workspace config

## Verification

- Owner in web and management admin (with read) see the same bucket detail and messages list layout and behavior.
- Management admin without messagesCrud read does not see Messages link when using the shared component with `showMessagesLink: false`; management-web does not register or allows access to messages route for that admin.
