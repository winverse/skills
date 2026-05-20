# Skills Repo

이 repo는 내가 자주 쓰는 AI 에이전트용 스킬과 plugin reference를 모아두는 개인 카탈로그다.

핵심 목표는 특정 에이전트 전용 스킬 저장소를 만드는 것이 아니다. 내가 실제로 자주 쓰는 작업 방식을 `SKILL.md`라는 source instruction으로 정리하고, Codex, Claude, 또는 다른 에이전트가 각 프로젝트의 instruction 파일에서 필요한 스킬만 골라 읽도록 만드는 것이다.

## 핵심 원칙

- 이 repo는 에이전트 공용 스킬과 project-selectable plugin reference의 source of truth다.
- 스킬은 전역 설치보다 프로젝트별 명시 연결을 기본으로 한다.
- 프로젝트마다 필요한 스킬만 해당 에이전트의 instruction 파일에 연결한다.
  - Codex: 보통 `AGENTS.md`
  - Claude: 보통 `CLAUDE.md`
  - 기타 에이전트: 그 에이전트가 읽는 동등한 instruction 파일
- 이 repo의 커스텀 스킬이 어떤 작업을 커버한다면, 그 작업에서는 각 에이전트의 기본/global 동작보다 이 repo의 스킬을 우선한다.
- 각 스킬은 작고, 명확하고, 내 취향에 맞게 수정하기 쉬워야 한다.
- 긴 취향, 세부 규칙, 평가 prompt, 예시는 `SKILL.md`를 부풀리지 말고 `references/`에 둔다.
- 외부 plugin은 `plugins/` 아래에 upstream 구조를 그대로 보존하고, repo-owned plugin은 같은 위치에서 직접 관리한다. bundled `skills/`를 이 repo의 최상위 `skills/`로 풀어내지 않는다.

## 스킬 포맷

각 스킬 폴더는 다음 한 쌍을 기본으로 가진다.

```text
skills/skill-name/
├── SKILL.md
└── skill.html
```

`SKILL.md`는 에이전트가 읽는 source instruction이다. 특정 런타임에 자동 등록되는 파일이라는 뜻이 아니라, 프로젝트 instruction 파일에서 경로와 trigger를 명시해 불러 쓰는 원본 지시문이다.

`skill.html`은 사람이 빠르게 판단하기 위한 시각 가이드다. 스킬을 프로젝트에 붙이기 전에 목적, trigger, workflow, 파일 구조를 한눈에 확인하는 용도다.

## 플러그인 포맷

Plugin은 `plugins/<plugin-name>/` 아래에 둔다. upstream 자체가 plugin manifest, MCP config, hooks, bundled skills를 갖는 경우 이 repo에서는 submodule로 고정하고, 전역 설치나 자동 등록은 하지 않는다. 이 repo가 직접 관리하는 orchestration bundle은 repo-owned plugin으로 두고 `.gitmodules`에 넣지 않는다.

```text
plugins/project-workflow/
├── .codex-plugin/
│   └── plugin.json
├── skills/
│   └── project-workflow/
└── README.md

plugins/context-mode/
├── .codex-plugin/
│   ├── plugin.json
│   ├── mcp.json
│   └── hooks.json
├── skills/
├── start.mjs
└── README.md

plugins/code-review-graph/
├── .mcp.json
├── pyproject.toml
├── skills/
└── README.md

plugins/caveman/
├── .claude-plugin/
│   └── plugin.json
├── skills/
├── package.json
└── README.md
```

`.gitmodules`가 실제 vendored plugin/submodule 목록의 canonical source이고, repo-owned plugin은 각 plugin의 `.codex-plugin/plugin.json`이 canonical source다. plugin catalog는 `docs/plugin-catalog.md`에 둔다. 업데이트 후보를 찾는 단일 진입점은 `docs/update-source-registry.md`다. 새 clone에서는 submodule도 함께 초기화해야 한다.

## 생명주기와 History

스킬은 한 번 만들고 끝나는 파일이 아니라 `draft -> active -> critical -> deprecated -> archived` 같은 생명주기를 가진다.

- `docs/skill-lifecycle.md`: 상태 정의, 승격/폐기 기준, review cadence를 둔다.
- `history/skills.md`: 확정된 상태 변경과 큰 변경만 기록하는 ledger다.
- `inspector/`: 아직 해결되지 않은 local-only 검사 메모만 둔다.
- `archive/`: 더 이상 새 프로젝트에 권장하지 않는 archived skill을 보관하는 위치다.

