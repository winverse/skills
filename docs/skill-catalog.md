# Skill Catalog

이 문서는 현재 repo의 스킬을 사람이 빠르게 고르기 위한 정적 카탈로그다. 최신 목록을 대화 안에서 바로 보려면 `show-skills`를 사용한다. `show-skills`는 독립 설치된 skills root에서도 `--root` 또는 `SKILLS_ROOT`로 현재 스킬 목록을 읽을 수 있다.

```bash
node skills/show-skills/scripts/show-skills.ts --compact
node skills/show-skills/scripts/show-skills.ts --root skills --compact
```

## 스킬 빠른 선택표

| 상황 | 먼저 쓸 스킬 | 같이 쓰면 좋은 스킬 |
| --- | --- | --- |
| 현재 스킬 목록을 보고 싶다 | `show-skills` | `sync-docs` |
| 최신 정보, 출처, 추천, 법/규정, 기술 문서를 조사한다. `web-search`라고 말해도 이 스킬로 해석한다. | `web-research` | `agent-improvement-loop` |
| 새 스킬의 사람용 HTML guide를 만든다 | `skill-to-html` | `SKILL.md` Markdown 의미를 `skill IR`로 추출해 visual component로 매핑하고, 한국어 짧은 라벨과 캡션, 그림 우선, 인터랙티브, 애니메이션 중심으로 만든다. PC desktop 기준만 보며 좁은 side panel 안에 4개 이상 카드 grid를 만들지 않는다. mobile/tablet layout은 비대상이다. `browser-qa`, `design-review` |
| 기존 스킬을 수정한다 | `skill-update` | 모든 호출에서 원본 provenance preflight를 먼저 실행하고, 원본 확인이 필요하면 `web-research`, 이후 `skill-to-html`, `sync-docs` |
| 문서끼리 충돌하거나 최신화가 의심된다 | `sync-docs` | `show-skills` |
| 전사본, 강의 대본, 자막, 회의록을 문맥 흐름에 맞게 직접 다듬는다 | `transcript-polisher` | `sync-docs` |
| 남는 토큰이나 긴 컨텍스트로 repo 품질을 올린다 | `agent-improvement-loop` | `code-review`, `browser-qa`, `sync-docs` |
| 에이전트 스킬/프롬프트 하네스를 처음 세팅한다 | `agent-eval-harness` | `agent-improvement-loop`, `sync-docs` |
| 스킬이나 플러그인을 실제 fresh clone cycle로 테스트한다 | `skill-plugin-test-loop` | `agent-eval-harness`, `skill-update`, `browser-qa`, `atomic-committer` |
| 새 프로젝트나 큰 기획의 초기 셋팅을 잡는다 | `project-workflow` | 워크플로우 묶음의 초기 설정 구간. 원본 Matt Pocock/GStack/Superpowers primitive가 있으면 실제 호출하고, 없으면 fallback 질문으로 도메인/제품 검증을 끝낸 뒤 진행한다. Matt Pocock gate는 `grill-with-docs`를 기본으로 써서 `CONTEXT.md`, `CONTEXT-MAP.md`, ADR 후보를 먼저 다룬다. 초기 셋팅 문서는 별도 언어 지정이 없으면 한국어 우선이며, TypeScript면 ESM only와 CommonJS 금지를 기록하고, 병렬 구현이면 `work-claims.md`를 만든다. 큰 구현 인계는 Codex session이 읽을 수 있는 phase/step handoff plan으로 쪼개고, 선택 runner는 Codex-first TypeScript `execute-phase.ts`를 쓴다. `project-structure`는 도메인/아키텍처 질문 이후, `sync-docs` |
| 기존 feature, issue, bug를 구현한다 | `feature-workflow` | 워크플로우 묶음의 반복 구현 구간. `work-claims.md`가 있으면 overlap block을 먼저 확인하고, TypeScript production edit은 ESM only를 유지한다. `code-review`, `browser-qa`, `sync-docs` |
| 구현, 디버깅, 리팩터링을 신중하게 한다 | `karpathy-thinkings` | `code-review` |
| 새 프로젝트 구조를 잡는다 | `project-structure` | `karpathy-thinkings` |
| 커밋을 논리 단위로 나누고 push한다 | `atomic-committer` | `code-review` |
| GitHub PR을 준비하거나 생성한다 | `pull-request` | `atomic-committer`, `code-review` |
| 브라우저 렌더링과 console/network를 확인하고 QA 종료 후 browser/server를 정리한다 | `browser-qa` | `design-review` |
| 코드 리뷰와 회귀 위험을 본다 | `code-review` | `browser-qa` |
| UI 위계, 밀도, 타이포그래피, 취향을 본다 | `design-review` | `browser-qa` |

