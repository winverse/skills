# 프로젝트 워크플로우 테스트 방법

이 문서는 `project-workflow`를 수정한 뒤 실제로 원하는 순서와 산출물이 나오는지 반복 확인하는 방법이다. 핵심은 결과를 나중에 맞춰 쓰는 것이 아니라, GitHub에서 새로 받은 copy를 기준으로 plugin을 호출하고 실제 응답과 파일 생성을 기록하는 것이다.

## 목표

- `project-workflow` 첫 응답이 `grill-with-docs` -> `office-hours` -> Superpowers `brainstorming` setup gap check 순서로 질문하는지 확인한다.
- `design.md`, `project-structure`, PRD, issue backlog, architecture handoff가 질문 gate 전에는 `deferred` 또는 `not created yet`로 남는지 확인한다.
- 질문에 답한 뒤에는 실제 프로젝트 폴더, 구조 파일, 도메인 문서, ADR, PRD, `design.md`, `workflow-state.md`, `work-claims.md`, phase handoff가 생성되는지 확인한다.
- target project가 다른 언어를 명시하지 않았으면 durable setup docs가 최상위 문서 제목까지 한국어 우선으로 작성되는지 확인한다.
- UI dashboard, CLI/no-browser local data tool, API/external-risk mock service처럼 성격이 다른 케이스를 늘려도 같은 계약이 유지되는지 확인한다.
- 실패하면 history를 고쳐 맞추지 않고 `project-workflow` 자체를 수정한 뒤 다음 cycle에서 다시 검증한다.

## `/goal` 반복 개선 루프

`project-workflow` 검증은 한 번의 `pass` 선언으로 끝내지 않는다. Claude Code에서는 `/goal`로 session-scoped goal condition을 먼저 세우고, Codex나 다른 agent에서는 같은 내용을 completion checklist로 `cycles.md`와 `cycle-summary.md`에 남긴다. 이 goal은 테스트 실행, 실패 분석, 플러그인 수정, 재검증을 하나의 loop로 묶는다.

기본 goal condition은 아래처럼 쓴다.

```text
Goal: project-workflow plugin과 workflow suite가 fresh clone 실제 실행에서 안정적으로 동작할 때까지 반복 개선한다.

완료 조건:
- GitHub fresh clone cycle에서 첫 응답 순서가 `grill-with-docs` -> `office-hours` -> Superpowers `brainstorming` setup gap check로 나온다.
- 질문 gate 전에는 `design.md`, `project-structure`, PRD, issue backlog, implementation이 `deferred` 또는 `not created yet`로 남는다.
- 질문 답변 뒤에는 실제 project structure, `.scratch` authority docs, `work-claims.md`, phase handoff, target project validation이 생성된다.
- 사용자가 structure를 확정했으면 `.scratch` Markdown만 생성하는 것은 실패다. root `package.json`, ESM tsconfig, 선택한 `apps/`/`packages/` 또는 `src/` shell, 검증 script가 실제 파일로 있어야 한다.
- target project가 다른 언어를 명시하지 않았으면 `CONTEXT.md`, ADR, PRD, issue backlog, `design.md`, setup validation, `workflow-state.md`, `work-claims.md`, phase handoff가 Korean-first artifact gate를 통과한다. 최상위 문서 제목, `workflow-state.md` risk-gate heading, `work-claims.md` lane heading도 한국어 우선이어야 한다. 예시는 `# 제품 요구사항(PRD): ledgerImportChecker`, `# workflow 상태: ledgerImportChecker`, `# 설정 검증(setup validation): ledgerImportChecker`다.
- `execute-phase.ts --dry-run`이 `Step undefined` 없이 feature-workflow step prompt를 만든다.
- shared workspace guard가 cycle 전후 동일하다.
- 마지막 plugin/test-method/validator 수정 이후 최소 1개 fresh clone cycle이 통과한다. 중요한 계약 변경 뒤에는 2개 연속 cycle 통과를 권장한다.

