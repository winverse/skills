---
name: skill-to-html
description: "SKILL.md 옆에 사람이 빠르게 훑어볼 수 있는 짧은 정적 요약 skill.html을 만들거나 갱신할 때 사용한다."
---

# 스킬 HTML 요약 만들기

이 스킬은 에이전트가 읽는 `SKILL.md`를 사람이 설치 전후에 빠르게 확인하는 `skill.html`로 요약한다. 목적은 화려한 설명 화면이 아니라, 스킬의 호출 조건, 핵심 계약, 주의할 경계, 검증 명령을 짧게 보여주는 정적 HTML이다.

## required outcome 기준

- 각 skill folder에는 `SKILL.md`와 `skill.html`이 함께 있어야 한다.
- `skill.html`은 `SKILL.md`의 요약 화면이며 새로운 기준 원문이 아니다.
- 첫 화면에는 스킬 이름, 한 줄 목적, 사용 조건, 핵심 계약 3-5개가 바로 보여야 한다.
- 화면에 보이는 일반 설명어는 한국어로 번역한다.
- 정확한 파일명, 명령, 코드 식별자, 프로토콜, 약어, 제품명, 라이브러리 이름만 원문을 유지한다.
- `TDD`, `QA`, `API`, `MCP`, `PRD`처럼 국내 개발 문맥에서 바로 통하는 약어는 남겨도 된다.
- 영어 원문이 꼭 필요하면 첫 등장에만 `한국어(원문)` 형태로 병기하고, 이후에는 한국어 표현만 쓴다.
- 긴 설명, 장식용 도표, 애니메이션, 보기 전환, 클릭 기반 상태 전환, 단계적 펼침을 넣지 않는다.
- `<button>`, inline JavaScript, Web Animations API, 외부 CDN, 외부 script, 외부 image를 사용하지 않는다.
- CSS는 정적 레이아웃과 읽기 폭을 유지하는 데만 쓴다.
- 모든 section을 독립 card처럼 만들지 않는다. 짧은 안내 화면은 하나의 문서 시트 안에서 section divider로 구분한다.
- 요약과 단순한 핵심 계약은 카드 grid가 아니라 선형 리스트로 표현한다.
- 본문형 card grid가 꼭 필요하면 `repeat(auto-fit, minmax(280px, 1fr))` 이상을 기본으로 하고, 좁은 side panel 안에 4개 이상 카드를 억지로 넣지 않는다.
- 넓은 표나 checklist는 전체 폭 section에 둔다.
- PC desktop에서 overflow, text overlap, broken local link가 없어야 한다. mobile/tablet 최적화는 다루지 않는다.

## Markdown-to-HTML 요약 모델 기준

- `SKILL.md` 원문을 읽고 heading, list, table, code fence, link가 어떤 역할인지 파악한다.
- Markdown은 신뢰하지 않는 입력으로 다룬다. 원문에 있는 HTML, 링크, code fence, 표는 역할만 읽고 그대로 실행 가능한 HTML로 통과시키지 않는다.
- 스킬 이름, 설명, 호출 조건, 핵심 계약, 작업 흐름, 관련 파일, 검증 명령, 위험 경계만 뽑아 `SkillHtmlModel`을 만든다.
- `SkillHtmlModel`은 `{name, purpose, useCondition, contracts, workflow, guardrails, files, validation}` 수준의 작은 중간 구조다.
- `SkillHtmlModel`을 repo가 작성한 신뢰된 템플릿에 넣어 단일 파일 `skill.html`로 렌더링한다.
- 요약 모델은 아래 정적 section으로 매핑한다.
  - 요약
  - 사용 판단
  - 핵심 계약
  - 작업 흐름
  - 금지와 허용
  - 파일과 검증
- Markdown 원문에 있는 raw HTML, event handler, `javascript:` link, `vbscript:` link, 외부 script, `<iframe>`, `<object>`, `<embed>`는 그대로 통과시키지 않는다.
- 원문 문단을 그대로 복사하지 말고, 사람이 읽기 좋은 짧은 한국어 문장으로 압축한다.

## creation workflow 기준

1. 대상 `SKILL.md`와 필요한 `references/`만 읽는다.
2. 스킬 이름, description, trigger, 반드시 하는 일, 하지 말아야 할 일, 검증 명령을 뽑는다.
3. 중복 설명과 세부 예시는 버리고, `SkillHtmlModel`에 핵심 계약 3-5개만 남긴다.
4. 일반 설명어가 영어로 남았는지 확인하고 한국어로 바꾼다.
5. 원문 Markdown 단편과 최종 HTML을 분리하고, 신뢰된 템플릿으로 `skill.html`을 작성한다.
6. 조작 UI, animation, inline JavaScript, 외부 asset, 위험한 URL 속성이 들어가지 않았는지 확인한다.
7. `node scripts/validate-skill-html.ts .`와 대상 스킬 validator를 실행한다.
8. 화면이 이상해 보였던 SVG, 표, 카드 구조가 있으면 제거하거나 정적 요약 표로 바꾼다.

## quality bar 기준

`skill.html`을 열었을 때 10초 안에 “이 스킬을 언제 쓰고, 무엇을 하고, 무엇을 하면 안 되고, 어떤 명령으로 확인하는지”가 보여야 한다. 인터랙션 없이 읽혀야 하며, 화면은 요약 문서처럼 단정해야 한다.
