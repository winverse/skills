---
name: project-workflow
description: "새 프로젝트나 큰 initiative의 초기 셋팅을 domain docs, product challenge, ADR, project structure, design.md, PRD, issue backlog, feature-workflow handoff까지 정리할 때 사용한다."
---

# project-workflow

이 스킬은 `workflow suite`의 초기 셋팅 orchestration이다. 프로젝트가 기능 개발을 받을 준비가 됐는지 만들고, raw idea를 바로 코드로 넘기지 않고, domain language, product reason, architecture boundary, design direction, PRD, issue backlog를 먼저 고정한다.

반복 구현은 이 스킬의 책임이 아니다. TDD, `writing-plans`, `subagent-driven-development`, 구현 review, QA, diagnose는 `feature-workflow`로 넘긴다. 이 스킬은 해당 정책과 handoff 조건만 남긴다.

## dependency contract 기준

Matt Pocock skills, GStack plugin, design-direction, repo-local custom helper에서 초기 셋팅에 필요한 primitive만 고른다. 전체 패키지를 전부 실행하지 않는다.

출력에는 각 primitive의 출처와 상태를 함께 표시한다.

```text
<source package>: <exact skill/plugin name> -> selected | skipped | fallback
```

## provenance ledger 기준

정확한 출처와 업데이트 규칙은 `references/upstream-dependency-map.md`를 먼저 본다. `grill-me`, `office-hours`, `to-prd`, `project-structure`, `design.md`처럼 외부 또는 custom에서 온 이름은 항상 출처 패키지와 함께 적는다.

- Matt Pocock skills: `setup-matt-pocock-skills`, `grill-me`, `grill-with-docs`, `to-prd`, `to-issues`, `triage`
- GStack plugin: `office-hours`, `plan-ceo-review`, `plan-design-review`
- user custom / design direction: `design.md` / design token setup, mock direction selection
- repo-local custom: `project-structure`, `sync-docs`, `agent-eval-harness`, Agent Tool And Security Risk Gate
- handoff target: `feature-workflow`가 `brainstorming`, `writing-plans`, `tdd`, `subagent-driven-development`, `review`, `qa`, `diagnose`, `document-sync`, `ship`을 맡는다.

upstream이 바뀌면 전체 내용을 복사하지 않는다. source package, exact name, adopted role, handoff condition, artifact path, validator/eval fixture, `skill.html`, project snippet, history만 갱신한다.

## 핵심 계약

- local project instructions와 docs를 먼저 읽는다.
- 사용자가 다른 언어를 명시하지 않으면 초기 셋팅 산출물과 프로젝트 문서는 한국어 우선으로 작성한다. `code identifiers`, 명령, 파일 경로, 제품명, API 이름은 원문 표기를 유지한다.
- domain language를 stack choice보다 먼저 고친다.
- product challenge와 가장 좁은 진입점을 확인한 뒤 scope를 줄인다.
- architecture decision은 PRD/issues 전에 ADR로 기록한다.
- TypeScript 프로젝트를 초기 셋팅하면 ESM only를 architecture constraint로 고정한다. `package.json`의 `type: "module"`, ESM `tsconfig`, `import`/`export`를 기본값으로 두고 `CommonJS`, `require`, `module.exports`, `.cjs`, `.cts`는 새 구조나 이슈에 넣지 않는다.
- 기존 코드가 CommonJS면 새 패턴으로 복사하지 말고 migration boundary, blocker, 또는 `project-structure` handoff 질문으로 남긴다.
- `project-structure`는 domain language와 concrete architecture questions가 생긴 뒤 호출한다.
- substantial UI는 구현 전 `design.md`와 2-3 mock direction 선택을 거친다.
- tool, MCP, external API, file write, network, untrusted content는 Agent Tool And Security Risk Gate를 기록한다.
- 여러 session, agent, worktree가 병렬로 구현할 수 있으면 `work-claims.md`에 lane ownership과 claimed write set을 먼저 나눈다.
- 이 repo에서 `/goal`이라고 쓰면 Claude Code의 `/goal` 기능을 뜻한다. Claude Code에서는 긴 초기 셋팅에 session-scoped goal condition을 제안하고, 다른 agent에서는 같은 내용을 completion checklist로 남긴다.

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
2. source-labeled primitive inventory
3. document language를 한국어 우선으로 고정하고, target project가 이미 다른 언어 규칙을 갖고 있으면 그 규칙을 명시
4. Matt Pocock skills `grill-me`/`grill-with-docs` 또는 fallback으로 domain language와 `CONTEXT.md` 정리
5. GStack plugin `office-hours` 또는 fallback으로 product challenge와 가장 좁은 진입점 확인
6. TypeScript를 쓰는 프로젝트면 ESM only와 CommonJS 금지를 architecture constraint로 기록
7. 필요한 경우 Agent Tool And Security Risk Gate 기록
8. repo-local custom `project-structure`, `design.md`, ADR을 필요한 경우에만 handoff
9. light spec과 PRD settings 확정
10. vertical issue backlog 작성
11. 병렬 작업이 가능하면 lane별 owner/session, branch or worktree, claimed write set, read-only paths, shared/hotspot files, integration owner를 `work-claims.md`에 기록
12. `feature-workflow`가 받을 준비 상태를 점검
13. document sync와 setup validation을 수행하고 다음 spec을 지정

## artifact map 기준

`.scratch/<project-or-feature-slug>/` 아래에 notes, `CONTEXT.md` draft, ADR, PRD, issues, design decisions, setup validation, workflow log를 둔다. 프로젝트가 이미 다른 workflow area를 갖고 있으면 그 위치를 따른다.

초기 셋팅 산출물은 사용자가 다른 언어를 지정하지 않는 한 한국어 우선이다. 여기에는 `CONTEXT.md`, ADR, PRD, issue backlog, `design.md`, setup validation, `workflow-state.md`, `work-claims.md`가 포함된다. 코드 식별자, 명령, 경로, 제품명, 외부 API 이름은 원문을 유지한다.

`workflow-state.md`를 같은 위치에 두고, 이후 `feature-workflow`가 반복 질문 없이 이어받을 수 있는 최소 상태를 남긴다.

- selected primitives와 skipped/fallback 이유
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
- <source package>: <exact name> -> selected | skipped | fallback

Project setup state
- <domain/product/architecture/design/PRD/issues readiness>
- document language: Korean-first unless target project says otherwise
- TypeScript module policy: ESM only / CommonJS blocked or not applicable
- state cache: <workflow-state.md path>
- work claims: <work-claims.md path or none>

Next workflow step
- project-workflow: <remaining setup gate>
- or feature-workflow: <spec/issue path and acceptance criteria>
```