## 비슷해 보이는 스킬 경계

| 헷갈리는 묶음 | 먼저 고를 기준 | 같이 쓰는 경우 |
| --- | --- | --- |
| `show-skills` / `sync-docs` | `show-skills`는 현재 목록을 읽고 추천할 때, `sync-docs`는 문서끼리 맞지 않는 설명을 고칠 때 쓴다. | 목록을 본 뒤 catalog, README, snippet이 stale인지 확인할 때 둘을 같이 쓴다. |
| `skill-update` / `web-research` / `skill-to-html` / `sync-docs` | `skill-update`는 기존 스킬 패키지 자체를 바꾸는 작업이며, 먼저 `docs/update-source-registry.md`를 단일 source registry로 읽어 `.gitmodules` 기반 vendored source와 workflow primitive source id를 분리한다. 원본이 있거나 의심되면 `web-research`로 source와 release/changelog를 확인한다. `skill-to-html`은 사람용 HTML guide 작업, `sync-docs`는 주변 문서 정합성 작업이다. | 원본 delta가 있는 스킬은 `web-research`로 source를 검증하고 `adopt`/`adapt`/`reject`/`defer` 판단을 registry에 남긴 뒤 local package, HTML, 주변 문서를 순서대로 맞춘다. |
| `agent-improvement-loop` / `agent-eval-harness` | `agent-improvement-loop`는 repo 품질 backlog와 Claude Code `/goal` 기준 bounded goal 조건을 고르는 루프, `agent-eval-harness`는 반복 검증 harness와 goal condition quality를 검사하는 스킬이다. | 개선 루프에서 재발 방지가 필요하면 eval harness case를 추가한다. |
| `skill-plugin-test-loop` / `agent-eval-harness` / `skill-update` | `skill-plugin-test-loop`는 실제 skill/plugin 호출을 fresh clone 또는 isolated copy에서 cycle로 돌리고 실패를 분류한다. `agent-eval-harness`는 재발 방지용 deterministic case를 만들고, `skill-update`는 실패가 확정된 source package를 고친다. | 실제 run에서 실패를 확인한 뒤 source를 수정하고, 같은 문제가 반복되면 eval case로 축소한다. |
| `project-workflow` / `feature-workflow` | 서로 다른 시점의 workflow다. `project-workflow`는 `plugins/project-workflow` repo-owned plugin으로 초기 셋팅만 맡고, `feature-workflow`는 초기 셋팅 이후 기존 feature/issue/bug 구현을 맡는 별도 skill로 둔다. | `project-workflow`가 feature handoff와 병렬 work claim을 만들고, 이후 반복 개발은 `feature-workflow`가 맡는다. claim overlap이나 gate 누락이 반복되면 `agent-eval-harness` seed를 남긴다. |
| `project-workflow` / `project-structure` | `project-workflow`는 구조 선택 전 도메인, 아키텍처 질문, TypeScript ESM only 제약을 만든다. `project-structure`는 구조 선택이 구체화된 뒤 폴더/env/codegen/db/infra 경계를 잡고, TypeScript를 쓰면 ESM only와 CommonJS 금지를 적용한다. | `project-workflow`가 architecture handoff 지점에 도달하면 `project-structure`를 호출한다. |
| `browser-qa` / `design-review` / `code-review` | `browser-qa`는 실제 렌더링과 console/network 증거, `design-review`는 UI 위계와 시각 판단, `code-review`는 구현 위험과 테스트 누락을 본다. | UI 변경 검토는 browser-qa로 사실을 확인하고 design-review로 판단을 보강한다. |
| `web-research` / `sync-docs` | `web-research`는 외부 최신 사실과 출처 검증, `sync-docs`는 repo 안의 현재 문서와 파일 대조다. | 문서가 외부 최신 사실을 포함하면 web-research로 근거를 확인한 뒤 sync-docs로 반영한다. |
| `transcript-polisher` / `sync-docs` / `code-review` | `transcript-polisher`는 전사본과 긴 산문을 직접 읽고 문맥을 다듬을 때, `sync-docs`는 repo 문서 간 정합성을 맞출 때, `code-review`는 코드 diff 위험을 볼 때 쓴다. | 전사본을 문서로 편입한 뒤 repo 문서와 연결해야 하면 transcript-polisher 후 sync-docs를 쓴다. |
| `karpathy-thinkings` / `code-review` | `karpathy-thinkings`는 구현 전후의 작업 discipline, `code-review`는 결과 diff의 findings-first 검토다. | 중요한 구현은 karpathy-thinkings로 진행하고 code-review로 마무리한다. |

