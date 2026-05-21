#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.argv[2] ?? process.cwd());
const errors: string[] = [];

const ignoredDirs = new Set<string>([
  ".git",
  ".githooks",
  ".artifacts",
  ".playwright-mcp",
  "archive",
  "hook-test-skill",
  "images",
  "inspector",
  "node_modules",
  "plugins",
  "test-results",
]);
const sourceExtensions = new Set<string>([
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".py",
  ".toml",
  ".ts",
  ".yaml",
  ".yml",
]);

const nodeMajor = Number(process.versions.node.split(".")[0] ?? "0");

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const privatePathPatterns = [
  process.env.HOME ? new RegExp(escapeRegExp(process.env.HOME)) : null,
  /\/private\/tmp\/codex-/,
].filter((pattern): pattern is RegExp => pattern !== null);

function rel(filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function readText(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function requireFile(relativePath: string): void {
  if (!existsSync(path.join(root, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

function requireText(relativePath: string, needle: string, label: string): void {
  if (!existsSync(path.join(root, relativePath))) return;
  const text = readText(relativePath);
  if (!text.includes(needle)) {
    errors.push(`${relativePath} is missing ${label}: ${needle}`);
  }
}

function requirePattern(relativePath: string, pattern: RegExp, label: string): void {
  if (!existsSync(path.join(root, relativePath))) return;
  const text = readText(relativePath);
  if (!pattern.test(text)) {
    errors.push(`${relativePath} is missing ${label}`);
  }
}

function requireDefaultPromptMention(relativePath: string, skillName: string): void {
  if (!existsSync(path.join(root, relativePath))) return;
  const text = readText(relativePath);
  const match = /^\s*default_prompt:\s*(.*)$/m.exec(text);
  if (!match) {
    errors.push(`${relativePath} is missing default_prompt for ${skillName}`);
    return;
  }

  const promptStart = match.index;
  const nextTopLevel = text.slice(promptStart + match[0].length).search(/^\S/m);
  const promptBlock = nextTopLevel === -1
    ? text.slice(promptStart)
    : text.slice(promptStart, promptStart + match[0].length + nextTopLevel);
  if (!promptBlock.includes(`$${skillName}`)) {
    errors.push(`${relativePath} is missing default_prompt mentioning $${skillName}`);
  }
}

function skillDirs(): string[] {
  const skillsRoot = path.join(root, "skills");
  if (!existsSync(skillsRoot)) return [];

  return readdirSync(skillsRoot)
    .filter((name) => {
      const fullPath = path.join(skillsRoot, name);
      return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, "SKILL.md"));
    })
    .map((name) => `skills/${name}`)
    .sort();
}

function walkSourceFiles(dir: string = root, output: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = rel(fullPath);
    const top = relativePath.split("/")[0];

    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name) && !ignoredDirs.has(top)) {
        walkSourceFiles(fullPath, output);
      }
      continue;
    }

    if (sourceExtensions.has(path.extname(entry.name))) {
      output.push(fullPath);
    }
  }
  return output;
}

