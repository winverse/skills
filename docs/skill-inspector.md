# Skill Inspector

이 문서는 스킬 검사관의 공용 기준이다. 실제 검사 결과와 임시 의견 파일은 `inspector/` 아래에 local-only로 둘 수 있지만, GitHub에는 올리지 않는다.

`inspector/`는 `.gitkeep`만 추적한다. 검사를 마치면 먼저 `inspector/YYYY-MM-DD-<scope>.md`에 검사 결과를 작성하고, 그 문서를 기준으로 수정한다. 처리 완료된 검사 결과 파일은 삭제해서 같은 검증 사항을 반복 검토하지 않게 한다.

## 검사관 역할

검사관은 스킬이 단순히 validator만 통과하는 수준이 아니라 Codex, Claude, 다른 에이전트에서도 프로젝트별로 고를 수 있고, 읽기 쉽고, 유지보수 가능한 상태인지 확인한다.

검사관은 다음을 본다.

- `SKILL.md`의 trigger와 description이 명확한가
- `skills/**/*.md`는 한국어 우선 문서인가. `SKILL.md`, `references/*.md`의 설명, 절차, 표 라벨은 한국어로 쓰고, 코드 식별자, 명령, 파일 경로, 제품명, 프로토콜명, 인용된 upstream skill 이름처럼 정확도가 필요한 용어만 원문 표기를 허용한다.
- `SKILL.md` 본문이 과하게 길지 않고, 세부 내용은 `references/`로 분리되어 있는가
- `skill.html`이 단순 카드형 요약이 아니라 decision matrix, workflow, chart, resource map, input/output schema 같은 시각 구조를 제공하는가
- `skill-to-html` 산출물은 첫 화면에서 텍스트 카드보다 interactive visual scene, animated diagram, mode switch, progressive disclosure가 먼저 보이는가
- `skill-to-html` 산출물은 `SKILL.md` Markdown의 heading/list/table/code/link 의미를 `skill IR`로 추출한 뒤 visual component에 매핑했는가
- `skill-to-html` 산출물은 Markdown `raw HTML`, event handler, `javascript:` link, 외부 script를 그대로 통과시키지 않는가
- `skill-to-html` 산출물은 4개 이상 계약 카드나 prose card를 좁은 side panel의 다열 grid로 만들지 않고, 전체 폭 matrix, wrap grid, 또는 읽기 폭이 있는 single-column control로 처리하는가
- `skill.html`의 화면 라벨이 한국어 우선인지 확인한다. `commit`, `push`, `repo`, `SKILL.md`, `GraphQL`, `TypeScript`, `Playwright`처럼 코드 맥락의 고유어는 허용하지만 `Decision Matrix`, `Workflow`, `Resource Map`, `Do Not` 같은 일반 UI 라벨은 한국어로 쓴다.
- `agents/openai.yaml`과 `project-snippets/`가 실제 스킬 목적과 맞는가
- `AGENTS.md`, `CLAUDE.md`, 또는 다른 에이전트 instruction 파일에서 연결 가능한 방식으로 문서화되어 있는가
- `docs/skill-lifecycle.md` 기준의 상태와 `history/skills.md`의 기록이 현재 스킬 상태와 맞는가
- 참조 파일, 스크립트, HTML 링크가 깨지지 않았는가
- validator와 스킬별 커스텀 검사가 통과하는가
- 스킬이 기본/global 동작보다 이 repo의 커스텀 기준을 우선하도록 연결되어 있는가
- 특정 에이전트 전용 표현이나 도구 의존성이 shared skill 본문에 과하게 섞여 있지 않은가

## 검사 절차

1. 대상 스킬의 `SKILL.md`를 읽고 trigger, workflow, failure mode를 확인한다.
2. `SKILL.md`가 직접 언급하는 `references/` 파일만 필요한 만큼 읽는다.
3. `skill.html`을 열어 한눈에 사용 판단이 가능한지 확인한다.
4. `project-snippets/`와 README의 설명이 현재 trigger와 일치하는지 확인한다.
5. `history/skills.md`에서 대상 스킬의 상태와 최근 큰 변경 기록이 맞는지 확인한다.
6. 기존 스킬을 수정하는 작업이면 `skills/skill-update/SKILL.md` 기준으로 package 전체가 맞춰졌는지 확인한다.
7. 문서끼리 최신화가 안 됐거나 서로 충돌하는 부분은 `skills/sync-docs/SKILL.md` 기준으로 대조한다.
8. repo 기본 TypeScript validator를 실행한다.
9. 스킬별 `scripts/validate-*` 파일이 있으면 같이 실행한다.
10. 공통 HTML validator로 `skill.html`의 portable self-contained HTML, desktop layout, visual structures, validation, misuse guardrails를 확인한다.
11. HTML은 가능하면 PC 데스크톱 viewport에서 열어 console error, overflow, text overlap, card readable width를 확인한다. `skill-to-html` 산출물은 mobile/tablet viewport를 검사하지 않아도 되지만 desktop click, focus, animation state는 확인한다.
12. 수정하기 전에 local-only `inspector/YYYY-MM-DD-<scope>.md` 파일을 만들고 findings, 근거 파일, 검증 명령, 해결 기준을 적는다.
13. 그 검사 문서를 기준으로 수정한다.
14. 이슈가 처리되면 해당 검사 파일은 삭제한다. 일부만 처리됐으면 해결된 항목을 제거하고 미해결 항목만 남긴다.

## 권장 검사 명령

