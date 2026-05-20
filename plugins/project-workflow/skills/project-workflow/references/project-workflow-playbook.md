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

dependency inventory는 전체 skill family를 켜는 목록이 아니라 초기 셋팅에 채택한 primitive 호출 장부다. 각 항목은 `Matt Pocock skills: grill-with-docs -> invoked`, `GStack plugin: office-hours -> fallback`, `repo-local custom: project-structure -> deferred`처럼 source package, exact skill/plugin name, selected/invoked/skipped/fallback/deferred 상태를 함께 쓴다.

선택된 upstream primitive는 가능한 경우 실제 skill/plugin 호출로 넘긴다. 현재 runtime에 호출 surface가 없으면 조용히 흉내 내지 않고 `fallback`으로 표시한 뒤, 아래 fallback interview gate만 수행한다.

```text
Primitive Invocation
- source package:
- exact name:
- status: selected | invoked | skipped | fallback | deferred
- timing: now | after domain/product gate | after design gate | after tool/security gate | not applicable
- invocation surface: repo-local skill | plugin command | slash command | MCP/tool | agent workflow | unavailable
- fallback reason:
- output artifact:
```

upstream이 바뀌면 전체 내용을 복사하지 않는다. `docs/update-source-registry.md`에서 source id, source package, exact name, checked ledger를 먼저 갱신하고, `upstream-dependency-map.md`에는 채택 역할, handoff 조건, artifact path, validator/eval 경계만 반영한다. 같은 변경을 `SKILL.md`, `skill.html`, project snippet, history에 반영한다.

## document language 기준

초기 셋팅 산출물과 프로젝트 문서는 사용자가 다른 언어를 지정하지 않는 한 한국어 우선으로 작성한다. 대상 프로젝트에 이미 영어 PRD, 영문 ADR, 다국어 issue template 같은 명시 규칙이 있으면 그 규칙을 따르고 `workflow-state.md`에 이유를 남긴다.

한국어 우선 대상은 `CONTEXT.md`, ADR, PRD, issue backlog, `design.md`, setup validation, workflow log, `workflow-state.md`, `work-claims.md`다. `code identifiers`, 명령, 파일 경로, 제품명, protocol, API 이름, upstream skill/plugin 이름은 원문 표기를 유지한다.

Korean-first artifact gate는 완료 전 hard gate다. durable setup docs의 제목, section heading, 설명 문장, 결정 이유, issue 설명, design 방향, work claim 설명, phase step 설명이 영어 중심이면 target project validation이 통과해도 cycle은 실패다. 영어 중심 heading, 영어-only lane heading, 영어-only field label도 실패로 본다. 먼저 문서를 한국어 우선으로 고친 뒤 검증 결과를 `setup-validation.md` 또는 `workflow-state.md`에 남긴다.

허용되는 영어는 exact identifier, command, file path, API name, package name, source package name, status keyword처럼 번역하면 정확성이 떨어지는 값이다. 문서의 자연어 설명을 영어로 남기는 것은 사용자가 명시적으로 영어 문서를 요청했을 때만 허용한다.

`workflow-state.md`, `work-claims.md`, phase step file은 조정 문서이지만 사람이 읽는 setup artifact다. exact field name과 gate name은 괄호나 backtick 안에 보조 표기로만 두고, section heading과 field label은 한국어 우선으로 쓴다. `## Agent Tool And Security Risk Gate`, `## API lane`처럼 영어-only heading이 남으면 실패다. 예시는 `## 도구/보안 위험 게이트(Agent Tool And Security Risk Gate)`, `## API 작업 lane`처럼 쓴다.

## scenario lanes 기준

### raw new SaaS/service 기준

domain language, target user, first usable slice, product challenge, Superpowers setup gap check, ADR, PRD 순서로 간다. 먼저 Matt Pocock skills `grill-with-docs`를 실제 호출해 기존 `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`, 코드와 문서 용어를 확인하고, 없으면 첫 용어가 확정될 때 root `CONTEXT.md`를 lazy artifact로 제안한다. 이어서 GStack plugin `office-hours`를 실제 호출한다. 그 다음 Superpowers plugin `brainstorming`을 실제 호출하거나 fallback setup gap check 질문으로 빠진 가정, 너무 넓은 첫 slice, 인계 위험을 확인한다. 호출 surface가 없으면 각 primitive를 `fallback`으로 표시하고 local 질문을 끝낸 뒤 다음 단계로 간다. Docker/AWS/Pulumi가 필요한 새 서비스는 service boundary와 secret boundary를 먼저 확인한 뒤 `project-structure`로 넘긴다.

### existing backend/API cleanup 기준

