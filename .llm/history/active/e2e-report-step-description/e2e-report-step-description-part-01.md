# E2E report: step description under each screenshot

**Started:** 2025-03-07  
**Context:** Custom Playwright reporter so step descriptions appear directly below each screenshot in the HTML report (no disconnected Attachments section).

---

### Session 1 - 2025-03-07

#### Prompt (Developer)

E2E report: step description under each screenshot. Implement the plan as specified. Combine the step descriptions with the screenshot view so the expandable step description is below each screenshot it is for.

#### Key Decisions

- Added custom reporter `scripts/e2e-html-steps-reporter.ts`: implements Playwright Reporter with onBegin/onTestEnd/onEnd, reads output dir from `PLAYWRIGHT_HTML_OUTPUT_DIR`, renders attachments in order so each image/png is followed by its "Step description" text/plain in a `<details>` block.
- Makefile `e2e_test_home_report` switched from `--reporter=html` to `--reporter=../../scripts/e2e-html-steps-reporter.ts` (path relative to workspace app dir so both web and management-web resolve to repo scripts).
- Reporter copies image attachments into report `attachments/` and writes self-contained `index.html` with dark-theme styling; HTML-escapes titles and body for safety.

#### Files Created/Modified

- `scripts/e2e-html-steps-reporter.ts` (created)
- `makefiles/local/Makefile.local.e2e.mk`
- `docs/testing/E2E-PAGE-TESTING.md` (subsection "Step report layout (custom reporter)")
- `.cursor/skills/e2e-page-tests/SKILL.md` (report mode custom reporter note)
- `.llm/history/active/e2e-report-step-description/e2e-report-step-description-part-01.md` (created)

---

### Session 2 - 2025-03-07

#### Prompt (Developer)

Instead of navigate-to-management-home-route-and-expect-redirect-to-login-page-for-unauthenticated-user can this be shorter? it seems like "Home redirects unauthenticated users to login" should tell us all the relevant info. Also this custom step report does not show a summary of tests like the report did previously. we still want that test summary at the top of the report, which we can click into for more specific information, but we also want all the screenshots and descriptions listed on the index test page so we can scroll through and view all screenshots without navigating into subdirectories. also, the title of these reports should indicate what they are for. for example. E2E Web Report and E2E Management Web Report (instead of E2E step report)

#### Key Decisions

- Shortened step labels in home specs to human-readable strings: "Home redirects unauthenticated users to login" and "Login page visible for unauthenticated user" (web and management-web).
- Reporter: derive report title from output path (ends with /management-web → "E2E Management Web Report", /web → "E2E Web Report"); add summary section at top with test counts and clickable list of test titles linking to #test-0, #test-1, etc.; add id on each test section for anchor links; all steps remain on same index page for scrolling.

#### Files Modified

- `apps/web/e2e/home.spec.ts`
- `apps/management-web/e2e/home.spec.ts`
- `scripts/e2e-html-steps-reporter.ts`
- `.llm/history/active/e2e-report-step-description/e2e-report-step-description-part-01.md`
