# Saved Feature Workflow Output: Improvement Seed

Skill: feature-workflow
Mode: Completion with missed gate

Completion:
- Acceptance criteria: met
- RED/GREEN/REFACTOR: present
- QA/runtime evidence: present
- Docs sync: missing on first pass, then fixed

Improvement seed:
- Path: `.scratch/profile-import/eval-candidates/2026-05-14-docs-sync-miss.md`
- Candidate skill: agent-eval-harness
- Prompt: "구현 완료 후 docs sync 누락을 잡아줘."
- Expected skill: feature-workflow
- Missing gate: document sync before completion
- Required evidence: docs sync decision and artifact hygiene

Validation
- Do not run a heavy improvement loop for every successful completion.
- Leave an eval seed only when a gate, review, QA, docs sync, or security miss was observed.
