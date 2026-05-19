# Workflow Fixture: Local Implementation Fallback

Skill: feature-workflow
Mode: Implementation
Dependency status: Superpowers-style fallback

Prior gates:
- PRD exists.
- Vertical issue is triaged as ready.
- Existing design.md is not relevant because this issue has no browser UI.

Next artifacts:
- `.scratch/example/specs/2026-05-12-01-implementation-design.md`
- `.scratch/example/plans/01.md`
- `.scratch/example/WORKFLOW_LOG.md`

Fallback requirements:
- Write issue-level implementation design with behavior, files, states, tool/security risks, and tests.
- Write a TDD plan with exact paths and commands.
- Run RED or characterization check before production changes when practical.
- Complete GREEN and only then refactor.
- Collect tests plus non-browser runtime evidence from the CLI command output.