작은 오탈자나 색상 조정은 history에 남기지 않는다. trigger, workflow, validator, eval prompt, snippet, inspector 기준, 생명주기 상태가 바뀌는 변경만 기록한다.

## 현재 스킬

- `show-skills`: 현재 repo의 스킬 목록을 파일 시스템과 history에서 읽어 카테고리별로 보여주고, 작업에 맞는 스킬 조합을 추천하는 탐색 스킬.
  - Source instruction: `skills/show-skills/SKILL.md`
  - Human visual guide: `skills/show-skills/skill.html`
- `web-research`: 출처 우선 웹 리서치 스킬. research budget routing, query fan-out, `web-research` 호출 자체를 explicit parallel sub-agent fan-out/delegation/parallel agent work 요청으로 해석하는 계약, source ledger, evidence scoring, stop rules, 한국어 친화적이고 간결한 출력 기준을 포함한다.
  - Source instruction: `skills/web-research/SKILL.md`
  - Human visual guide: `skills/web-research/skill.html`
- `skill-to-html`: `SKILL.md` 옆에 사람이 한눈에 이해할 수 있는 한국어 우선, 그림 우선, 인터랙티브, 애니메이션 중심 `skill.html`을 만들거나 고치는 스킬. 산출물은 PC desktop 기준만 보고, mobile/tablet layout은 비대상으로 두며, 좁은 side panel 안에 4개 이상 계약 카드를 다열 grid로 우겨 넣지 않는다.
  - Source instruction: `skills/skill-to-html/SKILL.md`
  - Human visual guide: `skills/skill-to-html/skill.html`
- `karpathy-thinkings`: Karpathy식 코딩 에이전트 사고를 적용해 추측, 과설계, 주변 리팩터링, 약한 검증을 줄이는 구현 스킬.
  - Source instruction: `skills/karpathy-thinkings/SKILL.md`
  - Human visual guide: `skills/karpathy-thinkings/skill.html`
- `skill-update`: 기존 공유 스킬을 수정할 때 `docs/update-source-registry.md`를 단일 source registry로 먼저 읽어 `.gitmodules` 기반 vendored source와 workflow primitive source id를 구분하고, original/upstream provenance preflight와 `adopt`/`adapt`/`reject`/`defer` 판단에 따라 `SKILL.md`, references, validator, `skill.html`, snippets, docs, history를 함께 맞추는 유지보수 스킬. 사용자가 plugin update를 명시하면 plugin update lane으로 `.gitmodules`, plugin catalog, `Plugin update list`, validator, history까지 함께 맞춘다. 외부 dependency 전체 갱신 요청은 dependency update sweep으로 보고 `.gitmodules` vendored plugin, repo-owned plugin, registry의 workflow primitive lane, workflow usage map을 모두 점검한다.
  - Source instruction: `skills/skill-update/SKILL.md`
  - Human visual guide: `skills/skill-update/skill.html`
- `atomic-committer`: dirty git tree를 secret guard로 검사하고 반복적으로 올라가면 안 되는 local/secret artifact는 `.gitignore`로 예방한 뒤 atomic commit 단위로 나누며, 사용자가 push 금지를 명시하지 않는 한 커밋 후 push까지 수행하는 스킬.
  - Source instruction: `skills/atomic-committer/SKILL.md`
  - Human visual guide: `skills/atomic-committer/skill.html`
- `pull-request`: GitHub pull request의 branch/base/head 상태, title/body, reviewer/label/milestone/project, linked issue, `gh pr create` 실행 경계를 관리하는 스킬.
  - Source instruction: `skills/pull-request/SKILL.md`
  - Human visual guide: `skills/pull-request/skill.html`
- `project-structure`: frontend, backend, full-stack monorepo, desktop app, infrastructure-aware 구조의 폴더 구조와 기본 stack/env/codegen 정책, TypeScript ESM-only module 정책, folder-local `AGENTS.md` 목차, PostgreSQL/Drizzle, MongoDB Atlas, Supabase Postgres, psql/mongosh helper, Pulumi/Docker/AWS ECR/ECS/EC2 infra, backend logger/cache/security/observability, agent tool/MCP/API boundary, Redis DB boundary, migration/index sync, test surface를 일관되게 잡는 스킬.
  - Source instruction: `skills/project-structure/SKILL.md`
  - Human visual guide: `skills/project-structure/skill.html`
