---
name: skill-plugin-test-loop
description: "스킬, 플러그인, plugin-bundled skill이 실제 fresh clone 또는 isolated copy에서 기대한 대로 호출되고 산출물을 만드는지 cycle 기록과 실패 분류를 남기며 반복 테스트할 때 사용한다."
---

# 스킬 플러그인 테스트 루프

이 스킬은 스킬이나 플러그인이 "문서상 좋아 보이는지"가 아니라, 실제 사용자가 부르는 것처럼 실행했을 때 기대한 질문, 호출 순서, 산출물, 검증 증거가 나오는지 반복 확인한다. 특히 fresh clone, GitHub에서 받은 copy, plugin-bundled skill, `/goal`식 긴 개선 루프, 여러 검증 case 확대를 다룬다.

## 사용 판단

사용한다:

- 새 스킬, 기존 스킬, 플러그인, plugin-bundled skill을 실제 호출 흐름으로 테스트하라는 요청.
- "사람이 하는 것처럼", "fresh clone에서", "다시 처음부터", "검증 case를 늘려서", "루프를 돌려서 완성할 때까지" 같은 요청.
- 테스트 history, cycle 횟수, 실제 질문/응답 기록, 산출물 폴더, 실패 원인 분류가 필요한 요청.
- `project-workflow`처럼 다른 스킬이나 플러그인을 내부에서 호출해야 하는 orchestration package의 실제 동작 검증.

사용하지 않는다:

- 일반 앱의 unit/integration/e2e test만 돌리면 되는 경우. 그때는 대상 repo의 test runner를 쓴다.
- deterministic routing/schema/safety eval case만 추가하면 되는 경우. 그때는 `agent-eval-harness`가 주 스킬이다.
- 이미 원인이 확정된 스킬 문구 수정만 필요한 경우. 그때는 `skill-update`가 주 스킬이다.

## 관계 스킬

| 작업 | 주 스킬 |
| --- | --- |
| 반복 실행 loop와 cycle history | `skill-plugin-test-loop` |
| deterministic eval harness 설계 | `agent-eval-harness` |
| 스킬 문구, validator, HTML 수정 | `skill-update` |
| 브라우저와 `skill.html` runtime 증거 | `browser-qa` |
| 수정 후 commit/push | `atomic-committer` |

## 루프 원칙

1. 테스트 대상과 source를 먼저 고정한다.
2. 로컬 작업본을 직접 믿지 않고, 필요하면 remote에서 fresh clone 또는 isolated copy를 만든다.
3. 사용자의 기대 과정을 결과 history에 끼워 맞추지 않는다. 실제 첫 응답과 실제 산출물을 그대로 기록한다.
4. 현재 runtime이 원본 skill/plugin/command를 실제 호출할 수 있으면 호출한다.
5. 호출할 수 없으면 `fallback`으로 표시하고, 어떤 callable surface가 없었는지 기록한다.
6. 실패가 나오면 history를 고쳐서 통과시키지 않고, source skill/plugin 또는 test method를 고친 뒤 새 cycle로 다시 실행한다.
7. fresh clone이 remote 상태를 소비해야 하면 수정 cycle 사이에 `atomic-committer`로 commit/push를 분리해 반영한다.

## 테스트 루트 구조

테스트는 target repo 안의 임시 폴더나 사용자가 지정한 별도 폴더에서 실행한다. 구조는 다음처럼 둔다.

```text
<test-root>/
├── cycles.md
├── current/
│   ├── _github/<repo>/
│   └── targets/<target-slug>/
└── runs/
    └── cycle-NNN/
        ├── prompts/
        ├── history/
        ├── output/
        └── cycle-summary.md
```

`cycles.md`에는 cycle 번호, source commit, prompt, 기대하지 않고 관찰한 실제 결과, pass/fail, 다음 수정 대상을 쓴다. `cycle-NNN`은 001부터 증가시키고, 같은 cycle의 기록은 덮어쓰지 않는다.

## 실행 절차

