# Topics list CRUD buttons

**Started:** 2025-03-04  
**Context:** Bucket detail page shows a topics list (child buckets). User asked for the view button to be the CRUD view button and to include view, update, and delete depending on permissions.

## Session 1 - 2025-03-04

#### Prompt (Developer)
In the topics list, the view button should be The crud view button and also You should include all of the crud buttons view update and delete depending on what permissions that user has available

#### Key Decisions
- Use `CrudButtons` in `BucketDetailContent` for topic row actions (view = icon, optional edit/delete).
- Added optional props: `topicEditHref`, `topicOnDelete`, `topicEditLabel`, `topicDeleteLabel`. When set, topic rows render `CrudButtons` with view (from `topicViewLabel` + `topic.href`), edit, and/or delete. `renderTopicActions` still overrides when provided.
- View label passed to CrudButtons only when string (aria-label). Edit/delete labels typed as `string | undefined`.

#### Files Created/Modified
- `packages/ui/src/components/bucket/BucketDetailContent/BucketDetailContent.tsx` — CrudButtons import; new props; getTopicActions builds CrudButtons (view/edit/delete) when no renderTopicActions.
- `apps/web/src/app/(main)/buckets/[id]/page.tsx` — Pass `topicEditHref`, `topicEditLabel`, `topicDeleteLabel`. Delete button appears when app passes `topicOnDelete` (e.g. from a client component with permission + API).

## Session 2 - 2025-03-04

#### Prompt (Developer)
How does the boilerplate web handle the owner of a bucket? The owner should always have full crud abilities related to that bucket. And it The owner should not be able to have those abilities removed. Admins on the other hand may be able to selectively have different crud abilities. also, the add topic button should be in line with the topic's label and aligned to the far right. of the wrapper it is in in the row

#### Key Decisions
- Documented existing behavior: `apps/api/src/lib/bucket-policy.ts` gives owner full CRUD; `bucketAdminsController` blocks editing/removing owner; `BucketAdminsView` shows "Owner" and no Edit/Delete for owner row. No code changes needed for owner handling.
- Added `docs/buckets/OWNER-AND-ADMINS.md` summarizing owner vs admins.
- `SectionWithHeading`: added optional `headingAction`; when set, title and action render in a row (title left, action right via flexbox).
- `BucketDetailContent`: Topics section uses `headingAction` for the Add topic button; button removed from below the table.

#### Files Created/Modified
- `docs/buckets/OWNER-AND-ADMINS.md` — New doc: owner full CRUD and not editable/removable; admins selective CRUD.
- `packages/ui/src/components/layout/SectionWithHeading/SectionWithHeading.tsx` — Optional `headingAction`; heading row with title + action.
- `packages/ui/src/components/layout/SectionWithHeading/SectionWithHeading.module.scss` — `.headingRow`, `.headingAction`.
- `packages/ui/src/components/bucket/BucketDetailContent/BucketDetailContent.tsx` — Topics section: pass Add topic button as `headingAction`; remove button after table.