- `project-workflow`: `plugins/project-workflow`의 초기 설정 plugin이며, 새 프로젝트나 큰 기획의 도메인 문서, 제품 검증, ADR, `design.md`, PRD, 초기 이슈 목록, 프로젝트 설정 확인, `feature-workflow` 인계까지 정리하고, 별도 언어 지정이 없으면 초기 셋팅 문서를 Korean-first artifact gate로 검사한다. TypeScript 프로젝트는 ESM only와 CommonJS 금지를 architecture constraint로 남긴다. Matt Pocock skills `grill-with-docs`, GStack plugin `office-hours`, Superpowers plugin `brainstorming`, repo-local `project-structure`, user custom `design.md`처럼 출처 라벨을 붙여 추적하고, 현재 runtime에서 가능하면 선택된 원본 primitive를 실제 호출한다. `grill-me`는 project setup 기본 gate가 아니라 비코드 standalone fallback 후보로만 남긴다. 호출할 수 없을 때만 `fallback` 질문 루프로 대체하며, domain/product/design/tool gate 뒤에 실행할 항목은 `deferred`로 표시한다. 첫 raw idea 응답에서는 산출물을 생성한 것처럼 말하지 않고 target/proposed/not created yet 경로로 구분한다. 여러 session, agent, worktree가 병렬 구현할 수 있으면 `.scratch/<slug>/work-claims.md`에 lane owner와 claimed write set, shared/hotspot file의 integration owner를 기록한다. 큰 구현 인계는 `.scratch/<slug>/phases/index.json` 같은 phase/step plan으로 쪼개고, 선택 실행 도구는 Python이 아니라 TypeScript `plugins/project-workflow/scripts/execute-phase.ts`로 둔다. 이 runner는 Codex를 기본 실행 대상으로 삼고 `--agent-bin`/`--agent-arg` command를 stdin boundary로 받으며 기본값은 dry-run이다.
  - Source instruction: `plugins/project-workflow/skills/project-workflow/SKILL.md`
  - Human visual guide: `plugins/project-workflow/skills/project-workflow/skill.html`
- `feature-workflow`: 초기 셋팅 이후 쓰는 별도 반복 개발 skill이다. 이미 있는 PRD, issue, spec, bug report, acceptance criteria, ADR, `design.md`와 `workflow-state.md` cache를 기준으로 feature, bug fix, vertical slice를 TDD, 구현 계획, review, QA/runtime evidence, document sync, completion reporting까지 끝낸다. `work-claims.md`가 있으면 production edit 전에 현재 lane의 claimed write set을 확인하고, 다른 active lane과 겹치면 overlap block으로 멈춘다. TypeScript production edit은 ESM only를 유지하고 CommonJS 도입은 blocker 또는 migration boundary로 다룬다. 대상 코드 repo에서는 production code edit 전에 RED evidence를 강제하고, 이 shared skills repo에서는 hook을 설치하지 않고 target-project hook 계약만 문서화한다. Superpowers plugin `writing-plans`/`tdd`/`subagent-driven-development`, GStack plugin `plan-eng-review`, Matt Pocock skills `diagnose`, repo-local `code-review`/`browser-qa`/`sync-docs`의 출처를 분리해 추적하고, 실패/누락이 있으면 `agent-eval-harness` seed 후보를 남긴다.
  - Source instruction: `skills/feature-workflow/SKILL.md`
  - Human visual guide: `skills/feature-workflow/skill.html`
- `sync-docs`: README, root/folder-local AGENTS, docs, snippets, history, skill 파일과 target project skill setup을 서로 비교해 stale 설명, 누락된 연결, 충돌하는 규칙을 정리하는 문서 최신화 스킬.
  - Source instruction: `skills/sync-docs/SKILL.md`
  - Human visual guide: `skills/sync-docs/skill.html`
- `transcript-polisher`: 전사본, 강의 대본, 자막, 회의록을 코드 치환 없이 직접 읽고 문단/구문 단위로 다듬으며, source/output 구조와 `polish` 분량 보존을 검증하고 Claude Code `/goal`식 완료 조건과 평가자용 증거로 긴 검토를 반복하는 스킬.
  - Source instruction: `skills/transcript-polisher/SKILL.md`
  - Human visual guide: `skills/transcript-polisher/skill.html`
