# Saved Workflow Output: New Project Routing

Skill: project-workflow
Mode: Discovery
Current authority: AGENTS.md present; CONTEXT.md missing; ADRs missing
Runtime adapter: Codex AGENTS.md
Dependencies: invocation inventory required before specialist calls
Primitive invocation
- Matt Pocock skills / `grill-with-docs`: selected -> invoke original if available; fallback docs-aware interview if unavailable
- Matt Pocock skills / `grill-me`: skipped -> not the default project setup gate
- GStack plugin / `office-hours`: selected -> invoke original if available; fallback product challenge if unavailable
- Superpowers plugin / `brainstorming`: selected -> invoke original if available; fallback setup gap check before design or structure if unavailable
- user custom / `design.md`: deferred until domain/product answers define the first usable UI slice
Document language: Korean-first unless target project says otherwise
Next step: Discovery

Artifacts
- Proposed target path, not created yet: CONTEXT.md or .scratch/<feature-slug>/WORKFLOW_LOG.md
- Preserve: no generated project tree yet

Validation
- Done when: `grill-with-docs` or fallback docs-aware interview, `office-hours` or fallback product challenge, and Superpowers `brainstorming` or fallback setup gap check make user/product/domain language clear enough to ask architecture and design questions

Open
- Do not call project-structure yet; structure choices are not constrained.
- Do not imply workflow-state, work-claims, phase handoff, ADR, PRD, or design.md already exist in the first response.
