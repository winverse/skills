---
name: project-structure
description: "frontend, backend, full-stack monorepo, desktop app, infrastructure-aware project folder structure, DDD-lite domain-first folders, folder-local AGENTS.md index를 선택·생성·표준화·리팩터링할 때 사용한다."
---

# 프로젝트 구조

이 스킬은 새 프로젝트나 큰 구조 변경에서 folder boundary, DDD-lite domain-first folders, env, codegen, DB, test, security, health/readiness, observability, infra handoff를 한 번에 정리한다. raw product discovery는 먼저 `project-workflow`가 처리하고, 이 스킬은 도메인 언어와 구조 선택이 구체화된 뒤 호출한다.

## 첫 행동

- 사용자의 stack 선택이 명확하지 않으면 compact numeric choices로 확인한다.
- 기존 repo가 있으면 현재 구조와 package manager를 먼저 읽는다.
- `CONTEXT.md`, `CONTEXT-MAP.md`, ADR, PRD, issue, folder-local instruction docs가 있으면 stack보다 먼저 읽고 도메인 용어와 bounded context를 확인한다.
- 사용자가 infra를 요청하지 않았으면 Pulumi/AWS/Docker 배포 구조를 추가하지 않는다.

## 기본 stack

명시가 없으면 Bun, Turborepo, Next.js, NestJS with Fastify, GraphQL, urql, GraphQL Code Generator, PostgreSQL + Drizzle, Panda CSS with headless UI, Tauri, Zod env validation을 기본값으로 둔다. infra 요청 시 Pulumi, Docker, AWS ECR/ECS Fargate를 기본 경로로 둔다.

## TypeScript module 정책

- TypeScript를 쓰는 프로젝트 구조는 반드시 ESM으로 설계한다.
- `package.json`에는 `type: "module"`을 기본으로 둔다.
- TypeScript source와 repo-owned config는 `import`/`export`만 사용한다.
- `CommonJS`, `require`, `module.exports`, `exports.*`, `.cjs`, `.cts`는 생성하거나 권장하지 않는다.
- `tsconfig`는 runtime에 맞춰 ESM module 설정을 명시한다. Node/NestJS runtime은 `module: "NodeNext"`와 `moduleResolution: "NodeNext"`를 우선하고, Bun/Next.js/browser-bundled runtime은 `module: "ESNext"`와 `moduleResolution: "Bundler"`를 우선한다.
- 기존 repo가 CommonJS를 쓰고 있으면 새 구조 제안에서 CommonJS를 따라가지 말고 ESM 전환 boundary와 필요한 migration 단계를 tree와 검증 명령에 표시한다.
- 외부 도구가 CommonJS 설정만 요구하는 것처럼 보이면 `.cjs` fallback을 추가하지 말고 ESM 지원 경로를 찾거나 사용자에게 예외 승인을 요청한다.

## 보안과 도구 경계

- agent tool, MCP, external API, DB shell, migration, deploy script, destructive command, secret, scrubbed artifact boundary를 tree에 표시한다.
- Supabase service-role key와 MongoDB URI는 server-only로 둔다.
- generated artifact와 source artifact를 섞지 않는다.

## DDD-lite domain-first 구조 정책

- 중간 이상 규모, 장기 유지, 여러 agent/session 협업, 복잡한 business rule이 있는 프로젝트는 기술 계층만 있는 tree를 기본값으로 삼지 않는다.
- `project-workflow`가 만든 domain language를 기준으로 bounded context, entity/value object, domain invariant, policy, use case, adapter boundary를 먼저 정리한다.
- TypeScript monorepo에서는 `packages/domain/src/<bounded-context>/`를 우선 검토하고, API/UI는 같은 bounded context 이름을 따라 `apps/api/src/<bounded-context>/`, `apps/web/src/features/<bounded-context>/`처럼 맞춘다.
- 작은 프로젝트는 하나의 bounded context로 시작할 수 있다. 이 경우에도 `CONTEXT.md`나 folder-local instruction docs에 “단일 context로 시작하는 이유”를 남긴다.
- domain package는 framework, DB client, HTTP, UI state에 직접 의존하지 않는다. adapter와 mapper는 app 쪽이나 infrastructure boundary에 둔다.
- 의미 있는 boundary folder에는 folder-local instruction docs를 둔다. Codex 중심이면 `AGENTS.md`, Claude 중심이면 `CLAUDE.md`, 혼합 agent면 실제 instruction surface를 확인해 둘 중 하나 또는 둘 다 짧게 유지하고, 설명용 보조 문서는 `README.md`로 둔다.

## 구조 workflow

1. 제품/도메인 언어와 runtime 요구를 확인한다.
2. 필요한 경우 `DDD-lite` 기준으로 bounded context와 domain-first folder map을 정한다.
3. app, package, infra, docs boundary를 고른다.
4. TypeScript 사용 여부를 확인하고 ESM module policy를 package/env/codegen 경계에 반영한다.
5. env, codegen, DB migration, test, health/readiness, observability 위치를 정한다.
6. 의미 있는 boundary folder에 짧은 folder-local instruction docs를 둔다.
7. 최종 tree와 validation command를 함께 제시한다.

## output shape 기준

```text
선택한 구조
- <stack/runtime/db/infra>

폴더 트리
- <tree>

도메인 구조
- bounded context:
- domain-first folder map:
- folder-local instruction docs:

경계
- env/codegen/db/test/security/tool/infra
- TypeScript module: ESM only, CommonJS 금지

검증
- <commands>
```
