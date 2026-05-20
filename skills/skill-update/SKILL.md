---
name: skill-update
description: "기존 shared skill을 업데이트, 수정, 개선, 유지보수, rename, split, deprecate, archive할 때 사용한다."
---

# 스킬 업데이트

이 스킬은 기존 스킬을 바꿀 때 `docs/update-source-registry.md`를 단일 진입점으로 읽고, `SKILL.md`, references, validators, `agents/openai.yaml`, `skill.html`, snippets, docs, history를 하나의 package로 맞춘다. 원본 skill이나 upstream primitive에서 파생된 스킬은 원본을 먼저 확인하고, 원본 delta를 이 repo에 적용한다.

## 핵심 계약

- 사용자가 의도한 behavior change에서 시작한다.
- 기존 유용한 behavior는 요청 없이 제거하지 않는다.
- `SKILL.md`는 concise하고 trigger-focused로 유지한다.
- 긴 예시, 취향, source rule은 `references/`로 옮긴다.
- material change가 있으면 `skill-to-html`도 실행한다.
- `skill.html`을 바꾸면 정적 HTML validator뿐 아니라 PC viewport에서 표, SVG arrow, overflow, text overlap을 직접 확인한다.
- skill add/remove/rename/archive/restore가 있으면 show-skills HTML catalog를 갱신한다.
- 한국어 Markdown 규칙을 지켜 `skills/**/*.md`를 한국어 우선으로 유지한다.
- `skill-update` 호출 자체는 대상 skill의 original/upstream provenance preflight를 포함한다.
- 사용자가 원본 조사를 따로 말하지 않아도 먼저 `docs/update-source-registry.md`를 읽고 source family를 고른다.
- 사용자가 "전체 업데이트", "외부 dependency 업데이트", "plugin과 workflow primitive까지 업데이트"처럼 repo dependency 갱신을 요청하면 이를 explicit dependency update sweep으로 본다.
- dependency update sweep은 `.gitmodules`의 vendored plugin 전부, repo-owned plugin 목록, `project-workflow`와 `feature-workflow`의 `upstream-dependency-map.md` 전부를 자동 점검 범위에 넣는다.
- `.gitmodules`는 vendored plugin/submodule update candidates의 canonical source다.
- `docs/update-source-registry.md`의 `Plugin update list`는 `.gitmodules`에서 파생한 사람이 읽는 별도 plugin update checklist다.
- `scripts/validate-plugins.ts`는 `.gitmodules`를 직접 파싱해 plugin catalog와 `Plugin update list`의 path/URL drift를 막는다.
- workflow provenance-only primitive는 각 workflow의 `references/upstream-dependency-map.md`를 canonical source로 읽고, `.gitmodules` 항목처럼 취급하지 않는다.
- 그 다음 `references/`, `history/skills.md`, project snippets, `agents/openai.yaml`, `skill.html`, git history에서 local provenance를 찾는다.
- 대상 skill이 plugin-bundled skill에서 fork되었거나 이를 명시적으로 참조할 때만 `.gitmodules`와 plugin/submodule metadata를 원본 후보 증거로 읽는다.
- `skill-update`는 plugin package, MCP config, submodule 자체를 incidental하게 업데이트하지 않는다. plugin bump나 bundled plugin skill 수정은 사용자가 plugin update를 명시했을 때 plugin update lane으로 다룬다.
- dependency update sweep 요청은 plugin update를 명시한 것으로 간주하되, 각 submodule bump 전에는 upstream release/changelog와 local manifest drift를 확인하고 source ledger를 남긴다.
- 원본이 있는 스킬은 local provenance를 확인한 뒤 `web-research`로 원본 source를 검증한다.
- 원본 확인이 현재성, release/changelog 비교, 여러 후보 탐색을 필요로 하면 runtime이 허용하는 한 `web-research`의 병렬 sub-agent fan-out을 사용한다.
- 원본 조사 결과는 source URL, checked date, upstream version/commit, local 채택 판단을 포함한 source ledger로 남긴다.
- 원본 수정 권한과 위치가 명확하면 원본 변경을 먼저 준비하거나 적용한 뒤, 그 delta를 이 repo의 shared skill package에 반영한다.
- 원본 전체를 무조건 복사하지 않고 `adopt`, `adapt`, `reject`, `defer`로 분류한 뒤 이 repo의 취향과 cross-agent 계약에 맞는 delta만 반영한다.
- 원본을 직접 수정할 수 없으면 source ledger, checked date, local delta 이유를 references나 history에 남긴다.

