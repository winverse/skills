# 스킬 업데이트 체크리스트

## package completeness 기준

- `SKILL.md`
- `references/*.md`
- `skill.html`
- `agents/openai.yaml`
- `project-snippets/<skill>.md`
- README, AGENTS, docs
- `history/skills.md`
- validator와 eval case

## coordination rules 기준

- behavior change와 visual guide를 분리하지 않는다.
- `skill.html`을 바꾸면 PC viewport에서 wide table, SVG arrow endpoint, overflow, text overlap을 직접 확인한다.
- 한국어 Markdown 규칙을 지킨다.
- source of truth가 충돌하면 추측하지 말고 묻는다.
- skill inventory가 바뀌면 show-skills catalog를 갱신한다.
- `skill-update` 호출 자체가 original/upstream provenance preflight를 포함한다.
- 사용자가 원본 확인을 따로 말하지 않아도 `docs/update-source-registry.md`를 먼저 읽고 source family를 고른다.
- 사용자가 전체 업데이트, 외부 dependency 업데이트, plugin과 workflow primitive 업데이트를 요청하면 explicit dependency update sweep으로 본다.
- dependency update sweep은 `.gitmodules`의 vendored plugin 전부, repo-owned plugin 목록, `project-workflow`와 `feature-workflow`의 `upstream-dependency-map.md` 전부를 자동 점검한다.
- `.gitmodules`는 vendored plugin/submodule update candidates의 canonical source다.
- `docs/update-source-registry.md`의 `Plugin update list`는 `.gitmodules`에서 파생한 사람이 읽는 별도 plugin update checklist다.
- `scripts/validate-plugins.ts`는 `.gitmodules`를 직접 파싱해 plugin catalog와 `Plugin update list`의 path/URL drift를 막는다.
- workflow provenance-only primitive는 각 workflow의 `references/upstream-dependency-map.md`를 canonical source로 읽고, `.gitmodules` 항목처럼 취급하지 않는다.
- 그 다음 `references/`, `history/skills.md`, project snippets, `agents/openai.yaml`, `skill.html`, git history에서 원본 후보를 찾는다.
- 대상 skill이 plugin-bundled skill에서 fork되었거나 이를 명시적으로 참조할 때만 `.gitmodules`와 plugin/submodule metadata를 원본 후보 증거로 읽는다.
- `skill-update`는 plugin package, MCP config, submodule 자체를 incidental하게 업데이트하지 않는다. plugin bump나 bundled plugin skill 수정은 사용자가 plugin update를 명시했을 때 plugin update lane으로 다룬다.
- dependency update sweep 요청은 plugin update를 명시한 것으로 간주하고, submodule bump 전에 upstream release/changelog와 local manifest drift를 확인한다.
- 원본 skill, upstream primitive, fork 기록이 있으면 local package를 먼저 고치지 말고 원본 확인을 선행한다.
- 원본 위치가 불명확하거나 최신 변경 비교가 필요하면 `web-research`를 호출하고, runtime이 허용할 때 독립 후보/source lane을 병렬로 찾는다.
- 원본 수정 권한과 위치가 명확하면 원본 변경을 먼저 준비하거나 적용한 뒤 local shared skill에 delta를 반영한다.
- 원본 delta는 `adopt`, `adapt`, `reject`, `defer`로 분류하고, 이 repo의 cross-agent 계약과 사용자 취향에 맞는 항목만 반영한다.
- 원본을 직접 수정할 수 없으면 source ledger, checked date, local delta 이유를 남긴다.

## upstream refresh 기준

1. `docs/update-source-registry.md`를 읽고 source family를 정한다.
2. vendored plugin/submodule 후보는 `.gitmodules`에서 path와 URL을 읽는다.
3. workflow provenance-only primitive는 `skills/project-workflow/references/upstream-dependency-map.md` 또는 `skills/feature-workflow/references/upstream-dependency-map.md`에서 읽는다.
4. `references/`, `history/skills.md`, project snippets, 기존 commit message에서 local provenance를 찾는다.
5. `agents/openai.yaml`, `skill.html`의 source mention, git history까지 확인한다.
6. 대상 skill이 plugin-bundled skill에서 온 경우에만 `.gitmodules`, plugin/submodule metadata, package manifest를 원본 후보 증거로 확인한다.
7. 원본 후보가 여러 개면 공식 repo/docs, upstream manifest, release note, changelog, source file을 우선한다.
8. `web-research` 결과는 source URL, checked date, upstream version/commit, 어떤 rule을 가져오거나 버렸는지 기록한다.
9. 원본과 local skill의 역할이 다르면 원본 전체를 복사하지 말고 이 repo에서 채택한 behavior delta만 반영한다.
10. 원본 변경이 외부 repo PR, submodule bump, vendor plugin update를 요구하면 `Plugin update list`의 path, upstream URL, 점검 파일을 확인한다. 사용자가 plugin update를 명시했으면 plugin update lane으로 계속 진행하고, 명시하지 않았으면 `skill-update` 범위를 벗어난 것으로 보고 사용자 요청 범위와 별도 workflow 필요 여부를 확인한다.
11. dependency update sweep이면 plugin update lane과 workflow primitive lane을 둘 다 실행하고, 변경이 없더라도 checked date, compared source, defer/reject 이유를 보고한다.

## source ledger 형식

```markdown
## 원본 source 확인

- Target skill: `skills/<skill-name>`
- Source registry checked: `docs/update-source-registry.md`
- Plugin update list checked: yes/no, relevant plugin path if any
- Local provenance checked: `.gitmodules` when relevant, workflow source maps when relevant, `references/`, `history/skills.md`, snippets, metadata, git history
- Source URL:
- Checked date:
- Upstream version or commit:
- Compared files or release notes:
- Adopt:
- Adapt:
- Reject:
- Defer:
- Local delta reason:
```

## history rules 기준

trigger, workflow, validator, eval, snippet, lifecycle state가 의미 있게 바뀔 때만 기록한다. typo나 단순 copy polish는 기록하지 않는다.

## failure modes 기준

- HTML은 갱신됐지만 SKILL.md가 stale
- HTML validator는 통과했지만 실제 브라우저에서 SVG 화살표가 노드에 닿지 않거나 넓은 범위 표가 2열 layout 안에서 깨짐
- validator가 영어 고정 문구만 검사
- snippet이 이전 trigger를 설명
- history가 lifecycle state와 불일치
- 원본이 있는 스킬을 local-only 추측으로 고쳐 upstream drift가 커짐
- `web-research`를 했지만 병렬 후보 비교, checked date, 적용/비적용 판단이 남지 않음
- 원본 조사를 사용자가 명시하지 않았다는 이유로 provenance preflight를 건너뜀
- `docs/update-source-registry.md`와 `.gitmodules`를 보지 않고 vendored plugin/source 후보를 추측함
- 별도 plugin update가 필요한데 `Plugin update list`의 path, upstream URL, 점검 파일을 보고하지 않음
- `.gitmodules`에 새 plugin이 생겼는데 `docs/plugin-catalog.md`나 `Plugin update list` drift를 `validate-plugins`로 잡지 못함
- plugin metadata를 원본 증거로 읽는 것을 plugin 자체 업데이트 권한으로 오해함
- dependency update sweep 요청인데 workflow primitive map만 갱신하고 vendored plugin을 누락하거나, 반대로 plugin만 갱신하고 workflow primitive source 확인을 누락함
