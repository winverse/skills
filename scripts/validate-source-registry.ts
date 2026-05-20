#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.argv[2] ?? process.cwd());
const errors: string[] = [];
const sourceIdPattern = /`((?:vendor|repo-plugin|matt-pocock|gstack|superpowers|observed)\.[a-z0-9.-]+)`/g;

const usageMaps = [
  "plugins/project-workflow/skills/project-workflow/references/upstream-dependency-map.md",
  "skills/feature-workflow/references/upstream-dependency-map.md",
];

const packagePrefixes: Array<[RegExp, string]> = [
  [/Matt Pocock skills/, "matt-pocock."],
  [/GStack plugin/, "gstack."],
  [/Superpowers plugin/, "superpowers."],
  [/observed workflow/, "observed."],
  [/setup source/, "repo-plugin."],
];

function read(relativePath: string): string {
  const fullPath = path.join(root, relativePath);
  if (!existsSync(fullPath)) {
    errors.push(`Missing required file: ${relativePath}`);
    return "";
  }
  return readFileSync(fullPath, "utf8");
}

function tableCells(line: string): string[] {
  return line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function sourceIdsIn(text: string): string[] {
  return [...text.matchAll(sourceIdPattern)].map((match) => match[1]);
}

const registry = read("docs/update-source-registry.md");
const registrySourceIds = new Set(sourceIdsIn(registry));

for (const required of [
  "단일 진실원 원칙",
  "upstream source URL, checked date, upstream version/commit, source id, local 채택 판단은 이 문서에서만 관리한다",
  "workflow의 `references/upstream-dependency-map.md`는 source registry가 아니라 usage map이다",
]) {
  if (!registry.includes(required)) {
    errors.push(`docs/update-source-registry.md must include ${required}`);
  }
}

for (const usageMap of usageMaps) {
  const text = read(usageMap);
  if (!text) continue;

  if (!text.includes("| source id |")) {
    errors.push(`${usageMap} must include a source id column in its usage table`);
  }

  if (/https?:\/\//.test(text)) {
    errors.push(`${usageMap} must not duplicate source URLs; use docs/update-source-registry.md`);
  }

  if (/\b20\d{2}-\d{2}-\d{2}\b/.test(text)) {
    errors.push(`${usageMap} must not duplicate checked dates; use docs/update-source-registry.md`);
  }

  for (const sourceId of sourceIdsIn(text)) {
    if (!registrySourceIds.has(sourceId)) {
      errors.push(`${usageMap} references unknown source id: ${sourceId}`);
    }
  }

  for (const line of text.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = tableCells(line);
    if (cells.length === 0 || cells[0] === "source id" || cells.every((cell) => /^-+$/.test(cell))) {
      continue;
    }

    const rowText = cells.join(" ");
    const idCell = cells[0];
    for (const [packagePattern, expectedPrefix] of packagePrefixes) {
      if (!packagePattern.test(rowText)) continue;
      if (!idCell.includes("`")) {
        errors.push(`${usageMap} row for ${packagePattern.source} must start with a registry source id`);
        continue;
      }
      const sourceId = sourceIdsIn(idCell)[0];
      if (!sourceId?.startsWith(expectedPrefix)) {
        errors.push(`${usageMap} row has mismatched source id for ${packagePattern.source}: ${idCell}`);
      }
    }
  }
}

if (errors.length) {
  console.error("source registry validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("source registry validation passed");
