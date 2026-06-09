# 구조화 검색 참조

## core idea 기준

검색은 query 나열이 아니라 claim을 검증하는 과정이다. 질문을 concept block으로 나누고, 각 block에 source target과 stop rule을 둔다.

이 repo에서 `web-search`, `web search`, `웹서치`, `웹 검색`은 별도 스킬명이 아니라 `web-research`의 alias다.

## activation boundary 기준

- `web-research` 스킬 자체를 검토, 수정, 평가하는 요청은 웹 검색 요청이 아니다.
- 사용자가 파일, transcript, raw note, source note를 제공하고 그 자료만 요약하라고 하면 로컬 자료를 primary source로 삼는다.
- 로컬 자료 요약 중 현재 의학·법률·금융 기준, 제품 가격·availability, 시장 상황, 최신 정책처럼 바뀔 수 있는 사실은 웹으로 보강한다.
- 사용자가 웹 검색하지 말라고 명시하면 검색하지 않는다. high-stakes 정확도 문제가 있으면 검색 필요성을 짧게 밝히고 로컬 근거와 한계를 분리한다.

## research budget router 기준

| 위험 | 처리 |
| --- | --- |
| 낮음 | 단일 official quick check. 출처가 명확하고 최신이면 멈춘다. |
| 중간 | 2-3개 query fan-out과 source comparison. |
| 높음 | primary source, 최신 날짜, conflict ledger. |
| recommendation | 가격, availability, review drift, safety, tradeoff 확인. |

## query fan-out 기준

- official term
- user term
- alias
- version/date term
- site-specific query

## parallel sub-agent fan-out 기준

web-research 또는 alias 호출은 source-first 검증 요청으로 해석한다. 병렬 sub-agent fan-out은 질문이 넓거나 독립 source lane이 있을 때 사용한다. 예를 들면 recommendation, comparison, legal/medical/financial high-stakes check, source conflict, market/product availability, implementation plan, skill update, PR, architecture note, product decision의 입력 조사다.

단일 에이전트 조사는 정상 경로다. official quick check 하나로 충분하거나, 사용자가 단일 에이전트를 요구했거나, private data가 포함됐거나, runtime/tool policy가 delegation을 막거나, 로컬 자료가 primary source인 요약이면 main-agent research로 처리한다.

병렬 fan-out을 생략했다는 사실은 매번 설명하지 않는다. 사용자가 병렬 조사를 요청했는데 생략할 때만 이유를 남긴다. 예: "private repo 정보가 섞여 있어 하위 agent에 위임하지 않았습니다."

리서치 결과가 recommendation, comparison, implementation plan, skill update, PR, architecture note, product decision 같은 downstream artifact의 입력이면 verified search로 본다. 단일 official source가 질문을 완전히 끝낼 때를 제외하고는 broad browsing 전에 독립 lane을 나누고 sub-agent fan-out을 먼저 고려한다.

하위 agent 결과는 그대로 합치지 않는다. main agent가 source ledger를 병합하고, 중복·출처 충돌·날짜 불일치·claim confidence를 최종 검토한다.

## stop rules 기준

- official source가 명확하고 최신이면 멈춘다.
- 서로 다른 권위 있는 source가 충돌하면 추가 source를 확인한다.
- recommendation은 최소 가격/availability/risk 근거가 있어야 멈춘다.

## source ledger 기준

| source | claim | date | confidence |
| --- | --- | --- | --- |
| URL | 확인한 주장 | 게시/접근 날짜 | high/medium/low |

## reporting template 기준

```text
결론
- <answer>

근거
- <source>: <claim>

주의
- <uncertainty/conflict>
```
