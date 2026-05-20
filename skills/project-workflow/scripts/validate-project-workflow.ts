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
  ["SKILL.md", "Superpowers plugin"],
  ["SKILL.md", "interview gate"],
  ["SKILL.md", "ESM only"],
  ["SKILL.md", "CommonJS"],
  ["SKILL.md", "type: \"module\""],
  ["references/project-workflow-playbook.md", "dependency invocation 기준"],
  ["references/project-workflow-playbook.md", "fallback interview gate 기준"],
  ["references/project-workflow-playbook.md", "parallel multi-session setup 기준"],
  ["references/project-workflow-playbook.md", "one active owner per claimed write path"],
  ["references/project-workflow-playbook.md", "document language 기준"],
  ["references/project-workflow-playbook.md", "TypeScript module policy 기준"],
  ["references/project-workflow-playbook.md", "type: \"module\""],
  ["agents/openai.yaml", "parallel work-claims.md lane coordination"],
  ["agents/openai.yaml", "Korean first"],
  ["agents/openai.yaml", "invoked"],
  ["agents/openai.yaml", "fallback"],
  ["agents/openai.yaml", "Superpowers plugin"],
  ["agents/openai.yaml", "ESM only"],
  ["agents/openai.yaml", "CommonJS"],
  ["skill.html", "work-claims.md"],
  ["skill.html", "integration owner"],
  ["skill.html", "한국어 우선"],
  ["skill.html", "invoked"],
  ["skill.html", "fallback"],
  ["skill.html", "Superpowers plugin"],
  ["skill.html", "TypeScript module 정책"],
  ["skill.html", "CommonJS 금지"],
  ["../../project-snippets/project-workflow.md", "work-claims.md"],
  ["../../project-snippets/project-workflow.md", "Korean first"],
  ["../../project-snippets/project-workflow.md", "invoked"],
  ["../../project-snippets/project-workflow.md", "fallback"],
  ["../../project-snippets/project-workflow.md", "Superpowers plugin"],
  ["../../project-snippets/project-workflow.md", "ESM only"],
  ["../../project-snippets/project-workflow.md", "CommonJS"],
  ["../../project-snippets/base.md", "work-claims.md"],
  ["../../project-snippets/base.md", "Korean first"],
  ["../../project-snippets/base.md", "invoked"],
  ["../../project-snippets/base.md", "ESM only"],
  ["../../project-snippets/claude-base.md", "Korean first"],
  ["../../project-snippets/claude-base.md", "invoked"],
  ["../../project-snippets/claude-base.md", "ESM only"],
  ["../../plugins/project-workflow/.codex-plugin/plugin.json", "\"project-workflow\""],
  ["../../plugins/project-workflow/skills/project-workflow/SKILL.md", "dependency invocation contract 기준"],
  ["../../plugins/project-workflow/README.md", "feature-workflow`는 이 plugin에 넣지 않는다"],
  ["../../plugins/project-workflow/references/plugin-boundary-review.md", "`project-workflow` | plugin core"],
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
