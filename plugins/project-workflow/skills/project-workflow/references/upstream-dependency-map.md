# project-workflow upstream dependency map 기준

## 목적

이 파일은 `project-workflow`가 참고하는 초기 셋팅 primitive의 사용 장부다. source URL, checked date, upstream version/commit, local 채택 판단은 단일 진실원인 `docs/update-source-registry.md`에서만 관리한다. `project-workflow`는 Matt Pocock skills, GStack plugin, user custom design-direction, repo-local custom helper를 통째로 복제하지 않고, 프로젝트 시작에 필요한 최소 primitive만 채택한다.

외부에서 온 이름은 항상 `출처 패키지`와 `정확한 skill/plugin 이름`을 함께 적는다. 예: `Matt Pocock skills / grill-with-docs`, `GStack plugin / office-hours`, `repo-local custom / project-structure`.

## 채택 원칙

| 원칙 | 기준 |
| --- | --- |
| 초기 셋팅 전용 | 프로젝트 언어, 제품 이유, 구조, 디자인, PRD, issue backlog까지만 맡는다. |
| 구현 loop 분리 | TDD, `writing-plans`, `subagent-driven-development`, QA, diagnose는 `feature-workflow`로 넘긴다. |
| 출처 라벨 필수 | 외부 primitive는 source package와 exact name을 함께 기록한다. |
| 실제 호출 우선 | 선택된 primitive는 현재 runtime에서 가능하면 실제 skill/plugin/command로 호출한다. |
| fallback 명시 | 호출 surface가 없으면 `fallback`으로 표시하고 최소 질문 루프만 수행한다. |
| handoff만 복제 | 원본 prompt 전문을 가져오지 않고 trigger, handoff, artifact, validator boundary만 반영한다. |
| 업데이트 추적 | upstream 이름, source URL, checked date가 바뀌면 `docs/update-source-registry.md`를 먼저 갱신하고, 이 파일은 실행 순서와 handoff만 갱신한다. |

## 사용 장부

| source id | 출처 패키지 | 정확한 skill/plugin 이름 | 채택 역할 | 로컬 산출물과 handoff | 기본 상태 |
| --- | --- | --- | --- | --- | --- |
| `matt-pocock.setup-matt-pocock-skills` | Matt Pocock skills | `setup-matt-pocock-skills` | project skill setup, issue tracker, domain docs 준비 | project instruction links, issue tracker notes | 선택 |
| `matt-pocock.grill-with-docs` | Matt Pocock skills | `grill-with-docs` | 프로젝트 셋팅의 기본 domain docs interview | 가능하면 실제 호출, 아니면 fallback docs-aware interview, `CONTEXT.md`, `CONTEXT-MAP.md`, ADR 후보, current docs gap list | 핵심 |
| `matt-pocock.grill-me` | Matt Pocock skills | `grill-me` | 일반 계획이나 비코드 설계의 standalone pressure interview | project setup에서는 기본 선택하지 않고, docs/code/domain doc 흐름이 전혀 맞지 않는 비코드 요청이면 fallback 후보로만 기록 | 보조 |
| `matt-pocock.to-prd` | Matt Pocock skills | `to-prd` | product challenge 이후 PRD 작성 | 가능하면 실제 호출, 아니면 local PRD skeleton, `.scratch/<slug>/PRD.md` | 조건부 |
| `matt-pocock.to-issues` | Matt Pocock skills | `to-issues` | PRD를 vertical issue backlog로 분할 | 가능하면 실제 호출, 아니면 local issue split, `.scratch/<slug>/issues/` | 조건부 |
| `matt-pocock.triage` | Matt Pocock skills | `triage` | issue ready/block/split 판단 | 가능하면 실제 호출, 아니면 local triage note, issue state notes | 조건부 |
| `gstack.office-hours` | GStack plugin | `office-hours` | 제품 가치, 수요, 가장 좁은 진입점 검증 | 가능하면 실제 호출, 아니면 fallback product challenge, PRD input | 핵심 |
| `gstack.plan-ceo-review` | GStack plugin | `plan-ceo-review` | scope, premise, product decision review | 가능하면 실제 호출, 아니면 local CEO/spec review notes | 조건부 |
| `gstack.plan-design-review` | GStack plugin | `plan-design-review` | UI/UX scope의 design review | 가능하면 실제 호출, 아니면 local mock direction review, `design.md` gap | UI 조건부 |
| `superpowers.brainstorming` | Superpowers plugin | `brainstorming` | raw idea 첫 응답의 setup gap check | `office-hours` 뒤 가능하면 실제 호출, 아니면 fallback setup gap 질문, 구현 scope는 `feature-workflow`로 넘김 | 핵심 |
| `superpowers.writing-plans` | Superpowers plugin | `writing-plans` | 큰 phase/step handoff plan gap 보강 | 가능하면 실제 호출, production plan execution은 `feature-workflow`로 넘김 | 조건부 |
| - | user custom / design direction | `design.md` / design token setup | AI-slop 방지, visual system 고정 | `design.md`, tokens, mock directions | UI 핵심 |
| - | repo-local custom | `project-structure` | folder/env/codegen/db/infra boundary | ADR, folder tree, app boundary | 구조 필요 시 |
| - | repo-local custom | `sync-docs` | setup docs/snippet/history drift 방지 | setup docs sync report | 완료 시 |
| - | repo-local custom | `agent-eval-harness` | project workflow routing regression guard | eval case + fixture | behavior 변경 시 |
| - | repo-local custom | Agent Tool And Security Risk Gate | tool/MCP/API/file-write/network 위험 평가 | `approved`, `dev-only`, `needs-info`, `blocked` decision | tool 작업 전 |
| - | repo-local custom | `workflow-state.md` cache | setup 결과와 skipped/open question 색인 | `.scratch/<slug>/workflow-state.md` | handoff 전 |
| `observed.harness-framework.execute-phase` | observed workflow | `harness_framework execute.py` / `test_execute.py` | phase/step 상태, 자기완결 handoff 구조, 리팩터링 안전망 테스트 의도 | TypeScript 선택 runner, `.scratch/<slug>/phases/index.json`, `step<N>.md`, `validate-execute-phase.ts` | 조건부 |
| - | handoff target | `feature-workflow` | feature/issue 단위 반복 구현 | feature handoff block | setup 완료 후 |

