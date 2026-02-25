### Session 1 - 2026-02-25

#### Prompt (Developer)

It appears that when I run the npm run dev all watch command that it starts by clearing the terminal. Is that able to be avoided. I don't think that the podverse mono repo does it, but meta boost repo is

#### Key Decisions

- Use TypeScript watch output preservation to avoid screen clears.

#### Files Modified

- apps/api/package.json
- apps/web/sidecar/package.json
