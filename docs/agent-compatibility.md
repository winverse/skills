# Agent Compatibility

이 repo의 스킬은 Codex 전용이 아니다. `SKILL.md`를 source instruction으로 두고, 각 프로젝트에서 사용하는 에이전트의 instruction 파일이 이 source instruction을 참조하도록 연결한다.

Copied snippets use `<skills-root>` as a placeholder for the actual clone path of this repo. Replace it per machine.

## 기본 모델

```text
<skills-root>/skills/<skill-name>/SKILL.md
        |
        +-- Codex project: AGENTS.md
        +-- Claude project: CLAUDE.md
        +-- Other agent: equivalent instruction file
```

`skill.html`은 에이전트가 아니라 사람이 빠르게 판단하기 위한 시각 가이드다. 새 프로젝트에 스킬을 붙이기 전에 먼저 `skill.html`을 열어 목적, trigger, workflow, 파일 구조를 확인한다.

Do not assume identical scope or precedence across agents. `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `.cursor/rules`, `.windsurf/rules`, `SKILL.md`, `.agents/skills`, and `.claude/skills` are portable connection surfaces, but each product can apply different discovery, nesting, precedence, activation metadata, and feature-support rules.

## Surface Matrix

| Surface | Use for | Compatibility note |
| --- | --- | --- |
| `AGENTS.md` | Codex-style project instructions and some agent-compatible repo instructions | Verify nested-file and precedence behavior per agent. |
| `CLAUDE.md` | Claude-oriented project instructions | Keep shared skill links readable even when automatic skill loading is unavailable. |
| `GEMINI.md` | Gemini-oriented project instructions | Treat as an adapter surface, not proof that other agents will read it. |
| `.github/copilot-instructions.md` | GitHub Copilot repo-wide instructions | Check feature support and path-specific instruction precedence. |
| `.github/instructions/*.instructions.md` | GitHub Copilot path or task instructions | Keep globs and agent-specific conditions explicit. |
| `.cursor/rules` | Cursor rules and activation metadata | Verify root/nested behavior and `description`, `globs`, or `alwaysApply` support for the installed version. |
| `.windsurf/rules` | Windsurf rules and durable reusable context | Distinguish rules, workflows, skills, and memory behavior. |
| `SKILL.md`, `.agents/skills`, `.claude/skills` | Reusable skill package instructions | Keep descriptions short, trigger-focused, and tested with positive and near-miss prompts. |

## Codex 연결

Codex 프로젝트에서는 보통 `AGENTS.md`에 다음처럼 연결한다.

```markdown
## Project Skills

- Use $web-research at <skills-root>/skills/web-research/SKILL.md when a task needs current facts, web verification, source comparison, citations, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords.
- Treat `web-search`, `web search`, `웹서치`, and `웹 검색` as aliases for `web-research`.
- Do not treat skill review/update requests or user-provided-document-only summarization as browse requests. Use local sources first when provided, then choose the smallest sufficient research budget.
- Use parallel source lanes for recommendations, comparisons, high-stakes/current facts, source conflicts, or downstream product/architecture/PR decisions. Single official quick checks can stay single-agent.
```

## Claude 연결

Claude 프로젝트에서는 보통 `CLAUDE.md`에 같은 스킬 경로와 사용 조건을 적는다. Claude가 `$skill-name` 링크 문법을 특별하게 처리하지 않는 환경에서도 경로와 trigger가 명확하면 사람이 붙여 넣거나 에이전트가 참고할 수 있다.

```markdown
## Project Skills

- For current facts, source verification, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords, use the shared skill at `<skills-root>/skills/web-research/SKILL.md`.
- Treat `web-search`, `web search`, `웹서치`, and `웹 검색` as aliases for `web-research`.
- Do not treat skill review/update requests or user-provided-document-only summarization as browse requests. Use local sources first when provided, then choose the smallest sufficient research budget.
- Use parallel source lanes for recommendations, comparisons, high-stakes/current facts, source conflicts, or downstream product/architecture/PR decisions. Single official quick checks can stay single-agent.
- Before using a shared skill, read its adjacent `skill.html` if you need a quick human-facing overview.

## Project Skill Overrides

- Prefer this project's local docs, source code, and logs before general web results.
- Use repo-linked custom skills before default/global agent behavior when the behavior overlaps.
```

## 다른 에이전트 연결

다른 에이전트에서도 같은 원칙을 쓴다.

1. 해당 에이전트가 읽는 project instruction 파일을 연다.
2. 필요한 스킬의 절대 경로와 trigger를 적는다.
3. 에이전트가 파일 링크를 자동으로 읽지 못하면, `SKILL.md` 내용을 project instruction에 요약하거나 adapter snippet을 만든다.
4. 프로젝트 고유 규칙은 shared skill을 바꾸지 말고 project instruction 아래 override로 둔다.

## 호환성 기준

공유 스킬은 다음 조건을 만족해야 한다.

- 특정 에이전트 이름에만 의존하지 않는 trigger 문구를 쓴다.
- Codex 전용 도구나 Claude 전용 도구가 필요한 경우, 그 부분을 adapter 또는 project override로 분리한다.
- `SKILL.md`는 agent-neutral workflow를 담고, 에이전트별 연결 방법은 `project-snippets/`나 프로젝트 instruction 파일에 둔다.
- `skill.html`은 누구든 스킬을 고를 수 있게 사람용 설명과 도표를 제공한다.
