# NestJS backend 구조

## 기본 tree

```text
apps/api/
  src/
    main.ts
    app.module.ts
    modules/
    providers/
      cache/
      logger/
    graphql/
    health/
  test/
  Dockerfile
```

## logger와 cache

logger는 request context와 error shape를 일관되게 남긴다. monorepo Redis boundary는 `packages/db/src/redis`에 두고, API cache wrapper는 `apps/api/src/providers/cache` 아래에 둔다.

## database boundary 기준

Drizzle schema와 migration은 shared package에 두고, app은 repository/provider를 통해 접근한다. migration command와 destructive DB shell은 agent boundary에 표시한다.

## GraphQL codegen 기준

schema source, generated artifact, client output path를 tree에 명확히 적는다. generated file은 손으로 수정하지 않는다.

## TypeScript module 기준

NestJS/Fastify backend도 ESM only로 둔다. `package.json`에는 `type: "module"`을 두고, `tsconfig`는 `module: "NodeNext"`와 `moduleResolution: "NodeNext"`를 우선한다. 새 backend 구조에서 `CommonJS`, `require`, `module.exports`, `.cjs`, `.cts`를 만들지 않는다.
