# API locale and email handling plan (added to boilerplate plans)

**Started:** 2025-02-27  
**Context:** Add a plan for locale handling at API touch points (emails) with API messages
staying en-US.

---

### Session 1 - 2025-02-27

#### Prompt (Developer)

Add another plan file that will add locale handle. handling at specific touch points with the
API such as when emails are sent so that emails are sent using the preferred selected
locale of the user that triggered that email. The status messages from the API should
always be in American English, but user-facing interactions like email messages should be
able to support locales

#### Key Decisions

- Created plan set **api-locale-email-handling** under `.llm/plans/active/`. Emails
  (verification, password reset, email-change) use user’s preferred locale; API
  `res.json({ message })` stays American English only.
- Locale resolution: prefer stored user preferred_locale, then request (Accept-Language or
  param), default en-US. Mailer gains optional locale param; email content per locale
  (API-owned or shared bundle).

#### Files Created/Modified

- `.llm/plans/active/api-locale-email-handling/00-EXECUTION-ORDER.md`
- `.llm/plans/active/api-locale-email-handling/00-SUMMARY.md`
- `.llm/plans/active/api-locale-email-handling/01-api-locale-email-handling.md`

---

### Session 2 - 2025-03-01

#### Prompt (Developer)

implement the plan

#### Key Decisions

- Implemented full locale handling test matrix (plan section 3) in `auth-mailer.test.ts`: signup locale (en-US, en, en-GB, DEFAULT_LOCALE=es, unsupported fr), forgot-password locale (es, no header), request-email-change locale (es), password validation 400 (weak password + es, weak password + no header).
- Request-email-change locale test uses a fresh signup in the test so it does not depend on email changed by a prior test.
- Optional resolveLocale unit tests (plan F) not added to keep helpers-i18n free of vitest.

#### Files Created/Modified

- `apps/api/src/test/auth-mailer.test.ts`
