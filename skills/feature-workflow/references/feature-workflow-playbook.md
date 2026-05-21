# feature-workflow playbook 기준

## core idea 기준

`feature-workflow`는 `workflow suite`의 기능 개발 loop다. project setup 이후 이미 존재하는 PRD section, issue, spec, bug repro, ADR, design.md를 기준으로 작은 feature, bug fix, vertical slice를 검증 가능한 변경으로 끝낸다.

## read order 기준

1. root instruction
2. folder-local instruction docs
3. target spec, issue, bug report, acceptance criteria
4. `CONTEXT.md`, `CONTEXT-MAP.md`, ADR, PRD, domain-first folder map
5. design.md, mock decision, testing docs
6. `.scratch/<slug>/work-claims.md` 또는 동등한 coordination artifact
7. current diff와 test output

## fallback routing 기준

아래가 부족하면 바로 구현하지 않는다.

| 부족한 것 | 다음 행동 |
| --- | --- |
| product/domain/architecture 자체가 불명확함 | `project-workflow` handoff |
| acceptance criteria 없음 | light spec 작성 또는 사용자 확인 |
| UI direction 없음 | selected mock direction 또는 `design-review` handoff |
| tool/security gate 없음 | Agent Tool And Security Risk Gate 작성 |
| test surface 없음 | characterization 또는 runtime evidence 방식 정의 |

## implementation loop 기준

```text
spec authority -> work claim preflight -> plan -> plan review -> RED -> GREEN -> REFACTOR -> review -> QA -> docs sync -> completion
```

`writing-plans`는 작업을 2-5분 단위로 쪼개는 데만 쓴다. product scope를 새로 늘리는 데 쓰지 않는다.

## domain structure preflight 기준

`project-workflow`가 DDD-lite structure gate를 남긴 프로젝트에서는 구현 전에 현재 spec이 어느 bounded context에 속하는지 확인한다.

```text
Domain Structure Preflight
- bounded context:
- domain-first folder map:
- folder-local instruction docs:
- domain invariant:
- TDD starting point:
- result: clear | blocked
```

domain invariant가 있는 작업은 UI/API adapter보다 domain package 또는 pure function test에서 RED를 먼저 만드는 것을 우선한다. folder-local instruction docs가 오래됐거나 새 bounded context가 생기면 production edit 뒤 `sync-docs` 후보에 넣는다.

## work claim preflight 기준

`work-claims.md`가 있으면 production edit 전에 현재 lane을 확인한다.

```text
Work Claim Preflight
- lane id:
- owner/session:
- branch or worktree:
- intended write set:
- matching claimed write set:
- read-only paths:
- shared/hotspot files:
- integration owner:
- overlap result: clear | blocked
```

`intended write set`이 현재 lane의 `claimed write set` 안에 있으면 진행한다. 다른 active lane과 겹치면 overlap block으로 멈추고, 파일을 수정하지 않은 상태에서 coordination note를 남긴다. `shared/hotspot files`는 integration owner만 직접 수정하며, 다른 lane은 필요한 변경을 dependent patch note나 issue로 남긴다.

claim이 없거나 stale이면 먼저 `work-claims.md`를 갱신한다. scope 자체를 다시 나눠야 하면 `project-workflow`로 병렬 lane 재분해를 넘긴다.

## TypeScript module policy preflight 기준

TypeScript production edit이면 plan 전에 module boundary를 확인한다. 기본값은 ESM only다.

```text
TypeScript Module Preflight
- module system: ESM only
- package boundary: package.json type: "module"
- allowed imports: import/export
- blocked patterns: CommonJS, require, module.exports, .cjs, .cts
- migration boundary: <existing CommonJS path or none>
- result: clear | blocked
```

새 production code, test, fixture, script는 `import`/`export`를 사용한다. `CommonJS`, `require`, `module.exports`, `.cjs`, `.cts`를 편의상 추가하지 않는다.

기존 spec이 CommonJS 파일 수정을 요구하면 바로 변환하지 않는다. 현재 lane이 그 파일을 claim했는지, migration owner가 누구인지, ESM으로 바꿀 수 있는지 확인하고 blocker 또는 migration note를 남긴 뒤 진행한다.

## local implementation fallback lane 기준

Superpowers-style implementation helper가 없으면 fallback으로 issue-level implementation design, exact TDD 또는 characterization plan, RED/GREEN/REFACTOR evidence, non-browser runtime evidence를 직접 남긴다. 이 fallback은 project setup이 아니라 feature/issue implementation loop 안에서만 실행한다.

