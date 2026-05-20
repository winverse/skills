---
name: feature-workflow
description: "기존 PRD, issue, spec, bug report, acceptance criteria, design.md, ADR을 기준으로 feature, bug fix, vertical slice를 TDD, 구현 계획, review, QA, document sync까지 끝낼 때 사용한다."
---

# feature-workflow

이 스킬은 `workflow suite`의 기능 개발 loop다. 이미 방향이 잡힌 프로젝트에서 하나의 feature, issue, bug fix, vertical slice를 검증 가능한 코드 변경으로 끝낸다. 프로젝트 초기 domain/product/architecture 셋팅이 없으면 `project-workflow`로 되돌린다.

`feature-workflow`는 플러그인식 실행 loop에 가깝다. 같은 프로젝트 안에서 여러 번 호출되며, 매번 현재 PRD, issue, spec, bug repro, acceptance criteria를 기준으로 plan, TDD, implementation, review, QA, docs sync를 반복한다.

## dependency contract 기준

Superpowers plugin, GStack plugin, Matt Pocock skills, repo-local custom helper에서 feature/issue 구현에 필요한 primitive만 고른다. 전체 패키지를 전부 실행하지 않는다.

출력에는 각 primitive의 출처와 상태를 함께 표시한다.

```text
<source package>: <exact skill/plugin name> -> selected | skipped | fallback
```

## provenance ledger 기준

정확한 upstream source와 checked ledger는 `docs/update-source-registry.md`를 단일 진실원으로 본다. `references/upstream-dependency-map.md`는 이 workflow 안에서 source id를 어떤 순서와 handoff로 쓰는지 적는 usage map이다. `brainstorming`, `writing-plans`, `tdd`, `subagent-driven-development`, `review`, `qa`, `diagnose`처럼 외부에서 온 이름은 항상 출처 패키지와 함께 적는다.

- Superpowers plugin: `brainstorming`, `writing-plans`, `subagent-driven-development`, `tdd` 또는 `test-driven-development`, `verification-before-completion`
- GStack plugin: `plan-eng-review`, `plan-design-review`, `browse`, `review`, `qa`, `ship`, `retro`
- Matt Pocock skills: `review`, `diagnose`, `document-sync`, `improve-codebase-architecture`, `semantic-commits`, `ship`
- repo-local custom: `code-review`, `browser-qa`, `design-review`, `sync-docs`, `atomic-committer`, `agent-eval-harness`, Agent Tool And Security Risk Gate
- setup source: `project-workflow`가 만든 `CONTEXT.md`, ADR, PRD, issue backlog, design.md, feature handoff

upstream이 바뀌면 전체 내용을 복사하지 않는다. source package, exact name, adopted role, handoff condition, artifact path, validator/eval fixture, `skill.html`, project snippet, history만 갱신한다.

## preflight 기준

- local project instructions와 folder-local docs를 먼저 읽는다.
- spec, issue, acceptance criteria, bug repro, or user-provided task가 있는지 확인한다.
- `CONTEXT.md`, ADR, PRD, design.md가 있으면 현재 spec 해석의 authority로 사용한다.
- `.scratch/<slug>/workflow-state.md` 또는 동등한 state cache가 있으면 selected primitives, skipped questions, gate decision, prior answers를 먼저 읽는다.
- `.scratch/<slug>/work-claims.md` 또는 동등한 coordination artifact가 있으면 현재 lane의 claimed write set, read-only paths, shared/hotspot files, integration owner를 production edit 전에 확인한다.
- TypeScript production edit이면 ESM only boundary를 확인한다. `type: "module"`, `import`/`export`, ESM `tsconfig`를 유지하고 `CommonJS`, `require`, `module.exports`, `.cjs`, `.cts`를 새로 도입하지 않는다.
- spec이 CommonJS 추가를 요구하거나 기존 CommonJS 파일을 직접 확장해야 하면 production edit 전에 blocker, migration boundary, 또는 사용자 확인을 남긴다.
- raw idea, product discovery, project structure 선택, design system 초기화가 부족하면 `project-workflow`로 넘긴다.
- tool, MCP, external API, file write, network, untrusted content는 Agent Tool And Security Risk Gate를 확인하거나 작성한다.

## mode router 기준

| 요청 | lane |
| --- | --- |
| 새 feature issue 구현 | spec preflight -> implementation plan -> TDD |
| bug fix | reproduce/characterization -> minimal fix -> regression test |
| substantial UI spec | design.md/selected mock 확인 -> design review -> browser QA |
| large implementation | `writing-plans` -> `plan-eng-review` -> `subagent-driven-development` |
| CLI/no-browser spec | command/API fixture -> runtime evidence |
| completion | review -> QA -> document sync -> commit handoff |
| raw project idea | `project-workflow` handoff |

## default loop 기준

