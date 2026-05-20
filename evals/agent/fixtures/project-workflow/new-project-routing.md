# Saved Workflow Output: New Project Routing

Skill: project-workflow
Mode: Discovery
Current authority: AGENTS.md present; CONTEXT.md missing; ADRs missing
Runtime adapter: Codex AGENTS.md
Dependencies: invocation inventory required before specialist calls
Primitive invocation
- Matt Pocock skills / `grill-me`: selected -> invoke original if available; fallback interview if unavailable
- GStack plugin / `office-hours`: selected -> invoke original if available; fallback product challenge if unavailable
- Superpowers plugin / `brainstorming`: deferred until setup questions reveal a plan gap
- user custom / `design.md`: deferred until domain/product answers define the first usable UI slice
Document language: Korean-first unless target project says otherwise
Next step: Discovery

Artifacts
- Proposed target path, not created yet: CONTEXT.md or .scratch/<feature-slug>/WORKFLOW_LOG.md
- Preserve: no generated project tree yet

Validation
- Done when: `grill-me` or fallback domain interview and `office-hours` or fallback product challenge make user/product/domain language clear enough to ask architecture questions

Open
- Do not call project-structure yet; structure choices are not constrained.
- Do not imply workflow-state, work-claims, phase handoff, ADR, PRD, or design.md already exist in the first response.