requireFile("README.md");
requireFile("AGENTS.md");
requireFile(".node-version");
requireFile("skills");
requireFile("scripts/validate-skill.ts");
requireFile("docs/skill-lifecycle.md");
requireFile("docs/skill-inspector.md");
requireFile("docs/update-source-registry.md");
requireFile("history/skills.md");
requireFile("project-snippets/base.md");
requireFile("project-snippets/claude-base.md");
requireFile("scripts/validate-skill-html.ts");
requireFile("scripts/validate-korean-markdown.ts");
requireFile("scripts/validate-plugins.ts");
requireFile("scripts/validate-source-registry.ts");
requireFile("plugins/project-workflow/scripts/validate-project-workflow.ts");
requireFile("scripts/run-agent-evals.ts");
requireFile("evals/agent/README.md");
requireFile("evals/agent/cases/skill-routing.json");
requireFile("evals/agent/cases/safety-boundaries.json");
requireFile("evals/agent/cases/output-shape.json");
requireText("README.md", "node scripts/validate-skill-html.ts .", "common skill HTML validator command");
requireText("README.md", "node scripts/validate-korean-markdown.ts .", "Korean Markdown validator command");
requireText("README.md", "node scripts/validate-plugins.ts .", "plugin validator command");
requireText("README.md", "node scripts/validate-source-registry.ts .", "source registry validator command");
requireText("README.md", "node plugins/project-workflow/scripts/validate-project-workflow.ts plugins/project-workflow/skills/project-workflow", "project-workflow plugin validator command");
requireText("README.md", "node scripts/run-agent-evals.ts", "agent eval harness command");
requireText("README.md", "docs/update-source-registry.md", "update source registry document");
requireText("AGENTS.md", "skills/**/*.md", "Korean Markdown rule for skill docs");
requireText("AGENTS.md", "node scripts/validate-korean-markdown.ts .", "Korean Markdown validator command");
requireText("AGENTS.md", "node scripts/run-agent-evals.ts", "agent eval harness command");
requireText("AGENTS.md", "node scripts/validate-source-registry.ts .", "source registry validator command");
requireText("AGENTS.md", "node plugins/project-workflow/scripts/validate-project-workflow.ts plugins/project-workflow/skills/project-workflow", "project-workflow plugin validator command");
requireText("AGENTS.md", "docs/update-source-registry.md", "update source registry instruction");
requireText("docs/update-source-registry.md", ".gitmodules", "canonical submodule source");
requireText("docs/update-source-registry.md", "workflow provenance-only primitive", "workflow primitive boundary");
requireText("docs/update-source-registry.md", "scripts/validate-source-registry.ts", "source registry validator");

if (nodeMajor < 22) {
  errors.push(`Node 22+ is required for direct .ts validator execution; current Node is ${process.versions.node}`);
}

const lifecycle = existsSync(path.join(root, "docs/skill-lifecycle.md"))
  ? readText("docs/skill-lifecycle.md")
  : "";
for (const state of ["draft", "active", "critical", "deprecated", "archived"]) {
  if (!lifecycle.includes(`\`${state}\``)) {
    errors.push(`docs/skill-lifecycle.md does not define ${state}`);
  }
}

const history = existsSync(path.join(root, "history/skills.md"))
  ? readText("history/skills.md")
  : "";
const skills = skillDirs();
const pluginBundledSkills = [
  {
    name: "project-workflow",
    path: "plugins/project-workflow/skills/project-workflow",
    validatorCommand: "node plugins/project-workflow/scripts/validate-project-workflow.ts plugins/project-workflow/skills/project-workflow",
  },
  {
    name: "ai-video-workflow",
    path: "plugins/ai-video-workflow/skills/ai-video-workflow",
    validatorCommand: "node plugins/ai-video-workflow/scripts/validate-ai-video-workflow.ts plugins/ai-video-workflow",
  },
] as const;
const skillNames = new Set([
  ...skills.map((skill) => path.basename(skill)),
  ...pluginBundledSkills.map((skill) => skill.name),
]);

for (const skill of skills) {
  const skillName = path.basename(skill);
  requireFile(`${skill}/SKILL.md`);
  requireFile(`${skill}/skill.html`);
  requireFile(`${skill}/agents/openai.yaml`);
  requireFile(`project-snippets/${skillName}.md`);

  requirePattern(
    "history/skills.md",
    new RegExp("^\\| `" + escapeRegExp(skillName) + "` \\|", "m"),
    `current registry row for ${skillName}`,
  );
  requireText("README.md", `- \`${skillName}\`:`, `current skill entry for ${skillName}`);
  requireText("README.md", `${skill}/SKILL.md`, `source path for ${skillName}`);
  requireText("README.md", `${skill}/skill.html`, `HTML guide path for ${skillName}`);
  requireText(
    "AGENTS.md",
    `${skill}/SKILL.md`,
    `repo-local project skill link for ${skillName}`,
  );
  requireText(
    "project-snippets/base.md",
    `<skills-root>/${skill}/SKILL.md`,
    `base snippet link for ${skillName}`,
  );
  requireText(
    "project-snippets/claude-base.md",
    `<skills-root>/${skill}/SKILL.md`,
    `Claude base snippet link for ${skillName}`,
  );
  requireText(
    `project-snippets/${skillName}.md`,
    `<skills-root>/${skill}/SKILL.md`,
    `skill snippet link for ${skillName}`,
  );
  requireText(
    "docs/project-skill-setup.md",
    `project-snippets/${skillName}.md`,
    `project setup snippet source for ${skillName}`,
  );

  const validatorPath = `${skill}/scripts/validate-${skillName}.ts`;
  if (existsSync(path.join(root, validatorPath))) {
    requireText("README.md", `node ${validatorPath} ${skill}`, `validator command for ${skillName}`);
  }

  const agentMetadataPath = `${skill}/agents/openai.yaml`;
  if (existsSync(path.join(root, agentMetadataPath))) {
    requireText(agentMetadataPath, "interface:", `OpenAI metadata interface for ${skillName}`);
    requirePattern(
      agentMetadataPath,
      /^\s*display_name:\s*["'][^"']+["']\s*$/m,
      `non-empty display_name for ${skillName}`,
    );
    requirePattern(
      agentMetadataPath,
      /^\s*short_description:\s*["'][^"']+["']\s*$/m,
      `non-empty short_description for ${skillName}`,
    );
    requireDefaultPromptMention(agentMetadataPath, skillName);
  }
}

