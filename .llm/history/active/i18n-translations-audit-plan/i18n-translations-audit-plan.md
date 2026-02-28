# i18n translations audit plan (added to boilerplate plans)

**Started:** 2025-02-27  
**Context:** Add a plan to audit pages/components for i18n usage and harden the i18n process.

---

### Session 1 - 2025-02-27

#### Prompt (Developer)

Add another plan file that will be responsible for scanning all of the current pages and
components and making sure that they use I-18N translations and that the I-18N translations
process is as efficient and reliable As it should be

#### Key Decisions

- Created a **new plan set** `i18n-translations-audit` under `.llm/plans/active/` (separate
  from plan 21 which sets up i18n). This plan focuses on coverage audit and process
  reliability.
- Plan covers apps/web, apps/management-web, and packages/ui; defines strategy for shared
  UI (props vs provider), validation/compile/CI, and optional automated scan for hardcoded
  strings.

#### Files Created/Modified

- `.llm/plans/active/i18n-translations-audit/00-EXECUTION-ORDER.md`
- `.llm/plans/active/i18n-translations-audit/00-SUMMARY.md`
- `.llm/plans/active/i18n-translations-audit/01-i18n-audit-and-process.md`
