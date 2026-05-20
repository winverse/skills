# project-workflow plugin

`project-workflow`는 repo-owned plugin이다. 새 프로젝트나 큰 initiative의 초기 셋팅만 맡는다.

## 포함 범위

| Plugin skill | 역할 |
| --- | --- |
| `project-workflow` | 도메인 언어, 제품 검증, 구조 경계, 디자인 기준, PRD, 초기 이슈, `workflow-state.md`, 병렬 `work-claims.md`, 구현 인계 준비 |

## 선택 실행 도구

`scripts/execute-phase.ts`는 `harness_framework`의 `execute.py` 아이디어를 TypeScript와 agent-neutral 방식으로 옮긴 선택 도구다. 기본값은 dry-run이며 다음 step prompt만 출력한다.

```bash
node plugins/project-workflow/scripts/execute-phase.ts .scratch/new-product/phases
node plugins/project-workflow/scripts/execute-phase.ts .scratch/new-product/phases --project-root /path/to/target-project
node plugins/project-workflow/scripts/execute-phase.ts .scratch/new-product/phases --run --agent codex --agent-bin codex --agent-arg exec
node plugins/project-workflow/scripts/execute-phase.ts .scratch/new-product/phases --run --agent claude --agent-bin claude --agent-arg -p
```

실행 command는 prompt를 stdin으로 받는다. Target project 문서는 `--project-root` 기준으로 읽고, 생략하면 현재 작업 디렉터리를 쓴다. 이 script는 Claude 전용 flag나 권한 우회 flag를 hard-code하지 않고, 알려진 권한 우회 flag는 거부한다. 실제 production edit은 `feature-workflow` step 실행으로 다룬다.

## 반복 테스트

`project-workflow` 계약을 바꾼 뒤에는 [프로젝트 워크플로우 테스트 방법](../../docs/project-workflow-test-method.md)에 따라 GitHub fresh clone 기반 cycle을 돌린다. 테스트는 local workspace 파일을 직접 읽지 않고, cycle마다 `current/`를 지운 뒤 새 clone에서 첫 응답 순서와 실제 project setup 산출물을 확인한다.

Codex CLI로 실제 테스트할 때는 첫 응답과 `resume`을 모두 테스트 project root cwd에서 실행하고, 첫 JSON event log에서 얻은 explicit session id를 직접 넘긴다. `--last` 기반 resume이나 wrapper cwd에서 sibling project를 쓰는 방식은 실패로 기록한다.

## 제외 범위

`feature-workflow`는 이 plugin에 넣지 않는다. `feature-workflow`는 초기 셋팅 이후 기존 PRD, issue, spec, bug, ADR, `design.md`를 구현하는 별도 반복 개발 스킬이다.

`agent-eval-harness`도 이 plugin에 넣지 않는다. 하네스는 setup 실행이 아니라 회귀 검증 레이어다. `project-workflow` 규칙이 바뀌거나 반복 실패가 생겼을 때 별도 companion skill로 호출한다.

`project-structure`, `design-review`, `browser-qa`, `sync-docs`, `code-review`도 이 plugin에 넣지 않는다. 이들은 초기 셋팅 중 필요할 때 호출하는 specialist skill이다.

## 정본 경로

새 프로젝트와 snippet은 `plugins/project-workflow/skills/project-workflow/SKILL.md`를 직접 링크한다. 기존 top-level `skills/project-workflow` 경로는 제거됐고, plugin-bundled skill만 canonical source로 본다.

```text
plugins/project-workflow/skills/project-workflow/SKILL.md
```