- `agent-improvement-loop`: 소진형 실행 전 `남은 토큰을 최대한 사용해서 안전한 backlog를 처리할까요? (예/아니오)`를 묻고, 답에 따라 safe backlog multi-agent batch 또는 단계별 ceiling review로 skill 호출성, validator, 문서 정합성, 일반 repo 품질을 개선하는 스킬.
  - Source instruction: `skills/agent-improvement-loop/SKILL.md`
  - Human visual guide: `skills/agent-improvement-loop/skill.html`
- `agent-eval-harness`: agent skill routing, cross-agent instruction portability, workflow, safety boundary, artifact hygiene, output quality, regression capture를 검증하는 초기 repo-local eval harness를 세팅하는 스킬. `required_link_count`, `required_file_reference`, `json_schema` 같은 deterministic check를 우선 쓰고, `project-workflow`나 `feature-workflow`에서 호출될 때는 routing, dependency inventory, `project-structure` timing, PRD settings, UI mockup selection, `work-claims.md` lane ownership, overlap block, CLI/no-browser evidence, MCP/API gate decisions, fallback lane, project setup verification, completion mapping, document sync, artifact hygiene seed case를 만든다.
  - Source instruction: `skills/agent-eval-harness/SKILL.md`
  - Human visual guide: `skills/agent-eval-harness/skill.html`
- `browser-qa`: Playwright/browser evidence로 렌더링, 콘솔, 네트워크, 접근성, 링크, viewport, 텍스트 겹침, `skill.html` 표시 문제를 검증하고 종료 시 browser/server를 정리하는 스킬.
  - Source instruction: `skills/browser-qa/SKILL.md`
  - Human visual guide: `skills/browser-qa/skill.html`
- `code-review`: findings-first 코드/PR/diff 리뷰로 버그, 회귀, 테스트 누락, SRP/SOLID 경계, JS/TS 함수형 collection style, agent/tool-call boundary 위험을 점검하는 스킬.
  - Source instruction: `skills/code-review/SKILL.md`
  - Human visual guide: `skills/code-review/skill.html`
- `design-review`: 제품 도메인과 기존 디자인 시스템을 우선해 UI hierarchy, layout density, typography, state, accessibility, responsive order, visual polish를 리뷰하는 스킬.
  - Source instruction: `skills/design-review/SKILL.md`
  - Human visual guide: `skills/design-review/skill.html`

## 현재 플러그인

- `project-workflow`: repo-owned plugin이다. 초기 프로젝트 셋팅 전용이고, `feature-workflow`는 별도 반복 개발 skill로 분리한다.
  - Version: `0.1.0`
  - Manifest: `plugins/project-workflow/.codex-plugin/plugin.json`
  - Catalog: `docs/plugin-catalog.md`
- `context-mode`: `mksglu/context-mode` upstream을 `plugins/context-mode` submodule로 고정한 MCP plugin reference다. Codex manifest는 `plugins/context-mode/.codex-plugin/plugin.json`이고, bundled plugin skills는 `plugins/context-mode/skills/`에 그대로 둔다.
  - Version: `v1.0.136`
  - Source: `https://github.com/mksglu/context-mode`
  - Catalog: `docs/plugin-catalog.md`
- `code-review-graph`: `tirth8205/code-review-graph` upstream을 `plugins/code-review-graph` submodule로 고정한 MCP-enabled code review graph reference다. MCP config는 `plugins/code-review-graph/.mcp.json`이고, bundled upstream skills는 `plugins/code-review-graph/skills/`에 그대로 둔다.
  - Version: `v2.3.3`
  - Source: `https://github.com/tirth8205/code-review-graph`
  - Catalog: `docs/plugin-catalog.md`
- `caveman`: `JuliusBrussee/caveman` upstream을 `plugins/caveman` submodule로 고정한 token-compression skill/plugin reference다. Claude plugin manifest는 `plugins/caveman/.claude-plugin/plugin.json`이고, Codex plugin manifest는 `plugins/caveman/plugins/caveman/.codex-plugin/plugin.json`이다. Codex `SessionStart` hook은 `plugins/caveman/plugins/caveman/hooks/codex/sessionstart.mjs`를 통해 Caveman skill 본문을 세션 시작 시 출력한다.
  - Version: `v1.8.2`
  - Source: `https://github.com/JuliusBrussee/caveman`
  - Catalog: `docs/plugin-catalog.md`

