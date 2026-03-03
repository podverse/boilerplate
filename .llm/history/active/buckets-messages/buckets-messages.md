# Buckets / Topics / Messages

**Started:** 2025-03-02  
**Context:** Multi-file plan set (00-SUMMARY, 01–05) for Buckets (top-level), Topics (child buckets), messages, bucket admins, and public bucket page + submit.

---

### Session 1 - 2025-03-02

#### Prompt (Developer)
Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions
- Phase 4 and 5 implemented in boilerplate apps/web: list/create/edit bucket, bucket detail with topics and admins link, new topic page, bucket admins list + add (by User ID) + edit/delete, messages list + edit/delete, public bucket page (/b/[slug]), public submit form (/b/[slug]/submit).
- Public paths: `isPublicPath()` treats any path starting with `/b/` as public so unauthenticated users can view and submit.
- Button component in @boilerplate/ui has no `size` prop; removed all `size="small"` from new pages.
- Fixed packages/ui Text component: guard `styles.muted`/`styles.error`/`styles.sm` with `typeof x === 'string'` for strict TypeScript.

#### Files Created/Modified
- apps/web: buckets list (page, Card without action prop), new bucket (BucketForm), bucket detail ([id]/page), edit bucket ([id]/edit), topics new ([id]/topics/new, TopicForm), admins ([id]/admins, BucketAdminsClient), admins edit ([id]/admins/[userId]/edit, EditBucketAdminForm), messages ([id]/messages, MessagesList), message edit ([id]/messages/[messageId]/edit, EditMessageForm), public bucket (b/[slug]/page), public submit (b/[slug]/submit, PublicSubmitForm).
- apps/web: routes (isPublicPath includes /b/), AppHeader (Buckets nav), i18n buckets (cancel, save).
- packages/ui: Text.tsx (type guard for CSS module class names).
