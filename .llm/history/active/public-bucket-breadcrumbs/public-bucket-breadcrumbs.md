# Public bucket breadcrumbs

Started: 2026-03-05. Context: Public bucket page (/b/[id]) and send-message should show breadcrumbs
walking up the parent chain; API returns ancestors for breadcrumb links.

---

### Session 1 - 2026-03-05

#### Prompt (Developer)

The public page should have breadcrumbs for bucket and the breadcrumbs should lead back up the chain.
and list each parent bucket in the breadcrumb. This may mean the query needs to return all the parents
Of the current bucket

#### Key Decisions

- API GET /buckets/public/:id returns `ancestors: { shortId, name }[]` (root-first; public parents only).
- BucketService.findAncestry(bucketId) returns parent chain root-first; controller filters to isPublic.
- Public bucket and send-message pages use Breadcrumbs with links via publicBucketRouteFromAncestry.
- successHref on send-message uses full ancestry so redirect goes to correct nested bucket URL.

#### Files Created/Modified

- packages/orm/src/services/BucketService.ts (findAncestry)
- apps/api/src/lib/bucket-response.ts (PublicBucketAncestor, toPublicBucketResponse ancestors)
- apps/api/src/controllers/bucketMessagesController.ts (getPublicBucket loads ancestry, passes to response)
- packages/helpers-requests/src/types/bucket-types.ts (PublicBucketAncestor, PublicBucket.ancestors)
- packages/helpers-requests/src/types/index.ts (export PublicBucketAncestor)
- apps/web/src/app/(main)/b/[id]/PublicBucketBreadcrumbs.tsx (new client component)
- apps/web/src/app/(main)/b/[id]/page.tsx (breadcrumb items, PublicBucketBreadcrumbs)
- apps/web/src/app/(main)/b/[id]/send-message/page.tsx (breadcrumbs, successHref from ancestry)
