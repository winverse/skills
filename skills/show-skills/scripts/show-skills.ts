#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

type SkillInfo = {
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  state: string;
  risk: string;
  reviewed: string;
  skillPath: string;
  htmlPath: string;
  snippetPath: string;
};

const args = process.argv.slice(2);
const explicitRoot = valueFor("--root") ?? process.env.SKILLS_ROOT;
const catalog = findCatalogRoot(explicitRoot ? path.resolve(explicitRoot) : process.cwd());
const repoRoot = catalog.root;
const skillsRoot = catalog.skillsRoot;
const skillPathPrefix = catalog.pathPrefix;
const compact = args.includes("--compact");
const formatArg = valueFor("--format") ?? "markdown";
const categoryFilter = valueFor("--category");
const pluginBundledSkillPaths = [
  "plugins/project-workflow/skills/project-workflow",
  "plugins/ai-video-workflow/skills/ai-video-workflow",
];

const categoryOrder = [
  "탐색",
  "스킬 운영",
  "구현과 구조",
  "리뷰와 QA",
  "문서와 커밋",
  "기타",
];

const categoryBySkill: Record<string, string> = {
  "show-skills": "탐색",
  "web-research": "탐색",
  "markdown-to-html": "스킬 운영",
  "markdown-to-comic": "스킬 운영",
  "skill-update": "스킬 운영",
  "sync-docs": "스킬 운영",
  "agent-improvement-loop": "스킬 운영",
  "agent-eval-harness": "스킬 운영",
  "skill-plugin-test-loop": "스킬 운영",
  "karpathy-thinkings": "구현과 구조",
  "project-structure": "구현과 구조",
  "project-workflow": "구현과 구조",
  "ai-video-workflow": "구현과 구조",
  "feature-workflow": "구현과 구조",
  "transcript-polisher": "문서와 커밋",
  "atomic-committer": "문서와 커밋",
  "pull-request": "문서와 커밋",
  "browser-qa": "리뷰와 QA",
  "code-review": "리뷰와 QA",
  "design-review": "리뷰와 QA",
};

const summaryBySkill: Record<string, string> = {
  "show-skills": "현재 스킬 목록을 카테고리별로 보여주고 조합을 추천",
  "web-research": "최신 정보, 출처 검증, 추천, 기술 문서 조사",
  "markdown-to-html": "Markdown 의미를 안전한 한국어 우선 HTML guide로 변환",
  "markdown-to-comic": "Markdown을 imagegen 4컷/6컷 comic으로 변환",
  "skill-update": "기존 스킬과 외부 dependency sweep을 references, validator, docs까지 함께 유지보수",
  "sync-docs": "README, AGENTS, docs, snippets, history 충돌과 stale 설명 정리",
  "agent-improvement-loop": "스킬 호출성, 검증, 문서 정합성, repo 품질 개선 루프",
  "agent-eval-harness": "routing, cross-agent portability, safety, artifact hygiene를 검증하는 초기 eval harness",
  "skill-plugin-test-loop": "새 복제본 반복과 리서치 기반 개선으로 스킬과 플러그인의 실제 호출을 검증",
  "karpathy-thinkings": "추측, 과설계, 주변 리팩터링을 줄이는 구현 discipline",
  "project-structure": "frontend, backend, monorepo, desktop app, infra-aware 구조와 기본 stack 결정",
  "project-workflow": "plugin-bundled 초기 설정: domain, PRD, issue backlog, workflow-state cache",
  "ai-video-workflow": "동의된 Voicebox 목소리 profile과 HyperFrames 영상 제작 workflow",
  "feature-workflow": "Workflow suite loop: feature/issue/bug를 TDD, QA, docs sync로 구현",
  "transcript-polisher": "전사본과 강의 대본을 직접 읽고 Claude goal 루프로 다듬기",
  "atomic-committer": "secret guard 후 atomic commit 단위로 나누고 기본 push",
  "browser-qa": "브라우저 렌더링, console, network, viewport, accessibility 검증",
  "code-review": "findings-first 코드 리뷰와 회귀/테스트/보안 위험 점검",
  "design-review": "제품 도메인과 디자인 시스템 우선 UI 리뷰",
};

