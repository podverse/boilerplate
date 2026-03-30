# gha-workflow-summary-image-version

Started: 2026-03-30

### Session 1 - 2026-03-30

#### Prompt (Developer)

the summary info for the boilerplate ci actions should list somewhere what the image version that was built is

ex. 0.1.5-staging.0 0.1.5-staging.3 or whatever

#### Key Decisions

- Add a `workflow-summary` job to `publish-alpha.yml` that appends to `GITHUB_STEP_SUMMARY` after images are verified, showing the semver tag and each `ghcr.io` image with `:version` and `:staging`.

#### Files Modified

- `.github/workflows/publish-alpha.yml`
- `.llm/history/active/gha-workflow-summary-image-version/gha-workflow-summary-image-version-part-01.md`
