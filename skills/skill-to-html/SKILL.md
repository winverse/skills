---
name: skill-to-html
description: "SKILL.md 옆에 사람이 빠르게 이해할 수 있는 도표 중심 skill.html을 만들거나 갱신할 때 사용한다."
---

# 스킬 HTML 만들기

이 스킬은 에이전트가 읽는 `SKILL.md`를 사람이 읽는 `skill.html`로 변환한다. 단순 카드 요약이 아니라 판단 매트릭스, 흐름도, 차트, 파일 관계도, 입출력 구조처럼 한눈에 판단 가능한 도표 구조를 만든다.

## required outcome 기준

- 각 skill folder에는 `SKILL.md`와 `skill.html`이 함께 있어야 한다.
- 화면에 보이는 설명은 한국어 문장 우선으로 작성한다.
- 영어 설명어를 쉼표로 길게 나열하지 않는다. `TDD`, `QA`, `API`, `MCP`, `PRD`, 파일명, 명령, product/library 이름처럼 정확성이 필요한 식별자만 원문을 유지한다.
- `workflow suite`, `setup`, `initiative`, `domain language`, `architecture boundary`, `design direction`, `issue backlog`, `handoff`, `orchestration`, `source-labeled primitive` 같은 설명어는 한국어로 풀어 쓴다.
- 원문을 남겨야 할 때는 첫 등장에만 `한국어(원문)` 형태로 병기하고, 이후에는 한국어 표현을 쓴다.
- 외부 CDN, 외부 이미지, 외부 script, build tool에 의존하지 않는다.
- PC desktop viewport에서 빠르게 읽히고 text overflow가 없으면 된다.
- mobile/tablet viewport와 responsive breakpoint는 이 스킬의 설계나 검증 범위가 아니다.
- SVG arrow는 실제 node나 box에 닿아야 하며, 목적지 없는 dangling arrow를 남기지 않는다.
- 넓은 표, matrix, scope table은 좁은 2열 layout 안에 넣지 않는다.

## design contract 기준

- visual guide는 설명 문단보다 구조를 우선한다.
- diagram은 브라우저에서 읽히는 geometry를 기준으로 검토한다.
- layout 판단은 PC desktop을 기준으로 한다. mobile/tablet 최적화, touch interaction, breakpoint 조정은 다루지 않는다.
- 색상은 절제하고, nested card와 decorative orb를 피한다.
- code term, file path, command, product/library 이름은 원문을 유지하되, 일반 설명 문장은 한국어로 쓴다.

## creation workflow 기준

1. 대상 `SKILL.md`와 필요한 `references/`만 읽는다.
2. 호출 조건, 실행 흐름, 안전 경계, 출력 형태를 추출한다.
3. 최소 4개 이상의 시각 구조를 설계한다.
4. `skill.html`을 self-contained static HTML로 작성한다.
5. `node scripts/validate-skill-html.ts .`를 실행한다.
6. material visual change면 PC desktop viewport에서 arrow endpoint, table width, overflow, text overlap만 확인한다.

## quality bar 기준

HTML만 봐도 이 스킬을 언제 쓰고 언제 쓰지 말아야 하는지 알 수 있어야 한다.