for (const { name: skillName, path: skill, validatorCommand } of pluginBundledSkills) {
  requireFile(`${skill}/SKILL.md`);
  requireFile(`${skill}/skill.html`);
  requireFile(`${skill}/agents/openai.yaml`);
  requireFile(`project-snippets/${skillName}.md`);

  requirePattern(
    "history/skills.md",
    new RegExp("^\\| `" + escapeRegExp(skillName) + "` \\|", "m"),
    `current registry row for ${skillName}`,
  );
  requireText("README.md", `- \`${skillName}\`:`, `current skill entry for ${skillName}`);
  requireText("README.md", `${skill}/SKILL.md`, `source path for ${skillName}`);
  requireText("README.md", `${skill}/skill.html`, `HTML guide path for ${skillName}`);
  requireText("AGENTS.md", `${skill}/SKILL.md`, `repo-local project skill link for ${skillName}`);
  requireText(
    "project-snippets/base.md",
    `<skills-root>/${skill}/SKILL.md`,
    `base snippet link for ${skillName}`,
  );
  requireText(
    "project-snippets/claude-base.md",
    `<skills-root>/${skill}/SKILL.md`,
    `Claude base snippet link for ${skillName}`,
  );
  requireText(
    `project-snippets/${skillName}.md`,
    `<skills-root>/${skill}/SKILL.md`,
    `skill snippet link for ${skillName}`,
  );
  requireText(
    "docs/project-skill-setup.md",
    `project-snippets/${skillName}.md`,
    `project setup snippet source for ${skillName}`,
  );
  requireText("README.md", validatorCommand, `validator command for ${skillName}`);

  const agentMetadataPath = `${skill}/agents/openai.yaml`;
  requireText(agentMetadataPath, "interface:", `OpenAI metadata interface for ${skillName}`);
  requirePattern(
    agentMetadataPath,
    /^\s*display_name:\s*["'][^"']+["']\s*$/m,
    `non-empty display_name for ${skillName}`,
  );
  requirePattern(
    agentMetadataPath,
    /^\s*short_description:\s*["'][^"']+["']\s*$/m,
    `non-empty short_description for ${skillName}`,
  );
  requireDefaultPromptMention(agentMetadataPath, skillName);
}

for (const filePath of walkSourceFiles()) {
  const relativePath = rel(filePath);
  const text = readFileSync(filePath, "utf8");
  if (/(^|\/)scripts\/validate-[^/]+\.py$/.test(relativePath)) {
    errors.push(`Repo-owned validator must be TypeScript, not Python: ${relativePath}`);
  }
  if (privatePathPatterns.some((pattern) => pattern.test(text))) {
    errors.push(`Non-portable local path found in ${relativePath}`);
  }

  const skillPathPattern = /skills\/([a-z0-9-]+)\/(?:SKILL\.md|skill\.html|scripts\/validate-[a-z0-9-]+\.ts)/g;
  for (const match of text.matchAll(skillPathPattern)) {
    const precedingPath = text.slice(Math.max(0, match.index - 96), match.index);
    if (/plugins\/[a-z0-9-]+\/(?:[^"'`\s)]*\/)?$/.test(precedingPath)) {
      continue;
    }
    const referencedSkill = match[1];
    if (!skillNames.has(referencedSkill)) {
      errors.push(
        `${relativePath} references missing current skill path: ${match[0]}`,
      );
    }
  }
}

if (errors.length) {
  console.error("skill repo validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("skill repo validation passed");
