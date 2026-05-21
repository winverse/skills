---
name: markdown-to-html
description: "Markdown 문서를 사람이 빠르게 읽을 수 있는 안전한 단일 HTML로 변환하거나 갱신할 때 사용한다."
---

# Markdown을 HTML로 변환하기

이 스킬은 Markdown 문서를 그대로 이어 붙이지 않고, heading, list, table, code fence, link의 의미를 읽어 사람이 확인할 수 있는 script 없는 HTML로 변환한다. 이 repo에서는 주로 `SKILL.md` 옆의 `skill.html`을 만들 때 사용하지만, 사용자가 대상 Markdown과 출력 위치를 명시하면 긴 문서와 복잡한 구조도 보존하는 일반 Markdown 문서 mode로 동작한다.

## 결과 기준

- 각 skill folder에는 `SKILL.md`와 `skill.html`이 함께 있어야 한다.
- `skill.html`은 `SKILL.md`를 대체하지 않는 읽기용 HTML이다.
- 스킬 HTML mode의 요약 화면에는 대상 스킬의 이름, 실제 목적, 사용할 때, 주요 입력, 주요 출력, 중요한 기준 3-5개가 바로 보여야 한다.
- 스킬 HTML mode의 요약은 `markdown-to-html` 변환 절차가 아니라 대상 스킬 자체를 설명해야 한다.
- `SKILL.md와 필요한 참조 문서`, `사람이 빠르게 확인하는 단일 skill.html`, `범위`, `보존`, `차단`처럼 변환기의 입력/출력이나 레이아웃 기준을 대상 스킬 요약으로 쓰지 않는다.
- `SKILL.md`, `skill.html`, 참조 파일, 검증 명령은 요약이 아니라 `파일과 검증` 섹션에서만 다룬다.
- 일반 Markdown 문서 mode는 긴 문단, 깊은 heading 계층, 긴 표, 중첩 list, blockquote, code fence, footnote, task list처럼 원문에 있는 복잡한 구조를 버리지 않고 HTML 구조로 보존한다.
- 화면에 보이는 일반 설명어는 한국어로 쓴다.
- 정확한 파일명, 명령, 코드 식별자, 프로토콜, 약어, 제품명, 라이브러리 이름만 원문을 유지한다.
- `TDD`, `QA`, `API`, `MCP`, `PRD`처럼 국내 개발 문맥에서 바로 통하는 약어는 남겨도 된다.
- 영어 원문이 꼭 필요하면 첫 등장에만 `한국어(원문)` 형태로 병기하고, 이후에는 한국어 표현만 쓴다.
- `domain term`, `boundary`, `problem`, `user`, `first usable slice`, `included/excluded scope`, `acceptance criteria`, `selected mock direction`, `vertical slice`, `enabling task`, `handoff`, `challenge`, `initiative`처럼 사람이 읽는 설명어는 한국어로 바꾼다.
- 영어 keyword나 upstream primitive 상태값이 꼭 필요하면 `선택됨(selected)`, `보류(deferred)`, `첫 사용 단위(first usable slice)`처럼 한국어를 먼저 쓰고 괄호 안에 원문을 둔다.
- 긴 설명을 무조건 버리지 않는다. 스킬 HTML mode에서만 설치 전후 빠른 판단에 필요 없는 세부 예시를 줄인다.
- 장식용 도표, 애니메이션, 보기 전환, 클릭 기반 상태 전환, 단계적 펼침을 넣지 않는다.
- `<button>`, inline JavaScript, Web Animations API, 외부 CDN, 외부 script, 외부 image를 사용하지 않는다.
- CSS는 레이아웃과 읽기 폭을 유지하는 데만 쓴다.
- 섹션끼리는 충분한 margin으로 구분한다. 섹션 내부에는 불필요한 중첩 card를 만들지 않는다.
- 요약과 단순한 중요 기준은 카드 grid가 아니라 선형 리스트로 표현한다. 일반 Markdown 문서 mode에서는 원문 구조에 맞춰 article, section, table, list, pre/code, blockquote를 사용한다.
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
- `MarkdownHtmlModel`은 mode에 따라 다르게 채운다.
- 스킬 HTML mode에서는 대상 스킬의 문서 이름, 실제 목적, 사용할 때, 실제 입력, 실제 출력, 중요한 기준, 작업 흐름, 보안 경계, 관련 파일, 검증 명령을 뽑아 `{name, targetPurpose, whenToUse, operationalInputs, operationalOutputs, criteria, workflow, guardrails, files, validation}` 수준의 작은 중간 구조를 만든다.
- `operationalInputs`와 `operationalOutputs`는 변환기가 읽고 쓰는 `SKILL.md`/`skill.html`이 아니라 대상 스킬이 실제 작업에서 받는 입력과 만드는 산출물이다.
- 이 중간 구조는 대상 스킬의 실제 작업 모델을 담아야 한다.
- 예를 들어 `project-workflow`의 입력은 원시 아이디어, 도메인/제품 제약, 구조 질문이고 출력은 `CONTEXT.md`, ADR, PRD, 이슈 목록, `design.md`, `feature-workflow` 인계다. 이를 `SKILL.md 입력`과 `skill.html 출력`으로 바꾸면 실패다.
- 일반 Markdown 문서 mode에서는 원문 heading tree, paragraph, list, table, code fence, blockquote, link, image reference, footnote, task list, frontmatter 같은 구조를 `sections`, `blocks`, `assets`, `links`, `metadata`로 보존한다.
- 두 mode 모두 `MarkdownHtmlModel`을 repo가 작성한 신뢰된 템플릿에 넣어 단일 파일 HTML로 렌더링한다.
- 스킬 HTML mode의 요약 HTML은 아래 고정 섹션으로 매핑한다.
  - 요약
  - 사용 판단
  - 중요한 기준
  - 작업 흐름
  - 보안 경계
  - 파일과 검증