1. current spec, issue, PRD, ADR, design.md, local instructions 읽기
2. source-labeled primitive inventory
3. acceptance criteria와 out-of-scope 확인
4. 현재 lane의 intended write set을 `work-claims.md`와 대조하고, active claim과 겹치면 overlap block으로 멈춤
5. TypeScript 작업이면 ESM only와 CommonJS 금지 boundary를 plan과 검증 명령에 포함
6. Superpowers plugin `brainstorming` 또는 fallback으로 implementation approach 정리
7. Superpowers plugin `writing-plans` 또는 fallback으로 2-5분 단위 plan과 검증 명령 작성
8. GStack plugin `plan-eng-review` 또는 repo-local reviewer로 plan review
9. UI면 `plan-design-review`, `design-review`, selected mock direction 확인
10. TDD 또는 characterization test로 RED 상태 기록
11. 구현 후 GREEN, 필요한 경우 REFACTOR
12. 큰 구현이면 Superpowers plugin `subagent-driven-development`로 task fan-out과 review를 수행
13. `code-review` 또는 `codex:review`, `browser-qa` 또는 non-browser runtime evidence, `diagnose` 필요 여부 확인
14. `sync-docs`로 docs drift를 정리하고 completion/commit handoff를 남김

## artifact map 기준

`.scratch/<feature-slug>/` 아래에 spec notes, implementation design, plans, test evidence, QA evidence, review notes, docs sync notes, workflow log를 둔다. 프로젝트가 이미 다른 workflow area를 갖고 있으면 그 위치를 따른다.

반복 호출을 위해 `workflow-state.md`를 읽고 갱신한다.

- reused authority: 이번 spec에서 재사용한 `CONTEXT.md`, ADR, PRD, design.md
- selected primitives: 이번 loop에서 선택/생략/fallback 처리한 primitive
- evidence pointers: RED/GREEN/REFACTOR, QA, docs sync 경로
- open follow-up: 다음 spec에서 다시 물어보지 말아야 할 답변과 아직 막힌 질문

`work-claims.md`가 있으면 현재 lane의 status와 evidence도 갱신한다. 이 파일은 source of truth가 아니라 동시에 일하는 session이 같은 파일을 쓰지 않게 하는 coordination artifact다.

## TDD contract 기준

- 코드 작성이 포함된 target code repo 작업에서는 production change 전에 RED evidence가 필수다.
- RED evidence는 failing test, characterization check, repro script 중 하나로 남긴다.
- target code repo가 project-local TDD hook을 제공하면, production code edit은 RED evidence, characterization evidence, 또는 명시적 TDD exception record 없이는 통과하지 않아야 한다.
- 이 shared skills repo는 코드 제품 repo가 아니므로 TDD hook을 설치하거나 실행하지 않는다. 여기서는 target code repo에 적용할 문서 계약과 eval fixture만 유지한다.
- RED가 현실적으로 불가능하면 이유와 대체 evidence를 workflow log와 TDD exception record에 기록한다.
- GREEN 후 refactor를 수행하고, refactor가 behavior를 바꾸지 않는다는 검증 명령을 남긴다.
- 테스트가 없는 프로젝트라도 최소 command output, fixture, browser evidence, API response, log 중 하나는 남긴다.
- TypeScript production change는 TDD loop 중에도 ESM only를 유지한다. CommonJS 패턴이 RED/GREEN 편의를 위해 추가되면 실패로 본다.

## subagent boundary 기준

`subagent-driven-development`는 큰 feature나 issue에서만 쓴다. 바로 다음 작업이 그 결과에 막혀 있으면 main agent가 직접 처리한다. subagent를 쓸 때는 disjoint write set, task ledger, spec review, code quality review를 남긴다.

여러 agent/session/worktree가 동시에 움직이면 아래 규칙을 production edit 전 gate로 둔다.

- 쓰려는 파일은 현재 lane의 claimed write set에 있어야 한다.
- 다른 active lane의 claimed write set과 겹치면 overlap block으로 멈추고, integration owner나 사용자에게 조정 요청을 남긴다.
- shared/hotspot files는 integration owner만 직접 수정한다.
- read-only paths는 조사와 참고만 허용하고 patch를 만들지 않는다.
- claim이 없거나 오래된 상태면 먼저 `work-claims.md`를 갱신하거나 `project-workflow`로 병렬 lane 재분해를 넘긴다.

## completion 기준

완료 전에 아래를 확인한다.

- acceptance criteria 충족
- tests 또는 runtime evidence
- review findings 처리 또는 명시적 defer
- docs sync 필요 여부
- artifact hygiene
- TypeScript 작업이면 ESM only 유지와 CommonJS 미도입 확인
- gate, review, QA, docs sync 누락이 반복될 위험이 있으면 `agent-eval-harness`에 넘길 eval seed 후보를 남김
- commit/push는 사용자가 요청했을 때만 `atomic-committer` handoff

## output shape 기준

```text
Runtime adapter
- <active instruction surface>

Spec authority
- <spec/issue/PRD/ADR/design source>
- state cache: <workflow-state.md path or none>
- work claim: <lane id, claimed write set, overlap block result>
- TypeScript module policy: ESM only / CommonJS blocked or not applicable

Primitive inventory
- <source package>: <exact name> -> selected | skipped | fallback

Implementation loop
- RED:
- GREEN:
- REFACTOR:
- QA:
- docs sync:

Completion
- <done/deferred/blocker>
- improvement seed: <none or eval candidate>
```
