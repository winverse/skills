# Workflow Fixture: CLI / No-Browser Evidence

Skill: feature-workflow
Mode: Implementation

Next step:
- Use CLI/no-browser lane.
- Do not require browser-qa, screenshots, or mockup selection without a browser surface.

Vertical slice:
- local fixture/input -> command/API boundary -> report artifact/stdout/log -> non-browser runtime evidence

Artifacts
- `.scratch/local-report-cli/artifacts/cli-output/report.txt`
- `.scratch/local-report-cli/artifacts/logs/test-output.txt`

Validation
- Collect command output and tests as runtime evidence.
