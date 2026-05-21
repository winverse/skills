## Project Skills

- Use $skill-plugin-test-loop at <skills-root>/skills/skill-plugin-test-loop/SKILL.md when a task asks to test a skill, plugin, or plugin-bundled skill through fresh clone or isolated copy cycles, actual invocation history, cycle counts, generated output folders, bounded runner evidence, failure classification, source fixes, and reruns.

## Project-Specific Overrides

- Record each run as `cycle-NNN` and do not rewrite failed history to look successful.
- Prefer fresh clone or isolated copy evidence over trusting the current local workspace.
- If the runtime cannot call the original skill, plugin, MCP command, or hook, mark that lane as `fallback` and record the missing callable surface.
- Classify failures as `skill contract`, `plugin contract`, `runner`, `test method`, `target artifact`, `environment/hook`, or `source drift`.
- Use `agent-eval-harness` for deterministic regression cases, `skill-update` for package fixes, `browser-qa` for browser evidence, and `atomic-committer` when a remote fresh clone must consume a committed update.
