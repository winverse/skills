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

## 제외 범위

`feature-workflow`는 이 plugin에 넣지 않는다. `feature-workflow`는 초기 셋팅 이후 기존 PRD, issue, spec, bug, ADR, `design.md`를 구현하는 별도 반복 개발 스킬이다.

`agent-eval-harness`도 이 plugin에 넣지 않는다. 하네스는 setup 실행이 아니라 회귀 검증 레이어다. `project-workflow` 규칙이 바뀌거나 반복 실패가 생겼을 때 별도 companion skill로 호출한다.

`project-structure`, `design-review`, `browser-qa`, `sync-docs`, `code-review`도 이 plugin에 넣지 않는다. 이들은 초기 셋팅 중 필요할 때 호출하는 specialist skill이다.

## 호환 경로

기존 프로젝트가 `skills/project-workflow/SKILL.md`를 직접 링크할 수 있으므로 top-level `skills/project-workflow` 경로는 compatibility entry로 유지한다. 새 통합에서는 plugin 경로를 canonical source로 본다.

```text
plugins/project-workflow/skills/project-workflow/SKILL.md
```
