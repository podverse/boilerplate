# Buckets / Topics / Messages (part 02)

**Started:** 2025-03-02  
**Context:** Multi-file plan set (00-SUMMARY, 01–05) for Buckets, Topics, messages, bucket admins, public bucket page. Part 02 continues from part 01 (sessions 11+).

---

### Session 11 - 2025-03-04

#### Prompt (Developer)
The filter on the buckets page is not working as expected. When I type a word that matches only one out of a list of bucket names for a split second it works correctly and I see the filtered bucket name but then shortly after that it immediately loads all the bucket names again. The way this filter input should work is it should wait until a short amount of time passes between when the last character is pressed and then it should query the back end for the updated list and then render that list

#### Key Decisions
- Filter was debounced (300ms) and URL updated correctly, but the server always fetched all buckets (no search param), so after navigation the page received full list and displayed it. Fixed by adding server-side search: API and page now pass/search on query so the list is filtered by backend.
- API: GET /buckets accepts optional `search` query param; listBuckets reads it and passes to BucketService.findAccessibleByUser; BucketService filters by LOWER(bucket.name) LIKE with escaped % and _.
- Page: fetchBuckets(search) builds path with ?search= when non-empty and requests that URL; server re-render after debounced URL update now returns filtered buckets.

#### Files Modified
- packages/orm/src/services/BucketService.ts (findAccessibleByUser accepts optional options.search; andWhere LOWER(name) LIKE with ESCAPE for %/_).
- apps/api/src/controllers/bucketsController.ts (listBuckets reads req.query.search, passes to service).
- apps/web/src/app/(main)/buckets/page.tsx (fetchBuckets(search), path with search query when present).
