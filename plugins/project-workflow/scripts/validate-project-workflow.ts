#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "plugins/project-workflow/skills/project-workflow";
const repoRoot = path.resolve(skillRoot, "../../../..");

validateSkillPackage("project-workflow", skillRoot);

const requiredChecks = [
  ["SKILL.md", "work-claims.md"],
  ["SKILL.md", "claimed write set"],
  ["SKILL.md", "integration owner"],
  ["SKILL.md", "한국어 우선"],
  ["SKILL.md", "invoked"],
  ["SKILL.md", "fallback"],
  ["SKILL.md", "deferred"],
  ["SKILL.md", "첫 응답 기준"],
  ["SKILL.md", "not created yet"],
  ["SKILL.md", "Superpowers plugin"],
  ["SKILL.md", "setup gap check"],
  ["SKILL.md", "grill-with-docs"],
  ["SKILL.md", "CONTEXT-MAP.md"],
  ["SKILL.md", "ADR candidate"],
  ["SKILL.md", "interview gate"],
  ["SKILL.md", "ESM only"],
  ["SKILL.md", "CommonJS"],
  ["SKILL.md", "type: \"module\""],
  ["SKILL.md", "phase/step handoff gate"],
  ["SKILL.md", "acceptance command"],
  ["SKILL.md", "blocked condition"],
  ["SKILL.md", "summary field"],
  ["SKILL.md", "TypeScript 기반 선택 도구"],
  ["SKILL.md", "agent-neutral command boundary"],
  ["references/project-workflow-playbook.md", "dependency invocation 기준"],
  ["references/project-workflow-playbook.md", "fallback interview gate 기준"],
  ["references/project-workflow-playbook.md", "selected/invoked/skipped/fallback/deferred"],
  ["references/project-workflow-playbook.md", "Superpowers setup gap fallback"],
  ["references/project-workflow-playbook.md", "Grill with Docs fallback"],
  ["references/project-workflow-playbook.md", "not created yet"],
  ["references/project-workflow-playbook.md", "parallel multi-session setup 기준"],
  ["references/project-workflow-playbook.md", "one active owner per claimed write path"],
  ["references/project-workflow-playbook.md", "document language 기준"],
  ["references/project-workflow-playbook.md", "TypeScript module policy 기준"],
  ["references/project-workflow-playbook.md", "type: \"module\""],
  ["references/project-workflow-playbook.md", "phase/step handoff gate 기준"],
  ["references/project-workflow-playbook.md", "TypeScript execute runner boundary 기준"],
  ["references/project-workflow-playbook.md", "Claude 전용 `--dangerously-skip-permissions`"],
  ["references/upstream-dependency-map.md", "harness_framework"],
  ["references/upstream-dependency-map.md", "docs/update-source-registry.md"],
  ["references/upstream-dependency-map.md", "usage map"],
  ["references/upstream-dependency-map.md", "| source id | 출처 패키지 | 정확한 skill/plugin 이름 |"],
  ["references/upstream-dependency-map.md", "`gstack.office-hours`"],
  ["references/upstream-dependency-map.md", "`superpowers.brainstorming`"],
  ["references/upstream-dependency-map.md", "`observed.harness-framework.execute-phase`"],
  ["references/upstream-dependency-map.md", "`execute.py`"],
  ["references/upstream-dependency-map.md", "TypeScript 선택 runner"],
  ["references/upstream-dependency-map.md", "`grill-with-docs`"],
  ["references/upstream-dependency-map.md", "project setup에서는 `grill-me`를 기본 gate로 쓰지 않고"],
  ["agents/openai.yaml", "parallel work-claims.md lane coordination"],
  ["agents/openai.yaml", "Korean first"],
  ["agents/openai.yaml", "invoked"],
  ["agents/openai.yaml", "fallback"],
  ["agents/openai.yaml", "deferred"],
  ["agents/openai.yaml", "Superpowers plugin"],
  ["agents/openai.yaml", "Superpowers brainstorming setup gap check"],
  ["agents/openai.yaml", "grill-with-docs"],
  ["agents/openai.yaml", "grill-me is not the default project setup gate"],
  ["agents/openai.yaml", "ESM only"],
  ["agents/openai.yaml", "CommonJS"],
  ["agents/openai.yaml", "phase/step"],
  ["agents/openai.yaml", "execute-phase.ts"],
  ["agents/openai.yaml", "dry-run"],
  ["agents/openai.yaml", "stdin"],
  ["skill.html", "work-claims.md"],
  ["skill.html", "integration owner"],
  ["skill.html", "한국어 우선"],
  ["skill.html", "invoked"],
  ["skill.html", "fallback"],
  ["skill.html", "deferred"],
  ["skill.html", "Superpowers plugin"],
  ["skill.html", "setup gap check"],
  ["skill.html", "grill-with-docs"],
  ["skill.html", "TypeScript module 정책"],
  ["skill.html", "CommonJS 금지"],
  ["skill.html", "phase handoff"],
  ["skill.html", "execute-phase.ts"],
  ["repo:project-snippets/project-workflow.md", "work-claims.md"],
  ["repo:project-snippets/project-workflow.md", "Korean first"],
  ["repo:project-snippets/project-workflow.md", "invoked"],
  ["repo:project-snippets/project-workflow.md", "fallback"],
  ["repo:project-snippets/project-workflow.md", "deferred"],
  ["repo:project-snippets/project-workflow.md", "not created yet"],
  ["repo:project-snippets/project-workflow.md", "Superpowers plugin"],
  ["repo:project-snippets/project-workflow.md", "setup gap check"],
  ["repo:project-snippets/project-workflow.md", "grill-with-docs"],
  ["repo:project-snippets/project-workflow.md", "grill-me` is not the default project setup gate"],
  ["repo:project-snippets/project-workflow.md", "ESM only"],
  ["repo:project-snippets/project-workflow.md", "CommonJS"],
  ["repo:project-snippets/project-workflow.md", "phase/step plan"],
  ["repo:project-snippets/project-workflow.md", "execute-phase.ts"],
  ["repo:project-snippets/base.md", "work-claims.md"],
  ["repo:project-snippets/base.md", "Korean first"],
  ["repo:project-snippets/base.md", "invoked"],
  ["repo:project-snippets/base.md", "deferred"],
  ["repo:project-snippets/base.md", "not created yet"],
  ["repo:project-snippets/base.md", "ESM only"],
  ["repo:project-snippets/base.md", "setup gap check"],
  ["repo:project-snippets/base.md", "grill-with-docs"],
  ["repo:project-snippets/base.md", "phase/step"],
  ["repo:project-snippets/base.md", "TypeScript"],
  ["repo:project-snippets/claude-base.md", "Korean first"],
  ["repo:project-snippets/claude-base.md", "invoked"],
  ["repo:project-snippets/claude-base.md", "deferred"],
  ["repo:project-snippets/claude-base.md", "not created yet"],
  ["repo:project-snippets/claude-base.md", "ESM only"],
  ["repo:project-snippets/claude-base.md", "setup gap check"],
  ["repo:project-snippets/claude-base.md", "grill-with-docs"],
  ["repo:project-snippets/claude-base.md", "Claude or Codex"],
  ["repo:project-snippets/claude-base.md", "phase/step"],
  ["repo:plugins/project-workflow/.codex-plugin/plugin.json", "\"project-workflow\""],
  ["repo:plugins/project-workflow/.codex-plugin/plugin.json", "\"scripts\": \"./scripts/\""],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "--agent-bin"],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "--agent-arg"],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "--project-root"],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "stdin"],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "dry-run"],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "--dangerously-skip-permissions"],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "codex"],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "claude"],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "pending"],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "completed"],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "error"],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "blocked"],
  ["repo:plugins/project-workflow/scripts/execute-phase.ts", "shell: false"],
  ["repo:plugins/project-workflow/scripts/validate-execute-phase.ts", "pending dry-run must not mutate index.json"],
  ["repo:plugins/project-workflow/scripts/validate-execute-phase.ts", "completed dry-run must not mutate index.json"],
  ["repo:plugins/project-workflow/scripts/validate-execute-phase.ts", "dangerous permission-bypass flag should fail"],
  ["repo:plugins/project-workflow/README.md", "feature-workflow`는 이 plugin에 넣지 않는다"],
  ["repo:plugins/project-workflow/README.md", "execute-phase.ts"],
  ["repo:plugins/project-workflow/README.md", "--agent-bin"],
  ["repo:plugins/project-workflow/README.md", "프로젝트 워크플로우 테스트 방법"],
  ["repo:plugins/project-workflow/references/plugin-boundary-review.md", "`project-workflow` | plugin core"],
  ["repo:plugins/project-workflow/references/plugin-boundary-review.md", "execute-phase.ts"],
  ["repo:docs/project-workflow-test-method.md", "Cycle 절차"],
  ["repo:docs/project-workflow-test-method.md", "`grill-with-docs` -> `office-hours` -> Superpowers `brainstorming` setup gap check"],
  ["repo:docs/project-workflow-test-method.md", "`current/`는 매 cycle 시작 전에 삭제하고 다시 만든다"],
  ["repo:scripts/validate-source-registry.ts", "source registry validation passed"],
] as const;

function resolveTarget(relativePath: string): string {
  if (relativePath.startsWith("repo:")) {
    return path.join(repoRoot, relativePath.slice("repo:".length));
  }
  return path.join(skillRoot, relativePath);
}

const failures: string[] = [];
if (existsSync(path.join(repoRoot, "skills/project-workflow"))) {
  failures.push("top-level skills/project-workflow must be removed; use plugin-bundled canonical skill");
}

for (const [relativePath, needle] of requiredChecks) {
  const target = resolveTarget(relativePath);
  if (!existsSync(target)) {
    failures.push(`${relativePath} must exist`);
    continue;
  }
  const text = readFileSync(target, "utf8");
  if (!text.includes(needle)) {
    failures.push(`${relativePath} must include ${needle}`);
  }
}

if (failures.length) {
  console.error("project-workflow validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("project-workflow validation passed");
