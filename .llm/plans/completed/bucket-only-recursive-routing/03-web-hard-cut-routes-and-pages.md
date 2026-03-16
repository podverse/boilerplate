# 03 - Web hard-cut routes and pages

## Scope

Replace topic route files/pages in `apps/web` with recursive bucket pages.

## Steps

1. Remove `topic` and `t` route trees in web app router.
2. Introduce recursive bucket page structure for nested detail/messages/edit/send-message flows.
3. Migrate topic page clients to generic nested-bucket clients.
4. Update breadcrumbs/links/forms to ancestry-based helpers.
5. Enforce root-only settings/admin UI; descendant edit form allows only name changes.

## Key files

- `apps/web/src/app/(main)/bucket/[id]/topic/**`
- `apps/web/src/app/(main)/b/[id]/t/**`
- `apps/web/src/app/(main)/bucket/[id]/page.tsx`
- `apps/web/src/app/(main)/bucket/[id]/messages/**`
- `apps/web/src/app/(main)/buckets/TopicForm.tsx`

## Verification

- Navigate nested private/public routes at depth 3.
- Confirm old topic pages are absent.
- Confirm descendant settings/admin controls are disabled or hidden.