## update scope 기준

| 변경 | follow-up |
| --- | --- |
| trigger/description | SKILL.md, snippet, README/AGENTS, metadata, HTML, history |
| workflow/rules | SKILL.md, references, validator, HTML, history |
| validator/script | README command, validator 실행, 필요 시 history |
| rename/split/archive | 경로 전체 갱신, catalog, lifecycle, history |
| upstream/original delta | provenance preflight, web-research ledger, release/changelog 비교, 원본 변경, local package, history/eval |
| dependency update sweep | `.gitmodules` plugin 전체, repo-owned plugin, workflow primitive map 전체, web-research source ledger, plugin catalog/history/validator |

## workflow

1. 대상 skill과 결과를 확인한다.
2. 현재 skill folder, snippets, README, AGENTS, history를 본다.
3. `docs/update-source-registry.md`를 읽고 `.gitmodules`, workflow source map, repo-owned skill inventory 중 어느 source family가 relevant한지 고른다.
4. original/upstream provenance preflight를 실행해 원본 skill, upstream primitive, fork 기록, git history를 찾는다.
5. 원본이 없으면 `no upstream source found`를 판단 근거와 함께 기록하고 local package 기준으로 진행한다.
6. 대상 skill이 plugin-bundled skill에서 온 경우에만 `.gitmodules`, `Plugin update list`, plugin/submodule metadata, package manifest를 원본 증거로 읽는다.
7. 원본이 있거나 의심되면 `web-research`로 공식 repo/docs/source/release/changelog를 찾고, runtime이 허용하면 독립 후보와 변경 이력을 병렬로 비교한다.
8. source ledger에 source URL, checked date, upstream version/commit, 변경 후보, local 적용 판단을 남긴다.
9. plugin package, MCP config, submodule bump가 필요하지만 사용자가 plugin update를 명시하지 않았으면 멈추고 별도 plugin update 필요성을 보고한다.
10. 사용자가 plugin update를 명시했거나 dependency update sweep을 요청했으면 plugin update lane으로 submodule tag/commit, upstream release note, package metadata, manifest, bundled skill 경로를 확인하고 `.gitmodules`, `docs/plugin-catalog.md`, `Plugin update list`, validator, history를 맞춘다.
11. dependency update sweep이면 workflow primitive lane도 함께 실행해 `project-workflow`와 `feature-workflow`의 upstream source, exact primitive name, adopted role, handoff boundary를 확인하고 `upstream-dependency-map.md`, snippets, eval, history를 갱신한다.
12. 원본 수정 권한과 위치가 확인되면 원본 skill 변경을 먼저 준비하거나 적용한다.
13. 원본 delta를 `adopt`, `adapt`, `reject`, `defer`로 분류하고 이 repo의 skill folder, references, snippets, README, AGENTS, docs, history에 적용한다.
14. 최소 파일을 수정한다.
15. material change면 `skill-to-html`을 실행한다.
16. `skill.html`이 바뀌었으면 `validate-skill-html.ts`와 browser rendering check로 wide table, SVG arrow endpoint, overflow, text overlap을 확인한다.
17. `docs/skill-inspector.md` 기준으로 검사한다.
18. validator를 실행하고 결과를 보고한다.

## ask before changing 기준

trigger 의미 변경, behavior 제거, rename/split/archive, repo-wide preference 변경, source-of-truth conflict는 사용자에게 묻는다.
