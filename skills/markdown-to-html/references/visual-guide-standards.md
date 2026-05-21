# Markdown HTML 변환 기준

## local design system 기준

이 repo의 `skill.html`은 한국어 우선 문구, 조용한 운영 도구형 UI, 얕은 border, 안정적인 읽기 폭을 기본으로 한다. `markdown-to-html` 산출물은 Markdown 문서의 의미를 읽어 만든 안전한 HTML이어야 한다. 스킬 HTML mode는 짧은 HTML로 압축하지만, 일반 Markdown 문서 mode는 긴 문서와 복잡한 구조를 보존한다.

## language policy 기준

화면에 보이는 일반 설명어는 한국어로 쓴다. `SKILL.md`, `skill.html`, `GraphQL`, `TypeScript`, `Playwright`, 명령, 파일 경로처럼 정확한 식별자는 원문을 유지한다.

영어 밀도는 낮게 유지한다. `TDD`, `QA`, `API`, `MCP`, `PRD`처럼 국내 개발 문맥에서 바로 통하는 약어는 남겨도 되지만, 설명어를 영어 단어 목록으로 나열하지 않는다. 원문 보존이 필요한 경우 첫 등장에만 `한국어(원문)` 형태로 병기하고 이후에는 한국어 표현을 쓴다.

| 피할 표현 | 권장 표현 |
| --- | --- |
| fresh clone | 새 복제본 |
| isolated copy | 격리 복사본 |
| failure class | 실패 분류 |
| cycle result | 반복 결과 |
| workflow suite | 워크플로우 묶음 |
| source of truth | 기준 원문 |
| handoff | 인계 |

## summary structure 기준

- 요약
- 사용 판단
- 중요한 기준
- 작업 흐름
- 보안 경계
- 파일과 검증

위 section은 스킬 HTML mode의 기본 구조다. 사람이 10초 안에 스킬의 목적과 경계를 파악할 수 있어야 하므로 세부 설명, 긴 예시, 반복되는 주의 문구는 `SKILL.md` 링크로 넘긴다. 일반 Markdown 문서 mode에는 이 고정 section 구조를 강제하지 않고 원문 heading 구조를 따른다.

## Markdown 변환 기준

- `SKILL.md`는 기준 원문이고 `skill.html`은 사람이 빠르게 확인하는 HTML이다.
- 변환은 Markdown parse -> 의미 구조 파악 -> `MarkdownHtmlModel` 추출 -> script 없는 HTML 작성 -> browser QA 순서로 본다.
- Markdown 의미 구조는 heading, list, table, code fence, blockquote, link가 수행하는 역할이다. 원문 순서와 줄바꿈을 그대로 layout으로 복사하지 않는다.
- Markdown 원문은 내용만 읽고, `raw HTML`, event handler, `javascript:` link, `vbscript:` link, 외부 script, `<iframe>`, `<object>`, `<embed>`는 실행 가능한 HTML로 통과시키지 않는다.
- raw HTML 지원이 꼭 필요하면 raw HTML을 별도로 파싱한 뒤 allowlist sanitizer를 마지막 unsafe transform 이후에 적용한다.
- URL은 `http:`, `https:`, `mailto:`, repo-local 상대 경로처럼 허용한 protocol만 남긴다.
- 스킬 HTML mode의 최종 `skill.html`은 원문 Markdown 단편을 이어 붙인 결과가 아니라, repo가 작성한 신뢰된 템플릿에 `MarkdownHtmlModel`을 넣어 만든 단일 파일이다.
- 일반 Markdown 문서 mode는 원문 heading tree, 긴 문단, 중첩 list, 긴 table, code fence, blockquote, footnote, task list를 가능한 한 보존한다. 복잡하다는 이유만으로 본문을 버리지 않는다.
- diagram은 원문에 실제 흐름, 관계, 계층이 있을 때만 만든다. 원문 의미가 없는 장식용 도표는 만들지 않는다.

