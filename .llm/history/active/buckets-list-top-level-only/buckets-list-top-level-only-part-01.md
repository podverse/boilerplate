# Buckets list top-level only

Started: 2025-03-05  
Context: Buckets plural pages show only top-level buckets; child buckets (topics) appear only on bucket detail under topics.

---

### Session 1 - 2025-03-05

#### Prompt (Developer)

In boilerplate, the buckets plural pages should only return buckets that do not have a parent bucket. The buckets that have parent buckets will only get displayed within the context of a bucket page under the topics section

#### Key Decisions

- Restrict list at ORM layer: `findAccessibleByUser` (API) and `listPaginated` (management API) now filter to `parent_bucket_id IS NULL`.
- Removed parent/parent_ba joins from `findAccessibleByUser` since list no longer includes child buckets.
- Child buckets (topics) unchanged: still returned by `listTopics` (GET /buckets/:id/buckets) on bucket detail.

#### Files Modified

- packages/orm/src/services/BucketService.ts
