---
name: skill-to-html
description: "SKILL.md 옆에 사람이 빠르게 이해할 수 있는 그림 우선, 인터랙티브, 애니메이션 중심 skill.html을 만들거나 갱신할 때 사용한다."
---

# 스킬 HTML 만들기

이 스킬은 에이전트가 읽는 `SKILL.md`를 사람이 조작하며 이해하는 `skill.html`로 변환한다. 목적은 보기 좋은 설명서가 아니라, `SKILL.md`의 핵심 계약을 그림, 흐름, 상태 변화, 애니메이션, 클릭 조작으로 먼저 보여주는 확인 화면을 만드는 것이다. 단순 카드 요약이나 긴 텍스트 표가 아니라 핵심 계약, 원문 근거, 실제 확인, 판단 매트릭스, 흐름도, 파일 관계도, 입출력 구조를 인터랙티브하게 만든다.

## required outcome 기준

- 각 skill folder에는 `SKILL.md`와 `skill.html`이 함께 있어야 한다.
- 첫 화면은 글 목록이 아니라 움직이는 도표, 조작 가능한 판단 보드, 상태 전환이 있는 시각 장면으로 시작한다.
- 화면 텍스트는 짧은 라벨, 캡션, 상태값 중심으로 제한하고, 긴 설명은 접힌 패널이나 하단 근거 section으로 보낸다.
- 핵심 계약 카드가 4개 이상이고 각 카드에 문장 설명이 있으면, 좁은 side panel, status panel, 2열 layout의 보조 영역 안에서 다열 grid로 넣지 않는다. 전체 폭 rail, matrix, flow lane, table, disclosure, 또는 280px 이상 single-column 선택 리스트로 읽기 폭을 확보한다.
- 본문형 card grid는 280px 이상을 기본으로 하고, 짧은 핵심 계약 snapshot도 `minmax(220px, 1fr)`보다 좁게 만들지 않는다.
- 화면에 보이는 설명은 한국어 문장 우선으로 작성한다.
- 영어 설명어를 쉼표로 길게 나열하지 않는다. `TDD`, `QA`, `API`, `MCP`, `PRD`, 파일명, 명령, product/library 이름처럼 정확성이 필요한 식별자만 원문을 유지한다.
- `workflow suite`, `setup`, `initiative`, `domain language`, `architecture boundary`, `design direction`, `issue backlog`, `handoff`, `orchestration`, `source-labeled primitive` 같은 설명어는 한국어로 풀어 쓴다.
- 원문을 남겨야 할 때는 첫 등장에만 `한국어(원문)` 형태로 병기하고, 이후에는 한국어 표현을 쓴다.
- 외부 CDN, 외부 이미지, 외부 script에 의존하지 않는다.
- 이 repo의 `skill.html`은 self-contained 단일 파일로 두며, 상호작용은 CSS animation, SVG animation, Web Animations API, 짧은 inline JavaScript로 구현한다.
- Framer Motion, Motion One, GSAP 같은 animation library는 target project가 build pipeline과 local dependency를 이미 갖고 있을 때만 bundled local asset으로 쓸 수 있다. 이 repo의 standalone `skill.html`에서는 CDN으로 불러오지 않고 같은 효과를 CSS 또는 Web Animations API로 구현한다.
- PC desktop viewport에서 빠르게 읽히고 text overflow가 없으면 된다.
- mobile/tablet viewport와 responsive breakpoint는 이 스킬의 설계나 검증 범위가 아니다. 단, PC desktop의 mouse, keyboard focus, click interaction은 검증 범위다.
- SVG arrow는 실제 node나 box에 닿아야 하며, 목적지 없는 dangling arrow를 남기지 않는다.
- 넓은 표, matrix, scope table은 좁은 2열 layout 안에 넣지 않는다.
- 첫 화면에는 `핵심 계약` 3-5개가 보여야 한다. 핵심 계약은 호출 조건, 반드시 하는 일, 절대 하지 않는 일, 검증 기준처럼 스킬 실행을 바꾸는 문장만 뽑는다.
- 첫 화면의 핵심 계약은 정적인 카드보다 조작 가능한 mode, toggle, stepper, hover/focus state, animated path에 연결한다.
- `원문 근거` section에는 핵심 계약이 `SKILL.md` 또는 `references/`의 어느 heading/문장/validator와 연결되는지 적는다. 줄 번호가 있으면 더 좋고, 없으면 section title과 파일명을 적는다.
- `실제 확인` section에는 실행한 validator, browser/viewport 확인, 링크 확인, 남은 미확인 항목을 표로 남긴다.
- 도표와 애니메이션은 장식이 아니라 의사결정, 실행 순서, 금지 경계, 증거 연결을 보여야 한다. 텍스트를 박스로 예쁘게 쪼갠 것만으로는 완료가 아니다.

## Markdown-to-HTML 변환 모델 기준