function valueFor(flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function hasSkillDirs(dir: string): boolean {
  try {
    return readdirSync(dir).some((name) => {
      const fullPath = path.join(dir, name);
      return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, "SKILL.md"));
    });
  } catch {
    return false;
  }
}

function findCatalogRoot(start: string): { root: string; skillsRoot: string; pathPrefix: string } {
  let current = path.resolve(start);
  while (true) {
    const nestedSkills = path.join(current, "skills");
    if (existsSync(nestedSkills) && hasSkillDirs(nestedSkills)) {
      return { root: current, skillsRoot: nestedSkills, pathPrefix: "skills/" };
    }

    if (hasSkillDirs(current)) {
      const parent = path.dirname(current);
      if (
        path.basename(current) === "skills" &&
        (existsSync(path.join(parent, "history/skills.md")) || existsSync(path.join(parent, "README.md")))
      ) {
        return { root: parent, skillsRoot: current, pathPrefix: "skills/" };
      }
      return { root: current, skillsRoot: current, pathPrefix: "" };
    }

    const parent = path.dirname(current);
    if (existsSync(path.join(current, "SKILL.md")) && hasSkillDirs(parent)) {
      return { root: parent, skillsRoot: parent, pathPrefix: "" };
    }

    if (parent === current) {
      return { root: path.resolve(start), skillsRoot: path.join(path.resolve(start), "skills"), pathPrefix: "skills/" };
    }
    current = parent;
  }
}

function read(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function stripMatchingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function stripIndent(line: string): string {
  return line.replace(/^\s{2}/, "");
}

function parseFrontmatter(text: string): Record<string, string> {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fields: Record<string, string> = {};
  const lines = match[1].split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (/^\s/.test(line)) continue;

    const field = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!field) continue;

    const key = field[1];
    const rawValue = field[2] ?? "";

    if (rawValue === "|" || rawValue === ">") {
      const blockLines: string[] = [];
      let cursor = index + 1;
      while (cursor < lines.length && (/^\s/.test(lines[cursor]) || !lines[cursor].trim())) {
        blockLines.push(stripIndent(lines[cursor]));
        cursor += 1;
      }
      fields[key] = rawValue === ">" ? blockLines.join(" ").trim() : blockLines.join("\n").trim();
      index = cursor - 1;
      continue;
    }

    fields[key] = stripMatchingQuotes(rawValue.trim());
  }
  return fields;
}

function parseShortDescription(yamlPath: string): string {
  if (!existsSync(path.join(repoRoot, yamlPath))) return "";
  const text = read(yamlPath);
  return text.match(/short_description:\s*["']?([^"'\n]+)["']?/)?.[1]?.trim() ?? "";
}

function parseHistory(): Map<string, { state: string; risk: string; reviewed: string }> {
  const output = new Map<string, { state: string; risk: string; reviewed: string }>();
  const historyPath = "history/skills.md";
  if (!existsSync(path.join(repoRoot, historyPath))) return output;
  for (const line of read(historyPath).split(/\r?\n/)) {
    const match = line.match(/^\| `([^`]+)` \| `([^`]+)` \| ([^|]+) \| ([^|]+) \|/);
    if (!match) continue;
    output.set(match[1], {
      state: match[2].trim(),
      risk: match[3].trim(),
      reviewed: match[4].trim(),
    });
  }
  return output;
}

