# Custom Link Usage

**Started:** 2025-03-03  
**Context:** Use existing @boilerplate/ui Link everywhere instead of next/link; fix clickable area
width so "back to bucket" button hit area matches the button.

---

### Session 1 - 2025-03-03

#### Prompt (Agent)

Use custom Link everywhere and fix clickable area width. Implement the plan as specified.

#### Key Decisions

- Kept custom Link in packages/ui; added `display: inline-block` and `width: fit-content` to
  `.root` in Link.module.scss so the link is only as wide as its content.
- Extended LinkProps via `Omit<React.ComponentProps<typeof NextLink>, 'onClick'> & { onClick?:
  () => void }` so target, rel, style, tabIndex, prefetch, etc. are supported.
- Updated `isInternalHref` to accept Next's `Url` type (string | UrlObject) by narrowing with
  `typeof href === 'string'`.
- Replaced `import Link from 'next/link'` with `import { Link } from '@boilerplate/ui'` (or
  internal `../../navigation/Link` in ResourceTableWithFilter) in 14 files across packages/ui,
  apps/web, and apps/management-web.
- Removed unused `styles` import from buckets/[id]/messages/page.tsx.

#### Files Modified

- packages/ui/src/components/navigation/Link/Link.module.scss
- packages/ui/src/components/navigation/Link/Link.tsx
- packages/ui/src/components/table/ResourceTableWithFilter/ResourceTableWithFilter.tsx
- apps/web/src/app/(main)/buckets/[id]/messages/page.tsx
- apps/web/src/app/(main)/buckets/[id]/BucketAdminsClient.tsx
- apps/web/src/components/BucketMessageList/BucketMessageList.tsx
- apps/web/src/app/(main)/b/[id]/page.tsx
- apps/web/src/app/(main)/buckets/[id]/settings/page.tsx
- apps/web/src/app/(main)/b/[id]/submit/page.tsx
- apps/web/src/app/(main)/buckets/[id]/EditMessageForm.tsx
- apps/web/src/app/(main)/buckets/BucketForm.tsx
- apps/web/src/app/(main)/buckets/[id]/page.tsx
- apps/web/src/app/(main)/buckets/[id]/admins/page.tsx
- apps/web/src/app/(main)/buckets/[id]/EditBucketAdminForm.tsx
- apps/web/src/app/(main)/buckets/TopicForm.tsx
- apps/management-web/src/app/(main)/admins/[id]/page.tsx
- apps/management-web/src/app/(main)/users/[id]/page.tsx