중단 조건:
- shared workspace가 오염된다.
- agent가 local workspace source를 읽거나 쓴다.
- 같은 실패가 2번 반복되어 원인 분류 없이 cycle만 반복된다.
- 외부 agent `resume`이 timeout에 걸리거나 final response 없이 산출물만 남긴다.
- secret, destructive action, remote write가 필요해 사용자 확인이 필요하다.
```

반복 방식은 아래처럼 고정한다.

1. goal condition을 `cycles.md`와 해당 `cycle-summary.md`에 기록한다.
2. `current/`를 삭제하고 GitHub fresh clone으로 cycle을 시작한다.
3. 실제 첫 응답과 실제 setup 실행을 기록한다.
4. 실패하면 원인을 `plugin contract`, `runner`, `test method`, `target artifact`, `environment/hook` 중 하나로 분류한다.
5. 분류 결과에 따라 이 repo의 `project-workflow`, `execute-phase.ts`, 테스트 문서, validator, eval fixture 중 필요한 곳을 수정한다.
6. repo validator를 통과시킨다.
7. GitHub fresh clone이 최신 수정본을 받도록 `atomic-committer`로 commit/push한다. 사용자가 명시적으로 push를 금지한 경우에는 fresh clone cycle을 계속하지 않고 local-only 검증 결과로 따로 표시한다.
8. 다음 cycle을 새로 돌린다.
9. 완료 조건을 만족할 때만 goal을 완료로 표시한다.

이 loop에서 중요한 것은 “결과 기록을 고쳐 pass로 만드는 것”이 아니라, 실패를 플러그인 계약이나 테스트 방법에 되먹임해서 다음 fresh clone cycle이 실제로 통과하게 만드는 것이다.

## 확장 검증 케이스

한 가지 성공 사례만으로 완료를 선언하지 않는다. 마지막 plugin/test-method/validator 변경 이후 최소 1개 fresh clone cycle이 필요하고, 중요한 계약 변경 뒤에는 아래 중 서로 다른 2개 케이스를 연속으로 확인하는 것을 권장한다.

| 케이스 | 목적 | 추가 확인 |
| --- | --- | --- |
| UI dashboard | `design.md`, mock direction, dense operational UI 기준 확인 | 디자인 gate가 질문 뒤에 나오고, 구현은 `feature-workflow`로 인계되는지 확인 |
| CLI/no-browser local data tool | browser evidence 없는 프로젝트에서도 workflow가 과한 UI/QA 요구를 하지 않는지 확인 | `src/` shell, fixture, CLI validation, non-browser runtime evidence가 남는지 확인 |
| API/external-risk mock service | 외부 API나 secret이 미래 범위로 언급될 때 risk gate가 먼저 남는지 확인 | 실제 외부 write 없이 mock/fake boundary, `도구/보안 위험 게이트(Agent Tool And Security Risk Gate)`, phase handoff가 남는지 확인 |

각 cycle은 raw prompt에 기대 순서를 넣지 않는다. 케이스 이름은 `cycle-summary.md`와 `cycles.md`에 남기고, 실패하면 케이스별 예외가 아니라 `plugin contract`, `runner`, `test method`, `target artifact`, `environment/hook` 중 하나로 분류한다.

## 테스트 루트

기본 루트는 사용자가 지정한 scratch root를 사용한다. 예시는 placeholder로 적는다.

```text
<skill-test-root>
```

테스트 루트 구조는 아래처럼 유지한다.

```text
skill-test/
├── cycles.md
├── current/
│   ├── _github/agents-skills/
│   └── example-projects/<project-slug>/
└── runs/
    └── cycle-NNN/
        ├── prompts/
        ├── history/
        ├── output/
        └── cycle-summary.md
