# 01 - Guidance and memory updates

## Scope

Ensure project guidance explicitly encodes the suite-title rule so future specs stay consistent
across both web and management-web E2E suites.

## Steps

1. Review `.cursor/skills/e2e-readability/SKILL.md`.
2. Confirm it explicitly states:
   - top-level suite `describe` is concise phrase-style;
   - nested/test/step labels remain verbose sentence-style;
   - rule applies to both `apps/web/e2e` and `apps/management-web/e2e`.
3. If any of the above is unclear or missing, update this skill with concise explicit wording.
4. Review `.cursor/rules/` for a focused E2E rule that reinforces this requirement.
5. Add/update a rule only if needed to avoid ambiguity or drift.

## Key files

- `.cursor/skills/e2e-readability/SKILL.md`
- `.cursor/rules/*.mdc` (only if needed)

## Verification

- Read back updated guidance and confirm all three conditions are explicit.
- Ensure no guidance conflicts with existing E2E readability policy.

## Deliverable

- Persistent repository guidance that clearly preserves this convention going forward.
