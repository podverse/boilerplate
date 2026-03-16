# Punycode deprecation fix (issue #23)

Started: 2026-03-16
Context: GitHub issue #23 – DEP0040 punycode deprecation warning at API startup.

---

### Session 1 - 2026-03-16

#### Prompt (Developer)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file
itself. To-do's from the plan have already been created. Do not create them again. Mark them as
in_progress as you work, starting with the first one. Don't stop until you have completed all the
to-dos.

#### Key Decisions

- Added npm `overrides.punycode` in root package.json so the dependency tree uses the userland
  punycode package instead of Node's deprecated built-in (fixes DEP0040).
- `npm install` was run; package-lock.json did not change (override did not alter resolved tree).

#### Files Modified

- package.json (root: overrides.punycode added)
