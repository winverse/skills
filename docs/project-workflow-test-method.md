# 프로젝트 워크플로우 테스트 방법

이 문서는 `project-workflow`를 수정한 뒤 실제로 원하는 순서와 산출물이 나오는지 반복 확인하는 방법이다. 핵심은 결과를 나중에 맞춰 쓰는 것이 아니라, GitHub에서 새로 받은 copy를 기준으로 plugin을 호출하고 실제 응답과 파일 생성을 기록하는 것이다.

## 목표

- `project-workflow` 첫 응답이 `grill-with-docs` -> `office-hours` -> Superpowers `brainstorming` setup gap check 순서로 질문하는지 확인한다.
- `design.md`, `project-structure`, PRD, issue backlog, architecture handoff가 질문 gate 전에는 `deferred` 또는 `not created yet`로 남는지 확인한다.
- 질문에 답한 뒤에는 실제 프로젝트 폴더, 구조 파일, 도메인 문서, ADR, PRD, `design.md`, `workflow-state.md`, `work-claims.md`, phase handoff가 생성되는지 확인한다.
- 실패하면 history를 고쳐 맞추지 않고 `project-workflow` 자체를 수정한 뒤 다음 cycle에서 다시 검증한다.

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

## Cycle 절차

1. repo preflight를 실행한다.
   - `git status --short --branch`
   - 현재 작업 중인 변경과 unrelated dirty file을 분리한다.
   - 테스트에 반영할 변경은 먼저 검증하고 commit/push한다.

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
   - 단순 Markdown만 만들면 실패다. 최소한 `apps/`, `packages/`, `docs/`, `.scratch/`, 검증 script 같은 project structure가 실제 파일로 있어야 한다.

6. 검증을 실행한다.
   - target project 자체 검증 명령을 실행한다.
   - phase handoff가 있으면 `execute-phase.ts`를 dry-run으로 실행한다.
   - 결과는 `runs/cycle-NNN/output/`과 `cycle-summary.md`에 남긴다.

7. 판정한다.
   - `pass`: 첫 응답 순서, 실제 파일 생성, 검증 명령, history 기록이 모두 맞다.
   - `fail`: 하나라도 틀리면 원인을 `cycle-summary.md`에 쓰고, 이 repo의 `project-workflow`를 수정한 뒤 commit/push하고 다음 cycle로 반복한다.

## 금지

- local workspace의 `plugins/project-workflow`를 테스트 source로 직접 읽지 않는다.
- expected order를 prompt에 넣어 agent가 맞추게 하지 않는다.
- 실제 응답과 다른 history를 나중에 손으로 꾸미지 않는다.
- 이전 cycle의 `current/` 프로젝트를 재사용하지 않는다.
- 첫 응답 테스트에서 파일을 만든 것처럼 기록하지 않는다.

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
- verdict:

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

## 5. Cycle decision

Pass/fail:

Next:
```
