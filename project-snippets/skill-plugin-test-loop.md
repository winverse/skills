## Project Skills

- Use $skill-plugin-test-loop at <skills-root>/skills/skill-plugin-test-loop/SKILL.md when a task asks to test a skill, plugin, or plugin-bundled skill through 새 복제본 또는 격리 복사본 반복, actual invocation history, `cycle-NNN` counts, generated output folders, bounded runner evidence, 실패 분류, source fixes, research-informed improvement, and reruns.

## Project-Specific Overrides

- Record each run as `cycle-NNN` and do not rewrite failed history to look successful.
- Prefer GitHub 새 복제본 evidence under an external scratch root, for example `<desktop>/skill-plugin-test-runs/<target-slug>`, over trusting the current local workspace.
- Delete only `current/` each cycle; preserve `runs/` and `cycles.md`.
- If the tested changes are not committed and pushed, mark the run as preflight or local-only and do not call it a fresh clone pass.
- If the runtime cannot call the original skill, plugin, MCP command, or hook, mark that lane as `fallback` and record the missing callable surface.
- If the target depends on external best practice, famous workflow patterns, current agent/tool behavior, security/QA guidance, or upstream docs, run `web-research` as a parallel research-informed improvement lane and record `official/source`, `community/practice`, and `counterexample/risk` source lanes.
- Classify research findings as `adopt`, `adapt`, `reject`, or `defer`; if a delta is accepted, update the source package through `skill-update` and rerun a new cycle before calling the test passed.
- If `web-research` is skipped, still write a research ledger with the skipped reason and `defer` decision.
- Classify failures as `skill contract`, `plugin contract`, `runner`, `test method`, `target artifact`, `environment/hook`, or `source drift`.
- Use `agent-eval-harness` for deterministic regression cases, `skill-update` for package fixes, `browser-qa` for browser evidence, and `atomic-committer` when a remote 새 복제본 must consume a committed update.
