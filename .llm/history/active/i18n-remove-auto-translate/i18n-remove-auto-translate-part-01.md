# i18n: remove auto-translate, add doc note and skill

Started: 2025-02-27  
Context: Remove OpenAI auto-translate; document LLM-of-choice for translations; add i18n skill for reliable translation work.

---

### Session 1 - 2025-02-27

#### Prompt (Developer)

remove the auto translate with openai feature. going forward, we will simply use cursor chat window for this purpose. a note in documentation about i18n should say that translations can be generated with an LLM of your choosing. also make sure there is a skill that helps inform you how i18n translations work in the project so you can do it reliably

#### Key Decisions

- No actual translate script or i18n.yml workflow existed in the repo; only plan/docs referred to them. Removed those references and added doc note + skill.
- I18N.md: added "Generating translations" section stating translations can be generated with an LLM of your choosing (e.g. Cursor chat); run i18n:compile and i18n:validate after.
- Created `.cursor/skills/i18n/SKILL.md` describing three-tier layout, commands, adding/changing keys, UI namespace, validation rules, and checklist for reliable i18n work.
- Plan 21 and related plans updated to remove OpenAI/automation workflow; doc now says use LLM of your choosing. Removed OPENAI_API_KEY and i18n workflow from 28-github-repo-setup.md and 00-EXECUTION-ORDER.md.

#### Files Created/Modified

- docs/localization/I18N.md (added "Generating translations" section)
- .llm/plans/active/boilerplate/21-i18n-translations.md (removed automation workflow; doc-only step)
- .llm/plans/active/boilerplate/00-EXECUTION-ORDER.md (plan 21 description)
- .llm/plans/active/boilerplate/28-github-repo-setup.md (removed OPENAI_API_KEY and i18n workflow)
- .llm/plans/active/i18n-translations-audit/01-i18n-audit-and-process.md (i18n:translate → LLM of choice; CI note)
- .cursor/skills/i18n/SKILL.md (new)
- .llm/history/active/i18n-remove-auto-translate/i18n-remove-auto-translate-part-01.md (new)
