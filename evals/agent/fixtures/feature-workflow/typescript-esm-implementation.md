# Saved Feature Workflow Output: TypeScript ESM Implementation

Skill: feature-workflow
Mode: Implementation loop

TypeScript Module Preflight
- Module system: ESM only
- Package boundary: `package.json` `type: "module"`
- Allowed imports: `import` / `export`
- Blocked patterns: CommonJS, require, module.exports, .cjs, .cts
- Result: clear

Implementation rule
- Do not add require, module.exports, .cjs, or .cts during RED/GREEN/REFACTOR.
- If the spec requires CommonJS, stop with a blocker or migration boundary before editing production code.

Validation
- RED/GREEN/REFACTOR evidence must preserve the ESM module boundary.
