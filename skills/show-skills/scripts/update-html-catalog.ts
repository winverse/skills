#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

type SkillTile = {
  folder: string;
  name: string;
  description: string;
  skillHref: string;
  htmlHref: string;
};

const startMarker = "        <!-- skill-catalog:start -->";
const endMarker = "        <!-- skill-catalog:end -->";
const args = process.argv.slice(2);
const check = args.includes("--check");
const skillRootArg = args.find((arg) => !arg.startsWith("--"));
const skillRoot = path.resolve(skillRootArg ?? "skills/show-skills");
const repoRoot = path.resolve(skillRoot, "../..");
const skillsRoot = path.join(repoRoot, "skills");
const htmlPath = path.join(skillRoot, "skill.html");
const pluginBundledSkillPaths = [
  "plugins/project-workflow/skills/project-workflow",
  "plugins/ai-video-workflow/skills/ai-video-workflow",
];

const summaryBySkill: Record<string, string> = {
  "show-skills": "현재 스킬 목록을 카테고리별로 보여주고 조합을 추천",
  "web-research": "최신 정보, 출처 검증, 추천, 기술 문서 조사",
  "markdown-to-html": "Markdown 의미를 안전한 한국어 우선 HTML guide로 변환",
  "markdown-to-comic": "Markdown을 imagegen 4컷/6컷 comic으로 변환",
  "skill-update": "기존 스킬과 외부 dependency sweep을 references, validator, docs까지 함께 유지보수",
  "sync-docs": "README, AGENTS, docs, snippets, history 충돌과 stale 설명 정리",
  "transcript-polisher": "전사본과 강의 대본을 직접 읽고 Claude goal 루프로 다듬기",
  "agent-improvement-loop": "스킬 호출성, 검증, 문서 정합성, repo 품질 개선 루프",
  "agent-eval-harness": "routing, portability, safety, artifact hygiene를 검증하는 eval harness",
  "skill-plugin-test-loop": "새 복제본 반복과 리서치 기반 개선으로 스킬과 플러그인의 실제 호출을 검증",
  "karpathy-thinkings": "추측, 과설계, 주변 리팩터링을 줄이는 구현 discipline",
  "project-structure": "frontend, backend, monorepo, desktop app, ESM TypeScript 구조 결정",
  "project-workflow": "plugin-bundled 초기 설정: 도메인, PRD, ESM TypeScript 정책, workflow-state cache",
  "ai-video-workflow": "동의된 Voicebox 목소리 profile과 HyperFrames 영상 제작 workflow",
  "feature-workflow": "워크플로우 묶음 반복 구현: feature/issue/bug를 ESM TypeScript, TDD, QA로 구현",
  "atomic-committer": "secret guard 후 atomic commit 단위로 나누고 기본 push",
  "browser-qa": "브라우저 렌더링, console, network, viewport, accessibility 검증",
  "code-review": "findings-first 코드 리뷰와 회귀/테스트/보안 위험 점검",
  "design-review": "제품 도메인과 디자인 시스템 우선 UI 리뷰",
};

function read(filePath: string): string {
  return readFileSync(filePath, "utf8");
}

function parseFrontmatter(text: string): Record<string, string> {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fields: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) continue;
    fields[field[1]] = stripQuotes(field[2].trim());
  }
  return fields;
}

function stripQuotes(value: string): string {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function summarize(description: string): string {
  const firstSentence = description
    .replace(/\s+/g, " ")
    .replace(/^Use when the user asks to\s+/i, "")
    .replace(/^Use when\s+/i, "")
    .trim()
    .split(/[.!?]\s/)[0];
  if (firstSentence.length <= 86) return firstSentence;
  return `${firstSentence.slice(0, 83).trim()}...`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function displayName(skill: SkillTile): string {
  if (skill.name === "project-workflow") return "project-workflow plugin skill";
  if (skill.name === "ai-video-workflow") return "ai-video-workflow plugin skill";
  if (skill.name === "feature-workflow") return "feature-workflow 스킬";
  return skill.name;
}

function relativeHref(folder: string, file: "SKILL.md" | "skill.html"): string {
  if (folder === "show-skills") return file;
  return `../${folder}/${file}`;
}

function discoverSkills(): SkillTile[] {
  if (!existsSync(skillsRoot)) {
    throw new Error(`Missing skills root: ${path.relative(repoRoot, skillsRoot)}`);
  }

  const topLevelSkills = readdirSync(skillsRoot)
    .filter((folder) => {
      const fullPath = path.join(skillsRoot, folder);
      return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, "SKILL.md"));
    })
    .sort()
    .map((folder) => {
      const skillPath = path.join(skillsRoot, folder, "SKILL.md");
      const guidePath = path.join(skillsRoot, folder, "skill.html");
      if (!existsSync(guidePath)) {
        throw new Error(`Missing skill.html for ${folder}`);
      }

      const frontmatter = parseFrontmatter(read(skillPath));
      const name = frontmatter.name || folder;
      return {
        folder,
        name,
        description: summaryBySkill[name] || summarize(frontmatter.description || `${name} skill guide`),
        skillHref: relativeHref(folder, "SKILL.md"),
        htmlHref: relativeHref(folder, "skill.html"),
      };
    });

  const discoveredNames = new Set(topLevelSkills.map((skill) => skill.name));
  const pluginBundledSkills = pluginBundledSkillPaths
    .filter((folder) => existsSync(path.join(repoRoot, folder, "SKILL.md")))
    .map((folder) => {
      const skillPath = path.join(repoRoot, folder, "SKILL.md");
      const frontmatter = parseFrontmatter(read(skillPath));
      const name = frontmatter.name || path.basename(folder);
      return {
        folder,
        name,
        description: summaryBySkill[name] || summarize(frontmatter.description || `${name} skill guide`),
        skillHref: `../../${folder}/SKILL.md`,
        htmlHref: `../../${folder}/skill.html`,
      };
    })
    .filter((skill) => !discoveredNames.has(skill.name));

  return [...topLevelSkills, ...pluginBundledSkills].sort((a, b) => a.name.localeCompare(b.name));
}

function renderCatalog(skills: SkillTile[]): string {
  const lines = [startMarker];

  for (const skill of skills) {
    lines.push(`          <div class="skill-tile" data-skill="${escapeHtml(skill.folder)}">`);
    lines.push(`            <strong>${escapeHtml(displayName(skill))}</strong>`);
    lines.push(`            <em>${escapeHtml(skill.description)}</em>`);
    lines.push(
      `            <span class="skill-links"><a href="${escapeHtml(skill.htmlHref)}">skill.html</a><a href="${escapeHtml(skill.skillHref)}">SKILL.md</a></span>`,
    );
    lines.push("          </div>");
  }

  lines.push(endMarker);
  return lines.join("\n");
}

function replaceCatalog(html: string, catalog: string): string {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("skill.html must contain skill-catalog start/end markers");
  }
  return `${html.slice(0, start)}${catalog}${html.slice(end + endMarker.length)}`;
}

const catalog = renderCatalog(discoverSkills());
const currentHtml = read(htmlPath);
const nextHtml = replaceCatalog(currentHtml, catalog);

if (check) {
  if (nextHtml !== currentHtml) {
    console.error("show-skills skill.html catalog is stale");
    console.error("Run: node skills/show-skills/scripts/update-html-catalog.ts skills/show-skills");
    process.exit(1);
  }
  console.log("show-skills HTML catalog is current");
} else {
  writeFileSync(htmlPath, nextHtml);
  console.log(`Updated ${path.relative(repoRoot, htmlPath)}`);
}
