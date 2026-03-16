# Tab active state and URL params

**Started:** 2025-03-06  
**Context:** Messages tab did not show active state when URL had ?tab=messages&sort=oldest because activeHref was set to the full URL while the tab item href was the canonical (base) URL; with exactMatch they did not match.

---

### Session 1 - 2025-03-06

#### Prompt (Developer)

It appears that the messages tab is not active state, even though we're on the messages tab according to the URL. Does the tab component need extra handling to ensure that this problem doesn't happen again in the future When the URL doesn't have URL params, the active state should work. But also There should always be the possibility that there will be a tab in the URL params that will also need to be recognized as a match Add something to make this more reliable and consistent and if you need a skill to remind you do so

#### Key Decisions

- Cause: With exactMatch, Tabs compares currentHref === item.href. The page was setting activeHref to the full URL (e.g. ?tab=messages&sort=oldest) while the Messages tab item href is the canonical URL (e.g. bucketViewRoute(id) with no query). They never matched.
- Fix: Set activeHref to the canonical href for the current tab (same as the tab item's href for that tab). So when tab === 'messages' use bucketViewRoute(id) / bucketDetailRoute(id); when tab === 'buckets' use bucketDetailTabRoute(id, 'buckets'). No extra query params in activeHref.
- Skill: .cursor/skills/tab-active-state-url-match/SKILL.md documents that activeHref must match the tab item href (canonical tab URL); Tabs JSDoc updated to state this.

#### Files Created/Modified

- apps/management-web/src/app/(main)/bucket/[id]/page.tsx (activeHref = canonical tab href only)
- apps/web/src/app/(main)/bucket/[id]/page.tsx (activeHref = canonical tab href only)
- packages/ui/src/components/navigation/Tabs/Tabs.tsx (JSDoc for activeHref)
- .cursor/skills/tab-active-state-url-match/SKILL.md (new)
- .llm/history/active/tab-active-state-url-match/tab-active-state-url-match.md (new)
