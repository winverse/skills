---
name: agent-eval-harness
description: "에이전트 스킬 라우팅, 프롬프트 경계, cross-agent portability, guardrails, artifact hygiene, 반복 가능한 AI-agent workflow를 검증하는 repo-local eval harness를 설계하고 개선할 때 사용한다."
---

# 에이전트 평가 하네스

이 스킬은 스킬 설명이 실제 에이전트 행동으로 이어지는지 반복 검증하는 작은 평가 체계를 만든다. 목적은 모델별 문구에 과적합하지 않고, routing, safety boundary, output shape, artifact hygiene 같은 행동 계약을 deterministic case로 확인하는 것이다.

## 핵심 계약

- 먼저 성공 기준을 정의하고 그 기준을 case schema에 반영한다.
- 초기 구조는 repo-local `evals/agent/` 아래에 작게 둔다.
- case는 `typical`, `edge`, `adversarial` 입력을 섞는다.
- `required_link_count`, `required_file_reference`, `json_schema`, `forbidden_text`처럼 결정적으로 확인 가능한 check를 우선한다.
- live model/API 평가는 예산과 flake 정책이 명확해질 때까지 advisory로 둔다.
- 저장되는 출력은 scrubbed artifact만 남기고, 비밀값·개인 경로·원본 사용자 데이터는 보존하지 않는다.
- 이 repo에서 `/goal`이라고 쓰면 Claude Code의 `/goal` 기능을 뜻한다. `/goal` 같은 session-scoped completion loop를 검증할 때는 goal condition 자체를 평가 대상 artifact로 본다. 좋은 조건은 measurable end state, stated check, constraints, turn/time bound를 가진다.

## 설정 절차

1. 평가 대상 행동을 한 문장으로 적는다.
2. `evals/agent/cases/*.json`에 최소 case를 추가한다.
3. `scripts/run-agent-evals.ts`가 case를 읽고 check를 실행하게 한다.
4. 실패한 실제 agent run은 가장 작은 regression case로 줄여 추가한다.
5. CI gate가 필요하면 deterministic case만 blocking으로 연결한다.

## 기본 lane

| lane | 확인 대상 |
| --- | --- |
| 스킬 호출 | 올바른 skill selection, near-miss prompt, forbidden skill |
| workflow behavior | 단계 순서, handoff, project-structure timing |
| safety boundary | prompt injection, destructive action, least privilege |
| output quality | file reference, source link, schema, concise report |
| artifact hygiene | scrubbed fixture, no local secret, no raw transcript leak |

## workflow handoff seed case 기준

`project-workflow`나 `feature-workflow`와 함께 쓸 때는 dependency inventory, `project-structure` 호출 시점, PRD settings, UI mockup selection, `workflow-state.md` cache, `work-claims.md` parallel lane ownership, overlap block, CLI/no-browser evidence, MCP/API gate, fallback lane, project setup verification, feature/issue implementation loop, completion mapping, document sync, artifact hygiene, improvement seed, goal condition quality를 seed case로 둔다.

## goal condition eval 기준

- 좋은 조건: measurable end state, check evidence, constraints, turn/time bound가 모두 있다.
- 나쁜 조건: "완벽할 때까지", "좋아질 때까지"처럼 종료 증거가 없다.
- Claude Code `/goal` 기준 여부는 `agentSurfaces`와 `assumptionDate`에 기록한다.
- evaluator가 tool을 직접 쓰지 않는다는 전제를 case 설명에 남긴다.

## 완료 기준

- case마다 success criteria와 metrics가 분명하다.
- 최소 safety case pack이 있다.
- cross-agent portability가 필요한 표면을 `agentSurfaces`와 `assumptionDate`로 기록한다.
- 검증 명령과 실패 예시가 README 또는 관련 skill 문서에 연결되어 있다.

## 출력 형식

```text
평가 범위
- <행동 계약>

추가한 case
- <case id>: <검증 목적>

검증
- <명령>: <결과>
```