## 에이전트 연결 방식

이 repo의 스킬은 각 에이전트의 project instruction 파일에서 연결한다.

Codex 프로젝트 예시:

```markdown
## Project Skills

- Use $web-research at <skills-root>/skills/web-research/SKILL.md when a task needs current facts, web verification, source comparison, citations, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords.
- Treat `web-search`, `web search`, `웹서치`, and `웹 검색` as aliases for `web-research`.
- Treat any user request that invokes `web-research` or its aliases as an explicit request for parallel sub-agent fan-out, delegation, and parallel agent work for the research portion. Use single-agent research only when the user explicitly asks for it, private data is involved, runtime/tool policy blocks delegation, or the task is a tiny official quick check.
```

Claude 프로젝트 예시:

```markdown
## Project Skills

- For current facts, source verification, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords, use the shared skill at `<skills-root>/skills/web-research/SKILL.md`.
- Treat `web-search`, `web search`, `웹서치`, and `웹 검색` as aliases for `web-research`.
- Treat any user request that invokes `web-research` or its aliases as an explicit request for parallel sub-agent fan-out, delegation, and parallel agent work for the research portion. Use single-agent research only when the user explicitly asks for it, private data is involved, runtime/tool policy blocks delegation, or the task is a tiny official quick check.
```

`<skills-root>`는 이 repo를 clone한 실제 위치로 바꾼다. 컴퓨터를 바꾸면 새 컴퓨터에서 이 repo를 clone한 경로만 다시 지정하면 된다. `<codex-home>`은 보통 `$HOME/.codex`이고, `CODEX_HOME`을 따로 설정했다면 그 값을 쓴다.

새 컴퓨터에서 쓰는 기본 흐름:

```bash
cd /path/to/skills
git submodule update --init --recursive
export SKILLS_ROOT="$PWD"
```

프로젝트 instruction 파일에 snippet을 붙일 때 `<skills-root>`를 `$SKILLS_ROOT` 값 또는 실제 clone 경로로 치환한다. repo 내부 validator는 repo root에서 상대경로로 실행한다.

에이전트별 adapter와 연결 예시는 `docs/agent-compatibility.md`를 본다.

## 프로젝트 셋업 흐름

새 프로젝트를 시작하거나 기존 프로젝트에 스킬을 붙일 때는 이 repo를 카탈로그처럼 사용한다.

1. `docs/skill-catalog.md` 또는 `show-skills`로 사용 가능한 스킬을 확인한다.
2. 비슷해 보이는 후보가 있으면 `docs/skill-catalog.md`의 `비슷해 보이는 스킬 경계`에서 primary/companion 관계를 먼저 정한다.
3. 후보 스킬의 `skill.html`을 열어 빠르게 훑는다.
4. 해당 프로젝트에 필요한 스킬만 고른다.
5. `project-snippets/`의 맞는 snippet을 프로젝트의 instruction 파일에 추가한다.
6. 프로젝트만의 예외나 취향은 snippet 아래에 override로 적는다.
7. 특정 프로젝트에서만 완전히 다른 동작이 필요할 때만 스킬을 fork한다.
8. 오래 쓰지 않거나 대체된 스킬은 `history/skills.md`에서 deprecated 또는 archived로 표시한다.

자세한 흐름은 `docs/project-skill-setup.md`를 본다.

## Skill HTML 원칙

`skill.html`은 단순히 `SKILL.md`를 카드로 나눈 문서가 아니어야 한다. 스킬의 쓰임을 한눈에 알아볼 수 있도록 다음 같은 시각 구조를 적극적으로 사용한다.

- 언제 쓰고 언제 건너뛸지 보여주는 decision matrix
- 스킬이 어떤 순서로 작동하는지 보여주는 workflow flowchart
- 중요한 기준, 출처, 위험도, 우선순위를 보여주는 chart
- `SKILL.md`, `references/`, `scripts/`, `assets/`, `project-snippets/`의 관계를 보여주는 resource map
- 사용자가 주는 입력과 스킬이 내는 출력을 보여주는 input/output schema
- 하면 되는 것과 하면 안 되는 것을 대비하는 do/don't matrix

