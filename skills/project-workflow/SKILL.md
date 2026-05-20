---
name: project-workflow
description: "새 프로젝트나 큰 initiative의 초기 셋팅을 domain docs, product challenge, ADR, project structure, design.md, PRD, issue backlog, feature-workflow handoff까지 정리할 때 사용한다."
---

# project-workflow

이 top-level skill은 `project-workflow` plugin으로 이동한 compatibility entry다. Canonical plugin source는 `plugins/project-workflow/skills/project-workflow/SKILL.md`다. 기존 프로젝트가 `skills/project-workflow/SKILL.md`를 직접 링크할 수 있으므로 같은 실행 계약을 유지한다.

이 스킬은 `workflow suite`의 초기 셋팅 orchestration이다. 프로젝트가 기능 개발을 받을 준비가 됐는지 만들고, raw idea를 바로 코드로 넘기지 않고, domain language, product reason, architecture boundary, design direction, PRD, issue backlog를 먼저 고정한다.

반복 구현은 이 스킬의 책임이 아니다. TDD, `writing-plans`, `subagent-driven-development`, 구현 review, QA, diagnose는 `feature-workflow`로 넘긴다. 이 스킬은 해당 정책과 handoff 조건만 남긴다.

## dependency invocation contract 기준

Matt Pocock skills, GStack plugin, Superpowers plugin, design-direction, repo-local custom helper에서 초기 셋팅에 필요한 primitive만 고른다. 전체 패키지를 전부 실행하지 않는다.

선택된 primitive는 현재 agent/runtime에서 실제 호출할 수 있으면 먼저 호출한다. 단순히 이름만 라벨링하고 같은 동작을 흉내 내지 않는다. 호출할 수 없으면 `fallback`으로 표시하고, 원본 primitive의 목적을 좁게 복제한 질문 루프를 실행한다.

출력에는 각 primitive의 출처와 상태, 실행 시점을 함께 표시한다.

```text
<source package>: <exact skill/plugin name> -> selected | invoked | skipped | fallback | deferred
```

상태 기준은 아래와 같다.

- `selected`: 이 setup에 필요하다고 판단했지만 아직 호출 전이다.
- `invoked`: 해당 skill/plugin/command를 실제로 호출했거나, 현재 runtime의 명시적 skill invocation surface로 넘겼다.
- `skipped`: 이 setup에는 필요하지 않다.
- `fallback`: 현재 session에 해당 원본 skill/plugin이 없거나 호출 surface가 없어 local interview 질문으로 대체했다.
- `deferred`: 필요하지만 domain/product/design/tool gate 답변 뒤에 실행해야 하므로 지금은 보류한다.

## provenance ledger 기준

정확한 출처와 업데이트 규칙은 `references/upstream-dependency-map.md`를 먼저 본다. `grill-with-docs`, `office-hours`, `to-prd`, `project-structure`, `design.md`처럼 외부 또는 custom에서 온 이름은 항상 출처 패키지와 함께 적는다.

- Matt Pocock skills: `setup-matt-pocock-skills`, `grill-with-docs`, `to-prd`, `to-issues`, `triage`. `grill-me`는 출처 장부에는 남기지만, project setup 기본 질문 gate에서는 `grill-with-docs`가 대체한다.
- GStack plugin: `office-hours`, `plan-ceo-review`, `plan-design-review`
- Superpowers plugin: `brainstorming`은 raw idea 첫 응답에서 `office-hours` 뒤 setup gap check로 처리하고, `writing-plans`는 큰 phase/step handoff plan의 빈틈 보강에만 쓴다. `tdd`, `subagent-driven-development` 같은 구현 primitive는 `feature-workflow`로 넘긴다.
- user custom / design direction: `design.md` / design token setup, mock direction selection
- repo-local custom: `project-structure`, `sync-docs`, `agent-eval-harness`, Agent Tool And Security Risk Gate
- handoff target: `feature-workflow`가 `brainstorming`, `writing-plans`, `tdd`, `subagent-driven-development`, `review`, `qa`, `diagnose`, `document-sync`, `ship`을 맡는다.

upstream이 바뀌면 전체 내용을 복사하지 않는다. source package, exact name, adopted role, handoff condition, artifact path, validator/eval fixture, `skill.html`, project snippet, history만 갱신한다.

## 핵심 계약

