#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/project-workflow";
const repoRoot = path.resolve(skillRoot, "../..");

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
  ["references/upstream-dependency-map.md", "`execute.py`"],
  ["references/upstream-dependency-map.md", "TypeScript 선택 runner"],
  ["agents/openai.yaml", "parallel work-claims.md lane coordination"],
  ["agents/openai.yaml", "Korean first"],
  ["agents/openai.yaml", "invoked"],
  ["agents/openai.yaml", "fallback"],
  ["agents/openai.yaml", "deferred"],
  ["agents/openai.yaml", "Superpowers plugin"],
  ["agents/openai.yaml", "ESM only"],
  ["agents/openai.yaml", "CommonJS"],
  ["skill.html", "work-claims.md"],
  ["skill.html", "integration owner"],
  ["skill.html", "한국어 우선"],
  ["skill.html", "invoked"],
  ["skill.html", "fallback"],
  ["skill.html", "deferred"],
  ["skill.html", "Superpowers plugin"],
  ["skill.html", "TypeScript module 정책"],
  ["skill.html", "CommonJS 금지"],
  ["skill.html", "phase handoff"],
  ["skill.html", "execute-phase.ts"],
  ["../../project-snippets/project-workflow.md", "work-claims.md"],
  ["../../project-snippets/project-workflow.md", "Korean first"],
  ["../../project-snippets/project-workflow.md", "invoked"],
  ["../../project-snippets/project-workflow.md", "fallback"],
  ["../../project-snippets/project-workflow.md", "deferred"],
  ["../../project-snippets/project-workflow.md", "not created yet"],
  ["../../project-snippets/project-workflow.md", "Superpowers plugin"],
  ["../../project-snippets/project-workflow.md", "ESM only"],
  ["../../project-snippets/project-workflow.md", "CommonJS"],
  ["../../project-snippets/project-workflow.md", "phase/step plan"],
  ["../../project-snippets/project-workflow.md", "execute-phase.ts"],
  ["../../project-snippets/base.md", "work-claims.md"],
  ["../../project-snippets/base.md", "Korean first"],
  ["../../project-snippets/base.md", "invoked"],
  ["../../project-snippets/base.md", "deferred"],
  ["../../project-snippets/base.md", "not created yet"],
  ["../../project-snippets/base.md", "ESM only"],
  ["../../project-snippets/base.md", "phase/step"],
  ["../../project-snippets/base.md", "TypeScript"],
  ["../../project-snippets/claude-base.md", "Korean first"],
  ["../../project-snippets/claude-base.md", "invoked"],
  ["../../project-snippets/claude-base.md", "deferred"],
  ["../../project-snippets/claude-base.md", "not created yet"],
  ["../../project-snippets/claude-base.md", "ESM only"],
  ["../../project-snippets/claude-base.md", "Claude or Codex"],
  ["../../project-snippets/claude-base.md", "phase/step"],
  ["../../plugins/project-workflow/.codex-plugin/plugin.json", "\"project-workflow\""],
  ["../../plugins/project-workflow/.codex-plugin/plugin.json", "\"scripts\": \"./scripts/\""],
  ["agents/openai.yaml", "phase/step"],
  ["agents/openai.yaml", "execute-phase.ts"],
  ["agents/openai.yaml", "dry-run"],
  ["agents/openai.yaml", "stdin"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "--agent-bin"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "--agent-arg"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "--project-root"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "stdin"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "dry-run"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "--dangerously-skip-permissions"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "codex"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "claude"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "pending"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "completed"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "error"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "blocked"],
  ["../../plugins/project-workflow/scripts/execute-phase.ts", "shell: false"],
  ["../../plugins/project-workflow/scripts/validate-execute-phase.ts", "pending dry-run must not mutate index.json"],
  ["../../plugins/project-workflow/scripts/validate-execute-phase.ts", "completed dry-run must not mutate index.json"],
  ["../../plugins/project-workflow/scripts/validate-execute-phase.ts", "dangerous permission-bypass flag should fail"],
  ["../../plugins/project-workflow/skills/project-workflow/SKILL.md", "dependency invocation contract 기준"],
  ["../../plugins/project-workflow/skills/project-workflow/SKILL.md", "phase/step handoff gate"],
  ["../../plugins/project-workflow/README.md", "feature-workflow`는 이 plugin에 넣지 않는다"],
  ["../../plugins/project-workflow/README.md", "execute-phase.ts"],
  ["../../plugins/project-workflow/README.md", "--agent-bin"],
  ["../../plugins/project-workflow/references/plugin-boundary-review.md", "`project-workflow` | plugin core"],
  ["../../plugins/project-workflow/references/plugin-boundary-review.md", "execute-phase.ts"],
] as const;

const failures: string[] = [];
for (const [relativePath, needle] of requiredChecks) {
  const target = relativePath.startsWith("../..")
    ? path.join(repoRoot, relativePath.slice(6))
    : path.join(skillRoot, relativePath);
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
