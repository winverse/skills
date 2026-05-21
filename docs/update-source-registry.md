# Update Source Registry

이 문서는 이 repo에서 외부 원본, vendored plugin, repo-owned plugin, workflow primitive를 업데이트할 때 보는 단일 사람용 진실원이다. `skill-update`는 대상 스킬을 고치기 전에 이 문서를 먼저 읽고, 여기 있는 source id와 checked ledger를 기준으로 원본 확인, `adopt`/`adapt`/`reject`/`defer` 판단, local delta 적용 범위를 정한다.

## 단일 진실원 원칙

- upstream source URL, checked date, upstream version/commit, source id, local 채택 판단은 이 문서에서만 관리한다.
- workflow의 `references/upstream-dependency-map.md`는 source registry가 아니라 usage map이다. 기존 표현으로는 workflow provenance-only primitive 사용 장부이며, 각 workflow가 어떤 source id를 어떤 순서와 handoff로 쓰는지만 적고, source URL이나 checked ledger를 복사하지 않는다.
- workflow usage map의 `source id` 컬럼은 이 문서의 source id를 참조해야 한다. `scripts/validate-source-registry.ts`는 이 연결과 source URL/checked date 중복을 검사한다.
- `.gitmodules`는 Git submodule path와 URL의 machine-readable source다. 이 문서는 update 작업자가 읽는 사람용 registry이며, `.gitmodules`와 다른 값을 적으면 drift다.
- plugin runtime entrypoint, MCP config, hook path, bundled skill path는 plugin manifest와 plugin 내부 파일이 machine-readable source다. 이 문서는 update 후보와 점검 파일을 가리킨다.
- repo-owned shared skill 목록은 `skills/*/SKILL.md`와 `history/skills.md`가 runtime/catalog source다. 이 문서는 외부 원본 또는 update source가 있는 항목만 다룬다.
- 다른 문서에서 source 정보를 설명해야 할 때는 source id를 인용하고 이 문서로 링크한다. source URL, checked date, upstream version/commit을 중복 작성하지 않는다.

## Source ID 규칙

| 범주 | source id 예시 | 기준 |
| --- | --- | --- |
| Vendored plugin | `vendor.context-mode` | `.gitmodules`에 있는 외부 submodule |
| Repo-owned plugin | `repo-plugin.project-workflow` | 이 repo가 직접 유지하는 plugin bundle |
| Repo-owned plugin | `repo-plugin.ai-video-workflow` | 이 repo가 직접 유지하는 local video workflow plugin bundle |
| Matt Pocock skills | `matt-pocock.grill-with-docs` | Matt Pocock source에서 온 skill 또는 primitive |
| GStack plugin | `gstack.office-hours` | GStack source에서 온 plugin skill 또는 command |
| Superpowers plugin | `superpowers.writing-plans` | Superpowers source에서 온 composable skill |
| Observed workflow | `observed.harness-framework.execute-phase` | 원본 prompt를 복제하지 않고 구조 아이디어만 채택한 외부 자료 |
| Observed external tool | `observed.voicebox` | vendoring하지 않고 workflow에서 호출하거나 연결하는 외부 local tool |

source id는 rename하지 않는다. 원본 이름이 바뀌면 새 source id를 추가하고, 기존 id는 `replaced by` 메모를 남긴다.

## Source Families

| 범주 | canonical source | usage 문서 | skill-update에서 하는 일 |
| --- | --- | --- | --- |
| Vendored external plugin/repo | `.gitmodules`와 이 문서의 `Plugin update list` | `docs/plugin-catalog.md`, plugin 내부 manifest | submodule path와 URL drift를 확인하고, plugin update가 명시된 경우 version/commit/source ledger를 갱신한다. |
| Repo-owned plugin | plugin root의 `.codex-plugin/plugin.json`, `README.md`, 이 문서의 `Repo-owned plugin lane` | `docs/plugin-catalog.md`, bundled skill | plugin boundary, bundled skill drift를 확인한다. |
| Workflow primitive | 이 문서의 `Workflow primitive lane` | 각 workflow의 `references/upstream-dependency-map.md`, eval fixture | source URL과 checked ledger는 여기서만 관리하고, workflow 문서에는 채택 역할과 실행 순서만 반영한다. |
| External tool | 이 문서의 `External tool lane` | plugin 내부 source ledger, README, bundled skill | vendoring하지 않는 local tool의 checked source와 local 채택 판단을 관리한다. |
| Repo-owned shared skill | `skills/<skill>/SKILL.md`, `history/skills.md` | README, AGENTS, snippets, `skill.html` | local package update 범위와 lifecycle/event 기록 여부를 판단한다. |
| Project setup snippet | `project-snippets/*.md` | README, AGENTS, `docs/project-skill-setup.md` | target project에 전달되는 instruction drift를 확인한다. |

