# project-workflow plugin

`project-workflow`는 repo-owned plugin이다. 새 프로젝트나 큰 initiative의 초기 셋팅만 맡는다.

## 포함 범위

| Plugin skill | 역할 |
| --- | --- |
| `project-workflow` | 도메인 언어, 제품 검증, 구조 경계, 디자인 기준, PRD, 초기 이슈, `workflow-state.md`, 병렬 `work-claims.md`, 구현 인계 준비 |

## 제외 범위

`feature-workflow`는 이 plugin에 넣지 않는다. `feature-workflow`는 초기 셋팅 이후 기존 PRD, issue, spec, bug, ADR, `design.md`를 구현하는 별도 반복 개발 스킬이다.

`agent-eval-harness`도 이 plugin에 넣지 않는다. 하네스는 setup 실행이 아니라 회귀 검증 레이어다. `project-workflow` 규칙이 바뀌거나 반복 실패가 생겼을 때 별도 companion skill로 호출한다.

`project-structure`, `design-review`, `browser-qa`, `sync-docs`, `code-review`도 이 plugin에 넣지 않는다. 이들은 초기 셋팅 중 필요할 때 호출하는 specialist skill이다.

## 호환 경로

기존 프로젝트가 `skills/project-workflow/SKILL.md`를 직접 링크할 수 있으므로 top-level `skills/project-workflow` 경로는 compatibility entry로 유지한다. 새 통합에서는 plugin 경로를 canonical source로 본다.

```text
plugins/project-workflow/skills/project-workflow/SKILL.md
```
