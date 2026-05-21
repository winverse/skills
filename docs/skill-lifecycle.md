# Skill Lifecycle

이 문서는 shared skill을 오래 관리하기 위한 생명주기 기준이다. `history/skills.md`는 이 기준에 따라 확정된 변경만 기록한다.

## 상태

| State | Meaning | Project use |
| --- | --- | --- |
| `draft` | 아이디어나 실험 단계. trigger, workflow, HTML, validator가 아직 안정적이지 않다. | 새 프로젝트 기본 연결 금지 |
| `active` | 일반 프로젝트에 연결해도 되는 상태. `SKILL.md`, `skill.html`, snippet, 기본 검증이 맞춰져 있다. | 필요할 때 연결 |
| `critical` | 자주 쓰거나 결과 품질에 큰 영향을 주는 핵심 스킬. 실패 비용이 높다. | 우선 사용, 더 엄격히 검증 |
| `deprecated` | 더 나은 스킬이나 방식으로 대체 중이다. 기존 프로젝트 호환을 위해 잠시 유지한다. | 새 프로젝트 연결 금지 |
| `archived` | 더 이상 유지하지 않는다. 참고용으로만 남긴다. | 사용 금지 |

## 상태 변경 기준

스킬은 다음 조건을 만족하면 `active`가 될 수 있다.

- `SKILL.md`가 trigger와 workflow를 간결하게 설명한다.
- `skill.html`이 decision matrix, flowchart, chart, resource map 같은 시각 구조를 포함한다.
- 프로젝트 연결 snippet이 있다.
- repo 기본 TypeScript validator가 통과한다.
- 스킬별 validator가 필요한 경우 해당 validator가 있다.

다음 중 하나에 해당하면 `critical`로 승격한다.

- 여러 프로젝트에서 반복 사용한다.
- 웹 조사, 코드 생성, 배포, 보안, 비용, 법률, 의료, 금융처럼 결과 품질이나 검증이 중요하다.
- 잘못 작동하면 사용자가 잘못된 결정을 내릴 가능성이 크다.
- 별도 eval prompt, evidence rule, static validator가 필요하다.

다음 중 하나에 해당하면 `deprecated`로 표시한다.

- 더 나은 스킬이나 workflow로 대체됐다.
- trigger가 너무 넓거나 다른 스킬과 충돌한다.
- 유지보수할 의지가 없지만 기존 프로젝트가 아직 참조한다.
- HTML, snippet, validator가 현재 기준과 오래 어긋나 있다.

`deprecated` 상태에서 더 이상 참조 프로젝트가 없고 복구 계획도 없으면 `archived`로 바꾼다. archived skill은 필요할 때 `archive/`를 만들어 그 아래로 이동하거나, 이동이 프로젝트 링크를 깨뜨리면 원래 위치에 최소 안내만 남긴다.

## History에 기록할 것

`history/skills.md`에는 오래 봐도 의미 있는 변경만 남긴다.

- 새 skill 추가
- `draft`, `active`, `critical`, `deprecated`, `archived` 상태 변경
- trigger 또는 workflow의 의미 있는 변경
- validator, eval prompt, inspector 기준 추가 또는 제거
- project snippet의 trigger 변경
- skill rename, split, merge, archive

다음은 기록하지 않는다.

- 오탈자
- 내부 문장 다듬기
- 의미 없는 색상, spacing, copy 조정
- validator 결과만 반복 기록하는 일

## Review Cadence

- `critical`: 큰 변경마다 inspector check를 하고, 한 달에 한 번 history와 validator 상태를 훑는다.
- `active`: 큰 변경마다 inspector check를 한다.
- `draft`: 프로젝트 연결 전에 `active` 조건을 채운다.
- `deprecated`: 대체 경로와 제거 예정 조건을 history에 남긴다.
- `archived`: 새 변경을 피하고 참고용으로만 둔다.

## Inspector와의 관계

`inspector/`는 미해결 이슈를 임시로 두는 scratch 공간이다. 해결된 검사 파일은 삭제한다.

`history/skills.md`는 해결된 결정과 상태 변경을 남기는 영구 ledger다. 같은 내용을 둘 다 오래 보관하지 않는다.
