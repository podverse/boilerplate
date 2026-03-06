# Table sort cookie preferences

**Started:** 2025-03-06  
**Context:** Persist table sort (sortBy/sortOrder) in app-specific cookies so list pages load with the user's last-selected sorting. Web and management-web each have their own cookie; preferences keyed by list (buckets, admins, users, events).

---

### Session 1 - 2025-03-06

#### Prompt (Developer)

Whenever a Table sorting is selected On web and management It should Save that preference in a cookie so that the page by default can load with that same sorting next time Web and management web should each have their own cookie for this purpose. The cookie should be specific to sorting preferences. come up with a good conventional name for this cookie in each app. boilerplate

(Subsequent: Implement the plan as specified.)

#### Key Decisions

- Cookie names: web `table_sort_prefs`, management-web `management_table_sort_prefs`. Single JSON cookie per app, keyed by list (buckets, admins, users, events).
- Cookie read when URL has no sortBy (client effect); cookie write in handleSortHeaderClick. Helpers in packages/ui (sortPrefsCookie.ts), client-only.
- Optional props `sortPrefsCookieName` and `sortPrefsListKey` on ResourceTableWithFilter and TableWithFilter; when both set, enable persist/restore.

#### Files Created/Modified

- packages/ui/src/components/table/sortPrefsCookie.ts (new)
- packages/ui/src/components/table/ResourceTableWithFilter/ResourceTableWithFilter.tsx
- packages/ui/src/components/table/TableWithFilter/TableWithFilter.tsx
- apps/web/src/lib/cookies.ts (new)
- apps/web/src/components/BucketsTableWithFilter.tsx
- apps/web/src/app/(main)/buckets/page.tsx
- apps/management-web/src/lib/cookies.ts (new)
- apps/management-web/src/components/BucketsTableWithFilter.tsx
- apps/management-web/src/components/AdminsTableWithFilter.tsx
- apps/management-web/src/components/UsersTableWithFilter.tsx
- apps/management-web/src/components/EventsTableWithFilter.tsx
- apps/management-web/src/app/(main)/buckets/page.tsx
- apps/management-web/src/app/(main)/admins/page.tsx
- apps/management-web/src/app/(main)/users/page.tsx
- apps/management-web/src/app/(main)/events/page.tsx
