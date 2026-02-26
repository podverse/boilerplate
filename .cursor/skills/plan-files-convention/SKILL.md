---
name: plan-files-convention
description: Where and how to save LLM plan files locally. Use when creating, saving, or completing plan sets (e.g. multi-phase plans). Aligns with Podverse monorepo convention.
version: 1.0.0
---

# Plan Files Convention

This skill describes how to save plan files locally in the Metaboost repo, following the same convention as the Podverse monorepo.

## Where to Save Plans

- **Active plans**: `.llm/plans/active/[plan-set-name]/`
- **Completed plans**: `.llm/plans/completed/[plan-set-name]/` (move here when the plan set is done)

Use a short, kebab-case name for the set (e.g. `metaboost-boilerplate`, `web-runtime-config-endpoint`).

## Standard File Layout (Active Set)

Inside the plan-set directory, use:

- **00-EXECUTION-ORDER.md** – Phase order, parallel groups, and pointers to each numbered plan.
- **00-SUMMARY.md** – Scope summary, list of plan files, dependency map, and recorded decisions.
- **01-NN-topic.md** … **NN-topic.md** – One markdown file per topic (e.g. `01-infra-directory.md`, `09-gitflow-test.md`). Each has: Scope, Steps, Key files, Verification.
- **COPY-PASTA.md** – Copy-paste prompts for parallel agents, referencing the numbered plans.

Plans stay under ~300 lines each; split into part files (e.g. `22-part-1-dashboard.md`) if a topic grows.

## How to use COPY-PASTA (execution order)

- **Phases are sequential.** Do not start Phase N+1 until Phase N is fully complete.
- **Within a phase,** steps can be sequential or parallel. When the doc says "run A, then B,
  then C and D in parallel" it means: run A → **wait for A to finish** → run B → **wait for
  B to finish** → then run C and D in parallel (e.g. two agents); **wait for both C and D**
  before starting the next phase. Only start "in parallel" work after all prior steps in
  that phase have completed.
- For each step or parallel group, wait for completion before starting the next step or
  phase.

## When Creating a New Plan Set

1. Create the directory: `.llm/plans/active/[plan-set-name]/`.
2. Add 00-EXECUTION-ORDER.md and 00-SUMMARY.md first.
3. Add one file per topic (01, 02, …) with scope, steps, key files, verification.
4. Add COPY-PASTA.md for any parallel execution groups.
5. Do not implement until the user asks; plans are executed incrementally (see plan-creation rule).

## When a Plan Set Is Complete

1. Move the entire directory from `active/` to `completed/`:  
   `mv .llm/plans/active/[plan-set-name] .llm/plans/completed/`
2. Update any cross-references (e.g. 00-master-plan or README) if needed.

## Reference

- Podverse: `.llm/plans/active/` and `.llm/plans/completed/`; see e.g. `podverse/.llm/plans/completed/web-runtime-config-endpoint/` for layout.
- Metaboost boilerplate set: `.llm/plans/active/metaboost-boilerplate/`.
