# Saved Workflow Output: Domain Driven Structure Gate

Skill: project-workflow
Mode: Setup after domain/product gate

Domain gate
- Bounded context: `recall`
- Core terms: `patientRecall`, `followUpTask`, `clinicStaff`
- Domain invariant: overdue recall must stay visible until a staff member resolves or defers it.
- TDD starting point: failing domain test for overdue recall visibility.

Structure handoff
- DDD-lite structure gate: completed
- Domain-first folder map:
  - `packages/domain/src/recall/`
  - `apps/api/src/recall/`
  - `apps/web/src/features/recall/`
- Folder-local instruction docs:
  - `packages/domain/AGENTS.md`
  - `apps/api/AGENTS.md`
  - `apps/web/AGENTS.md`

Next step
- Call project-structure after this gate.
- Hand off to feature-workflow only after PRD or issue has acceptance criteria and the TDD starting point.