## Vendored plugin details

### Vendored plugin lane

| Plugin | Source ID | Submodule path | Upstream URL | Update check files | 별도 update trigger |
| --- | --- | --- | --- | --- | --- |
| `context-mode` | `vendor.context-mode` | `plugins/context-mode` | `https://github.com/mksglu/context-mode.git` | `plugins/context-mode/.codex-plugin/plugin.json`, `plugins/context-mode/.codex-plugin/mcp.json`, `plugins/context-mode/.codex-plugin/hooks.json`, `plugins/context-mode/skills/` | manifest, MCP server, hook, bundled skill, release/tag 변경 |
| `code-review-graph` | `vendor.code-review-graph` | `plugins/code-review-graph` | `https://github.com/tirth8205/code-review-graph.git` | `plugins/code-review-graph/pyproject.toml`, `plugins/code-review-graph/.mcp.json`, `plugins/code-review-graph/skills/review-pr/SKILL.md`, `plugins/code-review-graph/skills/review-changes/SKILL.md` | package version, MCP command, bundled review skill, release/tag 변경 |
| `caveman` | `vendor.caveman` | `plugins/caveman` | `https://github.com/JuliusBrussee/caveman.git` | `plugins/caveman/package.json`, `plugins/caveman/.claude-plugin/plugin.json`, `plugins/caveman/plugins/caveman/.codex-plugin/plugin.json`, `plugins/caveman/plugins/caveman/.codex-plugin/hooks.json`, `plugins/caveman/plugins/caveman/hooks/codex/sessionstart.mjs`, `plugins/caveman/commands/`, `plugins/caveman/skills/caveman/SKILL.md`, bundled `plugins/caveman/skills/` | installer metadata, Claude/Codex plugin manifest, SessionStart hook, command, compression skill, release/tag 변경 |

## Plugin update list

이 목록은 `.gitmodules`와 repo-owned plugin lane에서 파생한 사람이 읽는 빠른 점검 표다. 아래 compact row는 validator와 사람이 같은 path/URL을 확인하기 위한 compatibility view이고, 세부 점검 파일은 위 Vendored plugin lane과 아래 Repo-owned plugin lane을 따른다.

| Plugin | Path | Upstream 또는 source |
| --- | --- | --- |
| `context-mode` | `plugins/context-mode` | `https://github.com/mksglu/context-mode.git` |
| `code-review-graph` | `plugins/code-review-graph` | `https://github.com/tirth8205/code-review-graph.git` |
| `caveman` | `plugins/caveman` | `https://github.com/JuliusBrussee/caveman.git` |
| `project-workflow` | `plugins/project-workflow` | repo-owned plugin |
| `ai-video-workflow` | `plugins/ai-video-workflow` | repo-owned plugin |

이 표는 `.gitmodules`에서 파생한 사람이 읽는 Plugin update list다. Plugin 추가/삭제의 machine-readable source는 `.gitmodules`이고, 이 표는 `skill-update`가 plugin 자체 업데이트 필요성을 발견했을 때 보고할 대상과 점검 파일을 고르는 checklist다. `scripts/validate-plugins.ts`는 `.gitmodules`, `docs/plugin-catalog.md`, 이 문서의 Plugin update list가 같은 plugin path와 upstream URL을 담는지 검사한다.

## Repo-owned plugin lane

| Plugin | Source ID | Path | Manifest | Bundled skills | Boundary |
| --- | --- | --- | --- | --- | --- |
| `project-workflow` | `repo-plugin.project-workflow` | `plugins/project-workflow` | `plugins/project-workflow/.codex-plugin/plugin.json` | `plugins/project-workflow/skills/project-workflow/SKILL.md`, `plugins/project-workflow/scripts/execute-phase.ts` | `feature-workflow`는 별도 반복 개발 스킬로 유지하고 bundle core에 넣지 않는다. |
| `ai-video-workflow` | `repo-plugin.ai-video-workflow` | `plugins/ai-video-workflow` | `plugins/ai-video-workflow/.codex-plugin/plugin.json` | `plugins/ai-video-workflow/skills/ai-video-workflow/SKILL.md`, `plugins/ai-video-workflow/scripts/doctor.ts`, `plugins/ai-video-workflow/scripts/scaffold-video-project.ts`, `plugins/ai-video-workflow/scripts/validate-video-project.ts` | Voicebox와 HyperFrames를 submodule로 vendoring하지 않고, 동의된 profile/sample workflow와 local tool handoff만 관리한다. |

