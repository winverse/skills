# 디자인 리뷰 기준

이 문서는 `design-review`가 취향 평가로 흐르지 않게 하는 세부 기준이다. `SKILL.md`는 호출과 출력 계약을 짧게 유지하고, 실제 리뷰의 깊이는 이 문서를 따른다.

## review model 기준

1. 제품 도메인과 주 사용자를 파악한다.
2. 기존 design system과 component pattern을 확인한다.
3. primary workflow가 빠르게 수행되는지 본다.
4. responsive layout과 text overflow를 확인한다.
5. state, error, empty, loading을 확인한다.
6. 필요하면 `web-research` source ledger로 외부 기준을 확인한다.

## product context matrix 기준

| 제품 | 우선 감각 |
| --- | --- |
| SaaS/CRM/운영툴 | 조용하고 밀도 있는 정보 구조 |
| 학습/콘텐츠 앱 | 읽기 흐름과 집중도 |
| 게임/인터랙티브 | 즉각성, 움직임, feedback |
| 랜딩/브랜드 | 첫 viewport에서 대상이 분명해야 함 |

## default taste profile 기준

- radius는 보통 8px 이하
- card 안에 card를 넣지 않음
- stable dimensions로 hover나 label 변경 시 layout shift 방지
- font size를 viewport width로 직접 scaling하지 않음
- 단일 색상 계열만 반복하는 palette를 피함

## report anatomy 기준

디자인 리뷰 산출물은 아래 구조를 기본으로 한다.

1. `Scope`: 사용자, task, workflow stage, device/viewport, 확인한 URL 또는 screenshot, 기존 design system 여부.
2. `Findings`: 문제를 표나 issue block으로 먼저 제시한다.
3. `Evidence Matrix`: visual, interaction, accessibility, content, responsive, state 중 무엇을 봤는지 표시한다.
4. `Recommendations`: 문제별 수정 방향을 적되, 근거 없는 pixel-perfect 처방은 피한다.
5. `Residual Risk`: screen reader, real-user test, analytics, mobile/tablet, browser matrix처럼 확인하지 못한 영역을 적는다.

finding table을 쓸 때는 아래 field를 갖춘다.

| field | 의미 |
| --- | --- |
| `id` | `DR-001` 같은 추적 가능한 번호 |
| `severity` | `S0`부터 `S4`까지의 등급 |
| `confidence` | `high`, `medium`, `low`, `inference` |
| `location` | 화면, component, selector, screenshot ref |
| `evidence` | screenshot, browser observation, code/CSS, design-system rule, WCAG/heuristic reference |
| `criterion` | WCAG, heuristic, design-system rule, product workflow 기준 |
| `user impact` | 사용자가 막히거나 느려지거나 오해하는 지점 |
| `recommendation` | 구체적 수정 방향 |
| `owner hint` | design, frontend, content, product, accessibility 중 대략 owner |

## severity 기준

`S0-S4`는 NN/g severity rating의 frequency, impact, persistence, market/business impact 개념을 이 repo의 작업 흐름에 맞게 줄인 표현이다.

| 등급 | 판단 기준 |
| --- | --- |
| `S0` | 문제 아님. heuristic 위반처럼 보이지만 product context상 정당한 trade-off |
| `S1` | cosmetic/polish. task 성공에는 거의 영향 없음 |
| `S2` | minor friction. 일부 사용자가 더 오래 걸리거나 한 번 더 읽어야 함 |
| `S3` | major task risk. 반복 workflow, 오류 복구, 의사결정, trust에 명확한 영향 |
| `S4` | release blocker. 접근성 차단, destructive action, 법적/금전/health/data risk, 되돌리기 어려운 상태 변화 |

single-agent 리뷰의 severity는 사용자 조사 결과가 아니다. confidence를 함께 적고, 큰 결정에는 real-user test 또는 다중 reviewer synthesis가 필요하다고 남긴다.

## heuristic lens 기준

finding에는 가능한 경우 아래 lens 중 하나 이상을 붙인다.