## CLI/no-browser 기준

browser surface가 없으면 browser-qa, screenshot, mockup selection을 요구하지 않는다. command output, fixture result, API response, stdout, log, generated report 같은 non-browser runtime evidence를 남긴다.

## TDD lane 기준

- bug fix는 repro 또는 characterization check를 먼저 만든다.
- feature는 acceptance criteria 중 하나를 테스트로 고정한다.
- domain invariant가 있으면 domain package 또는 pure function test에서 먼저 RED를 만든다.
- UI는 browser evidence와 accessibility snapshot을 test evidence와 함께 다룬다.
- 테스트를 만들 수 없으면 이유와 대체 command/runtime evidence를 남긴다.

## target code repo TDD hook 기준

이 shared skills repo에서는 TDD hook을 설치하거나 실행하지 않는다. 이 repo는 스킬 문서와 eval fixture를 관리하는 repo이며, production code 변경을 만들지 않는다.

대상 코드 repo에서 `feature-workflow`를 project instruction에 연결할 때만 project-local hook으로 TDD gate를 강제한다. 전역 hook 설치나 shared skills repo hook 추가는 하지 않는다.

권장 gate는 아래 순서다.

1. production code edit을 감지한다.
2. 같은 작업에 RED evidence가 있는지 확인한다.
3. RED evidence가 없으면 characterization evidence를 확인한다.
4. 둘 다 없으면 `tdd-exception.md` 또는 workflow log의 명시적 예외 사유를 확인한다.
5. 셋 다 없으면 warn 또는 block으로 처리한다.

hook이 인정할 evidence는 target repo가 정한다.

```text
TDD Gate Evidence
- test file: **/*.test.* 또는 **/*.spec.*
- characterization: .scratch/<feature-slug>/test-evidence.md
- RED log: .scratch/<feature-slug>/workflow-log.md 안의 RED:
- exception: .scratch/<feature-slug>/tdd-exception.md
```

운영은 처음부터 hard block으로 시작하지 않는다. target code repo에서 `warn` 모드로 누락 패턴을 본 뒤, 안정화되면 `block`으로 올린다.

## subagent lane 기준

큰 구현에서만 `subagent-driven-development`를 선택한다. task는 파일/모듈 ownership이 분리되어야 하고, 각 task는 spec review와 code quality review를 통과해야 한다.

각 subagent task는 claim 가능한 파일/모듈 범위를 가져야 한다. 하나의 shared file을 여러 task가 직접 수정해야 하면 병렬화하지 않고 integration owner lane에서 순차 적용한다. 읽기는 허용하지만 쓰기는 claim이 필요하다.

## completion/ship 기준

completion은 release publishing이 아니다. commit, push, deploy, tag, GitHub release는 사용자가 명시적으로 요청한 경우에만 `atomic-committer` 또는 별도 release workflow로 넘긴다.

완료 전에는 review, QA/runtime evidence, document-sync, artifact hygiene, secret guard 필요 여부를 확인한다. document-sync -> `sync-docs`, semantic-commits -> `atomic-committer`, ship -> release checklist처럼 source workflow 이름을 repo-local helper로 매핑한다.

## workflow-state cache 기준

`workflow-state.md`가 있으면 먼저 읽고, 반복 실행 후 새 evidence와 결정만 덧붙인다. 이 파일은 authority가 아니라 다음 spec 실행을 빠르게 하는 cache다.

```text
Workflow State Update
- reused authority:
- domain structure:
- selected primitives:
- skipped/fallback primitives:
- TypeScript module policy:
- RED/GREEN/REFACTOR:
- QA/runtime evidence:
- docs sync:
- next open question:
```

`work-claims.md`가 있으면 현재 lane의 status도 갱신한다.

```text
Work Claims Update
- lane id:
- status:
- changed files:
- validation:
- evidence:
- integration notes:
```

## improvement seed 기준

자가개선은 모든 완료마다 무겁게 실행하지 않는다. 아래 상황이 있었을 때만 `agent-eval-harness` 후보를 남긴다.

- wrong workflow routing
- missing setup gate
- skipped RED/GREEN/REFACTOR without reason
- repeated QA or docs sync omission
- tool/security gate 누락

후보는 `.scratch/<feature-slug>/eval-candidates/` 아래에 prompt, expected skill, missing gate, required evidence를 짧게 기록한다.

## workflow log 기준

```text
YYYY-MM-DD | <spec or issue>
- authority:
- selected primitives:
- RED:
- GREEN:
- REFACTOR:
- QA:
- docs sync:
- completion:
```