- Markdown 원문에 있는 raw HTML, event handler, `javascript:` link, `vbscript:` link, 외부 script, `<iframe>`, `<object>`, `<embed>`는 그대로 통과시키지 않는다.
- raw HTML 지원이 꼭 필요하면 raw HTML을 별도로 파싱한 뒤 allowlist sanitizer를 마지막 unsafe transform 이후에 적용한다.
- URL은 `http:`, `https:`, `mailto:`, repo-local 상대 경로처럼 허용한 protocol만 남긴다.
- 스킬 HTML mode에서는 원문 문단을 그대로 복사하지 말고, 대상 스킬의 실제 의미를 사람이 읽기 좋은 짧은 한국어 문장으로 줄인다.
- 스킬 HTML mode의 첫 요약 문단과 요약 리스트가 `markdown-to-html`의 변환 과정을 설명하면 실패로 본다.
- 일반 Markdown 문서 mode에서는 사용자가 요약을 요청하지 않은 한 본문 의미와 세부 구조를 보존한다. 줄이는 대상은 중복 layout, 실행 가능한 위험 요소, 깨진 링크, 불필요한 wrapper뿐이다.

## 작업 흐름

1. 변환 mode를 정한다. 이 repo의 기본 mode는 `SKILL.md`에서 같은 폴더의 `skill.html`을 만드는 스킬 HTML mode이고, 일반 Markdown 문서 mode는 명시적으로 요청됐을 때만 쓴다.
2. 대상 Markdown과 필요한 참조 파일만 읽는다.
3. Markdown parser나 token stream 기준으로 heading, list, table, code fence, link의 역할을 구분한다.
4. mode에 맞춰 `MarkdownHtmlModel`을 만든다. 스킬 HTML mode는 대상 스킬의 목적, 사용 판단, 실제 입력/출력, 중요한 기준 3-5개로 압축하고, 일반 Markdown 문서 mode는 원문의 복잡한 구조와 긴 내용을 보존한다.
5. 일반 설명어가 영어로 남았는지 확인하고 한국어로 바꾼다. 영어가 exact identifier인지 설명어인지 애매하면 한국어를 먼저 쓰고 원문을 괄호에 둔다.
6. 원문 Markdown 단편과 최종 HTML을 분리하고, 신뢰된 템플릿으로 HTML을 작성한다.
7. 조작 UI, animation, inline JavaScript, 외부 asset, 위험한 URL 속성, UI 설계 의도 설명이 들어가지 않았는지 확인한다.
8. `node scripts/validate-skill-html.ts .`와 대상 스킬 validator를 실행한다.
9. 요약 섹션이 대상 스킬이 아니라 변환기 자체를 설명하는지 확인한다. `SKILL.md에서 필요한 의미를 뽑아 skill.html로 정리한다` 같은 문구가 대상 스킬 HTML에 남으면 다시 작성한다.
10. 화면이 이상해 보였던 SVG, 표, 카드 구조가 있으면 원문 의미를 보존한 채 레이아웃만 단순화한다. 일반 Markdown 문서 mode에서는 복잡하다는 이유만으로 내용을 삭제하지 않는다.

## mode 기준

- 스킬 HTML mode: `SKILL.md`를 기준 문서로 읽고 같은 폴더의 `skill.html`만 갱신한다.
- 일반 Markdown 문서 mode: 사용자가 대상 Markdown과 출력 위치를 명시했을 때 사용하며, 복잡한 문서 구조를 article HTML로 보존한다.
- 두 mode 모두 raw HTML pass-through, 외부 script, event handler, 위험한 URL은 금지한다.
- 두 mode 모두 `MarkdownHtmlModel`을 거친 뒤 신뢰된 템플릿으로 렌더링한다.
- 두 mode의 차이는 요약 수준이다. 스킬 HTML mode는 빠른 판단용으로 압축하고, 일반 Markdown 문서 mode는 원문 구조와 세부 내용을 최대한 보존한다.

## 품질 기준

`skill.html`을 열었을 때 10초 안에 “이 스킬은 언제 쓰고, 실제로 무엇을 받아 무엇을 만들며, 어디서 멈추고, 어떤 명령으로 확인하는지”가 보여야 한다. 변환 도구의 입력/출력 설명이 아니라 대상 스킬의 핵심이 보여야 한다. 인터랙션 없이 읽혀야 하며, 화면은 문서 요약처럼 단정해야 한다.