## 카테고리별 목록

### 탐색

| Skill | 설명 | 자세히 |
| --- | --- | --- |
| `show-skills` | 현재 repo의 스킬을 파일 시스템에서 읽어 카테고리별로 보여주고, 작업에 맞는 스킬 조합을 추천한다. | [SKILL.md](../skills/show-skills/SKILL.md) · [skill.html](../skills/show-skills/skill.html) |
| `web-research` | 현재성 있는 사실, 출처 검증, 추천, 규정, 기술 문서 조사에 쓰며 `web-search` alias 호출 자체를 explicit parallel sub-agent fan-out/delegation/parallel agent work 요청으로 해석하는 리서치 스킬이다. | [SKILL.md](../skills/web-research/SKILL.md) · [skill.html](../skills/web-research/skill.html) |

### 스킬 운영

| Skill | 설명 | 자세히 |
| --- | --- | --- |
| `skill-to-html` | `SKILL.md` 옆에 사람이 빠르게 이해할 수 있는 PC desktop 기준, 한국어 우선, 그림 우선, 인터랙티브, 애니메이션 중심 `skill.html`을 만든다. Markdown source of truth에서 heading/list/table/code/link 의미를 읽고 `skill IR`을 만든 뒤 판단 보드, 흐름도, 파일 관계도, 검증 표, 근거 reveal로 매핑한다. mobile/tablet layout과 responsive breakpoint는 비대상이다. 좁은 side panel 안의 4개 이상 계약 카드 grid를 금지하고, Markdown `raw HTML`/event handler/`javascript:` link/외부 script를 그대로 통과시키지 않는다. 외부 CDN/script/image 없이 CSS/SVG animation, Web Animations API, 짧은 inline JavaScript로 상호작용을 닫는다. | [SKILL.md](../skills/skill-to-html/SKILL.md) · [skill.html](../skills/skill-to-html/skill.html) |
| `skill-update` | 기존 공유 스킬을 수정할 때 `docs/update-source-registry.md`와 `.gitmodules`를 먼저 확인하고, 원본/upstream provenance preflight, source/release 비교, `adopt`/`adapt`/`reject`/`defer` 판단, references, validator, visual guide, snippets, docs, history를 함께 맞춘다. 외부 dependency 전체 갱신 요청은 `.gitmodules` vendored plugin, repo-owned plugin, registry workflow primitive lane, workflow usage map을 모두 보는 dependency update sweep으로 처리하며, `scripts/validate-source-registry.ts`로 source id drift를 막는다. | [SKILL.md](../skills/skill-update/SKILL.md) · [skill.html](../skills/skill-update/skill.html) |
| `sync-docs` | README, root/folder-local AGENTS, docs, snippets, history, skill 파일과 target project skill setup을 비교해 stale 설명과 충돌을 정리한다. | [SKILL.md](../skills/sync-docs/SKILL.md) · [skill.html](../skills/sync-docs/skill.html) |
| `agent-improvement-loop` | 소진형 실행 전 예/아니오를 묻고, 답에 따라 safe backlog batch 또는 단계별 review로 repo 품질을 올린다. | [SKILL.md](../skills/agent-improvement-loop/SKILL.md) · [skill.html](../skills/agent-improvement-loop/skill.html) |
| `agent-eval-harness` | agent skill routing, cross-agent portability, safety, artifact hygiene, output quality를 회귀 테스트하는 초기 eval harness를 세팅한다. `required_link_count`, `required_file_reference`, `json_schema` 같은 deterministic check와 workflow scenario, `work-claims.md` lane ownership, overlap block seed case를 지원한다. | [SKILL.md](../skills/agent-eval-harness/SKILL.md) · [skill.html](../skills/agent-eval-harness/skill.html) |
| `skill-plugin-test-loop` | 스킬, 플러그인, plugin-bundled skill을 fresh clone 또는 isolated copy에서 실제 호출해 `cycle-NNN` history, output folder, bounded runner evidence, failure class, source 수정, 재실행을 남기는 반복 테스트 스킬이다. | [SKILL.md](../skills/skill-plugin-test-loop/SKILL.md) · [skill.html](../skills/skill-plugin-test-loop/skill.html) |

