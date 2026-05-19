## Project Skill: Agent Eval Harness

- Use $agent-eval-harness at `<skills-root>/skills/agent-eval-harness/SKILL.md` when asked to set up, scaffold, configure, or improve an evaluation harness for agent skills, agent instructions, prompt routing, cross-agent portability, tool choice, guardrails, artifact hygiene, or repeatable AI-agent workflows.

## Agent Eval Harness Overrides

- Start with a small repo-local harness before adding external eval platforms.
- Put durable cases under `evals/agent/cases/` and fixtures under `evals/agent/fixtures/` unless the project already has an eval convention.
- Prefer deterministic checks first: expected skill, forbidden skill, required output sections, required citations or file references, `required_link_count`, `required_file_reference`, `json_schema`, approval gates, and validator command results.
- Define success criteria before writing cases, then cover typical, edge, and adversarial examples.
- Add cross-agent portability cases when instructions are shared across Codex, Claude, Copilot, Cursor, Windsurf, or other agents; record `agentSurfaces` and `assumptionDate` for those cases.
- Include a minimum safety pack for tool-enabled agents: approval gates, destructive command avoidance, prompt injection/tool misuse, secret/private-data redaction, least privilege, and high-risk blocking promotion.
- Scrub saved outputs, traces, screenshots, logs, CI reports, and exported artifacts before committing them; keep raw live artifacts ignored unless intentionally reviewed as golden fixtures.
- Keep live model/API calls advisory until budget, secrets, retry policy, and flake handling are explicit.
- Calibrate model-graded checks against human review, edge cases, and repeat/variance evidence before making them blocking.
- Convert real agent failures into the smallest reproducing regression case before broadening instructions.
- When called from `project-workflow` or `feature-workflow`, keep the harness as a separate validation layer and seed cases for workflow routing, dependency inventory, `project-structure` timing, PRD settings, UI mockup selection, `workflow-state.md` cache/update, CLI/no-browser evidence, MCP/API gate decisions, fallback implementation lane, project setup verification, feature/issue implementation loops, completion mapping, document sync, artifact hygiene, improvement seed, and goal condition quality. A pre-workflow bootstrap harness should stay limited to routing, safety, and artifact policy until workflow artifacts exist.
- In this repo, `/goal` means Claude Code's `/goal` feature. For `/goal` or similar completion loops, test the condition text for measurable end state, check evidence, constraints, and turn/time bound; record Claude Code surface assumptions and assumption date.
