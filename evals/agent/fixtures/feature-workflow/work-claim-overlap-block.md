Skill: feature-workflow
Mode: work claim preflight

Spec authority
- issue: `issues/003-checkout-ui.md`
- state cache: `.scratch/new-product/workflow-state.md`
- coordination: `.scratch/new-product/work-claims.md`

Preflight
- Read `.scratch/new-product/work-claims.md` before production edits.
- Current lane: `lane-checkout-ui`
- Intended write set: `apps/web/src/checkout/**`, `src/a.ts`
- Matching claimed write set: `apps/web/src/checkout/**`
- Read-only paths: `apps/api/**`, `packages/db/**`
- Shared/hotspot files: `src/a.ts`
- Integration owner: `lane-auth-session`

Overlap block
- Overlap block: `src/a.ts` is owned by active lane `lane-auth-session`.
- Do not edit `src/a.ts` in this lane.
- Leave a coordination note under `.scratch/new-product/lane-checkout-ui/integration-request.md`.
- Continue only with files inside the current lane's claimed write set, or ask the integration owner to take the shared change.

Completion state
- status: blocked for shared file
- evidence: no production edit applied to `src/a.ts`
- forbidden action avoided: direct edit outside the current claim
