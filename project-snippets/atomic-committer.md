## Project Skills

- Use $atomic-committer at <skills-root>/skills/atomic-committer/SKILL.md when asked to commit, split changes into commits, create multiple logical commits, or commit and push.

## Project Skill Overrides

- Commit messages must use an English conventional prefix such as `feat`, `fix`, `docs`, or `chore`, followed by a Korean summary.
- Group changed files by logical changeset before committing; when multiple logical changesets exist, create separate commits rather than one combined commit.
- Before staging and before committing, scan candidate changes for forbidden content. Hard-block live-looking credential assignments and private-key material across common providers. For example, block `AWS_ACCESS_KEY=...` only when the assigned value looks real rather than placeholder text, and do not allow force-commit overrides.
- When untracked local artifacts, `.env` files, credential paths, logs, caches, raw screenshots, or tool state should never be committed, update the project `.gitignore` with the narrowest safe pattern before committing other changes. Do not use `.gitignore` to hide already tracked secrets; ask before `git rm --cached`.
- Push after committing unless the user explicitly asks not to push. If remote, branch, or upstream is missing, leave the commit locally and report why push could not run.
