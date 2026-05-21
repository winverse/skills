# project-workflow plugin boundary 검토

## plugin으로 옮기는 항목

| 항목 | 판단 | 이유 |
| --- | --- | --- |
| `project-workflow` | plugin core | 단일 작업 skill이 아니라 Matt Pocock, GStack, Superpowers, `project-structure`, `design.md`, `work-claims.md`를 조율하는 초기 셋팅 orchestration이다. |
| `execute-phase.ts` | plugin script | `harness_framework`의 `execute.py`를 Python이 아니라 TypeScript로 옮긴 선택 실행 도구다. Codex-first stdin 기반 command로 동작하고, custom command는 명시적 fallback으로만 허용한다. |

## plugin으로 옮기지 않는 항목

| 항목 | 판단 | 이유 |
| --- | --- | --- |
| `feature-workflow` | 별도 skill 유지 | 초기 셋팅 이후의 반복 개발 loop다. PRD, issue, spec, bug, ADR, `design.md`를 구현하는 용도라 project setup과 실행 시점이 다르다. |
| `agent-eval-harness` | companion skill 유지 | setup 실행이 아니라 routing, guardrail, artifact hygiene 회귀 검증이다. workflow 규칙 변경이나 반복 실패 때 별도 호출한다. |
| `project-structure` | specialist skill 유지 | 폴더/env/codegen/db/infra 구조 선택에 집중한다. `project-workflow`가 구조 질문 이후 호출한다. |
| `design-review` | specialist skill 유지 | UI 판단과 시각 리뷰에 집중한다. `project-workflow`의 design baseline gate 뒤에서 조건부 호출한다. |
| `browser-qa` | specialist skill 유지 | 실제 browser evidence 검증에 집중한다. 초기 셋팅 실행 자체와 다르다. |
| `code-review` | specialist skill 유지 | diff/PR findings-first review에 집중한다. 구현 후 검토 단계에서 호출한다. |
| `sync-docs` | specialist skill 유지 | 문서 drift 조정에 집중한다. 초기 셋팅 완료 단계에서 조건부 호출한다. |
| `atomic-committer`, `pull-request` | specialist skill 유지 | git publish 경계다. workflow completion과 별도 사용자 승인으로 호출한다. |
| `web-research` | skill 유지 | 현재 사실 조사와 출처 비교가 주 역할이다. 자체 MCP/hooks/state bundle이 붙기 전까지 plugin이 아니다. |
| `skill-update`, `markdown-to-html`, `show-skills` | repo maintenance skill 유지 | 이 repo의 skill package 관리 도구다. project setup 실행과 직접 묶지 않는다. |

## 재검토 후보

아래 조건이 붙으면 plugin 전환을 다시 검토한다.

- `feature-workflow`: 별도 `feature-workflow` plugin으로 승격할 필요가 생기는 경우
- `web-research`: 자체 MCP cache, browser/search adapter, source ledger store가 붙는 경우
- `browser-qa`: browser runner, screenshot artifact manager, local server lifecycle hook이 plugin으로 묶이는 경우
- `atomic-committer`: secret scanner, commit planner, git hook, PR integration이 하나의 installable package로 묶이는 경우
