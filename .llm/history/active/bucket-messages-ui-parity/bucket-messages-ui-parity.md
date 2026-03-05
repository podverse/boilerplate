# Bucket and messages UI parity (web and management-web)

**Started:** 2025-03-04  
**Context:** Plan: align management-web with web for bucket detail, messages, and settings.

---

### Session 1 - 2025-03-04

#### Prompt (Developer)
Bucket and messages UI parity (web and management-web). Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions
- Public link: management-web uses `NEXT_PUBLIC_WEB_APP_URL`; when set, "Public page" opens web app in new tab; bucket detail already uses `target="_blank"`.
- Shared BucketMessageList and BucketMessagesBreadcrumbs live in `packages/ui`; both apps use them with app-specific routes and i18n (buckets namespace in management-web).
- Shared settings chrome: BucketSettingsBreadcrumbs, BucketSettingsTabs, BucketSettingsLayoutClient in UI; accept hrefs/labels so apps pass their routes; web refactored to use them.
- Management-web settings: General tab only (no Admins); `/buckets/[id]/edit` redirects to `/buckets/[id]/settings`; bucket detail shows "Settings" label and links to settings.
- Management-web messages page: same layout as web (ContentPageLayout + breadcrumbs + BucketMessageList from UI), with optional "Add message" block when canCreate.

#### Files Created/Modified
- apps/management-web: config/env.ts (getWebAppUrl), .env.example, app/(main)/buckets/[id]/page.tsx (publicHref, settings label/href), app/(main)/buckets/[id]/messages/page.tsx, BucketMessagesPageClient.tsx (new), app/(main)/buckets/[id]/settings/layout.tsx (new), settings/page.tsx (new), app/(main)/buckets/[id]/edit/page.tsx (redirect), lib/routes.ts (bucketSettingsRoute, BucketSettingsTab), i18n originals en-US.json and es.json (buckets namespace, bucketDetail.settings).
- apps/web: app/(main)/buckets/[id]/messages/page.tsx, BucketMessagesPageClient.tsx (use UI breadcrumbs, pass bucketDetailHref/messagesAriaLabel), app/(main)/buckets/[id]/settings/BucketSettingsLayoutClient.tsx (use UI layout + breadcrumbs), BucketSettingsContent.tsx (use UI BucketSettingsTabs); removed BucketSettingsBreadcrumbs.tsx and BucketSettingsTabs.tsx.
- packages/ui: BucketMessagesBreadcrumbs (new), BucketSettingsBreadcrumbs (new), BucketSettingsTabs (new), BucketSettingsLayoutClient (new); index.ts exports; BucketMessageList already present from prior work.
