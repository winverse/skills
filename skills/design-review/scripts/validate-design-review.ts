#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = path.resolve(process.argv[2] ?? "skills/design-review");

validateSkillPackage("design-review", skillRoot);

const failures: string[] = [];

function read(relativePath: string): string {
  return readFileSync(path.join(skillRoot, relativePath), "utf8");
}

function requireIncludes(label: string, content: string, terms: string[]): void {
  for (const term of terms) {
    if (!content.includes(term)) failures.push(`${label} must include ${term}`);
  }
}

const skill = read("SKILL.md");
const referencePath = path.join(skillRoot, "references/design-review-criteria.md");
if (!existsSync(referencePath)) failures.push("missing references/design-review-criteria.md");
const criteria = existsSync(referencePath) ? read("references/design-review-criteria.md") : "";
const metadata = read("agents/openai.yaml");
const html = read("skill.html");

requireIncludes("SKILL.md", skill, [
  "references/design-review-criteria.md",
  "web-research",
  "S0",
  "S4",
  "Evidence Matrix",
  "WCAG 2.2",
  "2.4.7 Focus Visible",
  "2.5.8 Target Size",
  "3.3.1 Error Identification",
  "3.3.3 Error Suggestion",
  "Severity rationale",
]);

requireIncludes("references/design-review-criteria.md", criteria, [
  "report anatomy",
  "finding table",
  "severity",
  "confidence",
  "evidence",
  "criterion",
  "user impact",
  "recommendation",
  "owner hint",
  "screenshot annotation",
  "NN/g",
  "W3C WCAG 2.2",
  "GOV.UK",
]);

requireIncludes("agents/openai.yaml", metadata, [
  "severity",
  "evidence",
  "WCAG",
  "browser evidence",
]);

requireIncludes("skill.html", html, [
  "S0",
  "S4",
  "Evidence Matrix",
  "WCAG",
]);

if (failures.length) {
  console.error("design-review validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("design-review research-informed checks passed");