## External tool lane

| Source ID | 출처 패키지 | 정확한 이름 | Source URL 또는 checked source | Checked | Local 판단 |
| --- | --- | --- | --- | --- | --- |
| `observed.voicebox` | Voicebox | `voicebox` | `https://github.com/jamiepine/voicebox` | 2026-05-21 | `adapt`: local-first voice cloning/generation app으로 보고 profile/API workflow만 연결 |
| `observed.voicebox-mcp` | Voicebox docs | `MCP Server` | `https://docs.voicebox.sh/overview/mcp-server` | 2026-05-21 | `adapt`: localhost no-auth boundary와 consent rule 때문에 plugin manifest에는 자동 MCP 등록하지 않고 target config snippet만 제공 |
| `observed.hyperframes` | HyperFrames | `hyperframes` | `https://github.com/heygen-com/hyperframes`, `https://hyperframes.heygen.com/` | 2026-05-21 | `adapt`: HyperFrames 자체는 vendoring하지 않고 HTML video brief, CLI handoff, Node 22/FFmpeg doctor만 제공 |

## Workflow primitive lane

| Source ID | 출처 패키지 | 정확한 이름 | Source URL 또는 checked source | Checked | Local 판단 |
| --- | --- | --- | --- | --- | --- |
| `matt-pocock.setup-matt-pocock-skills` | Matt Pocock skills | `setup-matt-pocock-skills` | `https://github.com/mattpocock/skills`, `https://www.aihero.dev/skills` | 2026-05-19 | `adopt`: project skill setup과 issue/domain docs 준비만 채택 |
| `matt-pocock.grill-with-docs` | Matt Pocock skills | `grill-with-docs` | `https://github.com/mattpocock/skills`, raw `skills/engineering/grill-with-docs/SKILL.md`, `CONTEXT-FORMAT.md`, `ADR-FORMAT.md`, `https://www.aihero.dev/grill-with-docs`, `https://www.aihero.dev/skills-domain-model`, `https://www.aihero.dev/skills/skills-changelog-ubiquitous-language-grill-with-docs` | 2026-05-20 | `adapt`: project setup 기본 domain docs gate. `grill-me`를 기본 gate로 쓰지 않고, 첫 용어 확정 시 `CONTEXT.md`를 lazy artifact로 제안 |
| `matt-pocock.grill-me` | Matt Pocock skills | `grill-me` | `https://github.com/mattpocock/skills`, `https://www.aihero.dev/skills` | 2026-05-20 | `defer`: project setup 기본 gate가 아니라 비코드 standalone fallback 후보 |
| `matt-pocock.to-prd` | Matt Pocock skills | `to-prd` | `https://github.com/mattpocock/skills`, `https://www.aihero.dev/skills` | 2026-05-19 | `adopt`: product challenge 이후 PRD handoff만 채택 |
| `matt-pocock.to-issues` | Matt Pocock skills | `to-issues` | `https://github.com/mattpocock/skills`, `https://www.aihero.dev/skills` | 2026-05-19 | `adopt`: PRD를 vertical issue backlog로 쪼개는 역할만 채택 |
| `matt-pocock.triage` | Matt Pocock skills | `triage` | `https://github.com/mattpocock/skills`, `https://www.aihero.dev/skills` | 2026-05-19 | `adopt`: issue ready/block/split 판단만 조건부 채택 |
| `matt-pocock.tdd` | Matt Pocock skills | `tdd` | `https://github.com/mattpocock/skills`, `https://www.aihero.dev/skills` | 2026-05-19 | `defer`: setup에서는 제외하고 `feature-workflow` 구현 loop에서만 고려 |
| `matt-pocock.review` | Matt Pocock skills | `review` | `https://github.com/mattpocock/skills` | 2026-05-19 | `defer`: repo-local `code-review`와 충돌하지 않게 feature 완료 전 review 후보로만 둠 |
| `matt-pocock.diagnose` | Matt Pocock skills | `diagnose` | `https://github.com/mattpocock/skills` | 2026-05-19 | `adopt`: 실패 원인 분석 primitive로 feature loop에서 조건부 채택 |
| `matt-pocock.document-sync` | Matt Pocock skills | `document-sync` | `https://github.com/mattpocock/skills` | 2026-05-19 | `adapt`: repo-local `sync-docs` handoff로 매핑 |
| `matt-pocock.improve-codebase-architecture` | Matt Pocock skills | `improve-codebase-architecture` | `https://github.com/mattpocock/skills` | 2026-05-19 | `defer`: 큰 구현 후 architecture cleanup 후보 |
| `matt-pocock.semantic-commits` | Matt Pocock skills | `semantic-commits` | `https://github.com/mattpocock/skills` | 2026-05-19 | `adapt`: repo-local `atomic-committer` handoff로 매핑 |
| `matt-pocock.ship` | Matt Pocock skills | `ship` | `https://github.com/mattpocock/skills` | 2026-05-19 | `defer`: release checklist 후보, deploy/publish는 별도 요청 필요 |
| `gstack.office-hours` | GStack plugin | `office-hours` | `https://github.com/garrytan/gstack`, `office-hours/SKILL.md` | 2026-05-19 | `adopt`: product value, demand, 좁은 진입점 검증 |
| `gstack.plan-ceo-review` | GStack plugin | `plan-ceo-review` | `https://github.com/garrytan/gstack` | 2026-05-19 | `adopt`: scope, premise, product decision review 조건부 채택 |
| `gstack.plan-eng-review` | GStack plugin | `plan-eng-review` | `https://github.com/garrytan/gstack` | 2026-05-19 | `adopt`: 큰 implementation plan의 architecture/test 검토 |
| `gstack.plan-design-review` | GStack plugin | `plan-design-review` | `https://github.com/garrytan/gstack` | 2026-05-19 | `adopt`: substantial UI의 design review 조건부 채택 |
| `gstack.browse` | GStack plugin | `browse` | `https://github.com/garrytan/gstack` | 2026-05-19 | `defer`: repo-local `browser-qa`와 중복되므로 feature loop에서 조건부 |
| `gstack.review` | GStack plugin | `review` | `https://github.com/garrytan/gstack` | 2026-05-19 | `defer`: repo-local `code-review`와 병행 가능할 때만 조건부 |
| `gstack.qa` | GStack plugin | `qa` | `https://github.com/garrytan/gstack` | 2026-05-19 | `adapt`: `browser-qa` 또는 non-browser runtime evidence로 매핑 |
| `gstack.ship` | GStack plugin | `ship` | `https://github.com/garrytan/gstack` | 2026-05-19 | `defer`: destructive release action 없이 checklist만 조건부 |
| `gstack.retro` | GStack plugin | `retro` | `https://github.com/garrytan/gstack` | 2026-05-19 | `adopt`: 큰 spec 후 회고와 eval seed 후보 |
| `superpowers.brainstorming` | Superpowers plugin | `brainstorming` | `https://github.com/obra/superpowers` | 2026-05-19 | `adapt`: `project-workflow` raw idea 첫 응답에서 `office-hours` 뒤 setup gap check로 채택 |
| `superpowers.writing-plans` | Superpowers plugin | `writing-plans` | `https://github.com/obra/superpowers` | 2026-05-19 | `adapt`: setup에서는 phase/step handoff gap 보강, feature에서는 implementation plan으로 채택 |
| `superpowers.subagent-driven-development` | Superpowers plugin | `subagent-driven-development` | `https://github.com/obra/superpowers` | 2026-05-19 | `adopt`: 큰 feature implementation에서만 조건부 채택 |
| `superpowers.tdd` | Superpowers plugin | `test-driven-development`, `tdd` | `https://github.com/obra/superpowers` | 2026-05-19 | `adopt`: `feature-workflow`의 RED -> GREEN -> REFACTOR evidence loop |
| `superpowers.verification-before-completion` | Superpowers plugin | `verification-before-completion` | `https://github.com/obra/superpowers` | 2026-05-19 | `adopt`: 완료 전 검증 누락 방지 checklist |
| `observed.harness-framework.execute-phase` | observed workflow | `harness_framework execute.py` | `https://github.com/jha0313/harness_framework`, `scripts/execute.py`, `scripts/test_execute.py`, `.claude/commands/harness.md`, user-provided Notion tutorial | 2026-05-20 | `adapt`: Python engine, 자동 commit/push, 권한 우회 flag는 버리고 phase/step status, blocked state, acceptance command, 리팩터링 안전망 테스트 의도만 Codex-first TypeScript runner boundary와 `validate-execute-phase.ts`로 채택 |

