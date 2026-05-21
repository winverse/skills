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
requireSkillText("SKILL.md", "새 복제본", "fresh clone Korean contract");
requireSkillText("SKILL.md", "격리 복사본", "isolated copy Korean contract");
requireSkillText("SKILL.md", "cycle-NNN", "cycle numbering");
requireSkillText("SKILL.md", "plugin-bundled skill", "plugin-bundled skill scope");
requireSkillText("SKILL.md", "external scratch root", "external scratch root");
requireSkillText("SKILL.md", "Desktop", "Desktop example");
requireSkillText("SKILL.md", "publish gate", "publish gate");
requireSkillText("SKILL.md", "commit/push 전", "commit push preflight boundary");
requireSkillText("SKILL.md", "GitHub 새 복제본", "GitHub fresh clone");
requireSkillText("SKILL.md", "current/_github/<repo>/", "fresh clone path");
requireSkillText("SKILL.md", "실제 첫 응답", "actual first response evidence");
requireSkillText("SKILL.md", "Bounded runner", "bounded runner section");
requireSkillText("SKILL.md", "final response", "final response requirement");
requireSkillText("SKILL.md", "web-research", "research-informed improvement skill");
requireSkillText("SKILL.md", "best practice", "best practice research lane");
requireSkillText("SKILL.md", "research-informed improvement", "research-informed case");
requireSkillText("SKILL.md", "official/source", "official research lane");
requireSkillText("SKILL.md", "community/practice", "community practice research lane");
requireSkillText("SKILL.md", "counterexample/risk", "counterexample research lane");
requireSkillText("SKILL.md", "adopt", "adopt decision");
requireSkillText("SKILL.md", "adapt", "adapt decision");
requireSkillText("SKILL.md", "reject", "reject decision");
requireSkillText("SKILL.md", "defer", "defer decision");
requireSkillText("SKILL.md", "runs/cycle-NNN/research/ledger.md", "research ledger path");
requireSkillText("SKILL.md", "생략 사유", "research skip reason");
requireSkillText("SKILL.md", "ledger path", "output research ledger path");

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
  "web-research",
  "agent-eval-harness",
  "skill-update",
  "browser-qa",
  "atomic-committer",
]) {
  requireSkillText("SKILL.md", related, `related skill ${related}`);
}

requireSkillText("agents/openai.yaml", "$skill-plugin-test-loop", "default prompt trigger");
requireSkillText("agents/openai.yaml", "external scratch root", "default prompt external scratch root");
requireSkillText("agents/openai.yaml", "committed and pushed", "default prompt committed and pushed boundary");
requireSkillText("agents/openai.yaml", "$web-research", "default prompt research lane");
requireSkillText("agents/openai.yaml", "adopt/adapt/reject/defer", "default prompt research decision");
requireSkillText("skill.html", "cycle-NNN", "HTML cycle label");
requireSkillText("skill.html", "실패 분류", "HTML failure class label");
requireSkillText("skill.html", "리서치 기반 개선", "HTML research section");
requireSkillText("skill.html", "web-research", "HTML web research label");
requireSkillText("skill.html", "adopt/adapt/reject/defer", "HTML research decision label");
requireSkillText("skill.html", "생략 기록", "HTML research skip record");
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
requireText(
  "project-snippets/base.md",
  "research-informed improvement",
  "base snippet research lane",
);
requireText(
  "project-snippets/claude-base.md",
  "research-informed improvement",
  "Claude snippet research lane",
);

if (failures.length > 0) {
  console.error("skill-plugin-test-loop validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("skill-plugin-test-loop validation passed");