- `SKILL.md`는 의미 있는 Markdown 원본이고, `skill.html`은 그 원본을 사람이 조작하는 시각 view로 렌더링한 산출물이다. `skill.html`을 새로운 source of truth로 만들지 않는다.
- 변환은 `SKILL.md` 원문 읽기 -> Markdown 의미 구조 파악 -> `skill IR` 추출 -> component mapping -> standalone HTML 렌더링 -> 검증 순서로 생각한다.
- Markdown 의미 구조는 heading, list, table, code fence, blockquote, link, front matter가 무엇을 뜻하는지 보는 단계다. 원문 줄바꿈이나 문단 순서를 그대로 화면 layout으로 복사하지 않는다.
- `skill IR`은 `{name, description, triggers, contracts, workflow, files, validators, risks, evidence}` 같은 중간 구조다. 이 구조를 만든 뒤 판단 보드, 흐름도, 파일 관계도, 검증 표, 근거 reveal로 매핑한다.
- `unified/remark/rehype`의 `remark-rehype`, `Pandoc` template, `MDX`, `Markdoc` 같은 도구는 참고 모델이다. 이 repo의 standalone `skill.html`은 React/Vue/MDX runtime을 요구하지 않고, 필요한 component mapping 원칙만 가져온다.
- `raw HTML`은 신뢰된 repo-authored template에서만 나온다. Markdown 원문에 들어 있는 HTML, event handler, `javascript:` link, 외부 script는 그대로 통과시키지 않는다.
- 상호작용은 Markdown 안에 script를 숨기는 방식이 아니라 template의 닫힌 CSS/SVG/Web Animations API/짧은 inline JavaScript controller에서 만든다.

## design contract 기준

- visual guide는 설명 문단보다 구조와 증거를 우선한다.
- visual guide는 정적인 설명보다 직접 조작 가능한 상태 변화를 우선한다.
- 애니메이션은 의미가 있어야 한다. 예를 들어 source node가 evidence node로 연결되거나, 금지 경계가 선택 시 차단 상태로 바뀌어야 한다.
- `SKILL.md`의 모든 항목을 옮기지 않는다. 핵심 계약 3-5개, 오용 방지 경계, 실제 확인 결과만 남기고 나머지는 링크와 근거로 넘긴다.
- 4-5개 핵심 계약을 한 줄 카드로 보여줄 때는 좁은 side panel에 넣지 말고, 전체 폭에서 wrap되는 grid나 matrix로 둔다.
- diagram은 브라우저에서 읽히는 geometry를 기준으로 검토한다.
- layout 판단은 PC desktop을 기준으로 한다. mobile/tablet 최적화, touch interaction, breakpoint 조정은 다루지 않는다.
- 색상은 절제하고, nested card와 decorative orb를 피한다.
- code term, file path, command, product/library 이름은 원문을 유지하되, 일반 설명 문장은 한국어로 쓴다.
- `prefers-reduced-motion`을 넣어 motion-sensitive 환경에서 큰 움직임을 줄인다.

## creation workflow 기준

1. 대상 `SKILL.md`와 필요한 `references/`만 읽는다.
2. Markdown heading, list, table, code fence, link를 의미 단위로 읽고 `skill IR`을 만든다.
3. 핵심 계약 3-5개를 추출하고, 이를 먼저 조작 가능한 화면 상태로 바꾼다.
4. 텍스트 구조가 아니라 interactive storyboard를 먼저 잡는다. 최소 하나의 mode switch, 하나의 animated flow, 하나의 evidence reveal이 있어야 한다.
5. 4개 이상의 카드, matrix, 표가 필요하면 먼저 전체 폭 배치를 잡고, side panel에는 다열 카드 grid를 두지 않는다.
6. 호출 조건, 실행 흐름, 안전 경계, 출력 형태를 핵심 계약과 원문 근거에 연결한다.
7. 실제 확인 표를 만든다. 최소한 공통 HTML validator와 해당 스킬 validator, browser viewport 확인, interaction check 여부가 있어야 한다.
8. 최소 4개 이상의 시각 구조를 설계하되, 첫 구조는 정적인 카드가 아니라 interactive hero 또는 animated diagram이어야 한다.
9. `skill.html`을 self-contained HTML로 작성한다. 필요한 경우 짧은 inline JavaScript를 허용하되 network call, external script, 외부 asset은 금지한다.
10. Markdown의 `raw HTML`을 직접 신뢰하지 않았는지, component mapping이 원문 계약과 validator 근거를 잃지 않았는지 확인한다.
11. `node scripts/validate-skill-html.ts .`를 실행한다.
12. material visual change면 PC desktop viewport에서 click interaction, keyboard focus, animation state, arrow endpoint, table width, overflow, text overlap, card readable width를 확인한다.

## quality bar 기준

HTML 첫 화면만 봐도 이 스킬의 판단 구조가 그림으로 먼저 보여야 한다. 사용자는 mode를 눌러 보고, 흐름이 움직이는 것을 보고, 근거가 드러나는 것을 확인한 뒤에야 긴 검증 표를 읽게 되어야 한다.
