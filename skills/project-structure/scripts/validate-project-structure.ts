#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/project-structure";
const repoRoot = path.resolve(skillRoot, "../..");

validateSkillPackage("project-structure", skillRoot);

const requiredChecks = [
  ["SKILL.md", "TypeScript module 정책"],
  ["SKILL.md", "ESM"],
  ["SKILL.md", "CommonJS"],
  ["SKILL.md", "type: \"module\""],
  ["SKILL.md", "module: \"NodeNext\""],
  ["SKILL.md", "moduleResolution: \"Bundler\""],
  ["references/typescript-module-policy.md", "ESM만 사용"],
  ["references/typescript-module-policy.md", "CommonJS"],
  ["references/typescript-module-policy.md", "type: \"module\""],
  ["references/typescript-module-policy.md", "module.exports"],
  ["references/monorepo.md", "ESM only"],
  ["references/backend-nest.md", "ESM only"],
  ["references/frontend-next.md", "ESM only"],
  ["references/structure-validation.md", "type: \"module\""],
  ["agents/openai.yaml", "ESM only"],
  ["agents/openai.yaml", "CommonJS"],
  ["skill.html", "TypeScript module 정책"],
  ["skill.html", "ESM only"],
  ["skill.html", "CommonJS 금지"],
  ["../../project-snippets/project-structure.md", "ESM only"],
  ["../../project-snippets/project-structure.md", "CommonJS"],
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
  console.error("project-structure validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
