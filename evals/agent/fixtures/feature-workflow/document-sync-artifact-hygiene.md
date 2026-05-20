# Saved Workflow Output: Completion Gate

Skill: feature-workflow
Mode: Completion
Next step: Use document-sync before completion

Artifacts
- Store screenshots, traces, browser QA logs, and temporary evidence under .scratch/<feature-slug>/artifacts/
- Preserve historical plans/specs as historical records.

Validation
- Start commit handoff only when the user asks and after atomic-committer secret guard; after that handoff, atomic-committer pushes by default unless the user explicitly forbids push.
- Release prep is separate from tag creation, release publishing, deployment, and public ship.