## Dependency update sweep

사용자가 "전체 업데이트", "외부 dependency 업데이트", "plugin과 workflow primitive 업데이트"처럼 repo-wide source refresh를 요청하면 `skill-update`는 아래 범위를 하나의 sweep으로 다룬다.

| Lane | 포함 범위 | 단일 진실원 | usage 문서와 검증 |
| --- | --- | --- | --- |
| Vendored plugin lane | `.gitmodules`의 모든 submodule: `context-mode`, `code-review-graph`, `caveman` | `.gitmodules` + 이 문서의 `Plugin update list` | `docs/plugin-catalog.md`, plugin manifest, `scripts/validate-plugins.ts` |
| Repo-owned plugin lane | `repo-plugin.project-workflow`, `repo-plugin.ai-video-workflow` | plugin manifest + 이 문서의 `Repo-owned plugin lane` | repo-owned plugin `README.md`, bundled skill |
| Workflow primitive lane | Matt Pocock, GStack, Superpowers, observed workflow source ids | 이 문서의 `Workflow primitive lane` | `plugins/project-workflow/skills/project-workflow/references/upstream-dependency-map.md`, `skills/feature-workflow/references/upstream-dependency-map.md`, snippets, eval, history |
| External tool lane | Voicebox, Voicebox MCP, HyperFrames처럼 vendoring하지 않는 local tool source ids | 이 문서의 `External tool lane` | `plugins/ai-video-workflow/skills/ai-video-workflow/references/source-ledger.md`, plugin README, bundled skill |