현재 architecture와 behavior를 보존할 evidence를 먼저 정하고, 구조 정리 목표를 ADR 또는 architecture note로 남긴다. 동작이 바뀌지 않는 cleanup이면 full PRD를 강제하지 않는다.

### substantial UI 기준

`design.md` 또는 design token 기준을 만든 뒤 2-3 mock direction을 제시하고 사용자가 선택한다. 선택 전 대규모 UI coding을 하지 않는다. 실제 구현 loop는 `feature-workflow`가 맡는다.

Superpowers plugin `brainstorming`은 raw idea 첫 응답에서 `office-hours` 뒤 setup gap check로 처리한다. `writing-plans`는 큰 phase/step handoff plan이 생긴 뒤 계획 빈틈을 보강할 때만 조건부로 쓴다. 구현 계획 실행, TDD, subagent-driven implementation은 `feature-workflow`로 넘긴다.

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

도구/보안 위험 게이트(Agent Tool And Security Risk Gate)를 작성한다. 권한, destructive action, secret, untrusted content를 분리한다. Markdown heading은 영어-only로 두지 않고 `## 도구/보안 위험 게이트(Agent Tool And Security Risk Gate)`처럼 쓴다.

### cross-agent setup 기준

Codex, Claude Code, Cursor, Windsurf, Copilot 같은 agent별 instruction surface를 먼저 확인한다. repo skill을 global install하지 않고 project instruction에 필요한 snippet만 연결한다.

### parallel multi-session setup 기준

여러 agent, 여러 session, 여러 worktree가 같은 프로젝트에서 병렬 구현을 할 수 있으면 setup 단계에서 lane을 먼저 나눈다. 목표는 모든 파일을 lock하는 것이 아니라, 쓰기 책임을 명확히 해서 같은 파일을 두 session이 동시에 patch하지 않게 하는 것이다.

`project-workflow`는 `.scratch/<slug>/work-claims.md`를 생성하거나 갱신한다. 이 파일은 coordination artifact이며 authority가 아니다. authority는 `CONTEXT.md`, ADR, PRD, issue, `design.md`에 둔다.

owner policy는 one active owner per claimed write path다. 읽기는 허용하지만 쓰기는 claim이 필요하다.

```text
# work-claims

## 도메인 lane

## API 작업 lane

## 웹 화면 lane

- lane id:
- 담당자/session:
- branch 또는 worktree:
- 대상 spec/issue:
- 수정 소유 범위(claimed write set):
- 읽기 전용 경로(read-only paths):
- 공유/hotspot 파일:
- 통합 담당자(integration owner):
- 상태(status): planned | active | blocked | ready-for-integration | done
- 검증 명령:
- 증거 경로:
```

`claimed write set`은 파일, 디렉터리, 모듈 단위로 쓰되 너무 넓게 잡지 않는다. `shared/hotspot files`에는 route registry, schema, generated type entrypoint, central config, lockfile, migration index, public API barrel처럼 여러 lane이 건드리기 쉬운 파일을 적는다. 이런 파일은 한 lane의 integration owner가 맡고, 다른 lane은 dependent patch, note, issue, 또는 integration request로 남긴다.

겹치는 파일을 발견하면 setup 단계에서 아래 중 하나로 재분해한다.

- lane scope를 더 좁혀 claimed write set을 분리한다.
- shared/hotspot file을 integration owner lane으로 모은다.
- 한 lane을 `blocked` 또는 `planned`로 낮추고 선행 lane이 끝난 뒤 재개한다.
- 충돌이 architecture decision이면 ADR이나 issue를 먼저 갱신하고 구현을 미룬다.

## project-structure handoff 기준

folder/env/codegen/db/infra boundary가 필요할 때만 `project-structure`를 호출한다. raw idea discovery 중에는 호출하지 않는다. 특히 `grill-with-docs`, `office-hours`, Superpowers `brainstorming` setup gap check가 끝나기 전 호출하지 않는다.

Actual project shell gate는 setup 완료 전 hard gate다. 사용자가 structure를 확정했거나 `apps/`, `packages/`, `src/`, API/web/domain shell을 원한다고 답하면 `.scratch` 문서만 만들고 끝내지 않는다. `project-structure`를 실제 호출하거나, 호출 surface가 없으면 fallback으로 최소 실행 shell, 즉 minimal runnable shell을 만든다. 만들 수 없으면 blocker로 기록하고 pass로 보고하지 않는다.

TypeScript monorepo shell을 확정한 경우 최소 산출물은 아래다.

- root `package.json` with `"type": "module"` and validation script
- root ESM `tsconfig` 또는 `tsconfig.base.json`
- 선택한 app/package folder, 예를 들면 `apps/web`, `apps/api`, `packages/domain`
- 각 app/package의 `package.json`과 `src/` entrypoint
- external API, secret, real PII 없이 검증 가능한 dummy data 또는 pure helper
- `npm`, `pnpm`, `bun` 중 하나의 실제 검증 명령과 `setup-validation.md` 기록

