## Project Skills

- Use $skill-update at <skills-root>/skills/skill-update/SKILL.md when asked to update, revise, improve, maintain, rename, split, deprecate, or otherwise change an existing shared skill.

## Project-Specific Overrides

- Keep `SKILL.md`, references, validator, `agents/openai.yaml`, `skill.html`, snippets, docs, and history aligned when behavior changes.
- Treat every `skill-update` invocation as an original/upstream provenance preflight, even when the user did not explicitly ask for source research.
- Read `docs/update-source-registry.md` first; use `.gitmodules` as the canonical source for vendored plugin/submodule update candidates, and use workflow `references/upstream-dependency-map.md` files for provenance-only primitives.
- Use `scripts/validate-plugins.ts` to verify `.gitmodules`, `docs/plugin-catalog.md`, and `Plugin update list` path/URL drift.
- If the skill has an original skill, upstream primitive, submodule source, or fork record, verify the original with `web-research` before editing the local package; use parallel source/candidate lanes when runtime permits.
- Compare upstream release notes, changelog, source files, package metadata, and local provenance before applying changes.
- Record source URL, checked date, upstream version or commit, and adopt/adapt/reject/defer decisions.
- When the original source can be edited and the user has the right scope, prepare or apply the original change first, then apply its delta to this shared skills repo.
- If the original cannot be edited directly, leave the source ledger, checked date, and local delta reason in references or history.
- Do not update plugin packages, MCP config, or submodules incidentally through `skill-update`; when the user explicitly includes plugin updates, use the plugin update lane and keep `.gitmodules`, `docs/plugin-catalog.md`, `Plugin update list`, validators, and history aligned.
- Treat requests for "all external dependency updates", "plugin and workflow primitive updates", or similar repo-wide source refresh as a dependency update sweep; automatically check all `.gitmodules` vendored plugins, repo-owned plugins, and workflow `upstream-dependency-map.md` files.
- Use `skill-to-html` after material skill changes.
- When `skill.html` changes, verify static HTML validation plus PC viewport rendering for wide tables, SVG arrow endpoints, overflow, and text overlap.
- Run `node skills/show-skills/scripts/update-html-catalog.ts skills/show-skills` after skill add, remove, rename, archive, or restore operations.
- Use `sync-docs` when paths, snippets, README, AGENTS, docs, history, or validation commands may drift.
- Ask before changing unclear trigger behavior, lifecycle state, rename, split, merge, deprecation, or removal.
