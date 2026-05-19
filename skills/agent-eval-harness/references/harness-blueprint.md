# 에이전트 평가 하네스 청사진

## 범위 라우터

이 참조는 새 평가 체계를 만들 때 쓰는 최소 구조다. 대상은 스킬 호출, workflow handoff, safety boundary, output shape, artifact hygiene이며, 앱 기능 테스트나 브라우저 QA를 대체하지 않는다.

## 최소 폴더

```text
evals/agent/
  README.md
  cases/
    skill-routing.json
    safety-boundaries.json
    output-shape.json
  fixtures/
scripts/
  run-agent-evals.ts
```

## case schema 기준

- `id`: 안정적인 case 이름
- `prompt`: agent에게 줄 입력
- `expectedSkills`: 반드시 선택해야 하는 스킬
- `forbiddenSkills`: 선택하면 안 되는 스킬
- `trigger_quality`: positive, near-miss, forbidden skill, shortened description 같은 호출 품질 scope
- `checks`: deterministic check 목록
- `agentSurfaces`: Codex, Claude, Copilot 등 적용 표면
- `assumptionDate`: 빠르게 변하는 agent behavior의 기준일

## check type 기준

| type | 용도 |
| --- | --- |
| `required_text` | 필수 문구 확인 |
| `forbidden_text` | 금지 문구 확인 |
| `required_link_count` | 인용 링크 개수 확인 |
| `required_file_reference` | 파일 경로 언급 확인 |
| `json_schema` | 구조화 출력 확인 |
| `command_passed` | 로컬 명령 성공 여부 확인 |

## runner 동작

runner는 case를 순서대로 읽고 check 결과를 blocking/advisory로 나눈다. 모델 호출이 필요한 평가는 기본적으로 advisory이며, deterministic check만 CI blocking으로 둔다.

## 안전 case pack

- prompt injection이 tool 사용을 바꾸지 않는지 확인한다.
- destructive command, secret 출력, private data 보존을 금지한다.
- least privilege와 approval boundary가 출력에 드러나는지 확인한다.

## workflow seed pack 기준

`project-workflow`는 raw idea, existing API cleanup, substantial UI, MCP/API automation, project setup verification, `workflow-state.md` cache, `feature-workflow` handoff, goal condition quality 같은 setup lane을 가진다. `feature-workflow`는 CLI/no-browser implementation, TDD fallback, review, QA, completion mapping, document sync, `workflow-state.md` update, failure-driven improvement seed 같은 반복 구현 lane을 가진다. 각 lane은 최소 하나의 routing case와 하나의 artifact hygiene case를 둔다.

saved output은 그대로 커밋하지 않고 scrubbed artifact로 줄여 fixture에 둔다.

## goal condition case 기준

이 repo에서 `/goal`이라고 쓰면 Claude Code의 `/goal` 기능을 뜻한다. Claude Code `/goal`이나 유사한 completion loop를 평가할 때는 명령 실행 여부가 아니라 조건 문장의 품질을 deterministic하게 본다.

- required text: measurable end state, check evidence, constraints, turn/time bound
- forbidden text: 무제한 실행, destructive action, secret 출력, merge/force-push 자동화
- surface metadata: Claude Code `/goal` 기준과 assumption date

## 리포트 템플릿

```text
Agent eval harness
- Cases: <전체>/<전체>
- Passing: <통과>
- Blocking failures: <개수>
- Advisory failures: <개수>
```
