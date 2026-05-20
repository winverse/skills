#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/skill-to-html";

validateSkillPackage("skill-to-html", skillRoot);

const requiredChecks = [
  ["SKILL.md", "SVG arrow"],
  ["SKILL.md", "2열 layout"],
  ["SKILL.md", "PC desktop viewport"],
  ["SKILL.md", "mobile/tablet"],
  ["SKILL.md", "화면에 보이는 설명은 한국어 문장 우선"],
  ["SKILL.md", "영어 설명어를 쉼표로 길게 나열하지 않는다"],
  ["SKILL.md", "그림 우선"],
  ["SKILL.md", "인터랙티브"],
  ["SKILL.md", "애니메이션"],
  ["SKILL.md", "inline JavaScript"],
  ["SKILL.md", "Framer Motion"],
  ["SKILL.md", "Web Animations API"],
  ["SKILL.md", "arrow endpoint, table width, overflow, text overlap"],
  ["SKILL.md", "좁은 side panel"],
  ["SKILL.md", "card readable width"],
  ["references/visual-guide-standards.md", "render integrity"],
  ["references/visual-guide-standards.md", "interaction and animation"],
  ["references/visual-guide-standards.md", "library policy"],
  ["references/visual-guide-standards.md", "marker-end"],
  ["references/visual-guide-standards.md", "PC desktop"],
  ["references/visual-guide-standards.md", "mobile/tablet"],
  ["references/visual-guide-standards.md", "영어 밀도"],
  ["references/visual-guide-standards.md", "전체 폭 section"],
  ["references/visual-guide-standards.md", "readability and card grid"],
  ["references/visual-guide-standards.md", "minmax(220px, 1fr)"],
  ["skill.html", "도표 무결성"],
  ["skill.html", "한국어 문장"],
  ["skill.html", "그림 먼저"],
  ["skill.html", "인터랙티브"],
  ["skill.html", "애니메이션"],
  ["skill.html", "data-view"],
  ["skill.html", "addEventListener"],
  ["skill.html", "PC desktop"],
  ["skill.html", "mobile/tablet"],
  ["skill.html", "넓은 표"],
  ["skill.html", "읽기 폭"],
  ["../../project-snippets/skill-to-html.md", "한국어 문장 우선"],
  ["../../project-snippets/skill-to-html.md", "그림 우선"],
  ["../../project-snippets/skill-to-html.md", "인터랙티브"],
  ["../../project-snippets/skill-to-html.md", "애니메이션"],
  ["../../project-snippets/skill-to-html.md", "PC desktop"],
  ["../../project-snippets/skill-to-html.md", "mobile/tablet"],
  ["../../project-snippets/skill-to-html.md", "minmax(220px, 1fr)"],
  ["../../scripts/validate-skill-html.ts", "inline script"],
  ["../../scripts/validate-skill-html.ts", "wide scope table should not be nested inside a two-column layout"],
  ["../../scripts/validate-skill-html.ts", "contract card grids must use readable minmax width"],
  ["../../scripts/validate-skill-html.ts", "arrow endpoint that does not reach a visible node"],
] as const;

const failures: string[] = [];
for (const [relativePath, needle] of requiredChecks) {
  const target = relativePath.startsWith("../..")
    ? path.resolve(skillRoot, relativePath)
    : path.join(skillRoot, relativePath);
  const text = readFileSync(target, "utf8");
  if (!text.includes(needle)) {
    failures.push(`${relativePath} must include ${needle}`);
  }
}

if (failures.length) {
  console.error("skill-to-html validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
