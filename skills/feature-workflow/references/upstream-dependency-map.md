# feature-workflow upstream dependency map 기준

## 목적

이 파일은 `feature-workflow`가 참고하는 반복 개발 primitive의 사용 장부이자 usage map이다. source URL, checked date, upstream version/commit, local 채택 판단은 단일 진실원인 `docs/update-source-registry.md`에서만 관리한다. `feature-workflow`는 Superpowers plugin, GStack plugin, Matt Pocock skills, repo-local helper를 통째로 복제하지 않고, 현재 feature, issue, bug fix, vertical slice 구현에 필요한 최소 primitive만 채택한다.

외부에서 온 이름은 항상 `출처 패키지`와 `정확한 skill/plugin 이름`을 함께 적는다. 예: `Superpowers plugin / writing-plans`, `Superpowers plugin / tdd`, `GStack plugin / plan-eng-review`, `Matt Pocock skills / diagnose`.

## 채택 원칙

| 원칙 | 기준 |
| --- | --- |
| feature 단위 반복 | 하나의 feature/issue/spec/bug/vertical slice를 끝내는 데 필요한 loop만 실행한다. |
| project setup 회피 | raw idea, domain setup, PRD, project structure는 `project-workflow`로 넘긴다. |
| 출처 라벨 필수 | 외부 primitive는 source package와 exact name을 함께 기록한다. |
| evidence 우선 | RED/GREEN/REFACTOR, runtime evidence, review result를 남긴다. |
| 업데이트 추적 | upstream 이름, source URL, checked date가 바뀌면 `docs/update-source-registry.md`를 먼저 갱신하고, 이 파일은 실행 순서와 handoff만 갱신한다. |

## 사용 장부

| source id | 출처 패키지 | 정확한 skill/plugin 이름 | 채택 역할 | 로컬 산출물과 handoff | 기본 상태 |
| --- | --- | --- | --- | --- | --- |
| `superpowers.brainstorming` | Superpowers plugin | `brainstorming` | feature/issue implementation approach와 alternative 정리 | implementation design notes | 구현 조건부 |
| `superpowers.writing-plans` | Superpowers plugin | `writing-plans` | 2-5분 단위 task와 검증 명령 작성 | `.scratch/<slug>/plans/` | 핵심 |
| `superpowers.subagent-driven-development` | Superpowers plugin | `subagent-driven-development` | 큰 plan을 subagent로 실행하고 review | task ledger, spec/code-quality review notes | 큰 구현만 |
| `superpowers.tdd` | Superpowers plugin | `tdd` 또는 `test-driven-development` | RED -> GREEN -> REFACTOR loop | test evidence | 핵심 |
| `superpowers.verification-before-completion` | Superpowers plugin | `verification-before-completion` | 완료 전 검증 누락 방지 | completion checklist | 완료 조건부 |
| `gstack.plan-eng-review` | GStack plugin | `plan-eng-review` | implementation plan의 architecture/test 검토 | plan review result | 큰 구현 전 |
| `gstack.plan-design-review` | GStack plugin | `plan-design-review` | UI spec의 design review | mock decision, design gap list | UI 조건부 |
| `gstack.browse` | GStack plugin | `browse` | 빠른 browser session use | repo-local `browser-qa`와 충돌 여부 확인 | 조건부 |
| `gstack.review` | GStack plugin | `review` | 구현 review | repo-local `code-review` 또는 `codex:review`와 병행 가능 | 조건부 |
| `gstack.qa` | GStack plugin | `qa` | runtime QA | `browser-qa` 또는 non-browser evidence | 조건부 |
| `gstack.ship` | GStack plugin | `ship` | release manager gate | release checklist; destructive action 금지 | 요청 시 |
| `gstack.retro` | GStack plugin | `retro` | 큰 spec 후 회고와 eval seed | workflow log, future eval seed | 선택 |
| `matt-pocock.review` | Matt Pocock skills | `review` | 구현 후 일반 review primitive | repo-local `code-review`로 대체 가능 | 조건부 |
| `matt-pocock.diagnose` | Matt Pocock skills | `diagnose` | 실패 원인 분석 | QA evidence, bug notes | 조건부 |
| `matt-pocock.document-sync` | Matt Pocock skills | `document-sync` | 구현 후 문서 정합성 | repo-local `sync-docs` handoff | 완료 시 |
| `matt-pocock.improve-codebase-architecture` | Matt Pocock skills | `improve-codebase-architecture` | domain language와 코드 경계 재점검 | architecture cleanup notes, ADR update | 큰 구현 후 |
| `matt-pocock.semantic-commits` | Matt Pocock skills | `semantic-commits` | commit grouping | repo-local `atomic-committer` handoff | 요청 시 |
| `matt-pocock.ship` | Matt Pocock skills | `ship` | release 준비 | release checklist; deploy/publish는 별도 요청 필요 | 요청 시 |
| - | repo-local custom | `code-review` | findings-first code review | review findings | 완료 전 |
| - | repo-local custom | `browser-qa` | rendered UI evidence | screenshot, console/network/accessibility evidence | browser surface 시 |
| - | repo-local custom | `design-review` | UI/product-aware visual review | design findings | UI 조건부 |
| - | repo-local custom | `sync-docs` | docs/snippet/history drift 방지 | docs sync report | 완료 시 |
| - | repo-local custom | `atomic-committer` | atomic commit/push with secret guard | commit plan, validation, push proof | 요청 시 |
| - | repo-local custom | `workflow-state.md` cache | 반복 실행 상태와 evidence 색인 갱신 | `.scratch/<slug>/workflow-state.md` | 매 loop |
| - | repo-local custom | `agent-eval-harness` seed | 실패/누락 기반 자가개선 후보 | `.scratch/<slug>/eval-candidates/` | 누락 발견 시 |
| `repo-plugin.project-workflow` | setup source | `project-workflow` | project authority source | CONTEXT, ADR, PRD, issue, design.md | 사전 조건 |

