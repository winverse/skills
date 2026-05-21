## Project Skill: Project Structure

- For choosing, creating, standardizing, or refactoring frontend, backend, full-stack monorepo, desktop app, infrastructure-aware folder structures, or folder-local `AGENTS.md` indexes, use the shared skill at `<skills-root>/skills/project-structure/SKILL.md`.

## Project Structure Overrides

- If the request is still raw product discovery, domain modeling, PRD/issues, project setup, or “start a new project and prepare implementation,” use `project-workflow` first. Use `project-structure` after domain language and architecture questions are concrete enough to choose folder/env/codegen/db/infra boundaries. Use `feature-workflow` later for concrete implementation slices.
- If `CONTEXT.md`, `CONTEXT-MAP.md`, ADR, PRD, or `project-workflow` handoff exists, read it before choosing a tree. For medium, large, long-lived, or multi-agent projects, use DDD-lite domain-first folders: identify bounded context, domain invariant, entity/value object boundaries, and adapter boundaries before finalizing app/package layout.
- Prefer numeric choices when the project kind or stack is not clear.
- Default to Bun, Turborepo, Next.js, NestJS with Fastify, GraphQL, urql, GraphQL Code Generator, PostgreSQL + Drizzle, Panda CSS with headless UI, Tauri, Zod env validation, and Pulumi/Docker/AWS ECR/ECS Fargate when infrastructure is requested unless the project says otherwise.
- When TypeScript is used, enforce ESM only: set `package.json` `type: "module"`, use `import`/`export`, choose ESM `tsconfig` settings, and do not create or recommend CommonJS, `require`, `module.exports`, `.cjs`, or `.cts`.
- For Node/NestJS TypeScript runtime, prefer `module: "NodeNext"` and `moduleResolution: "NodeNext"`. For Bun, Next.js, or browser-bundled TypeScript runtime, prefer `module: "ESNext"` and `moduleResolution: "Bundler"`.
- If an existing repo uses CommonJS, mark it as an ESM migration boundary instead of copying the CommonJS pattern into new structure.
- Use MongoDB + Atlas when MongoDB/document DB is selected, and Supabase Postgres when the user wants managed psql-compatible Postgres. Keep Supabase service-role keys and MongoDB URIs server-only.
- Use `apps/web` or `apps/api` by default even for standalone frontend/backend projects unless the existing repo or user explicitly wants a root-level app.
- Use app-local env schemas and keep `packages/config` as helper-only. Shared packages must not read `process.env` directly.
- Keep app-owned env/codegen paths consistent across web, API, and desktop where applicable: `<app>/env/*`, `<app>/src/config/env.ts`, `<app>/codegen.ts`, and `<app>/src/graphql/autogen.ts`.
- In monorepos, keep Redis client, key, and connection helpers in `packages/db/src/redis`; API apps should wrap that boundary through `apps/api/src/providers/cache`.
- Keep API structured logging in `apps/api/src/providers/logger` and request logging integration in `apps/api/src/common/interceptors`.
- Keep Drizzle migration SQL and metadata in `packages/db/drizzle`; do not duplicate migration files under `src/migrations`.
- For MongoDB, keep client/collection/index helpers in `packages/db/src/mongo` and use seed/index sync scripts instead of Drizzle migrations.
- When GraphQL is selected, define the schema/document/autogen contract and choose one generated artifact policy: ignored and reproducible, or committed and reviewed.
- Represent frontend Panda CSS tokens/recipes/generated output, backend health/security/observability, and app-level test surfaces in the final tree when those capabilities are selected.
- When agent tools, MCP servers, external APIs, DB shells, deploy scripts, migrations, or write-capable automation are part of the structure, document the read/write/delete/network authority, approval boundary, least-privilege credential scope, and scrubbed logs/fixtures policy.
- Include `infra/pulumi`, app-local Dockerfiles, AWS ECR image ownership, and an ECS Fargate or EC2 Docker host runtime path only when deployment, cloud, Docker, Pulumi, AWS, ECR, ECS, EC2, or CI/CD structure is requested.
- For infrastructure-aware structures, include the public entrypoint choice, required secret names, Pulumi stack config examples without live values, immutable image tag handoff, and a post-deploy smoke check.
- Add short folder-local instruction docs for meaningful boundary folders such as `apps/web`, `apps/api`, `packages/domain`, `packages/domain/src/<bounded-context>`, `packages/db`, and `infra/pulumi`. Prefer `AGENTS.md` for Codex, `CLAUDE.md` for Claude, and `README.md` only as a human-readable helper. Keep them as table-of-contents files with purpose, local map, domain terms, work-here, do-not-change, related skills, authority docs, and validation commands.
