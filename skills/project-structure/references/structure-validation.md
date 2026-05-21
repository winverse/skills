# 구조 검증

## final tree checklist 기준

- app, package, infra, docs boundary가 보이는가
- DDD-lite가 필요한 프로젝트에서 bounded context와 domain-first folder map이 보이는가
- domain package가 framework, DB, HTTP, UI state에 직접 의존하지 않는 adapter boundary가 보이는가
- env와 secret boundary가 보이는가
- GraphQL generated artifact 위치가 보이는가
- Drizzle migration 위치가 보이는가
- TypeScript를 쓰면 `package.json`의 `type: "module"`과 ESM `tsconfig` 정책이 보이는가
- `CommonJS`, `require`, `module.exports`, `.cjs`, `.cts`를 새 구조에 만들지 않는가
- test, health/readiness, observability 위치가 보이는가
- folder-local instruction docs가 필요한 boundary에 있는가. Codex 중심이면 `AGENTS.md`, Claude 중심이면 `CLAUDE.md`, 보조 설명은 `README.md`로 둔다.

## validation commands 기준

```bash
bun lint
bun typecheck
bun test
bun build
bun db:check
```

프로젝트가 Bun을 쓰지 않으면 실제 package manager 명령으로 바꾼다.
