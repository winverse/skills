#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = path.resolve(process.argv[2] ?? "skills/skill-plugin-test-loop");
const repoRoot = path.resolve(skillRoot, "../..");
const failures: string[] = [];

function read(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function readSkill(relativePath: string): string {
  return readFileSync(path.join(skillRoot, relativePath), "utf8");
}

function requireFile(relativePath: string): void {
  if (!existsSync(path.join(repoRoot, relativePath))) {
    failures.push(`missing file: ${relativePath}`);
  }
}

function requireText(file: string, text: string, label: string): void {
  if (!existsSync(path.join(repoRoot, file))) {
    failures.push(`missing file for ${label}: ${file}`);
    return;
  }
  if (!read(file).includes(text)) {
    failures.push(`${file} missing ${label}: ${text}`);
  }
}

function requireSkillText(file: string, text: string, label: string): void {
  if (!existsSync(path.join(skillRoot, file))) {
    failures.push(`missing skill file for ${label}: ${file}`);
    return;
  }
  if (!readSkill(file).includes(text)) {
    failures.push(`${path.relative(repoRoot, path.join(skillRoot, file))} missing ${label}: ${text}`);
  }
}

validateSkillPackage("skill-plugin-test-loop", skillRoot);

requireFile("project-snippets/skill-plugin-test-loop.md");
requireSkillText("SKILL.md", "fresh clone", "fresh clone contract");
requireSkillText("SKILL.md", "isolated copy", "isolated copy contract");
requireSkillText("SKILL.md", "cycle-NNN", "cycle numbering");
requireSkillText("SKILL.md", "plugin-bundled skill", "plugin-bundled skill scope");
requireSkillText("SKILL.md", "실제 첫 응답", "actual first response evidence");
requireSkillText("SKILL.md", "Bounded runner", "bounded runner section");
requireSkillText("SKILL.md", "final response", "final response requirement");

for (const failureClass of [
  "skill contract",
  "plugin contract",
  "runner",
  "test method",
  "target artifact",
  "environment/hook",
  "source drift",
]) {
  requireSkillText("SKILL.md", failureClass, `failure class ${failureClass}`);
}

for (const related of [
  "agent-eval-harness",
  "skill-update",
  "browser-qa",
  "atomic-committer",
]) {
  requireSkillText("SKILL.md", related, `related skill ${related}`);
}

requireSkillText("agents/openai.yaml", "$skill-plugin-test-loop", "default prompt trigger");
requireSkillText("skill.html", "cycle-NNN", "HTML cycle label");
requireSkillText("skill.html", "Failure class", "HTML failure class label");
requireSkillText("skill.html", "SKILL.md", "HTML source pair");
requireSkillText("skill.html", "skill.html", "HTML guide pair");

for (const file of [
  "README.md",
  "AGENTS.md",
  "docs/skill-catalog.md",
  "docs/project-skill-setup.md",
  "history/skills.md",
  "project-snippets/base.md",
  "project-snippets/claude-base.md",
  "project-snippets/skill-plugin-test-loop.md",
  "skills/show-skills/scripts/show-skills.ts",
  "skills/show-skills/scripts/update-html-catalog.ts",
]) {
  requireText(file, "skill-plugin-test-loop", "repo surface entry");
}

requireText(
  "README.md",
  "node skills/skill-plugin-test-loop/scripts/validate-skill-plugin-test-loop.ts skills/skill-plugin-test-loop",
  "skill-specific validator command",
);
requireText(
  "project-snippets/base.md",
  "<skills-root>/skills/skill-plugin-test-loop/SKILL.md",
  "base snippet link",
);
requireText(
  "project-snippets/claude-base.md",
  "<skills-root>/skills/skill-plugin-test-loop/SKILL.md",
  "Claude snippet link",
);

if (failures.length > 0) {
  console.error("skill-plugin-test-loop validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("skill-plugin-test-loop validation passed");