## 업데이트 규칙

source id와 출처 확인 장부는 `docs/update-source-registry.md`가 단일 source registry다. 이 파일에는 source URL, checked date, upstream version/commit을 복사하지 않는다.

upstream source가 바뀌면 아래 순서로 추적한다.

1. `docs/update-source-registry.md`에서 source id, 출처 패키지, 정확한 skill/plugin 이름을 확인한다.
2. 이 primitive가 feature/issue implementation loop에 속하는지 다시 판단한다.
   - TDD, implementation plan, review, QA, diagnose, docs sync라면 유지한다.
   - domain/product/project structure 초기화라면 `project-workflow`로 옮긴다.
3. 갱신 범위를 제한한다.
   - 수정 대상: `SKILL.md`, 이 reference, `project-snippets/feature-workflow.md`, `project-snippets/base.md`, `project-snippets/claude-base.md`, `AGENTS.md`, `README.md`, `docs/skill-catalog.md`, `skill.html`, eval fixture/case, `history/skills.md`
   - 수정하지 않을 것: upstream skill 전문 복사, global install 정책, project setup stage 편입
4. eval을 추가하거나 갱신한다.
   - routing에 영향을 주면 `evals/agent/cases/feature-workflow-orchestration.json`에 deterministic check를 둔다.
   - saved output fixture에는 `source package`, `exact skill/plugin name`, `selected/skipped/fallback`이 보여야 한다.
5. 검증한다.
   - `node scripts/validate-skill.ts skills/feature-workflow`
   - `node skills/feature-workflow/scripts/validate-feature-workflow.ts skills/feature-workflow`
   - `node scripts/validate-korean-markdown.ts .`
   - `node scripts/validate-skill-html.ts .`
   - `node scripts/run-agent-evals.ts`
   - `node scripts/validate-skill-repo.ts .`

## 선택 budget 기준

| 작업 규모 | 선택할 primitive | 건너뛰는 것 |
| --- | --- | --- |
| tiny bug | repro, focused fix, `code-review` | full PRD, `subagent-driven-development` |
| normal feature | `writing-plans`, TDD, review, QA | full upstream chain |
| substantial UI | selected mock, `plan-design-review`, `design-review`, `browser-qa` | design system 초기화 |
| large implementation | `writing-plans`, `plan-eng-review`, `subagent-driven-development` | single-session freeform implementation |
| failure after implementation | `diagnose`, failing test, focused patch | new product discovery |
| completion/ship | review, QA evidence, `sync-docs`, optional `atomic-committer` | deploy/release/push without explicit request |

## 중복 경계 보호 규칙

`feature-workflow`는 repeated implementation loop를 맡고, project setup은 `project-workflow`, folder structure는 `project-structure`, docs drift는 `sync-docs`, commit은 `atomic-committer`가 맡는다.