Sweep 결과는 source id, checked date, upstream version/commit, compared files/release notes, `adopt`/`adapt`/`reject`/`defer` 판단을 이 문서에 먼저 남긴다. 변경이 없으면 `defer` 또는 `reject` 이유와 검증 결과만 보고한다.

## Preflight 순서

1. 이 문서를 읽고 source id와 source family를 고른다.
2. vendored plugin이면 `.gitmodules`에서 path와 URL을 확인하고 이 문서의 `Plugin update list`와 drift를 본다.
3. workflow primitive면 이 문서의 `Workflow primitive lane`에서 source URL, checked date, local 판단을 확인한다.
4. 대상 workflow의 `references/upstream-dependency-map.md`에서는 source id가 실제 실행 순서와 handoff에 어떻게 쓰이는지만 확인한다.
5. 대상 skill의 `SKILL.md`, `references/`, `history/skills.md`, snippets, metadata, `skill.html`, git history에서 local provenance를 확인한다.
6. 원본이 있거나 의심되면 `web-research`로 source, release/changelog, version/commit을 확인한다.
7. source ledger는 이 문서에 남긴다. workflow usage map에는 source URL과 checked date를 복사하지 않는다.
8. plugin package, MCP config, submodule bump가 필요하면 `Plugin update list`의 path, upstream URL, 점검 파일을 확인한다.
   - 사용자가 plugin update를 명시했으면 plugin update lane으로 계속 진행한다.
   - 명시하지 않았으면 `skill-update` 범위를 멈추고 별도 plugin update 요청이 필요한지 보고한다.
9. dependency update sweep이면 plugin update lane과 workflow primitive lane을 모두 실행한다.

## Drift Checks

- source URL이나 checked date가 workflow usage map에 복사되어 있으면 source-of-truth drift다.
- workflow usage map의 `source id`가 이 문서에 없으면 source-of-truth drift다.
- `.gitmodules` path와 이 문서의 `Plugin update list`, `docs/plugin-catalog.md`가 다르면 catalog drift다.
- repo-owned plugin이 `.gitmodules`에 들어가면 vendored source와 local source가 섞인 것이다.
- `.gitmodules` path 또는 URL이 이 문서의 Plugin update list에 없으면 update checklist drift다.
- 이 문서의 Plugin update list나 `docs/plugin-catalog.md`가 `.gitmodules`에 없는 `plugins/<name>` 경로를 언급하면 stale plugin reference다.
- workflow primitive를 `.gitmodules`에 넣으면 vendored source와 provenance-only source가 섞인 것이다.
- plugin catalog에 version/source를 업데이트했지만 submodule commit이나 manifest가 그대로면 이 문서의 source ledger에 이유가 있어야 한다.
- `skill-update`가 이 문서를 읽지 않고 plugin-bundled skill의 원본 여부를 판단하면 preflight 누락이다.
