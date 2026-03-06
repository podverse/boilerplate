# adminform-cleanup-avoid-unused-skill

Started: 2025-03-06
Context: Implement plan to remove unused isSuperAdmin prop from AdminForm and add avoid-unused-props-vars skill.

---

### Session 1 - 2025-03-06

#### Prompt (Developer)

AdminForm cleanup and "no unused" skill — Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Removed `isSuperAdmin` from `AdminFormProps` and from both callers (admin edit page and admins new page); form only needs `canEditPermissions` and `targetIsSuperAdmin`.
- Added project skill `avoid-unused-props-vars` and linked it from global SKILL Code Quality section.

#### Files Created/Modified

- apps/management-web/src/components/admins/AdminForm.tsx — removed isSuperAdmin from type and destructuring
- apps/management-web/src/app/(main)/admin/[id]/edit/page.tsx — removed isSuperAdmin prop
- apps/management-web/src/app/(main)/admins/new/page.tsx — removed isSuperAdmin prop
- .cursor/skills/avoid-unused-props-vars/SKILL.md — created
- .cursor/skills/global/SKILL.md — added Unused props/vars bullet and link