### 구현과 구조

| Skill | 설명 | 자세히 |
| --- | --- | --- |
| `karpathy-thinkings` | Karpathy식 코딩 에이전트 사고로 추측, 과설계, 주변 리팩터링, 약한 검증을 줄인다. | [SKILL.md](../skills/karpathy-thinkings/SKILL.md) · [skill.html](../skills/karpathy-thinkings/skill.html) |
| `project-structure` | frontend, backend, full-stack monorepo, desktop app과 folder-local AGENTS.md 목차, 선택형 DB/infra 구조, TypeScript ESM-only module 정책, 기본 stack/env/codegen/test/security/tool-boundary 정책을 잡는다. | [SKILL.md](../skills/project-structure/SKILL.md) · [skill.html](../skills/project-structure/skill.html) |
| `project-workflow` | `plugins/project-workflow`의 초기 설정 plugin이며 새 프로젝트나 큰 기획의 초기 셋팅을 도메인 문서, 제품 검증, ADR, `design.md`, PRD, 이슈 목록, TypeScript ESM only 정책, 설정 확인, `workflow-state.md`, 병렬 `work-claims.md`, `feature-workflow` 인계까지 정리한다. Matt Pocock `grill-with-docs`, GStack `office-hours`, 조건부 Superpowers `brainstorming`/`writing-plans`는 가능하면 실제 호출하고, 불가능할 때만 fallback 질문 루프로 대체한다. `grill-me`는 project setup 기본 gate가 아니라 비코드 standalone fallback 후보로만 남긴다. 나중 gate 뒤에 실행할 항목은 `deferred`로 표시하고 첫 raw idea 응답에서는 산출물 경로를 target/proposed/not created yet로 구분한다. 구조가 확정된 setup은 `.scratch` Markdown만 만들지 않고 최소 실행 shell과 validation command를 만든다. 큰 구현 인계는 phase/step handoff plan으로 만들고 선택 TypeScript runner는 Codex-first command boundary를 쓴다. plugin 자체 개선은 `/goal` 반복 개선 루프로 fresh clone cycle, UI dashboard/CLI-no-browser/API-external-risk 확장 검증 케이스, failure class 분류, 수정, commit/push, 재검증을 반복한다. 별도 언어 지정이 없으면 초기 셋팅 문서를 Korean-first artifact gate로 검사하고, 최상위 문서 제목, `workflow-state.md` risk-gate heading, `work-claims.md` lane/field label, phase step heading/body가 영어 중심이면 실패로 본다. 예시는 `제품 요구사항(PRD): <slug>`, `workflow 상태: <slug>`, `설정 검증(setup validation): <slug>`, `도구/보안 위험 게이트(Agent Tool And Security Risk Gate)`, `API 작업 lane`처럼 한국어 heading 우선이다. 외부 agent `resume` timeout이나 final response 누락은 `runner` 실패로 기록한다. | [SKILL.md](../plugins/project-workflow/skills/project-workflow/SKILL.md) · [skill.html](../plugins/project-workflow/skills/project-workflow/skill.html) |
| `feature-workflow` | 반복 구현 구간의 별도 skill이다. 기존 PRD, issue, spec, bug report, acceptance criteria, ADR, `design.md`, `workflow-state.md`, `work-claims.md`를 기준으로 feature, bug fix, vertical slice를 TDD, implementation plan, review, QA/runtime evidence, document sync, completion reporting까지 끝내고 TypeScript production edit에서 CommonJS 도입을 차단한다. 대상 코드 repo에서는 RED evidence를 강제하고, 이 shared skills repo에는 TDD hook을 설치하지 않는다. | [SKILL.md](../skills/feature-workflow/SKILL.md) · [skill.html](../skills/feature-workflow/skill.html) |