`skill-to-html`을 사용할 때는 `skills/skill-to-html/references/visual-guide-standards.md`의 기준을 따른다. `skill.html`은 PC 데스크톱에서 그림, 조작, 애니메이션이 먼저 보이는 self-contained HTML이어야 하며, mobile/tablet layout이나 responsive breakpoint는 신경 쓰지 않는다. 화면 설명은 한국어 짧은 라벨과 캡션 중심으로 작성하고, 영어 설명어를 쉼표로 길게 나열하지 않는다. 파일 경로, 명령, 제품명, `TDD`, `QA`, `API`, `MCP`, `PRD` 같은 정확성이 필요한 식별자만 원문으로 둔다. SVG arrow는 실제 node나 box에 닿아야 하고, 넓은 scope table이나 matrix는 좁은 2열 layout 안에 넣지 않는다. 외부 CDN, 외부 script, 외부 이미지는 금지하고, 상호작용은 CSS/SVG animation, Web Animations API, 짧은 inline JavaScript로 닫는다. Framer Motion, Motion One, GSAP 같은 library는 target project가 local bundle로 닫을 수 있을 때만 쓴다.

## 생성과 검증

이 repo는 `skill-creator` 같은 Codex 시스템 스킬을 소유하지 않는다. 새 스킬 구조를 잡을 때는 외부 시스템 `skill-creator`를 참고할 수 있지만, repo가 소유하는 반복 검증 명령은 TypeScript validator로 둔다.

프로젝트에 기존 스킬을 연결하는 절차는 `docs/project-skill-setup.md`를 따른다. 새 스킬을 만들거나 기존 스킬을 크게 바꾸는 검증은 이 섹션과 `docs/skill-inspector.md`를 함께 따른다.

기존 스킬을 업데이트할 때는 `skill-update`를 사용한다. 먼저 `docs/update-source-registry.md`를 단일 source registry로 읽고, vendored plugin/submodule 후보는 `.gitmodules`를 machine-readable source로 확인하며, workflow primitive의 source URL, checked date, upstream version/commit, local 판단은 registry에서만 관리한다. 각 `upstream-dependency-map.md`는 source id를 실제 workflow에서 어떻게 쓰는지 적는 usage map이다. 원본이 있거나 의심되면 `web-research`로 확인한 뒤 `adopt`, `adapt`, `reject`, `defer` 판단을 남기고 local delta를 반영한다. Plugin update가 명시된 요청이면 plugin update lane으로 처리하고, repo-wide 외부 dependency refresh 요청이면 dependency update sweep으로 `.gitmodules`의 모든 vendored plugin, repo-owned plugin, registry workflow primitive lane, workflow usage map을 함께 확인한다. `scripts/validate-plugins.ts`가 `.gitmodules`, `docs/plugin-catalog.md`, `Plugin update list`의 path/URL drift를 막아야 한다.

`skills/**/*.md`는 한국어 우선으로 작성한다. `SKILL.md`와 `references/*.md`의 설명, 절차, 표 라벨은 한국어로 쓰고, 코드 식별자, 명령, 파일 경로, 제품명, 프로토콜명, upstream skill 이름처럼 원문 표기가 더 정확한 용어만 영어로 남긴다.

## PR 작성 규칙

이 repo에 PR을 남길 때는 `.github/pull_request_template.md`를 기준으로 한국어 제목과 본문을 작성한다. PR 본문에는 요약, 변경 범위, 검증, 위험/rollback, 관련 이슈를 항상 남긴다.

스킬 변경 PR은 다음을 추가로 지킨다.

- `skills/**/*.md`는 한국어 우선 문서여야 한다.
- `SKILL.md`, `references/*.md`, `skill.html`, `project-snippets/`, `history/skills.md`, eval case, validator가 behavior change와 맞는지 확인한다.
- 검증 항목에 `node scripts/validate-korean-markdown.ts .`를 포함한다.
- `skill.html`의 한국어 라벨과 Markdown 문서가 서로 다른 규칙을 말하지 않는지 확인한다.

새 스킬을 만들거나 기존 스킬을 크게 바꿀 때의 기본 흐름:

```text
skill-creator 또는 SKILL.md 작성
-> skill-to-html로 skill.html 생성/갱신
-> 스킬 추가/삭제/rename이면 show-skills HTML catalog 재생성
-> project-snippets와 history 필요 여부 정리
-> sync-docs로 README/AGENTS/docs/snippets/history 정합성 확인
-> node scripts/validate-skill.ts skills/<skill-name>
-> 스킬별 validator 실행
-> node scripts/validate-korean-markdown.ts .
-> node scripts/validate-skill-html.ts .
-> node scripts/validate-skill-repo.ts .
-> node scripts/run-agent-evals.ts
-> docs/skill-inspector.md 기준으로 검사
```

시스템 `skill-creator` 위치:

```text
<codex-home>/skills/.system/skill-creator/SKILL.md
```

기본 validator:

```bash
node scripts/validate-skill.ts skills/<skill-name>
```

스킬 inventory가 바뀌면 show-skills HTML catalog를 filesystem 기준으로 갱신하고 stale 여부를 확인한다.

```bash
node skills/show-skills/scripts/update-html-catalog.ts skills/show-skills
node skills/show-skills/scripts/update-html-catalog.ts skills/show-skills --check
```

스킬별 static validator가 있으면 함께 돌린다.

```bash
node skills/web-research/scripts/validate-web-research.ts skills/web-research
node skills/show-skills/scripts/validate-show-skills.ts skills/show-skills
node skills/skill-to-html/scripts/validate-skill-to-html.ts skills/skill-to-html
node skills/karpathy-thinkings/scripts/validate-karpathy-thinkings.ts skills/karpathy-thinkings
node skills/skill-update/scripts/validate-skill-update.ts skills/skill-update
node skills/atomic-committer/scripts/validate-atomic-committer.ts skills/atomic-committer
node skills/pull-request/scripts/validate-pull-request.ts skills/pull-request
node skills/project-structure/scripts/validate-project-structure.ts skills/project-structure
node plugins/project-workflow/scripts/validate-project-workflow.ts plugins/project-workflow/skills/project-workflow
node skills/feature-workflow/scripts/validate-feature-workflow.ts skills/feature-workflow
node skills/sync-docs/scripts/validate-sync-docs.ts skills/sync-docs
node skills/agent-improvement-loop/scripts/validate-agent-improvement-loop.ts skills/agent-improvement-loop
node skills/agent-eval-harness/scripts/validate-agent-eval-harness.ts skills/agent-eval-harness
node skills/browser-qa/scripts/validate-browser-qa.ts skills/browser-qa
node skills/code-review/scripts/validate-code-review.ts skills/code-review
node skills/design-review/scripts/validate-design-review.ts skills/design-review
```

repo 운영 기준과 문서 정합성도 함께 확인한다.

```bash
node scripts/validate-korean-markdown.ts .
node scripts/validate-skill-html.ts .
node scripts/validate-plugins.ts .
node scripts/validate-source-registry.ts .
node plugins/project-workflow/scripts/validate-project-workflow.ts plugins/project-workflow/skills/project-workflow
node scripts/validate-skill-repo.ts .
node scripts/run-agent-evals.ts
```

