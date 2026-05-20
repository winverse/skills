# project-workflow playbook 기준

## core idea 기준

`project-workflow`는 `workflow suite`의 setup gate다. 프로젝트 초기에 잘못된 방향으로 빨리 가는 것을 막고, 반복 구현이 가능한 기준을 만든다. 이 문서는 구현 loop가 아니라 setup gate다.

## read order 기준

1. root instruction
2. folder-local instruction
3. README와 기존 domain docs
4. ADR, PRD, issue tracker가 이미 있으면 먼저 확인
5. 디자인 기준, env, API, DB, deployment docs

## dependency invocation 기준

dependency inventory는 전체 skill family를 켜는 목록이 아니라 초기 셋팅에 채택한 primitive 호출 장부다. 각 항목은 `Matt Pocock skills: grill-me -> invoked`, `GStack plugin: office-hours -> fallback`, `repo-local custom: project-structure -> skipped`처럼 source package, exact skill/plugin name, selected/invoked/skipped/fallback 상태를 함께 쓴다.

선택된 upstream primitive는 가능한 경우 실제 skill/plugin 호출로 넘긴다. 현재 runtime에 호출 surface가 없으면 조용히 흉내 내지 않고 `fallback`으로 표시한 뒤, 아래 fallback interview gate만 수행한다.

```text
Primitive Invocation
- source package:
- exact name:
- status: selected | invoked | skipped | fallback
- invocation surface: repo-local skill | plugin command | slash command | MCP/tool | agent workflow | unavailable
- fallback reason:
- output artifact:
```

upstream이 바뀌면 전체 내용을 복사하지 않는다. `upstream-dependency-map.md`에서 source package, exact name, 채택 역할, handoff 조건, artifact path, validator/eval 경계를 갱신하고, 같은 변경을 `SKILL.md`, `skill.html`, project snippet, history에 반영한다.

## document language 기준

초기 셋팅 산출물과 프로젝트 문서는 사용자가 다른 언어를 지정하지 않는 한 한국어 우선으로 작성한다. 대상 프로젝트에 이미 영어 PRD, 영문 ADR, 다국어 issue template 같은 명시 규칙이 있으면 그 규칙을 따르고 `workflow-state.md`에 이유를 남긴다.

한국어 우선 대상은 `CONTEXT.md`, ADR, PRD, issue backlog, `design.md`, setup validation, workflow log, `workflow-state.md`, `work-claims.md`다. `code identifiers`, 명령, 파일 경로, 제품명, protocol, API 이름, upstream skill/plugin 이름은 원문 표기를 유지한다.

## scenario lanes 기준

### raw new SaaS/service 기준

domain language, target user, first usable slice, product challenge, ADR, PRD 순서로 간다. 먼저 Matt Pocock skills `grill-me` 또는 `grill-with-docs`를 실제 호출하고, 이어서 GStack plugin `office-hours`를 실제 호출한다. 호출 surface가 없으면 fallback 질문으로 domain/product interview를 끝낸 뒤 다음 단계로 간다. Docker/AWS/Pulumi가 필요한 새 서비스는 service boundary와 secret boundary를 먼저 확인한 뒤 `project-structure`로 넘긴다.

### existing backend/API cleanup 기준

현재 architecture와 behavior를 보존할 evidence를 먼저 정하고, 구조 정리 목표를 ADR 또는 architecture note로 남긴다. 동작이 바뀌지 않는 cleanup이면 full PRD를 강제하지 않는다.

### substantial UI 기준

`design.md` 또는 design token 기준을 만든 뒤 2-3 mock direction을 제시하고 사용자가 선택한다. 선택 전 대규모 UI coding을 하지 않는다. 실제 구현 loop는 `feature-workflow`가 맡는다.

Superpowers plugin `brainstorming`이나 `writing-plans`가 현재 runtime에서 가능하면 setup 질문, scope gap, plan gap을 보강하는 데만 호출한다. 구현 계획 실행, TDD, subagent-driven implementation은 `feature-workflow`로 넘긴다.

### CLI/no-browser 프로젝트 기준

browser evidence를 요구하지 않는다. setup 단계에서는 command/API boundary, fixture path, runtime evidence 방식만 정한다.