## 업데이트 규칙

source id와 출처 확인 장부는 `docs/update-source-registry.md`가 단일 source registry다. 이 파일에는 source URL, checked date, upstream version/commit을 복사하지 않는다.

현재 usage map 기준으로 project setup에서는 `grill-me`를 기본 gate로 쓰지 않고 `grill-with-docs`를 기본 gate로 쓴다. `harness_framework`의 `execute.py` 아이디어는 source registry에서 `observed.harness-framework.execute-phase`로 추적하고, 여기서는 TypeScript 선택 runner handoff만 다룬다.

upstream source가 바뀌면 아래 순서로 추적한다.

1. `docs/update-source-registry.md`에서 source id, 출처 패키지, 정확한 skill/plugin 이름을 확인한다.
   - 이름, 경로, plugin slug, command name, checked source가 바뀌었으면 registry를 먼저 갱신하고 이 파일은 usage map만 갱신한다.
   - 근거가 YouTube/블로그 같은 2차 설명이면 `사용자 custom` 또는 `observed workflow`로 표시하고 official source처럼 취급하지 않는다.
2. 이 primitive가 project setup에 속하는지 다시 판단한다.
   - domain, product, architecture, design baseline, PRD, issue backlog라면 유지한다.
   - TDD, 구현 plan, subagent 실행, QA라면 `feature-workflow`로 옮긴다.
3. 갱신 범위를 제한한다.
   - 수정 대상: `SKILL.md`, 이 reference, `project-snippets/project-workflow.md`, `project-snippets/base.md`, `project-snippets/claude-base.md`, `AGENTS.md`, `README.md`, `docs/skill-catalog.md`, `skill.html`, eval fixture/case, `history/skills.md`
   - 수정하지 않을 것: upstream skill 전문 복사, global install 정책, 사용자가 요청하지 않은 구현 loop 편입
4. eval을 추가하거나 갱신한다.
   - 새 primitive가 routing에 영향을 주면 `evals/agent/cases/project-workflow-orchestration.json`에 deterministic check를 둔다.
   - saved output fixture에는 `source package`, `exact skill/plugin name`, `selected/skipped/fallback/deferred`가 보여야 한다.
5. 검증한다.
   - `node scripts/validate-skill.ts plugins/project-workflow/skills/project-workflow`
   - `node plugins/project-workflow/scripts/validate-project-workflow.ts plugins/project-workflow/skills/project-workflow`
   - `node scripts/validate-korean-markdown.ts .`
   - `node scripts/validate-skill-html.ts .`
   - `node scripts/run-agent-evals.ts`
   - `node scripts/validate-skill-repo.ts .`

## 선택 budget 기준

| 작업 규모 | 선택할 primitive | 호출 방식 | 건너뛰는 것 |
| --- | --- | --- | --- |
| tiny project setup | `grill-with-docs`, short ADR, issue seed | invoke if available, fallback docs-aware questions if not | full PRD, infra tree, implementation loop |
| new product | `grill-with-docs`, `office-hours`, PRD, vertical issue backlog | invoke `grill-with-docs`/`office-hours` before PRD | TDD and code changes |
| existing cleanup | `grill-with-docs`, boundary audit, ADR, staged issues | invoke docs-aware interview if available | full product discovery unless behavior changes |
| substantial UI | `design.md`, mock directions, `plan-design-review`, optional `brainstorming` | invoke review/brainstorming if available | UI coding before direction selection |
| infra-aware service | tool/security gate, `project-structure`, ADR | invoke setup primitives before structure | cloud writes or deploy without explicit request |
| ready for implementation | `feature-workflow` handoff | do not invoke implementation primitives here | local implementation inside project-workflow |

## 중복 경계 보호 규칙

`project-workflow`는 setup orchestration을 맡고, repeated implementation은 `feature-workflow`, folder structure는 `project-structure`, docs drift는 `sync-docs`, eval은 `agent-eval-harness`가 맡는다.

맞춤 확장은 외부 출처와 섞어 쓰지 않는다. 예를 들어 `project-structure`와 `design.md`는 Matt Pocock/GStack에서 온 primitive가 아니라 repo-local 또는 user custom handoff다.
