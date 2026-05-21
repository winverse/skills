#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const targetArg = args.find((arg) => !arg.startsWith("--"));

if (!targetArg) {
  console.error("Usage: node plugins/ai-video-workflow/scripts/validate-video-project.ts <target-dir> [--expect-audio path] [--expect-video path] [--expect-html path]");
  process.exit(1);
}

const targetRoot = path.resolve(targetArg);
const errors: string[] = [];
const warnings: string[] = [];

function valueFor(flag: string): string | undefined {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
}

function requirePath(relativePath: string): void {
  if (!existsSync(path.join(targetRoot, relativePath))) {
    errors.push(`Missing ${relativePath}`);
  }
}

for (const file of [
  "README.md",
  ".gitignore",
  "brief/narration.md",
  "brief/voicebox-request.json",
  "brief/hyperframes-brief.md",
  "assets/audio",
  "assets/private/voice-samples",
  "outputs",
]) {
  requirePath(file);
}

if (existsSync(path.join(targetRoot, ".gitignore"))) {
  const gitignore = readFileSync(path.join(targetRoot, ".gitignore"), "utf8");
  if (!gitignore.includes("assets/private/")) {
    errors.push(".gitignore must ignore assets/private/");
  }
  if (!gitignore.includes("outputs/")) {
    warnings.push(".gitignore should usually ignore outputs/ unless rendered media is intentionally versioned.");
  }
}

const expected = [
  ["audio", valueFor("--expect-audio")],
  ["video", valueFor("--expect-video")],
  ["html", valueFor("--expect-html")],
] as const;

for (const [kind, relativePath] of expected) {
  if (!relativePath) continue;
  if (!existsSync(path.resolve(targetRoot, relativePath))) {
    errors.push(`Expected ${kind} output is missing: ${relativePath}`);
  }
}

if (warnings.length) {
  console.log("ai-video-workflow validation warnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error("ai-video-workflow project validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("ai-video-workflow project validation passed");

