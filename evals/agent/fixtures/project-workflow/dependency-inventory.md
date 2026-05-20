# Saved Workflow Output: Dependency Inventory

Skill: project-workflow
Mode: Discovery

Dependencies
- Matt Pocock skills: selected | invoked | skipped | fallback | deferred
  - `grill-with-docs`: project setup domain docs interview; invoke original if available, fallback docs-aware questions if unavailable
  - `grill-me`: skipped for project setup by default; non-code standalone fallback only
  - `to-prd` / `to-issues`: PRD and backlog setup
- GStack plugin: selected | invoked | skipped | fallback | deferred
  - `office-hours`: product challenge; invoke original if available, fallback questions if unavailable
  - `plan-ceo-review` / `plan-design-review`: setup review
- Superpowers plugin: selected | invoked | skipped | fallback | deferred
  - `brainstorming`: raw idea first response setup gap check after `office-hours`
  - `writing-plans`: large phase/step handoff gap check only
- Design direction: selected | skipped | fallback | deferred
- Repo-local helpers: selected | skipped | fallback | deferred
  - `project-structure`, `design.md`, `sync-docs`, `agent-eval-harness`
- Spec handoff target: selected | skipped | fallback | deferred
  - `feature-workflow`: ready vertical slice handoff

Next step: report selected, invoked, skipped, fallback, and deferred primitives with source package labels, reason, and timing. Claim direct skill/plugin use only when the original invocation surface was actually used.
