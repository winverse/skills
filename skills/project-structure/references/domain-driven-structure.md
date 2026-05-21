# 도메인 주도 구조 기준

## 목적

이 문서는 큰 프로젝트에서 `project-structure`가 기술 계층만 보고 폴더를 나누지 않도록 하는 DDD-lite 기준이다. 목표는 full DDD ceremony가 아니라, 시간이 지나도 agent가 folder와 문서만 보고 도메인 언어와 책임 경계를 다시 찾을 수 있게 하는 것이다.

## 질문

- bounded context가 하나인지 여러 개인지 확인한다.
- 핵심 객체가 entity, value object, DTO, external resource 중 무엇인지 확인한다.
- 코드로 지켜야 할 domain invariant, policy, use case, domain event 후보를 확인한다.
- domain package가 framework, DB, HTTP, UI state에 직접 의존하지 않도록 adapter boundary를 정한다.
- 작은 프로젝트라 하나의 context로 시작하면 그 이유를 `CONTEXT.md` 또는 folder-local instruction docs에 남긴다.

## 권장 tree

```text
packages/domain/src/<bounded-context>/
  model/
  policies/
  events/
  use-cases/

apps/api/src/<bounded-context>/
  routes/
  adapters/
  mappers/

apps/web/src/features/<bounded-context>/
  screens/
  components/
  client-state/
```

`model`, `policies`, `events`, `use-cases`는 실제 도메인 규칙이 있을 때만 만든다. 단순 CRUD라면 억지로 깊은 tree를 만들지 않고, 왜 가벼운 구조를 택했는지 문서에 남긴다.

## 폴더별 instruction docs

meaningful boundary folder마다 짧은 instruction index를 둔다.

- Codex 중심 프로젝트: `AGENTS.md`
- Claude 중심 프로젝트: `CLAUDE.md`
- 혼합 agent 프로젝트: 실제로 읽히는 instruction surface를 확인하고 필요한 문서만 둔다.
- 사람이 읽는 보조 설명: `README.md`

각 문서는 root rule 복사가 아니라 아래만 담는다.

- 이 folder의 목적
- local map
- domain terms와 책임 경계
- work-here와 do-not-change boundary
- 관련 authority docs
- 관련 skills
- validation commands
