# Update Source Registry

이 문서는 `skill-update`가 업데이트 후보를 찾을 때 가장 먼저 보는 단일 진입점이다. 원본 정보를 여러 문서에 복사하지 않고, 각 범주의 canonical source를 여기서 정한다.

## 원칙

- `skill-update`는 대상 스킬을 고치기 전에 이 문서를 먼저 읽는다.
- 실제 vendored plugin 또는 외부 repo 목록은 `.gitmodules`가 canonical source다.
- repo-owned plugin은 `.gitmodules`가 아니라 각 plugin의 `.codex-plugin/plugin.json`과 `README.md`가 canonical source다.
- plugin의 설명, 버전 메모, 사용 목적은 `docs/plugin-catalog.md`에 두지만, plugin 추가/삭제 여부는 `.gitmodules`와 달라지면 안 된다.
- workflow가 참고만 하는 외부 primitive는 `.gitmodules`에 넣지 않는다. 이런 항목은 workflow provenance-only primitive이며, 각 workflow의 `references/upstream-dependency-map.md`가 canonical source다.
- repo-owned shared skill 목록은 `skills/*/SKILL.md`와 `history/skills.md`가 canonical source다.
- 원본 후보를 찾았다고 해서 `skill-update`가 plugin package, MCP config, submodule 자체를 업데이트할 권한을 갖는 것은 아니다. plugin bump나 submodule update는 사용자가 명시적으로 요청해야 한다.

## Source Families

| 범주 | canonical source | 보조 문서 | skill-update에서 하는 일 |
| --- | --- | --- | --- |
| Vendored external plugin/repo | `.gitmodules` | `docs/plugin-catalog.md`, plugin 내부 manifest | submodule path와 URL을 업데이트 후보로 읽고, 대상 skill과 관련 있을 때 version/commit/source ledger를 기록한다. |
| Repo-owned plugin | `plugins/<name>/.codex-plugin/plugin.json` | `plugins/<name>/README.md`, `docs/plugin-catalog.md` | plugin boundary, bundled skills, compatibility entry drift를 확인한다. |
| Plugin manifest detail | plugin 내부 manifest, 예: `.codex-plugin/plugin.json`, `.mcp.json`, `pyproject.toml` | `docs/plugin-catalog.md` | version, repository, MCP entrypoint, bundled skill 위치를 확인한다. |
| Workflow provenance-only primitive | `skills/project-workflow/references/upstream-dependency-map.md`, `skills/feature-workflow/references/upstream-dependency-map.md` | 각 workflow `SKILL.md`, eval fixture | 출처 라벨과 exact primitive name을 읽되, submodule처럼 취급하지 않는다. |
| Repo-owned shared skill | `skills/<skill>/SKILL.md`, `history/skills.md` | README, AGENTS, snippets, `skill.html` | local package update 범위와 lifecycle/event 기록 여부를 판단한다. |
| Project setup snippet | `project-snippets/*.md` | README, AGENTS, `docs/project-skill-setup.md` | target project에 전달되는 instruction drift를 확인한다. |

## `.gitmodules` 사용법

Vendored external repo 목록이 필요하면 `.gitmodules`를 직접 읽는다.

```bash
git config --file .gitmodules --get-regexp '^submodule\\..*\\.(path|url)$'
```

이 명령의 결과가 plugin catalog의 plugin row와 맞아야 한다. catalog에만 있고 `.gitmodules`에 없는 plugin은 vendored source가 아니라 후보 메모일 뿐이다. `.gitmodules`에 있고 catalog에 없는 plugin은 catalog drift다.

## Plugin update list

이 목록은 `.gitmodules`에서 파생한 사람이 읽는 별도 업데이트 후보 목록이다. Plugin 추가/삭제의 canonical source는 여전히 `.gitmodules`이고, 이 표는 `skill-update`가 plugin 자체 업데이트 필요성을 발견했을 때 보고할 대상과 점검 파일을 빠르게 고르기 위한 checklist다. `scripts/validate-plugins.ts`는 `.gitmodules`를 직접 파싱해 이 표와 `docs/plugin-catalog.md`에 submodule path와 upstream URL이 모두 있는지 검사한다.

