# full-stack monorepo 구조

## 기본 tree

```text
apps/
  web/
  api/
packages/
  domain/
  db/
  env/
  config/
  ui/
infra/
  pulumi/
```

## package roles 기준

- `packages/domain`: bounded context별 domain model, policy, use case, domain event. framework, DB, HTTP, UI state에 직접 의존하지 않는다.
- `packages/db`: Drizzle schema, migration, Redis boundary
- `packages/env`: server/client/shared env validation
- `packages/config`: eslint, tsconfig, shared tooling. TypeScript 설정은 ESM only이며 CommonJS 설정을 만들지 않는다.
- `packages/ui`: app 간 공유가 확실한 component만

## TypeScript module 기준

- 모든 TypeScript package는 `package.json`에 `type: "module"`을 둔다.
- workspace source와 repo-owned config는 `import`/`export`만 사용한다.
- `CommonJS`, `require`, `module.exports`, `.cjs`, `.cts`는 새 구조에 넣지 않는다.
- Node/NestJS package는 `module: "NodeNext"`와 `moduleResolution: "NodeNext"`를 우선한다.
- Next.js, Bun, browser-bundled package는 `module: "ESNext"`와 `moduleResolution: "Bundler"`를 우선한다.

## script policy 기준

root script는 orchestration만 하고, app/package script는 실제 작업을 가진다. generated artifact는 source와 구분한다.

이 구조는 여러 app과 shared package가 함께 움직일 때 책임을 분명히 하기 위한 기준이다. 새 package를 만들기 전에는 실제로 두 곳 이상에서 재사용되는지 확인한다.

## DDD-lite 기준

장기 유지 프로젝트는 domain-first folder map을 먼저 확인한다. 예시는 `packages/domain/src/<bounded-context>/`, `apps/api/src/<bounded-context>/`, `apps/web/src/features/<bounded-context>/`다. 작은 프로젝트가 단일 bounded context로 시작해도 `CONTEXT.md`나 folder-local instruction docs에 그 이유를 남긴다.
