# Plugin Catalog

이 문서는 이 repo가 보관하는 plugin의 human catalog다. 외부 vendored plugin/submodule 목록의 canonical source는 `.gitmodules`이고, repo-owned plugin 목록의 canonical source는 각 plugin의 `.codex-plugin/plugin.json`이다. 업데이트 후보를 찾는 단일 진입점은 `docs/update-source-registry.md`다. Plugin은 `skills/`와 다르게 manifest, MCP config, hooks, bundled skills를 함께 가질 수 있다. 따라서 plugin-bundled `skills/`를 이 repo 최상위 `skills/`로 옮기지 않는다.

## Repo-owned 플러그인

| Plugin | 위치 | 버전 | 출처 | 용도 |
| --- | --- | --- | --- | --- |
| `project-workflow` | `plugins/project-workflow` | `0.1.0` | repo-owned | 초기 프로젝트 셋팅 전용 orchestration plugin이다. `feature-workflow`는 별도 반복 개발 skill로 유지하고, `agent-eval-harness`는 companion 검증 스킬로 분리한다. |

## 외부 Vendored 플러그인

| Plugin | 위치 | 고정 버전 | 출처 | 용도 |
| --- | --- | --- | --- | --- |
| `context-mode` | `plugins/context-mode` | `v1.0.136` | `https://github.com/mksglu/context-mode` | context window 절약, session continuity, sandboxed execution, FTS5 검색을 제공하는 MCP plugin reference |
| `code-review-graph` | `plugins/code-review-graph` | `v2.3.3` | `https://github.com/tirth8205/code-review-graph` | token-efficient, context-aware code review를 위한 persistent incremental knowledge graph와 MCP server reference |
| `caveman` | `plugins/caveman` | `v1.8.2` | `https://github.com/JuliusBrussee/caveman` | agent output token 절감을 위한 terse communication skill/plugin, Caveman commands, compression, review/commit/stats, Cavecrew subagents source reference |

## 보관 기준

- 외부 plugin은 upstream 구조를 그대로 둔다.
- repo-owned plugin은 `.gitmodules`에 넣지 않고, plugin root의 `.codex-plugin/plugin.json`과 `README.md`를 canonical source로 둔다.
- Codex plugin manifest는 각 plugin의 `.codex-plugin/plugin.json`을 따른다.
- MCP entrypoint와 hooks는 plugin 내부 경로를 기준으로 유지한다.
- 이 repo는 plugin을 전역 설치하거나 global plugin directory에 등록하지 않는다.
- 새 clone 후에는 `git submodule update --init --recursive`를 실행한다.

## project-workflow 확인 사항

- Codex manifest: `plugins/project-workflow/.codex-plugin/plugin.json`
- Bundled skills: `plugins/project-workflow/skills/`
- Primary setup skill: `plugins/project-workflow/skills/project-workflow/SKILL.md`
- Optional TypeScript runner: `plugins/project-workflow/scripts/execute-phase.ts`
- Boundary review: `plugins/project-workflow/references/plugin-boundary-review.md`
- Companion validation skill: `skills/agent-eval-harness/SKILL.md`

## context-mode 확인 사항

- Codex manifest: `plugins/context-mode/.codex-plugin/plugin.json`
- MCP config: `plugins/context-mode/.codex-plugin/mcp.json`
- MCP entrypoint: `node ./start.mjs`
- Bundled skills: `plugins/context-mode/skills/`
- License: `Elastic-2.0`

## code-review-graph 확인 사항

- Package metadata: `plugins/code-review-graph/pyproject.toml`
- MCP config: `plugins/code-review-graph/.mcp.json`
- MCP server: `code-review-graph`
- MCP command: `uvx code-review-graph serve`
- Bundled skills: `plugins/code-review-graph/skills/`
- License: `MIT`

## caveman 확인 사항

- Package metadata: `plugins/caveman/package.json`
- Claude plugin manifest: `plugins/caveman/.claude-plugin/plugin.json`
- Codex plugin manifest: `plugins/caveman/plugins/caveman/.codex-plugin/plugin.json`
- Codex plugin hooks: `plugins/caveman/plugins/caveman/.codex-plugin/hooks.json`
- Codex SessionStart script: `plugins/caveman/plugins/caveman/hooks/codex/sessionstart.mjs`
- Commands: `plugins/caveman/commands/`
- Bundled skills: `plugins/caveman/skills/`
- Primary skill: `plugins/caveman/skills/caveman/SKILL.md`
- Extra skills: `caveman-help`, `caveman-compress`, `caveman-commit`, `caveman-review`, `caveman-stats`, `cavecrew`
- License: `MIT`

## 검증

```bash
node scripts/validate-plugins.ts .
```