### 문서와 커밋

| Skill | 설명 | 자세히 |
| --- | --- | --- |
| `transcript-polisher` | 전사본, 강의 대본, 자막, 회의록, 긴 산문을 코드 치환 없이 직접 읽고 source/output 구조, `polish` 분량, 불확실 용어를 검증하며 Claude Code `/goal`식 완료 조건 루프로 검토한다. | [SKILL.md](../skills/transcript-polisher/SKILL.md) · [skill.html](../skills/transcript-polisher/skill.html) |
| `atomic-committer` | dirty git tree를 secret guard로 검사하고, 반복 untracked local/secret artifact는 `.gitignore`로 예방한 뒤 atomic commit 단위로 나누며, 사용자가 push 금지를 명시하지 않는 한 커밋 후 push까지 수행한다. | [SKILL.md](../skills/atomic-committer/SKILL.md) · [skill.html](../skills/atomic-committer/skill.html) |
| `pull-request` | GitHub PR의 branch/base/head, 한국어 title/body, template, issue link, reviewer/label/draft 옵션과 `gh pr create` 실행 경계를 관리한다. | [SKILL.md](../skills/pull-request/SKILL.md) · [skill.html](../skills/pull-request/skill.html) |

### 리뷰와 QA

| Skill | 설명 | 자세히 |
| --- | --- | --- |
| `browser-qa` | 브라우저 runtime evidence로 렌더링, console, network, accessibility snapshot, viewport, text overflow를 확인하고 QA 종료 후 browser/server를 정리한다. | [SKILL.md](../skills/browser-qa/SKILL.md) · [skill.html](../skills/browser-qa/skill.html) |
| `code-review` | Findings-first 방식으로 버그, 회귀, 누락 테스트, SRP/SOLID, JS/TS 스타일, agent/tool-call boundary 위험을 검토한다. | [SKILL.md](../skills/code-review/SKILL.md) · [skill.html](../skills/code-review/skill.html) |
| `design-review` | 제품 도메인과 기존 디자인 시스템을 우선해 UI hierarchy, density, typography, state, accessibility, responsive order를 리뷰한다. | [SKILL.md](../skills/design-review/SKILL.md) · [skill.html](../skills/design-review/skill.html) |

## 보는 방법

- 대화에서 바로 보고 싶으면 `show-skills`를 사용한다.
- 전체 흐름과 repo 목적은 [README.md](../README.md)를 본다.
- 각 스킬의 자세한 사용 판단은 해당 `skill.html`을 본다.
- 프로젝트에 붙일 문구는 [project-snippets](../project-snippets/)를 본다.
- 생명주기와 최근 변경은 [history/skills.md](../history/skills.md)를 본다.

## 유지보수 규칙

- 새 스킬을 추가하면 이 문서, README, AGENTS, base snippets, history, validator 명령을 함께 갱신한다.
- 스킬 설명이 길어지면 README보다 이 문서를 먼저 확장한다.
- 현재 목록을 자동으로 확인할 때는 `show-skills` 스크립트를 우선한다.
