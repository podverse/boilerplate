# Bucket tab: no redirect + loading spinner

**Started:** 2025-03-06  
**Context:** Flash of empty content when switching tabs due to server redirect for cookie-based sort restore; no loading feedback during tab navigation.

---

### Session 1 - 2025-03-06

#### Prompt (Developer)

There is an undesirable side effect happening With the restore from cookie server side rendering … (Implement the plan: Bucket tab no-redirect and loading spinner.)

#### Key Decisions

- Removed server-side redirects for cookie restore. Server now uses cookie only to derive sort (messages) and topicsSortBy/topicsSortOrder (buckets) when URL does not specify them; URL is left unchanged so no flash.
- sort: from URL if present, else getMessagesSortFromCookieValue(sortPrefsCookieValue) ?? 'recent'.
- topicsSortBy/topicsSortOrder: from URL when valid, else from getSortPrefsFromCookieValue with fallback to TOPICS_DEFAULT_SORT_BY and 'asc'.
- Added loading.tsx in bucket/[id]/ for both management-web and web: centered LoadingSpinner (size lg) so Next.js shows it while the segment is loading (tab switch or initial load).

#### Files Created/Modified

- apps/management-web/src/app/(main)/bucket/[id]/page.tsx (removed redirect block; derive sort and topicsSort from cookie when URL omits them)
- apps/web/src/app/(main)/bucket/[id]/page.tsx (same)
- apps/management-web/src/app/(main)/bucket/[id]/loading.tsx (new)
- apps/web/src/app/(main)/bucket/[id]/loading.tsx (new)
