# skill.html 정적 요약 기준

## local design system 기준

이 repo의 `skill.html`은 한국어 우선 문구, 조용한 운영 도구형 UI, 얕은 border, 안정적인 읽기 폭을 기본으로 한다. `skill-to-html` 산출물은 정적 요약이어야 하며, 그림이나 애니메이션보다 사용 조건, 핵심 계약, 금지 경계, 검증 명령이 먼저 읽혀야 한다.

## language policy 기준

화면에 보이는 일반 설명어는 한국어로 번역한다. `SKILL.md`, `skill.html`, `GraphQL`, `TypeScript`, `Playwright`, 명령, 파일 경로처럼 정확한 식별자는 원문을 유지한다.

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
- 핵심 계약
- 작업 흐름
- 금지와 허용
- 파일과 검증

위 section만으로 사람이 10초 안에 스킬의 목적과 경계를 파악할 수 있어야 한다. 세부 설명, 긴 예시, 반복되는 주의 문구는 `SKILL.md` 링크로 넘긴다.

## Markdown 변환 기준

- `SKILL.md`는 기준 원문이고 `skill.html`은 사람이 빠르게 확인하는 요약 화면이다.
- 변환은 Markdown 원문 읽기 -> 의미 구조 파악 -> `SkillHtmlModel` 추출 -> 정적 HTML 작성 -> browser QA 순서로 본다.
- Markdown 의미 구조는 heading, list, table, code fence, blockquote, link가 수행하는 역할이다. 원문 순서와 줄바꿈을 그대로 layout으로 복사하지 않는다.
- Markdown은 신뢰하지 않는 입력으로 다룬다. `raw HTML`, event handler, `javascript:` link, `vbscript:` link, 외부 script, `<iframe>`, `<object>`, `<embed>`는 그대로 통과시키지 않는다.
- 최종 `skill.html`은 원문 Markdown 단편을 이어 붙인 결과가 아니라, repo가 작성한 신뢰된 템플릿에 `SkillHtmlModel`을 넣어 만든 단일 파일이다.

## readability 기준

- 짧은 스킬 안내는 여러 개의 큰 card를 세로로 쌓지 말고 하나의 문서 시트 안에서 section divider로 구분한다.
- 요약과 단순한 핵심 계약은 카드가 아니라 리스트로 둔다. 비교, 상태, 파일 관계처럼 구조가 있는 정보에만 카드나 표를 쓴다.
- 허용/금지처럼 두 값을 비교하는 정보는 카드 두 개보다 간단한 table을 우선한다.
- 검증 명령은 카드보다 명령 리스트로 둔다.
- 본문형 card grid는 `repeat(auto-fit, minmax(280px, 1fr))`를 기본으로 한다.
- 핵심 계약처럼 짧은 snapshot card도 최소 `minmax(220px, 1fr)`를 확보한다.
- Korean/CJK 본문은 긴 줄도 긴 세로 열도 피한다. 문장형 설명은 `max-width:40em` 안팎으로 두고, 좁은 카드 안에 긴 문장을 넣지 않는다.
- 비교해야 하는 정보는 전체 폭 matrix나 table로 둔다.
- PC desktop에서 section header, table cell, code path, card readable width가 부모 밖으로 밀리거나 잘리지 않아야 한다.

## forbidden interaction 기준

- 인터랙티브 요소를 넣지 않는다.
- `<button>`, inline JavaScript, Web Animations API, 외부 CDN, 외부 script, 외부 image를 쓰지 않는다.
- 정적 HTML이므로 click, hover, keyboard focus 상태로 의미가 바뀌면 안 된다.
- 장식용 SVG, 과한 flow line, 반복 animation은 제거한다.

## render integrity 기준

- 검증 viewport는 PC desktop이다. mobile/tablet viewport는 확인하지 않아도 된다.
- 넓은 범위 표, 매트릭스, 체크리스트 표는 전체 폭 section에 둔다.
- 2열 layout에는 짧은 카드, 파일 지도처럼 폭이 안정적인 구조만 넣는다.
- PC desktop viewport에서 overflow, text overlap, broken local link가 없어야 한다.
