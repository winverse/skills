# Workflow Fixture: Completion / Ship Mapping

Skill: feature-workflow
Mode: Completion

Repo-local mapping:
- review -> code-review
- qa -> browser-qa when a browser surface exists; otherwise CLI/API/runtime evidence
- document-sync -> sync-docs
- semantic-commits -> atomic-committer
- ship -> release notes/checklist by default

Next step:
- Verify tests, QA/runtime evidence, document sync, artifact hygiene, and secret scan before commit/push.

Validation
- Release prep is not release publishing.
- Tag creation, GitHub release, deploy, or public release require explicit request.