- local project instructions와 docs를 먼저 읽는다.
- 현재 runtime에서 Matt Pocock, GStack, Superpowers 호출 surface를 확인하고, 선택된 primitive는 가능하면 실제 호출한다. 호출 surface가 없으면 그 사실을 `fallback`으로 남긴다. 호출 surface 확인은 현재 session의 skill list, enabled plugin list, slash command 또는 command surface, MCP/tool surface, project instruction 링크 순서로 증거를 남긴다.
- 사용자가 다른 언어를 명시하지 않으면 초기 셋팅 산출물과 프로젝트 문서는 한국어 우선으로 작성한다. `code identifiers`, 명령, 파일 경로, 제품명, API 이름은 원문 표기를 유지한다.
- domain language를 stack choice보다 먼저 고친다.
- product challenge와 가장 좁은 진입점을 확인한 뒤 scope를 줄인다.
- raw idea나 새 프로젝트에서는 Matt Pocock skills `grill-with-docs` -> GStack plugin `office-hours` -> Superpowers plugin `brainstorming` setup gap check 순서가 끝나기 전 `design.md`, `project-structure`, PRD, issue backlog, architecture handoff를 진행하지 않는다. `grill-with-docs`는 기존 `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`, 코드와 문서의 용어를 먼저 확인하고, 문서가 없으면 첫 용어가 확정될 때 `CONTEXT.md`를 lazily 제안한다. 사용자가 “추정해서 진행”이라고 명시한 경우에만 fallback으로 진행한다.
- architecture decision은 PRD/issues 전에 ADR로 기록한다.
- TypeScript 프로젝트를 초기 셋팅하면 ESM only를 architecture constraint로 고정한다. `package.json`의 `type: "module"`, ESM `tsconfig`, `import`/`export`를 기본값으로 두고 `CommonJS`, `require`, `module.exports`, `.cjs`, `.cts`는 새 구조나 이슈에 넣지 않는다.
- 기존 코드가 CommonJS면 새 패턴으로 복사하지 말고 migration boundary, blocker, 또는 `project-structure` handoff 질문으로 남긴다.
- `project-structure`는 domain language와 concrete architecture questions가 생긴 뒤 호출한다.
- substantial UI는 구현 전 `design.md`와 2-3 mock direction 선택을 거친다.
- 구현 handoff가 여러 단계로 쪼개지면 `phase/step handoff gate`를 만들고, 각 step은 이후 `feature-workflow` 실행 session이 이어받을 수 있도록 read files, claimed write set, acceptance command, blocked condition, summary field를 포함한다.
- `harness_framework`의 `execute.py` 아이디어는 Python 실행 엔진이 아니라 TypeScript 기반 선택 도구와 phase/step handoff 규칙으로만 채택한다. Claude 전용 flag를 쓰지 않고 Codex와 Claude 모두 받을 수 있는 agent-neutral command boundary를 둔다. 선택 runner는 `project-workflow` 산출물을 실행하는 기본 경로가 아니라, 사용자가 명시했을 때 `feature-workflow` step 실행을 돕는 adapter다.
- tool, MCP, external API, file write, network, untrusted content는 Agent Tool And Security Risk Gate를 기록한다.
- 여러 session, agent, worktree가 병렬로 구현할 수 있으면 `work-claims.md`에 lane ownership과 claimed write set을 먼저 나눈다.
- 이 repo에서 `/goal`이라고 쓰면 Claude Code의 `/goal` 기능을 뜻한다. Claude Code에서는 긴 초기 셋팅에 session-scoped goal condition을 제안하고, 다른 agent에서는 같은 내용을 completion checklist로 남긴다.

## 첫 응답 기준

Raw idea나 새 서비스 요청의 첫 응답은 프로젝트를 바로 만들지 않는다. 먼저 아래를 출력하고 질문 답변을 기다린다.

- active instruction surface와 canonical skill path
- primitive inventory: `selected`, `invoked`, `skipped`, `fallback`, `deferred`와 reason/timing
- project setup state: 현재 authority, readiness, proposed artifact path를 구분
- `grill-with-docs` fallback domain docs interview 질문
- `office-hours` fallback product challenge 질문
- Superpowers plugin `brainstorming` fallback setup gap check 질문. 이 질문은 `design.md`, `project-structure`, PRD, issue backlog보다 먼저 나온다.
- substantial UI면 `design.md`와 2-3 mock direction은 `deferred`로 표시하고, domain/product 답변 뒤 요청한다고 밝힘
- `project-structure`, PRD, issue backlog, implementation은 질문 gate 전에는 `deferred` 또는 `skipped for now`로 표시

파일을 실제로 쓰지 않는 시뮬레이션, 검토, 첫 질문 응답에서는 `workflow-state.md`, `work-claims.md`, `phases/index.json`, `CONTEXT.md`, ADR, PRD, `design.md`를 생성한 것처럼 말하지 않는다. 경로는 `target path`, `proposed path`, `not created yet`으로 표시한다.

## mode router 기준

