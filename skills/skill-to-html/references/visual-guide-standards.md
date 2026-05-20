# skill.html 시각 가이드 기준

## local design system 기준

이 repo의 `skill.html`은 한국어 우선 문구, 조용한 운영 도구형 UI, 얕은 border, 명확한 도표 구조를 기본으로 한다. 단, `skill-to-html` 산출물은 이제 텍스트 설명보다 그림, 애니메이션, 클릭 조작을 먼저 보여준다.

## language policy 기준

화면 라벨과 설명 문장은 한국어로 쓴다. `SKILL.md`, `GraphQL`, `TypeScript`, `Playwright`, command, file path처럼 코드 맥락의 고유어만 원문을 유지한다.

영어 밀도는 낮게 유지한다. `TDD`, `QA`, `API`, `MCP`, `PRD`처럼 국내 개발 문맥에서 바로 통하는 약어는 남겨도 되지만, 설명어를 영어 단어 목록으로 나열하지 않는다. 원문 보존이 필요한 경우 첫 등장에만 `한국어(원문)` 형태로 병기하고 이후에는 한국어 표현을 쓴다.

| 피할 표현 | 권장 표현 |
| --- | --- |
| `Workflow suite의 setup 절반` | 워크플로우 묶음의 초기 설정 구간 |
| `domain language, product reason, architecture boundary` | 도메인 용어, 제품 이유, 아키텍처 경계 |
| `issue backlog, handoff, orchestration` | 이슈 목록, 인계, 초기 설정 흐름 |
| `source-labeled primitive` | 출처가 표시된 구성 요소 |
| `input/output schema, resource map, risk guardrail chart` | 입출력 구조, 파일 관계도, 위험/안전 경계 차트 |

## required visual grammar 기준

- 판단 매트릭스
- 작업 흐름도
- 파일 관계도
- 입출력 구조
- 위험/안전 경계 차트
- mode switch, tab, stepper, toggle 같은 조작 가능한 상태 전환
- SVG path drawing, node highlight, timeline progress 같은 의미 있는 애니메이션
- 클릭하거나 keyboard focus를 이동했을 때 근거나 검증 상태가 드러나는 progressive disclosure

## page structure 기준

첫 화면에서 skill name, 호출 조건, 오용 방지 경계가 보여야 한다. 하지만 첫 화면의 중심은 문장 카드가 아니라 interactive hero 또는 animated diagram이어야 한다. 이어서 작업 흐름과 검증 명령이 보여야 한다.

## diagram rules 기준

도표는 실제 의사결정에 쓰여야 한다. 텍스트를 박스로 쪼개기만 한 구조는 부족하다.

## interaction and animation 기준

- 첫 viewport에는 최소 하나의 즉시 조작 가능한 control이 있어야 한다.
- mode를 바꾸면 주요 도표의 강조 node, caption, evidence panel이 함께 바뀌어야 한다.
- hover/focus/click state가 눈에 보여야 하며 keyboard focus outline을 제거하지 않는다.
- animation은 흐름 이해를 돕는 곳에만 쓴다. 단순 배경 장식, 의미 없는 움직임, 주의를 빼앗는 반복 효과는 쓰지 않는다.
- `prefers-reduced-motion: reduce`에서는 큰 이동과 반복 animation을 줄인다.
- 설명 문장은 짧은 label, caption, evidence note로 나누고, 긴 문단은 접힘 패널이나 하단 검증 section으로 보낸다.

## library policy 기준

- 이 repo의 `skill.html`은 self-contained 단일 파일이다.
- 외부 CDN, 외부 script, 외부 image는 금지한다.
- inline JavaScript는 짧은 interaction controller로만 허용한다. network call, storage tracking, remote import, eval은 쓰지 않는다.
- Framer Motion, Motion One, GSAP 같은 animation library는 target project가 build pipeline과 local dependency를 이미 갖고 있고 산출물이 bundled local asset으로 닫힐 때만 선택한다.
- standalone skill guide에서는 Framer 같은 library를 직접 로드하지 말고 CSS animation, SVG animation, Web Animations API로 같은 상호작용을 구현한다.

## render integrity 기준

- 검증 viewport는 PC desktop이다. mobile/tablet viewport는 확인하지 않아도 된다.
- PC desktop에서 mouse click, keyboard focus, animated state change를 확인한다.
- SVG arrow는 출발 node와 도착 node가 시각적으로 분명해야 한다.
- `marker-end`가 있는 화살표는 실제 box, node, lane, 또는 명시된 목표에 닿아야 하며 빈 공간을 가리키지 않는다.
- 넓은 범위 표, 매트릭스, 체크리스트 표는 전체 폭 section에 둔다.
- 2열 layout에는 짧은 카드, 구조도, 파일 지도처럼 폭이 안정적인 구조만 넣는다.
- PC desktop viewport에서 section header, table cell, SVG text, code path가 부모 밖으로 밀리거나 잘리지 않아야 한다.
- mobile/tablet breakpoint, 1열 접힘, touch target, small viewport wrapping은 이 스킬의 완료 조건이 아니다.
