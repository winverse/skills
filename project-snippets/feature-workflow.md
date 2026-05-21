## Project Skills

- Use $feature-workflow at `<skills-root>/skills/feature-workflow/SKILL.md` when an existing PRD, issue, spec, bug report, acceptance criteria, ADR, or `design.md` should be turned into a verified implementation slice with planning, TDD or characterization checks, review, QA/runtime evidence, document sync, and completion reporting.

## Project Skill Overrides

- Treat `feature-workflow` as the repeated implementation loop half of the Workflow suite. It is called after `project-workflow` or equivalent project setup has produced enough domain, architecture, design, and acceptance criteria.
- Do not use `feature-workflow` for raw product discovery, project structure selection, initial design system setup, or PRD creation. Hand those back to `project-workflow`.
- Before running it, inventory selected implementation primitives from Superpowers plugin, GStack plugin, Matt Pocock skills, and repo-local helpers as `selected`, `skipped`, or `fallback`; do not run whole upstream packages by default.
- Label borrowed primitives with their source package, for example Superpowers plugin `writing-plans`/`tdd`/`subagent-driven-development`, GStack plugin `plan-eng-review`, Matt Pocock skills `diagnose`, and repo-local custom `code-review`/`browser-qa`/`sync-docs`.
- Read the target spec, issue, bug report, acceptance criteria, ADR, PRD, `design.md`, testing docs, and current diff before planning implementation.
- Read domain-first folder map and folder-local instruction docs when present. Confirm the current spec's bounded context before choosing files.
- Read `.scratch/<project-or-feature-slug>/workflow-state.md` when present, and update it with reused authority, selected primitives, evidence pointers, skipped/fallback choices, and remaining open questions.
- Read `.scratch/<project-or-feature-slug>/work-claims.md` when present. Before production edits, confirm the current lane owns the intended write set, respect read-only paths, and stop with an overlap block if another active lane owns the same file or module.
- Shared/hotspot files should be changed only by the integration owner named in `work-claims.md`; other lanes should leave dependent patch notes or issues instead of editing those files directly.
- If acceptance criteria are missing, write a light spec or ask a focused question before changing production code.
- For TypeScript production edits, keep ESM only: `package.json` `type: "module"`, ESM `tsconfig`, `import`/`export`, and no CommonJS, `require`, `module.exports`, `.cjs`, or `.cts`. If the spec requires CommonJS, stop with a blocker or migration boundary before editing.
- For target code repos, treat TDD as mandatory before production code edits: RED evidence first, characterization evidence second, and an explicit TDD exception record only when neither is practical.
- When a domain invariant exists, start RED in the domain package or pure function boundary before relying on UI/API adapter tests.
- Do not install or run TDD hooks from this shared skills repo. If enforcement is needed, wire a project-local hook in the target code repo and keep it scoped to that repo.
- Use `subagent-driven-development` only for large implementation work with disjoint write sets and clear review ownership.
- For UI work, verify selected mock direction or `design.md` before coding; use `design-review` and `browser-qa` when the surface is visible in a browser.
- For CLI/no-browser work, collect command output, fixture result, API response, or log evidence instead of requiring screenshots.
- Before connecting tools, MCP servers, external APIs, write-capable automation, network fetches, or untrusted content processing, verify or write the Agent Tool And Security Risk Gate.
- Completion requires acceptance criteria, tests or runtime evidence, review result, docs sync decision, and artifact hygiene.
- If a wrong route, missing setup gate, skipped TDD evidence, repeated QA/docs omission, or tool/security gate miss appears, leave an `agent-eval-harness` seed candidate under `.scratch/<feature-slug>/eval-candidates/` instead of running a heavy improvement loop every time.
- Start commit, deploy, tag, or release handoff only when explicitly requested. For commit handoff, use `atomic-committer`; after that handoff, its default-push contract applies unless the user explicitly forbids push.