| 요청 | lane |
| --- | --- |
| raw idea, 새 서비스, 새 앱 | discovery -> domain -> product challenge |
| project structure | domain/architecture 질문 후 `project-structure` handoff |
| TypeScript module policy | ESM only constraint -> `project-structure` handoff |
| design system, UI 방향 | `design.md` baseline -> 2-3 mock direction |
| PRD/issues | CONTEXT/ADR 확인 후 PRD -> vertical issue backlog |
| Docker/AWS/Pulumi 새 서비스 | service boundary와 security gate 후 infra-aware structure |
| cross-agent setup | target instruction surface와 snippet link 검증 |
| spec 구현 시작 | `feature-workflow` handoff |

## default flow 기준

1. context 읽기
2. runtime invocation surface 확인: repo-local skill, enabled plugin, command slash, MCP/tool, agent-specific workflow surface
3. document language를 한국어 우선으로 고정하고, target project가 이미 다른 언어 규칙을 갖고 있으면 그 규칙을 명시
4. source-labeled primitive inventory를 만들고 각 항목을 `selected`, `invoked`, `skipped`, `fallback`, `deferred`로 추적
5. Matt Pocock skills `grill-with-docs`를 호출하거나 fallback 질문으로 domain language, `CONTEXT.md`, `CONTEXT-MAP.md`, ADR 후보를 정리
6. GStack plugin `office-hours`를 호출하거나 fallback 질문으로 product challenge와 가장 좁은 진입점 확인
7. Superpowers plugin `brainstorming`을 호출하거나 fallback setup gap check 질문으로 빠진 가정, 너무 넓은 slice, 인계 위험만 보강하고, 구현 primitive는 선택하지 않음
8. TypeScript를 쓰는 프로젝트면 ESM only와 CommonJS 금지를 architecture constraint로 기록
9. 필요한 경우 Agent Tool And Security Risk Gate 기록
10. repo-local custom `project-structure`, `design.md`, ADR을 필요한 경우에만 handoff
11. light spec과 PRD settings 확정
12. vertical issue backlog 작성
13. 병렬 작업이 가능하면 lane별 owner/session, branch or worktree, claimed write set, read-only paths, shared/hotspot files, integration owner를 `work-claims.md`에 기록
14. 구현 handoff가 크면 `.scratch/<slug>/phases/index.json`과 `step<N>.md` 초안을 만들거나 동등한 phase/step handoff plan을 남김
15. `feature-workflow`가 받을 준비 상태를 점검
16. document sync와 setup validation을 수행하고 다음 spec을 지정

## interview gate 기준

원본 `grill-with-docs`/`office-hours`/Superpowers `brainstorming` setup gap check를 호출했거나 fallback 질문을 끝내기 전에는 setup 산출물을 확정하지 않는다. 최소 질문은 아래와 같다.

- domain docs: 기존 `CONTEXT.md`나 `CONTEXT-MAP.md`가 있는지, 없으면 어떤 root `CONTEXT.md`를 첫 용어 확정 뒤 만들지
- domain language: 사용자가 부르는 핵심 객체, 사용자가 피하고 싶은 오해, 기존 코드/문서 용어와 새 용어의 경계
- ADR candidate: 되돌리기 어렵고, 맥락 없이는 의외이며, 실제 trade-off가 있는 결정인지
- product: 이 프로젝트가 해결하는 고통, 첫 번째 사용자, 지금 당장 쓸 수 있는 가장 좁은 성공 장면
- setup gap: 첫 slice가 너무 넓은지, 빠진 가정이 있는지, 병렬/인계 위험이 있는지, 지금 디자인/구조로 넘어갈 조건이 충분한지
- scope: 이번 setup에 포함할 것, 제외할 것, 나중으로 미룰 것
- confidence: 확정된 답, 추정한 답, 반드시 다시 물어야 할 답

답이 없으면 `workflow-state.md`의 open questions에 남기고, PRD/issues에는 추정이라고 표시한다.

## artifact map 기준

`.scratch/<project-or-feature-slug>/` 아래에 notes, `CONTEXT.md` draft, ADR, PRD, issues, design decisions, setup validation, workflow log를 둔다. 프로젝트가 이미 다른 workflow area를 갖고 있으면 그 위치를 따른다.

초기 셋팅 산출물은 사용자가 다른 언어를 지정하지 않는 한 한국어 우선이다. 여기에는 `CONTEXT.md`, ADR, PRD, issue backlog, `design.md`, setup validation, `workflow-state.md`, `work-claims.md`가 포함된다. 코드 식별자, 명령, 경로, 제품명, 외부 API 이름은 원문을 유지한다.

`workflow-state.md`를 같은 위치에 두고, 이후 `feature-workflow`가 반복 질문 없이 이어받을 수 있는 최소 상태를 남긴다.