## fallback interview gate 기준

원본 호출이 불가능하면 fallback 질문을 실행한다. fallback은 원본 전문 복제가 아니라 setup에 필요한 최소 질문이다.

```text
Grill with Docs fallback
- 기존 `CONTEXT.md` 또는 `CONTEXT-MAP.md`가 있는가?
- 이 프로젝트에서 사용자가 부르는 핵심 객체는 무엇인가?
- 헷갈리면 안 되는 비슷한 용어와 피해야 할 alias는 무엇인가?
- 이미 있는 문서나 코드가 쓰는 용어 중 바꾸면 안 되는 것은 무엇인가?
- 되돌리기 어렵고 맥락 없이는 의외이며 실제 trade-off가 있는 ADR 후보가 있는가?

Product challenge fallback
- 이 프로젝트가 줄이는 고통은 무엇인가?
- 첫 번째 사용자는 누구인가?
- 오늘 완성되면 바로 쓸 수 있는 가장 좁은 장면은 무엇인가?
- 이번 setup에서 제외할 것은 무엇인가?

Superpowers setup gap fallback
- 방금 정한 첫 slice가 아직 너무 넓은가?
- PRD, `design.md`, `project-structure`로 넘어가기 전에 빠진 가정은 무엇인가?
- 병렬 session이나 `feature-workflow` handoff에서 충돌할 위험은 무엇인가?
- 지금 확정하지 말고 open question으로 남겨야 할 것은 무엇인가?
```

답이 없으면 추정하지 않고 `workflow-state.md`의 open questions에 남긴다. 사용자가 “추정해서 진행”이라고 명시한 경우에만 추정값을 `assumption`으로 표시하고 PRD/issues에 반영한다.

## PRD settings 기준

PRD에는 problem, user, first usable slice, included scope, excluded scope, acceptance criteria, risk를 포함한다.

`CONTEXT.md` 또는 ADR이 없으면 PRD와 issue 생성을 바로 시작하지 않는다. 먼저 domain language와 architecture premise를 정한다. Eval fixture 호환을 위해 `CONTEXT.md or ADR` 문구도 이 gate의 동의어로 본다.

## local implementation fallback lane 기준

`project-workflow`는 local implementation fallback을 직접 실행하지 않는다. implementation helper가 없거나 TDD 계획이 필요한 상황은 `feature-workflow`로 넘기고, setup 단계에서는 spec/issue, acceptance criteria, validation command, evidence plan만 준비한다.

## completion/ship 기준

`project-workflow`의 completion은 project setup 완료와 `feature-workflow` handoff 완료를 뜻한다. code review, QA, document sync, atomic commit, push/deploy는 구현 spec이 끝난 뒤 `feature-workflow`나 관련 helper가 맡으며, release prep은 release publishing이 아니다.

## `/goal` 반복 개선 루프 기준

`project-workflow` plugin이나 workflow suite 자체를 완성하는 작업은 단발 검토가 아니라 `/goal` 반복 개선 루프로 운영한다. Claude Code에서는 `/goal`을 실제로 설정하고, Codex나 다른 agent에서는 같은 내용을 completion checklist로 `cycles.md`와 `cycle-summary.md`에 남긴다.

Goal은 아래 evidence가 실제 fresh clone cycle에서 확인될 때까지 유지한다.

- 첫 응답 gate: `grill-with-docs` -> `office-hours` -> Superpowers `brainstorming` setup gap check
- gate 전 산출물 상태: `design.md`, `project-structure`, PRD, issue backlog, implementation은 `deferred` 또는 `not created yet`
- setup 후 산출물: 실제 project structure, `.scratch` authority docs, `workflow-state.md`, `work-claims.md`, phase handoff
- runner: `execute-phase.ts --dry-run`이 `Step undefined` 없이 feature-workflow step prompt 생성
- guard: shared workspace guard 전후 동일
- validation: target project validation과 repo validators 통과

실패하면 cycle을 반복하기 전에 원인을 분류한다.

| Failure class | 의미 | 다음 조치 |
| --- | --- | --- |
| `plugin contract` | `SKILL.md`나 playbook이 기대 행동을 충분히 명시하지 못함 | plugin-bundled skill과 snippet, validator를 수정 |
| `runner` | `execute-phase.ts`나 phase metadata 처리 문제 | runner와 runner validator를 수정 |
| `test method` | fresh clone 절차, cwd, resume, guard, 기록 방식이 불충분함 | `docs/project-workflow-test-method.md`와 validator를 수정 |
| `target artifact` | 생성된 프로젝트 구조나 docs가 handoff 기준에 부족함 | project setup 계약, artifact map, issue/phase template을 수정 |
| `plugin contract` 또는 `target artifact` | durable setup docs가 Korean-first artifact gate를 통과하지 못함 | Korean-first gate를 hard gate로 강화하고 다음 fresh clone cycle에서 문서 언어를 재검증 |
| `environment/hook` | local hook, cache, dev server, Codex sandbox 같은 환경 영향 | 환경 guard를 보강하고 cycle에는 fail 또는 environment note를 남김 |