### TypeScript module policy 기준

TypeScript를 쓰는 프로젝트를 초기 셋팅하면 ESM only를 기본 architecture constraint로 기록한다. `package.json`에는 `type: "module"`을 두고, `tsconfig`는 ESM import/export와 NodeNext 또는 Bundler 계열 module resolution을 전제로 정리한다.

새 파일, scaffolding, PRD, issue backlog, ADR에는 `CommonJS`, `require`, `module.exports`, `.cjs`, `.cts`를 새 기본 패턴으로 넣지 않는다. 기존 repo가 CommonJS를 이미 쓰고 있으면 새 작업에서 복사할 패턴이 아니라 migration boundary로 표시한다.

`project-workflow`가 직접 구조를 생성하지 않고 `project-structure`로 넘길 때도 handoff에 아래를 포함한다.

```text
TypeScript Module Policy
- module system: ESM only
- package boundary: package.json type: "module"
- allowed imports: import/export
- blocked patterns: CommonJS, require, module.exports, .cjs, .cts
- migration boundary: <existing CommonJS path or none>
```

### MCP/API/file-write automation 기준

Agent Tool And Security Risk Gate를 작성한다. 권한, destructive action, secret, untrusted content를 분리한다.

### cross-agent setup 기준

Codex, Claude Code, Cursor, Windsurf, Copilot 같은 agent별 instruction surface를 먼저 확인한다. repo skill을 global install하지 않고 project instruction에 필요한 snippet만 연결한다.

### parallel multi-session setup 기준

여러 agent, 여러 session, 여러 worktree가 같은 프로젝트에서 병렬 구현을 할 수 있으면 setup 단계에서 lane을 먼저 나눈다. 목표는 모든 파일을 lock하는 것이 아니라, 쓰기 책임을 명확히 해서 같은 파일을 두 session이 동시에 patch하지 않게 하는 것이다.

`project-workflow`는 `.scratch/<slug>/work-claims.md`를 생성하거나 갱신한다. 이 파일은 coordination artifact이며 authority가 아니다. authority는 `CONTEXT.md`, ADR, PRD, issue, `design.md`에 둔다.

```text
Work Claims
- coordination file: .scratch/<slug>/work-claims.md
- owner policy: one active owner per claimed write path
- read policy: read is allowed, write requires claim

Lane
- lane id:
- owner/session:
- branch or worktree:
- spec/issue:
- claimed write set:
- read-only paths:
- shared/hotspot files:
- integration owner:
- status: planned | active | blocked | ready-for-integration | done
- validation command:
- evidence path:
```

`claimed write set`은 파일, 디렉터리, 모듈 단위로 쓰되 너무 넓게 잡지 않는다. `shared/hotspot files`에는 route registry, schema, generated type entrypoint, central config, lockfile, migration index, public API barrel처럼 여러 lane이 건드리기 쉬운 파일을 적는다. 이런 파일은 한 lane의 integration owner가 맡고, 다른 lane은 dependent patch, note, issue, 또는 integration request로 남긴다.

겹치는 파일을 발견하면 setup 단계에서 아래 중 하나로 재분해한다.

- lane scope를 더 좁혀 claimed write set을 분리한다.
- shared/hotspot file을 integration owner lane으로 모은다.
- 한 lane을 `blocked` 또는 `planned`로 낮추고 선행 lane이 끝난 뒤 재개한다.
- 충돌이 architecture decision이면 ADR이나 issue를 먼저 갱신하고 구현을 미룬다.

## project-structure handoff 기준

folder/env/codegen/db/infra boundary가 필요할 때만 `project-structure`를 호출한다. raw idea discovery 중에는 호출하지 않는다.

## fallback interview gate 기준

원본 호출이 불가능하면 fallback 질문을 실행한다. fallback은 원본 전문 복제가 아니라 setup에 필요한 최소 질문이다.

```text
Domain interview fallback
- 이 프로젝트에서 사용자가 부르는 핵심 객체는 무엇인가?
- 헷갈리면 안 되는 비슷한 용어는 무엇인가?
- 이미 있는 문서나 코드가 쓰는 용어 중 바꾸면 안 되는 것은 무엇인가?

Product challenge fallback
- 이 프로젝트가 줄이는 고통은 무엇인가?
- 첫 번째 사용자는 누구인가?
- 오늘 완성되면 바로 쓸 수 있는 가장 좁은 장면은 무엇인가?
- 이번 setup에서 제외할 것은 무엇인가?
```

