# Saved Project Workflow Output: TypeScript ESM Setup

Skill: project-workflow
Mode: Initial setup

TypeScript Module Policy
- Module system: ESM only
- Package boundary: `package.json` `type: "module"`
- Allowed imports: `import` / `export`
- Blocked patterns: CommonJS, require, module.exports, .cjs, .cts are blocked
- Migration boundary: existing CommonJS paths must be listed before handoff

Handoff
- Record this policy in ADR or `workflow-state.md`.
- Pass the same constraint to `project-structure` before folder/env/codegen decisions.

Validation
- Do not write a PRD or issue that asks new code to use CommonJS by default.