수정 뒤에는 repo validator를 통과시키고, GitHub fresh clone이 최신본을 받을 수 있도록 `atomic-committer`로 commit/push한 뒤 다음 cycle을 돈다. 마지막 수정 이후 fresh clone cycle이 통과하고 unresolved blocker가 없을 때만 goal을 완료한다.

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

첫 응답이나 시뮬레이션에서는 파일을 쓴 것처럼 말하지 않는다. Artifact 경로는 `target path`, `proposed path`, `not created yet`으로 표시하고, 실제 생성은 사용자가 진행을 승인했거나 질문 답변이 준비된 뒤에만 한다.

```text
Workflow State
- source primitives:
- document language: Korean-first unless target project says otherwise
- document language gate: Korean-first artifact gate pass/fail and evidence path
- primitive invocation: selected/invoked/skipped/fallback/deferred with fallback reason and timing
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

## phase/step handoff gate 기준

`harness_framework`의 `execute.py`에서 차용할 부분은 자동 실행 자체가 아니라 step 상태 관리와 자기완결 handoff 구조다. `project-workflow`는 큰 구현을 바로 실행하지 않고, 필요하면 `.scratch/<slug>/phases/` 또는 target project의 동등한 workflow area에 아래 산출물을 만든다. 이 산출물은 `feature-workflow`가 실행 단계에서 읽는 handoff다.

```text
phases/
├── index.json
├── step0.md
├── step1.md
└── step2.md
```

`index.json`은 `project`, `phase`, `steps`를 담고, 각 step은 `pending`, `completed`, `error`, `blocked` 중 하나의 상태를 가진다. step metadata는 `step`/`name`을 기본으로 쓰되, 생성 agent가 `id`/`title`/`file`을 만든 경우 `execute-phase.ts`가 이를 정상화해서 읽을 수 있어야 한다. `blocked`는 실패가 아니라 API key, 계정 권한, 외부 승인, 수동 설정처럼 사용자 개입이 필요한 상태다.

`index.json`의 `title`이나 `name`은 dry-run header에 노출되므로 한국어 우선 또는 한국어+identifier 병기로 쓴다.

각 `step<N>.md`는 독립 Codex session이 읽어도 실행 가능해야 하며, section heading은 한국어 우선으로 둔다.

- 읽을 파일(read files): 먼저 읽을 authority 문서와 기존 코드 경로
- 작업 목적(purpose): 이 step이 해결하는 문제와 제외 범위
- 수정 소유 범위(claimed write set): 수정 가능한 파일/디렉토리
- 읽기 전용 경로(read-only paths): 읽기만 허용되는 경로
- 검증 명령(acceptance commands): 실제 실행 가능한 검증 명령
- 차단 조건(blocked conditions): 사용자 개입이 필요한 조건
- 완료 요약(summary field): 완료 뒤 다음 step에 넘길 한 줄 산출물
- 금지 변경(forbidden changes): 하지 말아야 할 작업과 이유

## TypeScript execute runner boundary 기준

Python `execute.py`를 repo에 들여오지 않는다. 선택 실행 도구가 필요하면 TypeScript로 작성하고, `plugins/project-workflow/scripts/execute-phase.ts`를 기준으로 둔다.

- 기본 동작은 dry-run prompt 출력이며 index file을 수정하지 않는다.
- 실제 실행은 사용자가 `--run`과 `--agent-bin`을 명시했을 때만 한다.
- agent command는 `--agent-bin`과 반복 `--agent-arg`로 구성하고 prompt를 stdin으로 받아야 한다.
- target project 문서는 `--project-root` 기준으로 읽으며, 생략하면 현재 작업 디렉터리를 쓴다.
- 알려진 권한 우회 flag는 사용자 입력으로도 거부한다.
- `--dangerously-skip-permissions` 같은 권한 우회 flag를 hard-code하지 않는다.
- Codex-first command boundary로 둔다. 다른 command는 사용자가 명시한 custom fallback일 때만 허용한다.
- 자동 branch checkout, commit, push는 하지 않는다. publish는 `atomic-committer`가 맡는다.
- production code edit 책임은 `feature-workflow`가 맡는다. runner prompt는 `project-workflow` 실행이 아니라 `feature-workflow` step 실행 adapter로 해석한다.

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