답이 없으면 추정하지 않고 `workflow-state.md`의 open questions에 남긴다. 사용자가 “추정해서 진행”이라고 명시한 경우에만 추정값을 `assumption`으로 표시하고 PRD/issues에 반영한다.

## PRD settings 기준

PRD에는 problem, user, first usable slice, included scope, excluded scope, acceptance criteria, risk를 포함한다.

`CONTEXT.md` 또는 ADR이 없으면 PRD와 issue 생성을 바로 시작하지 않는다. 먼저 domain language와 architecture premise를 정한다. Eval fixture 호환을 위해 `CONTEXT.md or ADR` 문구도 이 gate의 동의어로 본다.

## local implementation fallback lane 기준

`project-workflow`는 local implementation fallback을 직접 실행하지 않는다. implementation helper가 없거나 TDD 계획이 필요한 상황은 `feature-workflow`로 넘기고, setup 단계에서는 spec/issue, acceptance criteria, validation command, evidence plan만 준비한다.

## completion/ship 기준

`project-workflow`의 completion은 project setup 완료와 `feature-workflow` handoff 완료를 뜻한다. code review, QA, document sync, atomic commit, push/deploy는 구현 spec이 끝난 뒤 `feature-workflow`나 관련 helper가 맡으며, release prep은 release publishing이 아니다.

## feature-workflow handoff 기준

`feature-workflow`는 project setup 이후 반복 개발을 맡는다. 넘길 때는 아래 정보를 남긴다.

```text
Spec handoff
- spec or issue:
- acceptance criteria:
- TypeScript module policy: ESM only / CommonJS blocked or not applicable
- design reference:
- architecture reference:
- tool/security gate:
- validation command:
- state cache:
- work claims:
```

## workflow-state cache 기준

`workflow-state.md`는 자가개선 엔진이 아니라 반복 질문을 줄이는 handoff cache다. setup 단계에서 아래 내용을 남긴다.

```text
Workflow State
- source primitives:
- document language: Korean-first unless target project says otherwise
- primitive invocation: selected/invoked/skipped/fallback with fallback reason
- TypeScript module policy: ESM only / CommonJS blocked or not applicable
- authority docs:
- decisions:
- skipped questions:
- open questions:
- tool/security gate:
- next feature-workflow target:
```

캐시는 source of truth를 대체하지 않는다. `CONTEXT.md`, ADR, PRD, `design.md`, issue가 authority이고, `workflow-state.md`는 다음 agent가 빠르게 찾는 색인이다.

## work-claims coordination 기준

`work-claims.md`는 병렬 session의 쓰기 충돌을 줄이는 장부다. source of truth는 아니므로 spec 내용, architecture decision, product scope는 이 파일에만 두지 않는다. `feature-workflow`는 이 파일을 읽고 현재 lane의 claimed write set 밖 production file을 수정하지 않아야 한다.

## workflow log 기준

```text
YYYY-MM-DD | <stage>
- decision:
- artifact:
- validation:
- next: feature-workflow / project-workflow
```

## completion gate 기준

context, ADR, PRD or issue backlog, design baseline, project setup verification, feature handoff가 맞아야 완료한다. commit, push, deploy는 사용자가 명시적으로 요청한 경우에만 연결한다.

Project Setup Verification은 연결된 skill path, snippet, no-global-install 조건을 확인한다.

## goal condition recipe 기준

```text
/goal <measurable project setup end state> and <stated check evidence appears in transcript>; constraints: <scope and forbidden changes>; stop after <turn/time bound>
```

좋은 조건은 agent가 출력으로 증명할 수 있는 상태여야 한다. 예: `CONTEXT.md exists`, `docs/adr/0001-*.md is written`, `project-snippets/project-workflow.md is linked`, `feature handoff is reported`. 나쁜 조건은 `좋아질 때까지`, `완벽할 때까지`처럼 증거와 종료 기준이 없는 문장이다.
