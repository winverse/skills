## Project Skills

- Use $skill-to-html at <skills-root>/skills/skill-to-html/SKILL.md whenever a skill is created, installed, forked, or updated, so the skill folder gets a 그림 우선, 인터랙티브, 애니메이션 중심 `skill.html` beside `SKILL.md`.

## Project-Specific Overrides

- Run this immediately after `skill-creator` initializes or updates a skill.
- Do not accept a `skill.html` that only partitions text into cards or long tables.
- The first viewport should start with an interactive visual scene, animated diagram, mode switch, or click-driven 판단 보드 before long explanatory text.
- Prefer 판단 매트릭스, 흐름도, 순위 차트, 파일 관계도, 입출력 구조, mode switch, stepper, toggle, and progressive disclosure.
- Keep skill explanations consistent across skills: 목적, 사용/건너뜀, 실행 흐름, 입력/출력, 파일 관계, 검증, 오용 방지.
- Use 한국어 문장 우선 화면 문구 in `skill.html`; keep English only for coding terms, exact file names, commands, products, protocols, libraries, or copyable instruction snippets.
- Do not list English explanation terms with commas. Translate terms such as workflow suite, setup, initiative, domain language, architecture boundary, issue backlog, handoff, orchestration, and source-labeled primitive into Korean unless they are exact identifiers.
- Follow the shared quiet operational visual rules: shallow borders, restrained color, stable dimensions, no decorative hero treatment, and dark surfaces only for code or terminal snippets.
- Use self-contained CSS/SVG animation or short inline JavaScript for interaction. Do not use external CDN, external scripts, or external images.
- Framer Motion, Motion One, GSAP, or similar animation libraries are allowed only when the target project already has a local build pipeline and the dependency is bundled locally; standalone skill guides should use CSS animation, SVG animation, or Web Animations API.
- Design and verify only for PC desktop viewport; mobile/tablet layout and responsive breakpoint tuning are out of scope for this skill. Desktop click, hover, focus, and animated state changes are in scope.
- Keep wide scope tables, matrices, and checklist tables in full-width sections rather than narrow two-column layouts.
- Make SVG arrows terminate at visible nodes, boxes, or lanes; do not leave dangling arrowheads in empty space.
- Verify the HTML visually in a PC desktop viewport when practical, especially interaction state changes, animation state, arrow endpoints, table width, overflow, and text overlap.
