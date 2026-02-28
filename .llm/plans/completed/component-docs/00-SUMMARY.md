# Component viewing and documentation – summary

Scope: add a tool for **viewing** and **documenting** `@boilerplate/ui` components in isolation. No testing (no Vitest/RTL, no play functions, no Chromatic) in this plan.

- **Recommendation:** Storybook in `packages/ui`.
- **Alternative:** Ladle (lighter, Vite-based) if you prefer minimal footprint.
- **Documentation:** Add `packages/ui/PACKAGES-UI.md` (per documentation-conventions) covering how to run Storybook and add stories.
- **Skill:** Add `.cursor/skills/storybook-component-docs/SKILL.md` so agents add/update stories when changing `packages/ui` components.
- **Single plan file:** [01-storybook-viewing-docs.md](01-storybook-viewing-docs.md)
