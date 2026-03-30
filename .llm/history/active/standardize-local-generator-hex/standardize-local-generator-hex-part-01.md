# standardize-local-generator-hex

### Session 1 - 2026-03-24

#### Prompt (Developer)

implement, we don't care about historical

#### Key Decisions

- `JWT_SECRET` and `MANAGEMENT_JWT_SECRET` use `local_generator: hex_32` in classification; `setup.sh` uses `generate_hex_32` only; removed `generate_uuid`.
- Validator allows only `hex_32` for `local_generator`.

#### Files Created/Modified

- infra/env/classification/base.yaml
- scripts/local-env/setup.sh
- scripts/k8s-env/validate-classification.sh
- docs/development/ENV-REFERENCE.md
- docs/development/LOCAL-ENV-OVERRIDES.md
- .cursor/skills/classification-env/SKILL.md