| Plugin | Submodule path | Upstream URL | Update check files | 별도 update trigger |
| --- | --- | --- | --- | --- |
| `context-mode` | `plugins/context-mode` | `https://github.com/mksglu/context-mode.git` | `plugins/context-mode/.codex-plugin/plugin.json`, `plugins/context-mode/.codex-plugin/mcp.json`, `plugins/context-mode/.codex-plugin/hooks.json`, `plugins/context-mode/skills/` | manifest, MCP server, hook, bundled skill, release/tag 변경 |
| `code-review-graph` | `plugins/code-review-graph` | `https://github.com/tirth8205/code-review-graph.git` | `plugins/code-review-graph/pyproject.toml`, `plugins/code-review-graph/.mcp.json`, `plugins/code-review-graph/skills/review-pr/SKILL.md`, `plugins/code-review-graph/skills/review-changes/SKILL.md` | package version, MCP command, bundled review skill, release/tag 변경 |
| `caveman` | `plugins/caveman` | `https://github.com/JuliusBrussee/caveman.git` | `plugins/caveman/package.json`, `plugins/caveman/.claude-plugin/plugin.json`, `plugins/caveman/plugins/caveman/.codex-plugin/plugin.json`, `plugins/caveman/plugins/caveman/.codex-plugin/hooks.json`, `plugins/caveman/plugins/caveman/hooks/codex/sessionstart.mjs`, `plugins/caveman/commands/`, `plugins/caveman/skills/caveman/SKILL.md`, bundled `plugins/caveman/skills/` | installer metadata, Claude/Codex plugin manifest, SessionStart hook, command, compression skill, release/tag 변경 |

## Repo-owned plugin list

이 목록은 `.gitmodules`에서 파생하지 않는다. 이 repo가 직접 유지하는 plugin bundle이다.

| Plugin | Path | Manifest | Bundled skills | Boundary |
| --- | --- | --- | --- | --- |
| `project-workflow` | `plugins/project-workflow` | `plugins/project-workflow/.codex-plugin/plugin.json` | `plugins/project-workflow/skills/project-workflow/SKILL.md` | `feature-workflow`는 별도 반복 개발 스킬로 유지하고 bundle core에 넣지 않는다. |

`skill-update`가 이 표의 항목에서 submodule bump, plugin manifest 수정, MCP config 수정, bundled plugin skill 수정을 발견했지만 사용자가 plugin update를 명시하지 않았다면 local shared skill update 범위를 멈추고 별도 plugin update 요청이 필요하다고 보고한다. 사용자가 plugin update를 명시했거나 현재 요청에 plugin update를 포함했다면 plugin update lane으로 계속 진행하고, 해당 submodule의 tag/commit, upstream release note, package metadata, manifest, bundled skill 경로를 함께 확인한 뒤 `.gitmodules`, `docs/plugin-catalog.md`, 이 목록, validator, history를 맞춘다.

Plugin update list를 바꾼 뒤에는 아래 검증이 `.gitmodules`와 catalog/list drift를 잡아야 한다.

```bash
node scripts/validate-plugins.ts .
```

## skill-update preflight 순서

1. `docs/update-source-registry.md`를 읽고 source family를 고른다.
2. `.gitmodules`에서 vendored external repo 후보를 읽는다.
3. 대상 스킬의 `SKILL.md`, `references/`, `history/skills.md`, snippets, metadata, `skill.html`, git history에서 local provenance를 확인한다.
4. 대상 스킬이 workflow primitive를 참조하면 해당 `upstream-dependency-map.md`를 확인한다.
5. 대상 스킬이 plugin-bundled skill에서 fork되었거나 plugin을 명시적으로 참조하면 `.gitmodules`의 submodule과 plugin manifest를 원본 후보 증거로 읽는다.
6. 원본이 있거나 의심되면 `web-research`로 source, release/changelog, version/commit을 확인한다.
7. source ledger에 source URL, checked date, upstream version/commit, adopt/adapt/reject/defer 판단을 남긴다.
8. plugin package, MCP config, submodule bump가 필요하면 `Plugin update list`의 path, upstream URL, 점검 파일을 확인한다.
   - 사용자가 plugin update를 명시했으면 plugin update lane으로 계속 진행한다.
   - 명시하지 않았으면 `skill-update` 범위를 멈추고 별도 plugin update 요청이 필요한지 사용자에게 보고한다.

## Drift Checks

- `.gitmodules` path와 `docs/plugin-catalog.md`의 위치가 다르면 catalog drift다.
- repo-owned plugin이 `.gitmodules`에 들어가면 vendored source와 local source가 섞인 것이다.
- `.gitmodules` path 또는 URL이 `Plugin update list`에 없으면 update checklist drift다.
- `Plugin update list`나 `docs/plugin-catalog.md`가 `.gitmodules`에 없는 `plugins/<name>` 경로를 언급하면 stale plugin reference다.
- workflow primitive를 `.gitmodules`에 넣으면 vendored source와 provenance-only source가 섞인 것이다.
- plugin catalog에 version/source를 업데이트했지만 submodule commit이나 manifest가 그대로면 source ledger에 이유가 있어야 한다.
- `skill-update`가 `.gitmodules`를 읽지 않고 plugin-bundled skill의 원본 여부를 판단하면 preflight 누락이다.
