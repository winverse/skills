# Saved Feature Workflow Output: TDD Hook Docs Only

Skill: feature-workflow
Mode: Target project TDD gate planning

Repo classification:
- Current repo: shared skills repo
- Production code surface: none

Decision:
- Document the target-project TDD hook contract only.
- Do not create `.codex/hooks/enforce_spec_tdd.mjs` in this repo.
- Do not edit `.codex/config.toml` in this repo for TDD enforcement.
- Target code repos may add a project-local hook after they opt in.

Target repo TDD gate:
- production code edit requires RED evidence first
- characterization evidence is allowed when a failing test cannot be created first
- explicit TDD exception record is required when neither is practical
- start in warn mode, then move to block mode after the project validates the gate
