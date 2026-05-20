Skill: project-workflow
Mode: large implementation handoff

Source decision
- `harness_framework` `execute.py`: adapt, not adopt.
- Do not use Python execute.py directly.
- Keep the useful parts: phase/step status, self-contained step files, executable acceptance commands, and blocked state.

Phase handoff
- Path: `.scratch/new-product/phases/index.json`
- Step files: `.scratch/new-product/phases/step0.md`, `.scratch/new-product/phases/step1.md`
- Status values: `pending`, `completed`, `error`, `blocked`
- Each step includes read files, claimed write set, acceptance commands, blocked conditions, summary field, and forbidden changes.

Optional runner
- Runner: `plugins/project-workflow/scripts/execute-phase.ts`
- Language: TypeScript
- Default mode: dry-run prompt generation
- Agent command boundary: stdin
- Supported target agents: Codex, Claude, or custom command
- Publish boundary: no automatic branch, commit, push, or permission bypass