```

`current/`는 매 cycle 시작 전에 삭제하고 다시 만든다. `runs/`와 `cycles.md`는 누적 기록이므로 삭제하지 않는다. 실제 실행 history에는 사용자가 지정한 절대 경로를 기록해도 되지만, 공유 repo 문서에는 machine-specific 절대 경로를 쓰지 않는다.

## 실행 guard

외부 agent를 실제로 돌리는 테스트는 cwd와 resume 대상이 조금만 틀려도 local shared workspace를 수정할 수 있다. 따라서 모든 cycle은 아래 guard를 통과해야 한다.

- 테스트 대상 project root는 `<skill-test-root>/current/example-projects/<project-slug>/`이고, 첫 응답과 이어진 setup 실행 모두 이 actual project root cwd에서 실행한다.
- wrapper directory나 `<skill-test-root>/current`에서 실행한 뒤 sibling `example-projects/<project-slug>`에 쓰게 하지 않는다. sibling target write가 필요해지는 실행 방식은 실패로 판정한다.
- Codex CLI를 쓰면 첫 실행의 JSON event log에서 explicit session id를 추출하고, 이어지는 `codex exec resume`에는 그 id를 직접 넘긴다. `--last`는 다른 cwd의 마지막 session을 잡을 수 있으므로 쓰지 않는다.
- resume도 첫 실행과 같은 actual project root cwd에서 실행한다.
- non-git scratch project에서 Codex CLI를 쓸 때는 필요하면 `--skip-git-repo-check`를 명시한다. 이 flag는 테스트 scratch project에 대한 repo check 우회일 뿐, shared workspace를 target으로 삼는 허가가 아니다.
- 테스트 목적이 local shared workspace hook이나 project rule 검증이 아니라면 external Codex 실행에는 `--ignore-rules`를 붙인다. user config나 MCP hook이 shared workspace side effect를 만들 수 있는 환경이면 `--ignore-user-config`도 함께 붙인다. plugin entrypoint는 prompt의 GitHub fresh clone 경로로 직접 제공하므로, 이 isolation은 local shared repo hook이 테스트 중 shared workspace를 수정하는 일을 막기 위한 것이다.
- shared workspace guard를 매 외부 agent 실행 전후로 확인한다. 예시는 아래와 같다.

```bash
git -C <local-workspace> status --short
```

위 결과는 테스트 시작 전과 종료 후가 같아야 한다. 테스트 session이 `<skill-test-root>/current` 밖, 특히 local shared workspace를 수정하면 즉시 process를 중단하고 테스트가 만든 변경만 되돌린 뒤 cycle을 `fail`로 기록한다. 이 경우 나중에 history를 고쳐 pass로 만들지 않고, 테스트 방법이나 `project-workflow` 계약을 수정한 뒤 다음 cycle로 넘어간다.

권장 실행 shape는 아래처럼 project root를 cwd로 고정하는 방식이다.

```bash
cd <skill-test-root>/current/example-projects/<project-slug>

codex exec \
  --skip-git-repo-check \
  --ignore-rules \
  --json \
  -o <skill-test-root>/runs/cycle-NNN/history/first-response.md \
  - < <skill-test-root>/runs/cycle-NNN/prompts/first-response.md \
  > <skill-test-root>/runs/cycle-NNN/output/first-response-events.jsonl

# first-response-events.jsonl에서 explicit session id를 추출한다.

codex exec resume \
  --skip-git-repo-check \
  --ignore-rules \
  --json \
  -o <skill-test-root>/runs/cycle-NNN/history/project-run-final.md \
  <explicit-session-id> \
  - < <skill-test-root>/runs/cycle-NNN/prompts/project-setup-answers.md \
  > <skill-test-root>/runs/cycle-NNN/output/project-run-events.jsonl
