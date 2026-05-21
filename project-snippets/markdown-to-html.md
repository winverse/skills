## Project Skills

- Use $markdown-to-html at <skills-root>/skills/markdown-to-html/SKILL.md whenever a Markdown document should become safe, Korean-first HTML, including the repo default of creating or updating a skill's adjacent `skill.html`.

## Project-Specific Overrides

- Run this immediately after `skill-creator` initializes or updates a skill.
- Treat `SKILL.md` as the source document and `skill.html` as a human reading view when using skill HTML mode.
- Use skill HTML mode by default: update only the adjacent `skill.html` for the target skill folder. Use general Markdown document mode when the user explicitly gives a Markdown input and output location.
- The skill name is general: general Markdown document mode must preserve complex source structure instead of forcing every document into a short summary.
- Parse Markdown semantics first: headings, lists, tables, code fences, blockquotes, and links.
- Convert Markdown through `MarkdownHtmlModel` before writing HTML; do not copy source paragraphs or raw Markdown line breaks directly into layout.
- In skill HTML mode, keep the first screen focused on the target skill's name, real purpose, when to use it, operational inputs, operational outputs, and 3-5 important criteria.
- The summary must describe the target skill, not the `markdown-to-html` conversion process.
- Do not use generic converter rows such as `SKILL.md` input, adjacent `skill.html` output, folder scope, preserve, or block as the target skill summary. Put source files and validation commands only in the files and validation section.
- In general Markdown document mode, preserve heading hierarchy, long paragraphs, nested lists, wide tables, code fences, blockquotes, footnotes, task lists, and frontmatter metadata when the parser supports them.
- Markdown 원문에 있는 raw HTML이나 위험한 링크는 실행 가능한 HTML로 통과시키지 않는다. Render only through a repo-authored trusted template.
- If raw HTML must be supported, parse it separately and apply an allowlist sanitizer after the last unsafe transform.
- 일반 설명어는 한국어로 쓴다.
- Keep English only for exact identifiers such as file paths, commands, protocol names, product names, library names, and common acronyms such as `TDD`, `QA`, `API`, `MCP`, and `PRD`.
- If an English source term must remain, use `한국어(원문)` only on first mention and use Korean afterward.
- Do not expose English explanatory fragments such as `domain term`, `boundary`, `problem`, `user`, `first usable slice`, `included/excluded scope`, `acceptance criteria`, `selected mock direction`, `vertical slice`, `enabling task`, or `handoff` as visible prose. Translate them to Korean first and keep the source term only in parentheses when it is useful.
- 인터랙티브 요소를 넣지 않는다.
- Do not add animation, view switching, click-driven state, staged reveal, or decorative SVG.
- Do not use `<button>`, inline JavaScript, Web Animations API, 외부 CDN, external scripts, or external images.
- Do not pass Markdown `raw HTML`, event handlers, `javascript:` links, `vbscript:` links, `<iframe>`, `<object>`, `<embed>`, external scripts, or external assets through.
- Keep only allowed URL protocols such as `http:`, `https:`, `mailto:`, and repo-local relative paths.
- Use self-contained CSS only for static layout, spacing, readable width, and overflow control.
- 섹션끼리는 충분한 margin으로 구분한다. 섹션 내부에는 불필요한 중첩 card를 만들지 않는다.
- 표현할 정보가 요약이나 단순 중요 기준이면 card grid보다 선형 리스트를 우선한다.
- Do not put UI design rationale, layout explanation, or self-commentary in visible `skill.html` body text.
- Visible sentences should contain only meaning, criteria, boundaries, commands, and preserved document content extracted from the source document.
- 허용/금지는 텍스트 heading과 table 구조로 구분한다. 색은 보조 스타일로만 쓴다. 검증 명령은 명령 리스트를 우선한다.
- Use tables when comparison axes or decision criteria are real.
- Use charts only for real numeric values; for standalone `skill.html`, prefer table, CSS bar, `<meter>`, or inline SVG over a chart library.
- Chart.js or Observable Plot is allowed only when the target project already has a local build pipeline and bundled dependency. Use D3 only for complex custom visualization.
- Make diagrams only when the source Markdown has a real flow, relationship, or hierarchy to show.
- Keep wide scope tables, matrices, and checklist tables in full-width sections rather than narrow two-column layouts.
- In general Markdown document mode, keep long tables or detailed sections readable with stable full-width layout rather than deleting rows or collapsing them into summaries.
- Do not place 4+ criteria cards or prose cards as a multi-column grid inside a narrow side panel, status panel, or secondary column.
- Use readable card grids such as `repeat(auto-fit, minmax(280px, 1fr))`; compact contract snapshots must still keep at least `minmax(220px, 1fr)`.
- Design and verify only for PC desktop viewport; mobile/tablet layout and responsive breakpoint tuning are out of scope for this skill.
- Verify the HTML visually in a PC desktop viewport when practical, especially overflow, text overlap, local links, and whether the summary can be understood within 10 seconds.
