# Infinite redirect / reload safeguards

**Started:** 2026-03-16  
**Context:** Implement plan "Infinite Redirect / Reload Scenarios – Audit and Safeguards": reject
returnUrl === LOGIN/SIGNUP in proxy and login page to avoid self-redirects.

---

### Session 1 - 2026-03-16

#### Prompt (Developer)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file
itself. To-do's from the plan have already been created. Do not create them again. Mark them as
in_progress as you work, starting with the first one. Don't stop until you have completed all the
to-dos.

#### Key Decisions

- Proxy: after resolving target from returnUrl, normalize path (strip trailing slash, drop query) and
  if normalized path is ROUTES.LOGIN or ROUTES.SIGNUP, use ROUTES.DASHBOARD to avoid self-redirect.
- Login page: extended isSafeReturnUrl to treat LOGIN and SIGNUP as invalid (normalized path
  comparison) so post-login redirect never goes to auth pages.

#### Files Created/Modified

- apps/web/src/proxy.ts (reject returnUrl === LOGIN/SIGNUP when redirecting "already logged in")
- apps/web/src/app/(auth)/login/page.tsx (isSafeReturnUrl rejects LOGIN/SIGNUP)
