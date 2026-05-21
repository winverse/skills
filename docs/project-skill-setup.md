# Project Skill Setup

Use this workflow when configuring a project to use skills from this repo. In copied snippets, replace `<skills-root>` with the actual path where this repo is cloned.

## Goal

Each project should explicitly choose the skills it uses. The skills repo stays as the shared catalog and source of truth for Codex, Claude, and other agents.

This document is only for connecting existing shared skills to a target project. For creating or materially changing a shared skill, use README's `생성과 검증` section and `docs/skill-inspector.md`.

Plugin setup is separate from skill setup. If a target project needs a plugin or MCP tool package such as `context-mode` or `code-review-graph`, keep it under `plugins/` with its native manifest, package metadata, and MCP config; do not copy plugin-bundled `skills/` into the shared top-level `skills/` tree.

## Setup Steps

1. Open the target project's agent instruction file, usually `AGENTS.md` for Codex or `CLAUDE.md` for Claude.
2. Open each candidate skill's `skill.html` to understand the skill visually before linking it.
3. If candidates look similar, resolve the primary and companion roles using `docs/skill-catalog.md` before linking multiple skills.
4. Add a `Project Skills` section if it does not exist.
5. Add links to the selected skill `SKILL.md` files from this repo.
6. Add project-specific overrides directly below the selected skill list.
7. Keep the linked skill as the shared default. Fork only when one project needs a permanently different version.
8. Check `history/skills.md` if the skill is unfamiliar, deprecated, or recently changed.

## Project Setup Verification

Before calling a project setup complete, verify it from the target project:

- The selected instruction file exists, usually `AGENTS.md`, `CLAUDE.md`, or both.
- Every selected skill link points to an existing `SKILL.md` under the actual `<skills-root>`, not a placeholder path.
- No setup step installs, symlinks, or auto-registers these repo skills globally unless the user explicitly asked for that.
- Each selected skill has a neighboring `skill.html`, and the setup notes say the human-readable HTML was reviewed.
- Any selected project snippet was copied or linked intentionally, and its skill list matches the target instruction file.
- Project-specific overrides live in the target project instruction file, not in the shared skill, unless the preference should apply everywhere.
- The linked skill names, trigger names, and paths match `docs/skill-catalog.md`, `project-snippets/base.md`, and `project-snippets/claude-base.md` when those snippets are used.
- If the setup needs to stay reliable over time, add or update an `agent-eval-harness` case that checks the target instruction file references the expected skills and avoids global install instructions.
- If selected plugin references are needed, verify `docs/plugin-catalog.md`, the plugin's native manifest or package metadata, and the plugin's MCP entrypoint instead of treating the plugin as a normal shared skill.

Suggested verification report shape:

```json
{
  "targetInstructionFile": "AGENTS.md",
  "skills": ["project-workflow", "feature-workflow", "project-structure", "browser-qa"],
  "linksValid": true,
  "globalInstallAllowed": false,
  "validation": ["node scripts/run-agent-evals.ts --scope cross_agent_portability"]
}
```

## Snippet Sources

Use the smallest snippet that matches the target project and agent:

- `project-snippets/base.md`: agent-neutral starter block for the current shared skills.
- `project-snippets/claude-base.md`: Claude-oriented starter block.
- `project-snippets/show-skills.md`: only current skill catalog browsing and skill recommendation.
- `project-snippets/web-research.md`: only the web research skill.
- `project-snippets/markdown-to-html.md`: only the skill HTML guide workflow.
- `project-snippets/karpathy-thinkings.md`: only Karpathy-style coding agent discipline.
- `project-snippets/skill-update.md`: only existing skill maintenance, original/upstream source checks, and package sync rules.
- `project-snippets/agent-improvement-loop.md`: only repo quality improvement loops and spend-down consent routing.
- `project-snippets/skill-plugin-test-loop.md`: only repo 밖 external scratch root의 GitHub 새 복제본 또는 격리 복사본 반복 testing for skills, plugins, plugin-bundled skills, actual invocation history, 실패 분류, source fixes, research-informed improvement, commit/push 전 preflight boundary, and reruns.
- `project-snippets/browser-qa.md`: only browser runtime evidence and Playwright QA.
- `project-snippets/code-review.md`: only findings-first code review.
- `project-snippets/design-review.md`: only product-aware UI and design review.
- `project-snippets/atomic-committer.md`: only commit grouping and push rules.
- `project-snippets/pull-request.md`: only GitHub PR preparation and creation rules.
- `project-snippets/project-structure.md`: only project structure, default stack rules, selected DB provider options, and requested infra/deployment boundaries.
- `project-snippets/project-workflow.md`: only the Workflow suite setup half, project bootstrap sequencing, domain/product/ADR/design/PRD/issue backlog setup, `workflow-state.md` cache, and `feature-workflow` handoff.
- `project-snippets/feature-workflow.md`: only the Workflow suite feature/issue implementation half, PRD/issue/spec/bug based implementation loops, `workflow-state.md` update, TDD, target-code-repo TDD hook contract, review, QA/runtime evidence, document sync, improvement seed, and completion reporting.
- `project-snippets/sync-docs.md`: only documentation refresh and conflict reconciliation rules.
- `project-snippets/transcript-polisher.md`: only transcript, lecture script, subtitle, meeting note, and long-prose polishing by direct reading without scripted replacement.
- `project-snippets/agent-eval-harness.md`: only initial agent eval harness setup, skill routing cases, cross-agent portability checks, guardrail checks, artifact hygiene, local runner wiring, and regression capture.

## Forking Rule

Fork a skill only when the project needs behavior that should not affect other projects.

Recommended fork path:

```text
<project-root>/skills/<skill-name>/SKILL.md
```

If a project forks a skill, link the project-local skill in the target agent instruction file and mention which repo skill it was forked from.

The fork should keep the same pair:

```text
<project-root>/skills/<skill-name>/SKILL.md
<project-root>/skills/<skill-name>/skill.html
```

## Update Rule

When a shared skill changes:

- If the skill has an original or upstream source, verify that source with `web-research` before changing the local shared package.
- Update `README.md` if the skill's purpose changed.
- Update `AGENTS.md`, `docs/skill-catalog.md`, `project-snippets/base.md`, and `project-snippets/claude-base.md` when the trigger, path, or project-facing behavior changed.
- Use `markdown-to-html` to update the skill's own `skill.html`.
- Update the matching file in `project-snippets/`.
- Update `history/skills.md` if trigger, workflow, validator, eval prompt, snippet, inspector criteria, or lifecycle state changed.
- Keep repo-owned validators in `.ts` and run them with Node 22+.
- Run `node scripts/validate-skill-html.ts .` and `node scripts/validate-skill-repo.ts .` after shared skill or repo-level docs changes.
- Run `node scripts/run-agent-evals.ts` after changing skill triggers, project-facing behavior, safety boundaries, or expected final answer shapes.
- Revisit project instruction files only when the trigger or path changed.