```

실제 반복 테스트에서는 `resume`을 bounded wrapper로 감싼다. 기본 한계는 setup resume 6분 또는 validation 이후 3분 동안 event log 증가가 없는 상태다. timeout이 발생하면 process를 종료하고 `resume-timeout.txt`, `resume-pid.txt`, `cycle-summary.md`에 기록한다. 산출물과 validation이 일부 생겼더라도 final response가 없으면 `runner` 실패다.

## Cycle 절차

1. repo preflight를 실행한다.
   - `git status --short --branch`
   - 현재 작업 중인 변경과 unrelated dirty file을 분리한다.
   - 테스트에 반영할 변경은 먼저 검증하고 commit/push한다.
   - shared workspace guard baseline을 기록한다.

2. 테스트 루트를 초기화한다.
   - `<skill-test-root>/current`를 삭제한다.
   - `runs/cycle-NNN/`을 새로 만든다.
   - `cycles.md`에 cycle 번호, 날짜, 목적, 대상 commit을 추가한다.

3. GitHub에서 새 copy를 받는다.
   - local workspace를 symlink하거나 직접 참조하지 않는다.
   - clone source는 `https://github.com/winverse/agents-skills.git`이다.
   - 기록에는 downloaded commit hash를 남긴다.

4. 첫 응답 테스트를 한다.
   - plugin entrypoint는 `current/_github/agents-skills/plugins/project-workflow/skills/project-workflow/SKILL.md`다.
   - prompt에는 기대 순서를 주입하지 않는다.
   - raw idea나 새 서비스 요청만 준 뒤 첫 응답을 그대로 `runs/cycle-NNN/history/first-response.md`에 저장한다.
   - agent 실행 cwd는 actual project root cwd다.
   - Codex CLI를 쓰면 JSON event log에서 explicit session id를 추출해 기록한다.
   - 통과 조건은 아래다.
     - Matt Pocock skills / `grill-with-docs`가 첫 domain docs gate로 나온다.
     - GStack plugin / `office-hours`가 그 다음 product challenge로 나온다.
     - Superpowers plugin / `brainstorming` setup gap check가 `design.md`, `project-structure`, PRD, issue backlog보다 먼저 나온다.
     - `grill-me`는 project setup 기본 gate가 아니라 skipped 또는 non-code fallback으로만 언급된다.
     - artifact path는 `target path`, `proposed path`, `not created yet` 중 하나로 표시된다.

5. 실제 project setup 테스트를 한다.
   - 사람이 답하는 것처럼 domain/product/tool/design 질문에 순서대로 답한다.
   - agent가 만든 전체 대화와 결정을 `runs/cycle-NNN/history/project-run-history.md`에 남긴다.
   - 실제 프로젝트는 `current/example-projects/<project-slug>/` 아래에 만든다.
   - 이어진 실행이 필요하면 첫 응답에서 얻은 explicit session id로 같은 actual project root cwd에서 resume한다.
   - `--last` 기반 resume, 다른 cwd 기반 resume, wrapper cwd에서 sibling project를 쓰는 방식은 실패다.
   - 단순 Markdown만 만들면 실패다. 선택한 구조에 맞는 `apps/`/`packages/` 또는 `src/` 같은 실제 project structure, `docs/`, `.scratch/`, 검증 script가 실제 파일로 있어야 한다.
   - 사용자가 TypeScript monorepo shell을 확정했으면 root `package.json`, `"type": "module"`, ESM tsconfig, 선택한 workspace package, source entrypoint, validation script가 있어야 한다.

