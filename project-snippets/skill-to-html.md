## Project Skills

- Use $skill-to-html at <skills-root>/skills/skill-to-html/SKILL.md whenever a skill is created, installed, forked, or updated, so the skill folder gets a 짧은 정적 요약 `skill.html` beside `SKILL.md`.

## Project-Specific Overrides

- Run this immediately after `skill-creator` initializes or updates a skill.
- Treat `SKILL.md` as the 기준 원문 and `skill.html` as a human summary view.
- Convert Markdown through a small `SkillHtmlModel` before writing HTML; do not copy source paragraphs or raw Markdown structure directly into layout.
- Treat Markdown as 신뢰하지 않는 입력 and render only through a repo-authored 신뢰된 템플릿.
- Keep the first screen focused on the skill name, one-line purpose, use condition, and 3-5 core contracts.
- 일반 설명어는 한국어로 번역한다.
- Keep English only for exact identifiers such as file paths, commands, protocol names, product names, library names, and common acronyms such as `TDD`, `QA`, `API`, `MCP`, and `PRD`.
- If an English source term must remain, use `한국어(원문)` only on first mention and use Korean afterward.
- 인터랙티브 요소를 넣지 않는다.
- Do not add animation, view switching, click-driven state, staged reveal, or decorative SVG.
- Do not use `<button>`, inline JavaScript, Web Animations API, 외부 CDN, external scripts, or external images.
- Do not pass Markdown `raw HTML`, event handlers, `javascript:` links, `vbscript:` links, `<iframe>`, `<object>`, `<embed>`, external scripts, or external assets through.
- Use self-contained CSS only for static layout, spacing, readable width, and overflow control.
- 짧은 안내 화면은 여러 section card를 세로로 쌓지 말고 하나의 문서 시트 안에서 section divider로 구분한다.
- 표현할 정보가 요약이나 단순 핵심 계약이면 card grid보다 선형 리스트를 우선한다.
- 허용/금지는 table, 검증 명령은 명령 리스트를 우선한다.
- Keep wide scope tables, matrices, and checklist tables in full-width sections rather than narrow two-column layouts.
- Do not place 4+ core contract cards or prose cards as a multi-column grid inside a narrow side panel, status panel, or secondary column.
- Use readable card grids such as `repeat(auto-fit, minmax(280px, 1fr))`; compact contract snapshots must still keep at least `minmax(220px, 1fr)`.
- Design and verify only for PC desktop viewport; mobile/tablet layout and responsive breakpoint tuning are out of scope for this skill.
- Verify the HTML visually in a PC desktop viewport when practical, especially overflow, text overlap, local links, and whether the summary can be understood within 10 seconds.
