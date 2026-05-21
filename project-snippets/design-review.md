## Project Skills

- Use $design-review at <skills-root>/skills/design-review/SKILL.md when a task asks for design review, UI review, visual critique, layout critique, interaction critique, design-system fit, accessibility review, responsive design review, visual hierarchy review, product surface polish, or product-aware design judgment.

## Project-Specific Overrides

- Respect the target project's existing design system and product domain first.
- Use quiet operational UI, restrained color, shallow borders, stable dimensions, 8px-or-less radius, no decorative gradients/orbs/bokeh, and no nested cards only as the shared fallback profile.
- Keep objective browser failures in `browser-qa`; use `design-review` for hierarchy, density, typography, affordance, state, responsive order, and taste judgment.
- If a review depends on actual rendering, pair this with browser evidence from screenshots or `browser-qa`.
- For substantive reviews, read `references/design-review-criteria.md`, frame scope by user/task/device/design system, and report findings with `S0-S4` severity, confidence, evidence, criterion, user impact, recommendation, and residual risk.
- When `web-research` is requested with design review, compare official/source, practice, and report-shape lanes, then classify local deltas as `adopt`, `adapt`, `reject`, or `defer`.