```bash
node scripts/validate-skill.ts skills/<skill-name>
```

스킬별 커스텀 validator가 있으면 추가로 실행한다.

```bash
node skills/<skill-name>/scripts/validate-<skill-name>.ts skills/<skill-name>
```

repo 전체 lifecycle, history, portable path, 문서 정합성 기준도 확인한다.

```bash
node scripts/validate-skill-html.ts .
node scripts/validate-skill-repo.ts .
node scripts/run-agent-evals.ts
node skills/skill-to-html/scripts/validate-skill-to-html-render.ts skills/skill-to-html
```

Repo가 소유하는 validator는 `.ts`를 기본으로 한다. Node 22 이상에서 `node <file>.ts`로 직접 실행하는 것을 기준으로 하고, 새 validator를 `.py`로 추가하지 않는다. Codex hook처럼 다른 실행 환경과의 호환성이 중요한 파일은 예외적으로 `.mjs`를 유지할 수 있다.

`scripts/validate-skill-repo.ts`는 현재 스킬 목록이 README, AGENTS, `project-snippets/`, `history/skills.md`, 스킬별 validator 명령과 일치하는지도 검사한다. 스킬 이름을 바꾸거나 새 스킬을 추가했는데 문서 한 곳이 이전 이름을 가리키면 이 검증에서 실패해야 한다.

`scripts/run-agent-evals.ts`는 `evals/agent/cases/`의 대표 prompt 계약을 검사한다. 정적 validator가 파일 정합성을 보는 동안, 이 runner는 skill routing, safety boundary, output shape 같은 agent behavior regression을 빠르게 확인한다.

`scripts/validate-skill-html.ts`는 모든 `skills/*/skill.html`이 외부 asset이나 개인 로컬 경로 없이 열리고, PC 화면 기준 중앙 정렬, 배경 채움, diagram-rich section, `SKILL.md`/`skill.html` file pair, validation and misuse guardrails를 갖췄는지 검사한다. Inline JavaScript는 network call, external import, eval 없이 self-contained interaction controller일 때만 허용한다. `skill-to-html` 산출물은 Markdown 의미 구조를 `skill IR`과 visual component로 매핑하고, Markdown `raw HTML`이나 event handler를 통과시키지 않는지도 함께 본다. 넓은 scope table이 2열 layout 안에 들어가거나 SVG `marker-end` arrow가 보이는 node에 닿지 않는 경우도 실패로 처리한다. `skill-to-html` 자체 HTML은 `validate-skill-to-html-render.ts` Playwright 검사를 추가로 실행해 중복 section, hero arrow line, overflow, 읽기 폭, click state를 본다. HTML 렌더링 검사는 브라우저에서 `skill.html`을 PC 데스크톱 viewport로 직접 열거나, 프로젝트에서 쓰는 정적 서버가 있으면 그 서버로 확인한다.

## 판정 등급

- `A`: 바로 배포 가능. 구조, trigger, HTML, snippet, validator, 검증 문서가 모두 좋다.
- `B`: 사용 가능. 작은 중복, HTML 보강, 문서 연결 개선 같은 후속 작업이 있다.
- `C`: 일부 사용 가능. trigger 불명확, 참조 분리 부족, HTML 품질 부족, 검사 자동화 부족 중 하나 이상이 있다.
- `D`: 사용 보류. validator 실패, 깨진 링크, 잘못된 trigger, 심각한 유지보수 위험이 있다.

## 스킬 제작 에이전트 체크리스트

새 스킬을 만들거나 기존 스킬을 크게 바꾼 에이전트는 완료 전에 다음을 확인한다.

- `SKILL.md`는 500줄 이하를 목표로 하고, 핵심 trigger와 workflow만 둔다.
- `SKILL.md`와 `references/*.md`의 본문은 한국어로 작성한다. 영어 섹션 라벨을 그대로 남겨 `skill.html`과 대조하기 어렵게 만들지 않는다.
- 긴 취향, 예시, 평가 prompt, source rule은 `references/`로 분리한다.
- `skill.html`은 최소 4개 이상의 시각 구조를 포함한다.
- `skill-to-html` 산출물은 첫 viewport에 조작 가능한 visual scene, animated diagram, mode switch, 또는 evidence reveal을 둔다.
- `skill-to-html` 산출물은 `SKILL.md`를 source of truth로 유지하고 `skill IR`과 component mapping으로 화면을 만든다.
- `skill-to-html` 산출물은 좁은 side panel에 4개 이상 계약 카드를 다열 grid로 배치하지 않는다.
- `skill.html`은 외부 CDN, 외부 이미지, 외부 script, build tool에 의존하지 않는다. Self-contained inline JavaScript는 짧은 상호작용 구현에만 쓴다.
- `agents/openai.yaml`의 `display_name`, `short_description`, `default_prompt`가 현재 스킬과 맞다.
- `project-snippets/`의 문구가 실제 trigger와 맞다.
- Codex용 `AGENTS.md`뿐 아니라 Claude용 `CLAUDE.md`에도 연결 가능한 trigger와 경로가 문서화되어 있다.
- 수정 전에 `inspector/`에 검사 결과 문서를 작성했다.
- 큰 변경이면 `history/skills.md`에 event와 lifecycle state를 기록했다.
- validator, 공통 HTML validator, 커스텀 validator가 모두 통과한다.
- 미해결 검사 이슈가 있으면 local-only `inspector/` 파일에 남기고, 해결되면 삭제한다.