- `workflow fit`: 화면이 실제 primary task와 맞는가.
- `visibility/status`: 사용자가 상태와 다음 action을 즉시 알 수 있는가.
- `consistency/standards`: 같은 말과 같은 component가 같은 의미로 쓰이는가.
- `recognition over recall`: 중요한 정보가 숨겨져 기억에 의존하게 만들지 않는가.
- `minimalism`: 장식이나 부차 정보가 task attention을 빼앗지 않는가.
- `error recovery`: 무엇이 잘못됐고 어떻게 고칠지 보이는가.
- `control/freedom`: 되돌리기, 취소, 확인, 안전한 exit가 있는가.
- `accessibility`: keyboard, focus, target, contrast, label, screen reader path가 막히지 않는가.

## accessibility 기준

접근성 finding은 가능하면 구체 기준을 붙인다.

| 기준 | 디자인 리뷰에서 보는 신호 |
| --- | --- |
| WCAG 2.2 `2.4.7 Focus Visible` | keyboard focus가 보이는가. focus outline 제거를 문제로 본다. |
| WCAG 2.2 `2.5.8 Target Size (Minimum)` | pointer target이 최소 `24x24 CSS px`인지 본다. 더 큰 product default가 가능하면 권한다. |
| WCAG 2.2 `3.3.1 Error Identification` | input error가 어떤 항목에서 났는지 text로 알 수 있는가. |
| WCAG 2.2 `3.3.3 Error Suggestion` | 알려진 수정 방법을 안전하게 제안하는가. |
| WAI-ARIA keyboard practice | custom widget의 focus, active state, selected state가 구분되는가. |
| GOV.UK validation pattern | error summary, inline error, focus 이동, 입력 보존, 명확한 복구 문장이 있는가. |

완전한 WCAG compliance를 선언하지 않는다. 이 스킬은 디자인 리뷰이며, assistive technology와 실제 사용자 검증은 별도 evidence가 있어야 한다.

## evidence matrix 기준

| lane | 확인 방법 |
| --- | --- |
| visual | screenshot, hierarchy, density, color use, typography, spacing |
| interaction | primary action, focus order, disabled/loading/empty/error state |
| accessibility | keyboard, focus, target size, contrast, label, error recovery |
| content | label clarity, error copy, jargon, domain language |
| responsive | desktop/mobile/tablet 중 이번 scope에 포함된 viewport |
| state | success, error, empty, loading, blocked, destructive confirmation |

## critique maturity 기준

리뷰 stage에 따라 피드백의 입도를 맞춘다.

- `30%`: concept, information architecture, primary workflow, user promise를 본다.
- `60%`: layout, hierarchy, state model, interaction pattern, content structure를 본다.
- `90%`: visual polish, spacing, typography, edge state, focus/keyboard, copy consistency를 본다.

stage가 불명확하면 먼저 현재 리뷰가 concept, structure, polish 중 어디에 해당하는지 밝힌다.

## screenshot annotation 기준

- screenshot 파일명, viewport, state, issue id를 같이 남긴다.
- annotation이 없으면 snapshot ref, selector, component name 같은 위치 증거를 쓴다.
- before/after가 있으면 같은 viewport와 state로 비교한다.
- screenshot은 증거일 뿐이며 finding, severity rationale, user impact를 대체하지 않는다.

## evidence boundary 기준

layout overlap, runtime rendering, responsive issue는 가능하면 `browser-qa`로 확인한다.

## source ledger 기준

- NN/g heuristic evaluation: scope는 user/task/device로 좁히고, heuristic은 user research를 대체하지 않는 보조 방법으로 쓴다.
- NN/g severity rating: frequency, impact, persistence, market/business impact로 우선순위를 정한다.
- W3C WCAG 2.2와 WAI-ARIA APG: focus, target size, error identification, error suggestion, keyboard practice의 기준으로 쓴다.
- GOV.UK Design System validation guidance: error summary, inline message, focus 이동, 입력 보존, 명확하고 구체적인 복구 문장 기준으로 쓴다.