## mode 기준

- 스킬 HTML mode는 `SKILL.md`에서 같은 폴더의 `skill.html`을 만든다.
- 일반 Markdown 문서 mode는 사용자가 대상 Markdown과 출력 위치를 명시했을 때만 쓴다.
- 두 mode 모두 `MarkdownHtmlModel`을 거치고, 원문 Markdown 단편을 바로 HTML body에 붙이지 않는다.
- 두 mode의 차이는 요약 수준이다. 스킬 HTML mode는 빠른 판단용으로 압축하고, 일반 Markdown 문서 mode는 article 구조로 원문 세부 내용을 보존한다.

## readability 기준

- 섹션끼리는 충분한 margin으로 구분한다. 섹션 내부에는 불필요한 중첩 card를 만들지 않는다.
- 요약과 단순한 중요 기준은 카드가 아니라 리스트로 둔다. 비교, 상태, 파일 관계처럼 구조가 있는 정보에만 카드나 표를 쓴다.
- `skill.html` 본문에는 UI 설계 의도, 레이아웃 설명, 왜 이렇게 배치했는지에 대한 자기해설을 쓰지 않는다.
- 보이는 문장은 스킬 원문에서 뽑은 의미, 기준, 경계, 명령만 담는다.
- 허용/금지처럼 상반되는 판정은 텍스트 heading과 간단한 table 구조로 구분한다. 색은 보조 스타일로만 쓴다.
- 검증 명령은 카드보다 명령 리스트로 둔다.
- 표는 비교 축, 판단 기준, 허용/금지, 검증 결과처럼 행과 열이 실제 의미를 가질 때 쓴다.
- 일반 Markdown 문서 mode의 긴 표는 전체 폭 section에 두고 가로 스크롤이나 안정적인 열 폭으로 보존한다. 표가 길다는 이유로 요약 표로 바꾸지 않는다.
- 차트는 실제 수치가 있을 때만 쓴다. 수치가 없는 규칙 설명에는 chart를 만들지 않는다.
- standalone `skill.html`에서는 chart library를 쓰지 않고 table, CSS bar, `<meter>`, inline SVG를 우선한다.
- Chart.js나 Observable Plot은 대상 프로젝트가 local build pipeline과 bundled dependency를 이미 갖춘 경우에만 쓴다. D3는 복잡한 custom visualization이 필요한 경우에만 고려한다.
- 본문형 card grid는 `repeat(auto-fit, minmax(280px, 1fr))`를 기본으로 한다.
- 중요한 기준처럼 짧은 snapshot card도 최소 `minmax(220px, 1fr)`를 확보한다.
- Korean/CJK 본문은 긴 줄도 긴 세로 열도 피한다. 문장형 설명은 `max-width:40em` 안팎으로 두고, 좁은 카드 안에 긴 문장을 넣지 않는다.
- 비교해야 하는 정보는 전체 폭 matrix나 table로 둔다.
- PC desktop에서 section header, table cell, code path, card readable width가 부모 밖으로 밀리거나 잘리지 않아야 한다.

## forbidden interaction 기준

- 인터랙티브 요소를 넣지 않는다.
- `<button>`, inline JavaScript, Web Animations API, 외부 CDN, 외부 script, 외부 image를 쓰지 않는다.
- 읽기용 HTML이므로 click, hover, keyboard focus 상태로 의미가 바뀌면 안 된다.
- 장식용 SVG, 과한 flow line, 반복 animation은 제거한다.

## render integrity 기준

- 검증 viewport는 PC desktop이다. mobile/tablet viewport는 확인하지 않아도 된다.
- 넓은 범위 표, 매트릭스, 체크리스트 표는 전체 폭 section에 둔다.
- 2열 layout에는 짧은 카드, 파일 지도처럼 폭이 안정적인 구조만 넣는다.
- PC desktop viewport에서 overflow, text overlap, broken local link가 없어야 한다.