function discoverSkills(): SkillInfo[] {
  const history = parseHistory();
  if (!existsSync(skillsRoot)) return [];

  const topLevelSkills = readdirSync(skillsRoot)
    .filter((name) => {
      const fullPath = path.join(skillsRoot, name);
      return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, "SKILL.md"));
    })
    .map((folder) => {
      const skillPath = `${skillPathPrefix}${folder}/SKILL.md`;
      const htmlPath = `${skillPathPrefix}${folder}/skill.html`;
      const snippetPath = `project-snippets/${folder}.md`;
      const frontmatter = parseFrontmatter(read(skillPath));
      const name = frontmatter.name ?? folder;
      const registry = history.get(name);
      return {
        name,
        category: categoryBySkill[name] ?? "기타",
        description: frontmatter.description ?? "",
        shortDescription:
          summaryBySkill[name] ||
          parseShortDescription(`${skillPathPrefix}${folder}/agents/openai.yaml`) ||
          summarize(frontmatter.description ?? ""),
        state: registry?.state ?? "unknown",
        risk: registry?.risk ?? "unknown",
        reviewed: registry?.reviewed ?? "unknown",
        skillPath,
        htmlPath,
        snippetPath,
      };
    });

  const discoveredNames = new Set(topLevelSkills.map((skill) => skill.name));
  const pluginBundledSkills = pluginBundledSkillPaths
    .filter((skill) => existsSync(path.join(repoRoot, skill, "SKILL.md")))
    .map((skill) => {
      const folder = path.basename(skill);
      const skillPath = `${skill}/SKILL.md`;
      const htmlPath = `${skill}/skill.html`;
      const snippetPath = `project-snippets/${folder}.md`;
      const frontmatter = parseFrontmatter(read(skillPath));
      const name = frontmatter.name ?? folder;
      const registry = history.get(name);
      return {
        name,
        category: categoryBySkill[name] ?? "기타",
        description: frontmatter.description ?? "",
        shortDescription:
          summaryBySkill[name] ||
          parseShortDescription(`${skill}/agents/openai.yaml`) ||
          summarize(frontmatter.description ?? ""),
        state: registry?.state ?? "unknown",
        risk: registry?.risk ?? "unknown",
        reviewed: registry?.reviewed ?? "unknown",
        skillPath,
        htmlPath,
        snippetPath,
      };
    })
    .filter((skill) => !discoveredNames.has(skill.name));

  return [...topLevelSkills, ...pluginBundledSkills]
    .filter((skill) => !categoryFilter || skill.category === categoryFilter || skill.name === categoryFilter)
    .sort((a, b) => {
      const categoryDelta = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
      if (categoryDelta !== 0) return categoryDelta;
      return a.name.localeCompare(b.name);
    });
}

function summarize(description: string): string {
  return description.split(/[.!?]\s/)[0]?.slice(0, 120) ?? "";
}

function markdown(skills: SkillInfo[]): string {
  const lines: string[] = [];
  lines.push("# 현재 스킬 목록");
  lines.push("");
  lines.push(`총 ${skills.length}개 스킬. Source: \`${skillPathPrefix || "./"}*/SKILL.md\`, plugin-bundled \`plugins/*/skills/*/SKILL.md\`${existsSync(path.join(repoRoot, "history/skills.md")) ? ", `history/skills.md`" : ""}.`);
  lines.push("");

  for (const category of categoryOrder) {
    const group = skills.filter((skill) => skill.category === category);
    if (!group.length) continue;
    lines.push(`## ${category}`);
    lines.push("");
    lines.push("| Skill | State | When to use | Paths |");
    lines.push("| --- | --- | --- | --- |");
    for (const skill of group) {
      const label = compact ? skill.shortDescription : skill.description;
      lines.push(
        `| \`${skill.name}\` | \`${skill.state}\` / ${skill.risk} | ${escapePipes(label)} | [SKILL.md](${skill.skillPath}) · [skill.html](${skill.htmlPath}) |`,
      );
    }
    lines.push("");
  }

  if (existsSync(path.join(repoRoot, "docs/skill-catalog.md"))) {
    lines.push("자세한 정적 카탈로그: `docs/skill-catalog.md`");
  } else {
    lines.push("정적 카탈로그가 없으면 이 live listing을 source of truth로 사용한다.");
  }
  return lines.join("\n");
}

function escapePipes(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

const skills = discoverSkills();

if (explicitRoot && skills.length === 0) {
  console.error(`No skills found under explicit root: ${path.resolve(explicitRoot)}`);
  process.exit(1);
}

if (formatArg === "json") {
  process.stdout.write(`${JSON.stringify(skills, null, 2)}\n`);
} else {
  process.stdout.write(`${markdown(skills)}\n`);
}
