# folder-local instruction docs 기준

## 목적

folder-local instruction docs는 root rule 복사가 아니라 boundary index다. agent가 해당 폴더에서 무엇을 읽고 무엇을 건드리지 말아야 하는지 빠르게 알게 한다.

- Codex 중심 프로젝트는 `AGENTS.md`를 우선한다.
- Claude 중심 프로젝트는 `CLAUDE.md`를 우선한다.
- 혼합 agent 프로젝트는 실제 instruction surface를 확인하고 필요한 문서만 짧게 둔다.
- 사람이 읽는 보조 설명은 `README.md`로 둔다.

## 포함할 항목

- 목적
- local map
- domain terms와 책임 경계
- do-not-change boundary
- work-here boundary
- authority docs
- related skills
- validation commands

## 추천 대상

- `apps/web`
- `apps/api`
- `packages/domain`
- `packages/domain/src/<bounded-context>`
- `packages/db`
- `packages/env`
- `infra/pulumi`

## 금지

root `AGENTS.md`나 `CLAUDE.md` 전체를 복사하지 않는다. 폴더 책임, domain terms, 금지 경계, 검증 명령만 짧게 둔다.
