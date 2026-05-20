#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

validateSkillPackage("atomic-committer", process.argv[2]);

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const checks: Array<{ file: string; text: string }> = [
  {
    file: "skills/atomic-committer/SKILL.md",
    text: "기본적으로 commit + push 요청으로 해석한다",
  },
  {
    file: "skills/atomic-committer/SKILL.md",
    text: "push 금지를 명시한 경우에만 push를 생략한다",
  },
  {
    file: "skills/atomic-committer/SKILL.md",
    text: "logical changeset별로 commit을 분리",
  },
  {
    file: "skills/atomic-committer/SKILL.md",
    text: "remote, branch, upstream이 확인되지 않으면",
  },
  {
    file: "skills/atomic-committer/agents/openai.yaml",
    text: "push after committing unless the user explicitly asks not to push",
  },
  {
    file: "project-snippets/atomic-committer.md",
    text: "Push after committing unless the user explicitly asks not to push",
  },
  {
    file: "project-snippets/base.md",
    text: "push after committing unless the user explicitly asks not to push",
  },
  {
    file: "project-snippets/claude-base.md",
    text: "push after committing unless the user explicitly asks not to push",
  },
  {
    file: "AGENTS.md",
    text: "push after committing unless the user explicitly asks not to push",
  },
  {
    file: "README.md",
    text: "사용자가 push 금지를 명시하지 않는 한 커밋 후 push까지 수행",
  },
  {
    file: "docs/skill-catalog.md",
    text: "사용자가 push 금지를 명시하지 않는 한 커밋 후 push까지 수행",
  },
  {
    file: "evals/agent/cases/safety-boundaries.json",
    text: "push after committing unless the user explicitly asks not to push",
  },
];

const failures = checks.filter(({ file, text }) => {
  const content = readFileSync(path.join(repoRoot, file), "utf8");
  return !content.includes(text);
});

if (failures.length > 0) {
  console.error("atomic-committer contract validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure.file} must include: ${failure.text}`);
  }
  process.exit(1);
}
