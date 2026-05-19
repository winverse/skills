Skill: project-workflow
Mode: parallel multi-session setup

Parallel work contract
- Path: `.scratch/new-product/work-claims.md`
- Coordination file only; `CONTEXT.md`, ADR, PRD, issue, and `design.md` remain the authority.
- Read policy: read across lanes is allowed.
- Write policy: every production write needs a claimed write set.

Work Claims
- lane id: lane-checkout-ui
  owner/session: Codex session 1
  branch or worktree: worktree/checkouts-ui
  spec/issue: issues/003-checkout-ui.md
  claimed write set: `apps/web/src/checkout/**`, `apps/web/src/components/cart/**`
  read-only paths: `apps/api/**`, `packages/db/**`
  shared/hotspot files: `apps/web/src/routes.ts`, `packages/api-contract/src/index.ts`
  integration owner: lane-integration
  status: planned
  validation command: `bun test apps/web`
  evidence path: `.scratch/new-product/lane-checkout-ui/evidence.md`

- lane id: lane-auth-session
  owner/session: Claude session 1
  branch or worktree: worktree/auth-session
  spec/issue: issues/004-auth-session.md
  claimed write set: `apps/api/src/auth/**`, `packages/session/**`
  read-only paths: `apps/web/src/checkout/**`
  shared/hotspot files: `packages/api-contract/src/index.ts`
  integration owner: lane-integration
  status: planned
  validation command: `bun test apps/api`
  evidence path: `.scratch/new-product/lane-auth-session/evidence.md`

Handoff
- `feature-workflow` must read this file before implementation.
- If a lane needs a shared/hotspot file, it leaves an integration request instead of editing the file directly.
- This does not let every session edit shared files freely.