- selected primitives와 skipped/fallback 이유
- invoked primitives와 실제 호출하지 못한 이유
- domain/product/architecture/design authority 경로
- 미해결 질문과 사용자가 이미 답한 질문
- Agent Tool And Security Risk Gate decision
- 다음 `feature-workflow` handoff target

병렬 구현을 계획하면 같은 위치에 `work-claims.md`를 둔다. 이 파일은 authority가 아니라 coordination artifact다. 각 lane은 아래 정보를 가진다.

- lane id와 owner/session
- branch or worktree
- spec/issue target
- claimed write set과 read-only paths
- shared/hotspot files와 integration owner
- status: `planned`, `active`, `blocked`, `ready-for-integration`, `done`
- validation command와 evidence path

큰 구현 handoff를 준비하면 `.scratch/<slug>/phases/` 또는 target project의 동등한 workflow area에 phase/step handoff plan을 둔다. `project-workflow`는 이 plan을 만들 수 있지만, 기본적으로 구현 runner를 실행하지 않는다. 실제 production edit은 `feature-workflow`의 work-claim preflight, TDD/characterization, QA/runtime evidence 규칙을 따른다.

- `index.json`: project, phase, steps, status를 담는다.
- `step<N>.md`: read files, 작업 범위, claimed write set, acceptance commands, blocked conditions, 금지사항을 담는다.
- status vocabulary: `pending`, `completed`, `error`, `blocked`.
- optional TypeScript runner: `plugins/project-workflow/scripts/execute-phase.ts`.
- runner boundary: dry-run이 기본이고, 실제 실행은 사용자가 `--agent-bin`과 필요한 `--agent-arg`를 명시했을 때만 한다. 실행 prompt는 `feature-workflow` step 실행 adapter로 다룬다.
- agent adapter: Claude와 Codex 모두 가능해야 하며, 특정 제품 전용 권한 우회 flag를 hard-code하지 않는다.

## feature-workflow handoff 기준

`feature-workflow`로 넘기기 전에 아래가 있어야 한다.

- domain term과 boundary가 `CONTEXT.md`, ADR, 또는 equivalent docs에 남아 있다.
- PRD 또는 issue가 problem, user, first usable slice, included/excluded scope, acceptance criteria를 갖는다.
- UI 작업이면 `design.md` 또는 selected mock direction이 있다.
- TypeScript 작업이면 ESM only, `type: "module"`, `import`/`export`, CommonJS 금지 constraint가 `CONTEXT.md`, ADR, PRD, issue, 또는 `workflow-state.md` 중 하나에 남아 있다.
- tool/API/MCP 작업이면 Agent Tool And Security Risk Gate decision이 있다.
- 구현 단위가 vertical slice 또는 명시적 enabling task로 나뉘어 있다.
- `.scratch/<slug>/workflow-state.md` 또는 동등한 state cache에 위 authority와 open questions가 남아 있다.
- 병렬 구현이면 `.scratch/<slug>/work-claims.md` 또는 동등한 coordination artifact에 겹치지 않는 claimed write set과 shared/hotspot file의 integration owner가 남아 있다.
- 큰 구현이면 `.scratch/<slug>/phases/index.json` 또는 동등한 phase/step handoff plan에 각 step의 read files, claimed write set, acceptance command, blocked condition, summary field가 남아 있다.

## goal condition 기준

긴 초기 셋팅, cross-agent setup, 대규모 project bootstrap에는 Claude Code 기준 `/goal` 또는 동등한 completion checklist를 만든다.

- measurable end state: `CONTEXT.md`, ADR, PRD, issue backlog, design.md, setup validation처럼 판단 가능한 산출물
- stated check: agent가 transcript에 남길 명령, 파일, evidence
- constraints: 건드리면 안 되는 파일, scope, secret, destructive action 금지
- turn/time bound: `8 turns 후 중단`처럼 runaway를 막는 한계

`/goal` evaluator는 스스로 명령을 실행하거나 파일을 읽지 않는다고 가정한다. 따라서 검증 증거를 agent output에 남기게 해야 한다.

## output shape 기준

```text
Runtime adapter
- <active instruction surface>

Primitive inventory
- <source package>: <exact name> -> selected | invoked | skipped | fallback | deferred

Project setup state
- <domain/product/architecture/design/PRD/issues readiness>
- document language: Korean-first unless target project says otherwise
- TypeScript module policy: ESM only / CommonJS blocked or not applicable
- state cache: <workflow-state.md path>
- work claims: <work-claims.md path or none>
- phase handoff: <phases/index.json path or none>

Next workflow step
- project-workflow: <remaining setup gate>
- or feature-workflow: <spec/issue path and acceptance criteria>
```
