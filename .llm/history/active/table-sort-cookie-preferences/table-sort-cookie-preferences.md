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

---

### Session 2 - 2025-03-06

#### Prompt (Developer)

Bucket page sort preferences in cookies (path-based). Implement the plan as specified … Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Path-based keys: `bucket-detail-messages` (value `{ sort: 'recent'|'oldest' }`), `bucket-detail-topics` (value SortPref). Same app cookie (TABLE_SORT_PREFS_COOKIE_NAME).
- TableWithSort: optional sortPrefsCookieName, sortPrefsListKey, getSortUrl; restore effect + cookie write on header click; onSortChange(sortKey, nextOrder).
- MessagesSortSelect: optional sortPrefsCookieName; restore when URL has no sort (effect); save on change. Helpers getMessagesSortFromCookie, setMessagesSortInCookie exported from @boilerplate/ui.
- BucketDetailContent: buildTopicsSortUrl + handleTopicsSortChange(sortKey, nextOrder); pass cookie + getSortUrl to TableWithSort when topicsSortPrefsCookieName set.
- Skill: .cursor/skills/sort-prefs-cookie-by-path/SKILL.md; linked from table-sort-defaults.

#### Files Created/Modified

- packages/ui/src/components/table/sortPrefsCookie.ts (messages helpers; removed unused SortPrefsMap)
- packages/ui/src/components/table/TableWithSort/TableWithSort.tsx (cookie props, restore/save, onSortChange signature)
- packages/ui/src/components/bucket/BucketDetailContent/BucketDetailContent.tsx (topicsSortPrefsCookieName, buildTopicsSortUrl, handleTopicsSortChange)
- packages/ui/src/index.ts (export getMessagesSortFromCookie, setMessagesSortInCookie)
- apps/web/src/app/(main)/bucket/[id]/MessagesSortSelect.tsx (sortPrefsCookieName, restore/save)
- apps/web/src/app/(main)/bucket/[id]/page.tsx (TABLE_SORT_PREFS_COOKIE_NAME for MessagesSortSelect and BucketDetailContent)
- apps/web/src/app/(main)/b/[id]/page.tsx (sortPrefsCookieName for MessagesSortSelect)
- apps/management-web/src/app/(main)/bucket/[id]/MessagesSortSelect.tsx (sortPrefsCookieName, restore/save)
- apps/management-web/src/app/(main)/bucket/[id]/page.tsx (cookie names)
- .cursor/skills/sort-prefs-cookie-by-path/SKILL.md (new)
- .cursor/skills/table-sort-defaults/SKILL.md (see-also link)

---

### Session 3 - 2025-03-06

#### Prompt (Developer)

http://localhost:4002/bucket/XBUOsnZIuQ?tab=buckets when I navigate to this page, it seems that an infinite re-rendering is happening in the logs … I think the situation is that the default sorting matches the last saved sorting in the cookie. How to Prevent this very serious issue reliably

#### Key Decisions

- Cause: TableWithSort restore effect called router.replace(getSortUrl(pref)) when URL had no sortBy/sortOrder. When cookie held default (name, asc), getSortUrl returned the same URL, so replace(sameUrl) triggered re-render and the effect ran again → infinite loop.
- Fix: Add optional defaultSortBy and defaultSortOrder to TableWithSort. In the restore effect, when both are set and cookie pref matches them, skip router.replace. BucketDetailContent passes DEFAULT_TOPICS_SORT_BY and DEFAULT_TOPICS_SORT_ORDER when cookie prefs are enabled.

#### Files Created/Modified

- packages/ui/src/components/table/TableWithSort/TableWithSort.tsx (defaultSortBy, defaultSortOrder props; skip replace when pref === default)
- packages/ui/src/components/bucket/BucketDetailContent/BucketDetailContent.tsx (pass defaultSortBy, defaultSortOrder to TableWithSort when using cookie prefs)

#### Prompt (Developer, follow-up)

Are you confident that this fix will prevent the infinite rendering issue? Not just for the bucket, but for all cases? … apply the fix

#### Key Decisions

- Added a second guard in TableWithSort: before router.replace(url), compare url to current URL (pathname + searchParams). If equal, skip replace so the component is safe even if a caller omits defaultSortBy/defaultSortOrder.

#### Files Created/Modified

- packages/ui/src/components/table/TableWithSort/TableWithSort.tsx (usePathname; skip router.replace when getSortUrl result equals current URL)
