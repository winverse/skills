#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const pluginRoot = path.resolve(process.argv[2] ?? "plugins/ai-video-workflow");
const repoRoot = path.resolve(pluginRoot, "../..");
const errors: string[] = [];

function rel(filePath: string): string {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function requireFile(relativePath: string): void {
  const fullPath = path.join(pluginRoot, relativePath);
  if (!existsSync(fullPath)) {
    errors.push(`Missing ${rel(fullPath)}`);
  }
}

function requireText(relativePath: string, text: string): void {
  const fullPath = path.join(pluginRoot, relativePath);
  if (!existsSync(fullPath)) return;
  const content = readFileSync(fullPath, "utf8");
  if (!content.includes(text)) {
    errors.push(`${rel(fullPath)} must include ${text}`);
  }
}

function requireRepoText(relativePath: string, text: string): void {
  const fullPath = path.join(repoRoot, relativePath);
  if (!existsSync(fullPath)) return;
  const content = readFileSync(fullPath, "utf8");
  if (!content.includes(text)) {
    errors.push(`${relativePath} must include ${text}`);
  }
}

for (const file of [
  ".codex-plugin/plugin.json",
  "README.md",
  "skills/ai-video-workflow/SKILL.md",
  "skills/ai-video-workflow/skill.html",
  "skills/ai-video-workflow/agents/openai.yaml",
  "skills/ai-video-workflow/references/source-ledger.md",
  "scripts/doctor.ts",
  "scripts/scaffold-video-project.ts",
  "scripts/validate-video-project.ts",
]) {
  requireFile(file);
}

requireText(".codex-plugin/plugin.json", "\"name\": \"ai-video-workflow\"");
requireText(".codex-plugin/plugin.json", "\"skills\": \"./skills/\"");
requireText("README.md", "Voicebox MCP");
requireText("README.md", "샘플 파일 자체는 민감한 biometric artifact");
requireText("skills/ai-video-workflow/SKILL.md", "동의 없는 목소리 복제 금지");
requireText("skills/ai-video-workflow/SKILL.md", "Agent Tool And Security Risk Gate");
requireText("skills/ai-video-workflow/SKILL.md", "assets/private/voice-samples/");
requireText("skills/ai-video-workflow/skill.html", "동의 없는 목소리 복제 금지");
requireText("skills/ai-video-workflow/references/source-ledger.md", "http://127.0.0.1:17493/mcp");
requireText("scripts/doctor.ts", "--require-voicebox");
requireText("scripts/scaffold-video-project.ts", "assets/private/voice-samples");
requireText("scripts/validate-video-project.ts", "--expect-video");

requireRepoText("docs/plugin-catalog.md", "`ai-video-workflow`");
requireRepoText("docs/update-source-registry.md", "repo-plugin.ai-video-workflow");
requireRepoText("README.md", "plugins/ai-video-workflow/skills/ai-video-workflow/SKILL.md");
requireRepoText("AGENTS.md", "plugins/ai-video-workflow/skills/ai-video-workflow/SKILL.md");
requireRepoText("project-snippets/base.md", "<skills-root>/plugins/ai-video-workflow/skills/ai-video-workflow/SKILL.md");
requireRepoText("project-snippets/claude-base.md", "<skills-root>/plugins/ai-video-workflow/skills/ai-video-workflow/SKILL.md");
requireRepoText("project-snippets/ai-video-workflow.md", "<skills-root>/plugins/ai-video-workflow/skills/ai-video-workflow/SKILL.md");
requireRepoText("history/skills.md", "`ai-video-workflow`");

if (errors.length) {
  console.error("ai-video-workflow validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("ai-video-workflow validation passed");
