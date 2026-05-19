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
  ["SKILL.md", "ESM only"],
  ["SKILL.md", "CommonJS"],
  ["SKILL.md", "type: \"module\""],
  ["references/project-workflow-playbook.md", "parallel multi-session setup 기준"],
  ["references/project-workflow-playbook.md", "one active owner per claimed write path"],
  ["references/project-workflow-playbook.md", "document language 기준"],
  ["references/project-workflow-playbook.md", "TypeScript module policy 기준"],
  ["references/project-workflow-playbook.md", "type: \"module\""],
  ["agents/openai.yaml", "parallel work-claims.md lane coordination"],
  ["agents/openai.yaml", "Korean first"],
  ["agents/openai.yaml", "ESM only"],
  ["agents/openai.yaml", "CommonJS"],
  ["skill.html", "work-claims.md"],
  ["skill.html", "integration owner"],
  ["skill.html", "한국어 우선"],
  ["skill.html", "TypeScript module 정책"],
  ["skill.html", "CommonJS 금지"],
  ["../../project-snippets/project-workflow.md", "work-claims.md"],
  ["../../project-snippets/project-workflow.md", "Korean first"],
  ["../../project-snippets/project-workflow.md", "ESM only"],
  ["../../project-snippets/project-workflow.md", "CommonJS"],
  ["../../project-snippets/base.md", "work-claims.md"],
  ["../../project-snippets/base.md", "Korean first"],
  ["../../project-snippets/base.md", "ESM only"],
  ["../../project-snippets/claude-base.md", "Korean first"],
  ["../../project-snippets/claude-base.md", "ESM only"],
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