1. **대상 고정**: top-level skill, plugin, plugin-bundled skill 중 무엇인지 적고 entrypoint를 기록한다.
2. **source 고정**: local workspace, remote URL, branch, commit, submodule 상태를 기록한다.
3. **격리 준비**: fresh clone 또는 isolated copy를 만들고, local symlink/global install에 의존하지 않았는지 확인한다.
4. **case 선정**: 최소 happy path와 실패가 의심되는 edge case를 고른다.
5. **첫 응답 기록**: 예상 순서를 prompt에 주입하지 않고, 대상 skill/plugin을 호출했을 때 실제 첫 응답을 저장한다.
6. **산출물 확인**: 생성된 폴더, 파일, 질문/답변 history, validator output, browser evidence를 저장한다.
7. **실패 분류**: 아래 failure class 중 하나 이상으로 분류한다.
8. **수정 루프**: source를 고치고 validator를 실행한다. remote fresh clone 검증이 필요하면 commit/push 후 다음 cycle을 돈다.
9. **완료 판정**: 최소 pass 조건과 남은 위험을 `cycle-summary.md`와 최종 보고에 동시에 남긴다.

## 검증 case matrix

| case | 확인 질문 |
| --- | --- |
| baseline happy path | 대상이 올바른 trigger로 호출되고 필수 산출물을 만든다. |
| no-browser/CLI | 브라우저 없이도 runtime evidence와 final response가 남는다. |
| browser/visual | `skill.html`이나 UI가 있으면 실제 브라우저 증거가 남는다. |
| API/MCP/secret-risk | 외부 write, MCP, secret, untrusted content gate가 빠지지 않는다. |
| plugin manifest/hook | manifest, MCP config, hook, bundled skill 경계가 flatten되지 않는다. |
| update drift/regression | catalog, snippet, validator, history가 source 변경과 같이 움직인다. |

## Bounded runner 기준

외부 agent를 실행하는 helper가 있으면 다음 조건을 요구한다.

- 명시적인 session id 또는 run id가 있다.
- 같은 `cwd`와 같은 source commit으로 실행한다.
- `--last`처럼 이전 세션 tail에 의존하지 않는다.
- timeout이 있고, timeout은 `runner` failure class로 기록한다.
- final response가 없으면 성공으로 보지 않는다.
- stdin boundary, prompt file, output file 경로를 기록한다.

## 실패 분류 Failure class

| class | 의미 |
| --- | --- |
| `skill contract` | 스킬 문구가 실제 호출 조건, 순서, 산출물, 금지 경계를 충분히 강제하지 못했다. |
| `plugin contract` | manifest, bundled skill, MCP, hook, source boundary가 실제 plugin 사용과 다르다. |
| `runner` | helper script, timeout, session, stdout/stderr capture, final response 수집 문제다. |
| `test method` | 테스트가 실제 호출이 아니라 결과를 끼워 맞췄거나 local workspace를 몰래 사용했다. |
| `target artifact` | 생성된 프로젝트, 문서, history, validator output이 요구 shape와 다르다. |
| `environment/hook` | shell, terminal, hook approval, MCP startup, 권한, installed binary 문제다. |
| `source drift` | README, snippet, catalog, history, validator, plugin registry가 서로 어긋났다. |

## 검증 기준

최소 검증:

```bash
node scripts/validate-skill.ts skills/<skill-name>
node scripts/validate-korean-markdown.ts .
node scripts/validate-skill-html.ts .
node scripts/validate-skill-repo.ts .
```

대상이 plugin이면 추가로 plugin validator를 실행한다. 대상이 브라우저 표시를 포함하면 `browser-qa`로 PC desktop 증거를 남긴다. 대상이 이 repo의 스킬이면 해당 skill-specific validator와 `node scripts/run-agent-evals.ts`를 함께 실행한다.

## 출력 형식

```text
테스트 대상
- <skill/plugin/entrypoint>

source
- <repo/branch/commit>

cycle 결과
- cycle-001: pass/fail, 관찰한 실제 첫 응답, 산출물, failure class
- cycle-002: pass/fail, 수정점, 재검증 증거

검증 명령
- <command>: <result>

남은 위험
- <risk or none>
```
