## Project Skills

- Use $project-workflow at `<skills-root>/skills/project-workflow/SKILL.md` when asked to start a new project, shape a raw product idea, prepare domain docs, run product challenge, choose architecture boundaries, create `design.md`, write ADR/PRD, create an initial issue backlog, verify cross-agent project setup, or hand off a ready spec to `feature-workflow`.

## Project Skill Overrides

- Treat `project-workflow` as the initial setup half of the Workflow suite, not an implementation loop. It ends when the project has enough domain/product/architecture/design/PRD/issue context for `feature-workflow` to implement a vertical slice.
- Before running it, inventory selected setup primitives from Matt Pocock skills, GStack plugin, design-direction, and repo-local custom helpers as `selected`, `skipped`, or `fallback`; do not run whole upstream packages by default.
- Label borrowed primitives with their source package, for example Matt Pocock skills `grill-me`, GStack plugin `office-hours`, repo-local custom `project-structure`, and user custom `design.md`.
- If an upstream dependency changes, re-read that dependency's `SKILL.md` or official plugin source and update only the provenance ledger, project setup handoff, artifact path, validator/eval fixture, and visible guide. Do not duplicate the full source skill inside `project-workflow`.
- Read the project instruction file first, then domain docs, ADRs, PRD, issue tracker docs, testing docs, and `design.md` when relevant.
- Unless the user or target project explicitly chooses another language, write initial setup artifacts and project docs in Korean first. Preserve exact code identifiers, commands, file paths, product names, API names, and upstream skill/plugin names.
- When the workflow must run across Codex, Claude, Cursor, Windsurf, Copilot, or another agent, identify that agent's actual instruction/rule/workflow surface before relying on hooks, memories, skills, workflows, or subagents.
- Fix domain language before technology choices, and record app boundary and stack choices in ADRs before PRD and issue decomposition.
- When a setup uses TypeScript, record ESM only as an architecture constraint: `package.json` `type: "module"`, ESM `tsconfig`, `import`/`export`, and no CommonJS, `require`, `module.exports`, `.cjs`, or `.cts`. Existing CommonJS is a migration boundary, not a pattern to copy.
- Call `project-structure` only after domain language exists and the project kind, runtime, app boundary, API, persistence, env/codegen, DB, or infra questions are concrete enough to evaluate.
- For substantial UI, create or refresh baseline `design.md` early enough to shape PRD/issues, then require 2-3 mock directions with user selection before implementation.
- Before connecting new tools, MCP servers, external APIs, write-capable automation, network fetches, or untrusted content processing, record an Agent Tool And Security Risk Gate covering authority, untrusted content, secrets, side effects, approval, least privilege, and a decision of `approved`, `dev-only`, `needs-info`, or `blocked`.
- Keep project setup artifacts in the project’s chosen workflow area. If none exists, use `.scratch/<project-or-feature-slug>/`.
- Write or refresh `.scratch/<project-or-feature-slug>/workflow-state.md` as a handoff cache with selected primitives, authority docs, skipped/open questions, tool/security gate decisions, and the next `feature-workflow` target.
- When multiple agents, sessions, or worktrees may implement in parallel, write or refresh `.scratch/<project-or-feature-slug>/work-claims.md` before handoff. Include lane id, owner/session, branch or worktree, spec/issue target, claimed write set, read-only paths, shared/hotspot files, integration owner, status, validation command, and evidence path.
- Treat `work-claims.md` as a coordination artifact, not as product or architecture authority. Reads are allowed across lanes, but writes require a claim, and shared/hotspot files should have one integration owner.
- Handoff to `feature-workflow` only when the spec or issue has acceptance criteria, architecture/design references when relevant, validation command or evidence plan, and any required tool/security gate.
- In this repo, `/goal` means Claude Code's `/goal` feature. For long `project-workflow` runs on Claude Code, propose a `/goal` condition. Otherwise write the same measurable end state, check evidence, constraints, and turn/time bound as a completion checklist.
- Use `agent-eval-harness` as a separate validation handoff when setup routing must stay reliable. Seed cases for project setup routing, provenance inventory, project-structure timing, PRD settings, UI mockup selection, MCP/API gate decisions, cross-agent setup verification, and `feature-workflow` handoff quality.
- Use web research only for current external docs, official APIs, tool versions, or third-party behavior that local docs cannot answer.