6. 검증을 실행한다.
   - target project 자체 검증 명령을 실행한다.
   - phase handoff가 있으면 `execute-phase.ts`를 dry-run으로 실행한다.
   - dry-run prompt에 `Step undefined`나 `undefined` step title이 나오면 실패로 판정한다.
   - `node_modules`는 검증 중 생긴 generated artifact로 허용하되 `.gitignore` 또는 file-tree summary exclusion으로 처리한다. 산출물 품질 판단에는 포함하지 않는다.
   - target project가 다른 언어를 명시하지 않았으면 durable setup docs의 최상위 문서 제목, 자연어 제목/본문/목록/필드 라벨이 한국어 우선인지 확인한다. 영어 중심 heading, 영어-only field label, 영어 중심 phase step 설명이 있으면 target validation이 통과해도 실패다. exact identifier, command, file path, package name, status keyword는 허용한다.
   - `# ledgerImportChecker PRD`, `# ledgerImportChecker workflow state`, `# setup validation` 같은 제목은 실패다. `# 제품 요구사항(PRD): ledgerImportChecker`, `# workflow 상태: ledgerImportChecker`, `# 설정 검증(setup validation): ledgerImportChecker`처럼 한국어 제목 뒤에 exact identifier를 붙인다.
   - shared workspace guard를 다시 확인한다.
   - 결과는 `runs/cycle-NNN/output/`과 `cycle-summary.md`에 남긴다.

7. 판정한다.
   - `pass`: 첫 응답 순서, 실제 파일 생성, 검증 명령, history 기록이 모두 맞다.
   - `fail`: 하나라도 틀리면 원인을 `cycle-summary.md`에 쓰고, 필요한 경우 이 repo의 테스트 방법, validator, 또는 `project-workflow`를 수정한 뒤 commit/push하고 다음 cycle로 반복한다. Korean-first artifact gate 실패는 `plugin contract` 또는 `target artifact`로 분류한다.
   - `goal complete`: 마지막 plugin/test-method/validator 변경 이후 fresh clone cycle이 통과하고, 남은 blocker나 반복 failure가 없을 때만 표시한다.

## 금지

- local workspace의 `plugins/project-workflow`를 테스트 source로 직접 읽지 않는다.
- expected order를 prompt에 넣어 agent가 맞추게 하지 않는다.
- 실제 응답과 다른 history를 나중에 손으로 꾸미지 않는다.
- 이전 cycle의 `current/` 프로젝트를 재사용하지 않는다.
- 첫 응답 테스트에서 파일을 만든 것처럼 기록하지 않는다.
- `codex exec resume --last`로 다른 cwd의 session을 이어받지 않는다.
- 외부 agent가 local shared workspace를 수정했는데 pass로 처리하지 않는다.
- 한 번 pass했다고 `/goal`을 완료 처리하지 않는다. 마지막 수정 이후 fresh clone cycle 통과와 남은 개선점 여부를 같이 본다.
- target project가 영어 문서를 명시하지 않았는데 영어 중심 setup docs가 생성된 cycle을 pass로 처리하지 않는다.
- `# <slug> PRD`, `# <slug> workflow state`, `# setup validation`처럼 최상위 문서 제목이 영어 중심인 cycle을 pass로 처리하지 않는다.
- `workflow-state.md`의 사람이 읽는 risk-gate heading, `work-claims.md`의 lane/field label, `phases/step<N>.md`의 section heading/body가 영어 중심이면 pass로 처리하지 않는다. exact field name이나 gate name은 `도구/보안 위험 게이트(Agent Tool And Security Risk Gate)`, `API 작업 lane`처럼 한국어 heading 뒤 괄호나 backtick 안의 보조 표기로만 허용한다.
- 외부 agent가 timeout이나 final response 누락을 냈는데 생성된 파일만 보고 pass로 처리하지 않는다.

## 기록 템플릿

```md
# project-workflow plugin run history

## Run metadata

- date:
- cycle:
- test root:
- downloaded repository:
- downloaded commit:
- plugin entrypoint:
- project:
- agent cwd:
- explicit session id:
- shared workspace guard:
- verdict:
- goal:
- cycle count:
- validation case:
- runner timeout:
- failure class:
- goal status:
- document language gate:

## 0. Source download

Agent:

Human:

Decision:

## 1. First response gate

Raw prompt:

Agent first response:

Checks:

## 2. Question gates

Agent questions:

Human answers:

Decision:

## 3. Artifacts created

File tree summary:

## 4. Validation

Commands:

Results:

Generated artifacts excluded from summary:

## 5. Cycle decision

Pass/fail:

Next:
```
