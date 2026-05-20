#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/feature-workflow";
const repoRoot = path.resolve(skillRoot, "../..");

validateSkillPackage("feature-workflow", skillRoot);

const requiredChecks = [
  ["SKILL.md", "work-claims.md"],
  ["SKILL.md", "overlap block"],
  ["SKILL.md", "shared/hotspot files"],
  ["SKILL.md", "ESM only"],
  ["SKILL.md", "CommonJS"],
  ["SKILL.md", "type: \"module\""],
  ["references/feature-workflow-playbook.md", "work claim preflight 기준"],
  ["references/feature-workflow-playbook.md", "overlap result: clear | blocked"],
  ["references/feature-workflow-playbook.md", "TypeScript module policy preflight 기준"],
  ["references/feature-workflow-playbook.md", "type: \"module\""],
  ["agents/openai.yaml", "stop with an overlap block"],
  ["agents/openai.yaml", "ESM only"],
  ["agents/openai.yaml", "CommonJS"],
  ["skill.html", "work-claims.md"],
  ["skill.html", "overlap block"],
  ["skill.html", "TypeScript module 정책"],
  ["skill.html", "CommonJS 금지"],
  ["../../project-snippets/feature-workflow.md", "work-claims.md"],
  ["../../project-snippets/feature-workflow.md", "ESM only"],
  ["../../project-snippets/feature-workflow.md", "CommonJS"],
  ["../../project-snippets/base.md", "overlap block"],
  ["../../project-snippets/base.md", "ESM only"],
  ["../../plugins/project-workflow/README.md", "feature-workflow`는 이 plugin에 넣지 않는다"],
  ["../../plugins/project-workflow/references/plugin-boundary-review.md", "`feature-workflow` | 별도 skill 유지"],
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
  console.error("feature-workflow validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
