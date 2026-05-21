---
name: design-review
description: "UI review, visual critique, layout, interaction, design-system fit, accessibility, responsive hierarchy, product-aware design judgment가 필요할 때 사용한다."
---

# 디자인 리뷰

이 스킬은 제품 도메인과 기존 design system을 먼저 존중하면서 UI 문제를 구체적 evidence로 지적한다. 구현 리뷰가 아니라 화면 경험 리뷰다.

실질 리뷰를 할 때는 `references/design-review-criteria.md`를 먼저 읽고, 필요한 경우 `browser-qa` evidence와 `web-research` source ledger를 결합한다.

## review principles 기준

- target product의 사용자와 반복 workflow를 먼저 본다.
- 기존 design system과 component convention을 우선한다.
- density, hierarchy, spacing, typography, state, responsive order를 확인한다.
- accessibility와 keyboard/focus 상태를 놓치지 않는다.
- shared fallback taste는 quiet operational UI, restrained color, shallow border, stable dimension이다.
- heuristic violation을 자동 bug로 단정하지 않는다. 사용자 task, 빈도, 영향, 반복성, domain/business risk로 severity를 판단한다.

## evidence 기준

- screenshot, browser observation, code/CSS, design-system rule, WCAG/heuristic reference, user/task evidence 중 최소 하나를 finding마다 붙인다.
- browser evidence가 필요한 focus, target size, overflow, contrast, responsive 문제는 관찰 증거 없이 pass로 단정하지 않는다.
- `web-research`가 함께 요청되면 official/source, practice, report-shape lane으로 조사하고 `adopt`, `adapt`, `reject`, `defer` 판단을 남긴다.
- 추론이면 `inference`라고 표시하고, 실제 사용자 조사나 screen reader/assistive tech 검증을 대체했다고 말하지 않는다.

## severity 기준

| 등급 | 의미 |
| --- | --- |
| `S0` | 문제로 보지 않음 또는 의도된 trade-off |
| `S1` | polish/cosmetic. 여유가 있을 때 수정 |
| `S2` | friction. 일부 사용자의 흐름을 늦춤 |
| `S3` | major task risk. 주요 workflow 성공률이나 신뢰에 영향 |
| `S4` | release blocker. 접근성, 안전, 법적/금전/데이터 손상, 되돌리기 어려운 action 위험 |

severity rationale은 frequency, impact, persistence, domain/business risk 중 관련 항목을 짧게 적는다.

## accessibility 기준

- WCAG 2.2 `2.4.7 Focus Visible`, `2.5.8 Target Size (Minimum)`, `3.3.1 Error Identification`, `3.3.3 Error Suggestion`을 concrete finding에 연결한다.
- focus indicator, keyboard path, focus order, target size, color-only meaning, text contrast, error recovery, input preservation을 확인한다.
- destructive, legal, financial, health, data-changing action은 confirm/reverse/review path가 없으면 높은 severity로 본다.

## output shape 기준

```text
Scope
- user/task/device/design system/evidence

Findings
- [S3 Major][heuristic: recognition/error recovery][evidence: browser screenshot + WCAG 3.3.1]
  Location: <screen/component>
  Problem: <specific issue>
  User impact: <task blocked/slowed/confused>
  Severity rationale: frequency=<...>, impact=<...>, persistence=<...>
  Recommendation: <specific direction>

Evidence Matrix
- visual / interaction / accessibility / content / responsive / state coverage

Recommendations
- <구체적 수정 방향>

Residual Risk
- <확인 못 한 부분>
```

## 하지 말 것

- 제품 맥락 없이 취향만 말하지 않는다.
- decorative orb, heavy gradient, nested card 같은 일반 금지사항만 반복하지 않는다.
- browser evidence가 필요한 문제를 눈대중으로 단정하지 않는다.
- 모든 heuristic 위반을 무조건 수정해야 하는 bug로 취급하지 않는다.
- screenshot만 붙이고 finding, severity rationale, user impact를 생략하지 않는다.