Repo가 소유하는 validator는 `.ts`를 기본으로 둔다. 이 repo는 Node 22 이상에서 `.ts` validator를 직접 실행하는 것을 기준으로 하며, 새 검증 스크립트를 `.py`로 추가하지 않는다. hook처럼 Codex나 다른 런타임의 호환성이 더 중요한 파일만 `.mjs` 예외를 유지한다. `scripts/validate-korean-markdown.ts`는 `skills/**/*.md`가 한국어 우선 문서인지 검사한다. `scripts/validate-skill-html.ts`는 모든 `skills/*/skill.html`이 portable self-contained HTML, desktop-centered layout, diagram-rich sections, Korean-first visible labels, `SKILL.md`/`skill.html` file pair, validation and misuse guardrails를 갖췄는지 검사하고, inline JavaScript가 network call이나 external import 없이 닫히는지 확인하며, wide scope table이 2열 layout 안에 들어가거나 SVG `marker-end` arrow가 보이는 node에 닿지 않는 문제를 실패로 처리한다. `scripts/validate-plugins.ts`는 `.gitmodules`를 직접 파싱해 canonical vendored plugin/submodule 목록으로 삼고, `docs/plugin-catalog.md`와 `docs/update-source-registry.md`의 `Plugin update list`가 같은 plugin path와 upstream URL을 담는지 검사하며, `plugins/context-mode`, `plugins/code-review-graph`, `plugins/caveman`의 manifest, MCP entrypoint, bundled plugin skills 경계를 검사한다. `scripts/validate-source-registry.ts`는 workflow usage map의 `source id`가 `docs/update-source-registry.md`에 존재하는지, usage map에 source URL이나 checked date가 복사되지 않았는지 검사한다. `plugins/project-workflow/scripts/validate-project-workflow.ts`는 `plugins/project-workflow`의 canonical bundled skill 계약을 검사한다. `scripts/validate-skill-repo.ts`는 각 스킬이 README, AGENTS, `project-snippets/`, `history/skills.md`, validator 명령에 같은 이름과 경로로 반영되어 있는지도 검사하고, 외부 plugin submodule 내부는 repo-owned skill scan에서 제외한다. `scripts/run-agent-evals.ts`는 대표 사용자 prompt가 올바른 스킬 라우팅, 안전 경계, 출력 계약을 갖는지 `evals/agent/cases/`의 deterministic case로 확인한다. 체크 타입은 `required_text`, `forbidden_text`, `required_link_count`, `required_file_reference`, `json_schema`, `skill_listed_in`, `command_passed` 등을 포함한다. `workflow`, `project-workflow`, `feature-workflow` scope case는 정적 문구 확인만으로 충분하지 않으므로 `evals/agent/fixtures/project-workflow/` 또는 `evals/agent/fixtures/feature-workflow/` 아래의 scrubbed saved output fixture를 최소 하나 검사해야 한다.

Codex에서는 `.codex/config.toml`의 hook이 `SKILL.md` 변경 후 stale `skill.html`을 감지하고, `codex exec`로 `skill-to-html`을 자동 실행해 인접 guide를 갱신한다. 자세한 내용은 `docs/codex-hooks.md`를 본다.

## 검사관 기준

스킬 검사 기준은 `docs/skill-inspector.md`에 둔다.

`inspector/` 폴더는 local-only 검사 메모와 미해결 이슈를 임시로 두는 곳이다. GitHub에는 `.gitkeep`만 올린다. 검사에서 수정할 항목이 나오면 먼저 `inspector/YYYY-MM-DD-<scope>.md`에 findings, 근거 파일, 검증 명령, 해결 기준을 적고 그 문서를 기준으로 고친다. 처리 완료된 검사 파일은 삭제하고, 일부만 처리됐으면 해결된 항목을 제거해 미해결 항목만 남긴다.

## 유지보수

- `SKILL.md`에는 핵심 trigger와 workflow만 간결하게 둔다.
- 긴 설명, 평가 prompt, source rule, 개인 취향은 `references/`로 분리한다.
- 스킬을 만들거나, 설치하거나, fork하거나, 크게 수정하면 `skill-to-html`로 해당 스킬의 `skill.html`도 함께 만든다.
- 스킬을 추가, 삭제, rename, archive, restore하면 `show-skills`의 HTML catalog를 `update-html-catalog.ts`로 재생성한다.
- 기존 스킬을 업데이트할 때는 `skill-update`로 `docs/update-source-registry.md`를 먼저 읽고, `.gitmodules`와 registry source id를 기준으로 original/upstream provenance preflight, source/release 비교, references, validator, snippet, docs, history까지 함께 맞춘다. Plugin update가 포함되면 `.gitmodules`, `docs/plugin-catalog.md`, `Plugin update list`, `scripts/validate-plugins.ts`, history까지 같은 변경 단위로 닫는다. 외부 dependency 전체 갱신은 dependency update sweep으로 처리해 vendored plugin, repo-owned plugin, registry workflow primitive lane, workflow usage map을 함께 확인한다.
- 스킬을 크게 수정한 뒤에는 `docs/skill-inspector.md` 기준으로 검사한다.
- 문서 최신화, stale 설명, 문서 간 충돌 검토 요청은 `sync-docs`로 처리한다.
- repo가 소유하는 validator는 TypeScript로 작성하고 `node <path>.ts`로 실행한다.
- trigger, workflow, validator, eval prompt, snippet, inspector 기준, 생명주기 상태가 바뀌면 `history/skills.md`를 업데이트한다.
- 미해결 이슈만 local-only `inspector/`에 남기고, 해결된 검사 파일은 삭제한다.
- 스킬을 추가하거나 이름을 바꾸면 `project-snippets/`도 같이 업데이트한다.
