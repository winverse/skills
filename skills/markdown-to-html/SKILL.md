---
name: markdown-to-html
description: "Markdown 문서를 사람이 빠르게 읽을 수 있는 안전한 단일 HTML로 변환하거나 갱신할 때 사용한다."
---

# Markdown을 HTML로 변환하기

이 스킬은 Markdown 문서를 그대로 이어 붙이지 않고, heading, list, table, code fence, link의 의미를 읽어 사람이 빠르게 확인하는 script 없는 HTML로 변환한다. 이 repo에서는 주로 `SKILL.md` 옆의 `skill.html`을 만들 때 사용한다.

## 결과 기준

- 각 skill folder에는 `SKILL.md`와 `skill.html`이 함께 있어야 한다.
- `skill.html`은 `SKILL.md`를 대체하지 않는 읽기용 HTML이다.
- 요약 화면에는 문서 이름, 한 줄 목적, 입력/출력, 중요한 기준 3-5개가 바로 보여야 한다.
- 화면에 보이는 일반 설명어는 한국어로 쓴다.
- 정확한 파일명, 명령, 코드 식별자, 프로토콜, 약어, 제품명, 라이브러리 이름만 원문을 유지한다.
- `TDD`, `QA`, `API`, `MCP`, `PRD`처럼 국내 개발 문맥에서 바로 통하는 약어는 남겨도 된다.
- 영어 원문이 꼭 필요하면 첫 등장에만 `한국어(원문)` 형태로 병기하고, 이후에는 한국어 표현만 쓴다.
- 긴 설명, 장식용 도표, 애니메이션, 보기 전환, 클릭 기반 상태 전환, 단계적 펼침을 넣지 않는다.
- `<button>`, inline JavaScript, Web Animations API, 외부 CDN, 외부 script, 외부 image를 사용하지 않는다.
- CSS는 레이아웃과 읽기 폭을 유지하는 데만 쓴다.
- 섹션끼리는 충분한 margin으로 구분한다. 섹션 내부에는 불필요한 중첩 card를 만들지 않는다.
- 요약과 단순한 중요 기준은 카드 grid가 아니라 선형 리스트로 표현한다.
- `skill.html` 본문에는 UI 설계 의도나 레이아웃 설명을 쓰지 않는다.
- 보이는 문장은 스킬 원문에서 뽑은 의미, 기준, 경계, 명령만 담는다.
- 본문형 card grid가 꼭 필요하면 `repeat(auto-fit, minmax(280px, 1fr))` 이상을 기본으로 하고, 좁은 side panel 안에 4개 이상 카드를 억지로 넣지 않는다.
- 넓은 표나 checklist는 전체 폭 section에 둔다.
- 표는 비교 축이나 판단 기준이 있을 때 우선한다.
- 허용/금지처럼 상반되는 판정은 텍스트 heading과 table 구조로 구분한다. 색은 보조 스타일로만 쓴다.
- 차트는 실제 수치가 있을 때만 쓴다. standalone `skill.html`에서는 chart library를 쓰지 않고 table, CSS bar, `<meter>`, inline SVG를 우선한다.
- Chart.js나 Observable Plot은 대상 프로젝트가 local build pipeline과 bundled dependency를 이미 갖춘 경우에만 쓴다. D3는 복잡한 custom visualization이 필요한 경우에만 고려한다.
- PC desktop에서 overflow, text overlap, broken local link가 없어야 한다. mobile/tablet 최적화는 다루지 않는다.

## 변환 모델 기준

- Markdown은 CommonMark/GFM 계열의 블록 구조와 인라인 구조로 해석한다.
- 변환은 문자열 치환이 아니라 `Markdown AST` 또는 token stream을 거쳐 의미 구조를 만든다.
- Markdown 원문에 있는 HTML, 링크, code fence, 표는 내용만 읽고 역할만 해석한다. raw HTML이나 위험한 링크를 실행 가능한 HTML로 통과시키지 않는다.
- 문서 이름, 목적, 입력, 출력, 중요한 기준, 작업 흐름, 보안 경계, 관련 파일, 검증 명령만 뽑아 `MarkdownHtmlModel`을 만든다.
- `MarkdownHtmlModel`은 `{name, purpose, input, output, criteria, workflow, guardrails, files, validation}` 수준의 작은 중간 구조다.
- `MarkdownHtmlModel`을 repo가 작성한 신뢰된 템플릿에 넣어 단일 파일 HTML로 렌더링한다.
- 요약 HTML은 아래 고정 섹션으로 매핑한다.
  - 요약
  - 사용 판단
  - 중요한 기준
  - 작업 흐름
  - 보안 경계
  - 파일과 검증
- Markdown 원문에 있는 raw HTML, event handler, `javascript:` link, `vbscript:` link, 외부 script, `<iframe>`, `<object>`, `<embed>`는 그대로 통과시키지 않는다.
- raw HTML 지원이 꼭 필요하면 raw HTML을 별도로 파싱한 뒤 allowlist sanitizer를 마지막 unsafe transform 이후에 적용한다.
- URL은 `http:`, `https:`, `mailto:`, repo-local 상대 경로처럼 허용한 protocol만 남긴다.
- 원문 문단을 그대로 복사하지 말고, 사람이 읽기 좋은 짧은 한국어 문장으로 줄인다.

## 작업 흐름

1. 변환 mode를 정한다. 이 repo의 기본 mode는 `SKILL.md`에서 같은 폴더의 `skill.html`을 만드는 스킬 HTML mode이고, 일반 Markdown 문서 mode는 명시적으로 요청됐을 때만 쓴다.
2. 대상 Markdown과 필요한 참조 파일만 읽는다.
3. Markdown parser나 token stream 기준으로 heading, list, table, code fence, link의 역할을 구분한다.
4. 중복 설명과 세부 예시는 버리고, `MarkdownHtmlModel`에 중요한 기준 3-5개만 남긴다.
5. 일반 설명어가 영어로 남았는지 확인하고 한국어로 바꾼다.
6. 원문 Markdown 단편과 최종 HTML을 분리하고, 신뢰된 템플릿으로 HTML을 작성한다.
7. 조작 UI, animation, inline JavaScript, 외부 asset, 위험한 URL 속성, UI 설계 의도 설명이 들어가지 않았는지 확인한다.
8. `node scripts/validate-skill-html.ts .`와 대상 스킬 validator를 실행한다.
9. 화면이 이상해 보였던 SVG, 표, 카드 구조가 있으면 제거하거나 요약 표로 바꾼다.

## mode 기준

- 스킬 HTML mode: `SKILL.md`를 기준 문서로 읽고 같은 폴더의 `skill.html`만 갱신한다.
- 일반 Markdown 문서 mode: 사용자가 대상 Markdown과 출력 위치를 명시했을 때만 사용한다.
- 두 mode 모두 raw HTML pass-through, 외부 script, event handler, 위험한 URL은 금지한다.
- 두 mode 모두 `MarkdownHtmlModel`을 거친 뒤 신뢰된 템플릿으로 렌더링한다.

## 품질 기준

`skill.html`을 열었을 때 10초 안에 “입력은 무엇이고, 출력은 무엇이며, 무엇을 보존하고, 무엇을 차단하고, 어떤 명령으로 확인하는지”가 보여야 한다. 인터랙션 없이 읽혀야 하며, 화면은 문서 요약처럼 단정해야 한다.
