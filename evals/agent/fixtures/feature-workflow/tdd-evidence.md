# Saved Feature Workflow Output: TDD Evidence

Skill: feature-workflow
Mode: Bug fix

Spec authority
- Bug report with reproducible behavior.
- Acceptance criteria includes regression prevention.

TDD evidence
- RED: `node test failing-regression.test.ts` reproduces the bug.
- GREEN: focused implementation makes the regression test pass.
- REFACTOR: `node test failing-regression.test.ts` and related suite still pass after cleanup.

QA
- Runtime evidence path: `.scratch/bugfix/artifacts/test-output.txt`

Completion
- Done after review findings are resolved or explicitly deferred.
