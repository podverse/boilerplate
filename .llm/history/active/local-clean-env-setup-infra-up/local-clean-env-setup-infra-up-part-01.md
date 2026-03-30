# local-clean-env-setup-infra-up

**Started:** 2026-03-24  
**Author:** LLM-assisted  
**Context:** Composite Make target for full local reset + env from home overrides + infra.

### Session 1 - 2026-03-24

#### Prompt (Developer)

add a new make command

make local_clean_env_setup_infra_up

it is a combination of these commands

make local_clean
make local_env_clean
make local_env_prepare
make local_env_link
make local_env_setup
make local_infra_up

#### Key Decisions

- Added **`local_clean_env_setup_infra_up`** in **`Makefile.local.env.mk`** using sequential **`$(MAKE)`** sub-invocations so order is preserved under **`make -j`** (same pattern as **`local_nuke_rebuild_run`** / **`local_reset_env_infra`**).
- Forward **`testSuperAdmin=$(testSuperAdmin)`** to **`local_infra_up`** for non-interactive super admin.
- Documented target in **`Makefile.local.mk`** header comment block.

#### Files Created/Modified

- `makefiles/local/Makefile.local.env.mk`
- `makefiles/local/Makefile.local.mk`
- `.llm/history/active/local-clean-env-setup-infra-up/local-clean-env-setup-infra-up-part-01.md`

### Session 2 - 2026-03-24

#### Prompt (Developer)

review the make files. the nuke local commands after the local_env_clean need to call local_env_prepare and local_env_link before local_env_setup

#### Key Decisions

- **`local_nuke_rebuild_run`** now runs **`local_env_prepare`** and **`local_env_link`** immediately after **`local_env_clean`** and before **`local_prune_boilerplate_images`** / **`local_env_setup`**, matching the documented override workflow used by **`local_clean_env_setup_infra_up`**.
- **`local_clean_env_setup_infra_up`** was already correct; no change.
- **`local_reset_env_infra`** still uses **`local_env_remove`** (not **`local_env_clean`**); left unchanged unless a follow-up asks to align that path.

#### Files Created/Modified

- `makefiles/local/Makefile.local.env.mk`
- `makefiles/local/Makefile.local.mk`
- `.llm/history/active/local-clean-env-setup-infra-up/local-clean-env-setup-infra-up-part-01.md`
