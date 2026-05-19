# Agent Eval Harness

This folder contains the repo-local starter harness for checking agent behavior contracts.

This repo already has strong static validators for skill files, HTML guides, snippets, and history. These eval cases cover the gap those validators do not cover directly: whether representative user prompts map to the intended skills, trigger wording, cross-agent instruction surfaces, safety boundaries, artifact hygiene, and final-answer shapes.

## Current Mode

- Runner: `node scripts/run-agent-evals.ts`
- Execution: deterministic contract checks only
- Live model calls: not enabled
- CI status: local-only until the runner stabilizes

## Structure

```text
evals/agent/
├── README.md
├── cases/
│   ├── skill-routing.json
│   ├── safety-boundaries.json
│   ├── portability-and-triggers.json
│   ├── output-shape.json
│   ├── project-setup-verification.json
│   ├── project-workflow-orchestration.json
│   └── feature-workflow-orchestration.json
├── artifacts/
│   └── README.md
├── fixtures/
│   └── README.md
└── outputs/
    └── README.md
```

## Adding A Case

1. Add the smallest prompt that exercises one behavior.
2. Name the expected skill or safety boundary.
3. Include `assumptionDate` and `agentSurfaces` when the case depends on fast-changing agent behavior.
4. Mark the example as `typical`, `edge`, or `adversarial`.
5. Prefer checks that read current repo files or scrubbed fixtures: `AGENTS.md`, `project-snippets/`, `skills/*/SKILL.md`, references, compatibility docs, saved output files, and JSON reports.
6. For `workflow`, `project-workflow`, or `feature-workflow` scope, include at least one scrubbed saved output fixture under `evals/agent/fixtures/project-workflow/` or `evals/agent/fixtures/feature-workflow/`; static source phrases alone are not enough.
7. Keep high-confidence deterministic checks `blocking`.
8. Mark judgment-heavy, live-routing, or future live-output checks `advisory` until calibrated.

The runner validates repo-local skill names against `skills/*/SKILL.md` and allows known external system skills such as `skill-creator` and `skill-installer` when a case needs to assert that global installation should not be used.

Useful deterministic check types include `required_text`, `forbidden_text`, `required_link_count`, `required_file_reference`, `json_schema`, `skill_listed_in`, `command_passed`, `forbidden_command`, and `trace_event`.

Real agent failures should become regression cases before broad instruction rewrites.

## Artifact Policy

Do not store raw live traces, unsanitized saved outputs, screenshots with private data, production logs, environment dumps, real credentials, or customer data in this repo. Use synthetic data and scrubbed golden artifacts only. Keep compact CI reports separate from full exports.

## Safety Pack

Tool-enabled harnesses should include cases for approval gates, destructive command avoidance, prompt injection or tool misuse, secret/private-data redaction, least privilege, and high-risk blocking promotion once stable.
