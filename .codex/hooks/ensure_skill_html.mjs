#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const args = new Set(process.argv.slice(2));
const autoRun = args.has("--auto");
const dryRun = args.has("--dry-run");
const recursionGuard = process.env.SKILL_HTML_HOOK_ACTIVE === "1";
const noWrite = process.env.SKILL_HTML_HOOK_NO_WRITE === "1";
const localRepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

function git(args, cwd) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
}

function gitRoot(cwd) {
  try {
    return git(["rev-parse", "--show-toplevel"], cwd).trim();
  } catch {
    return path.resolve(cwd);
  }
}

function isLocalRepoRoot(root) {
  return path.resolve(root) === localRepoRoot;
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function parseGitStatus(root) {
  const status = git(["status", "--porcelain", "--untracked-files=all"], root);
  const entries = [];

  for (const line of status.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const code = line.slice(0, 2);
    let filePath = line.slice(3);
    if (filePath.includes(" -> ")) {
      filePath = filePath.split(" -> ").at(-1);
    }
    entries.push({ code, filePath });
  }

  return entries;
}

function skillDirFromPath(filePath) {
  const posix = toPosix(filePath);
  const parts = posix.split("/");
  if (parts.length === 3 && parts[0] === "skills" && parts[2] === "SKILL.md") {
    return `skills/${parts[1]}`;
  }
  return null;
}

function skillDirFromChangedPath(filePath) {
  const posix = toPosix(filePath);
  const parts = posix.split("/");
  if (parts.length >= 2 && parts[0] === "skills" && parts[1]) {
    return `skills/${parts[1]}`;
  }
  return null;
}

function collectDirtySkillDirs(entries) {
  const dirs = new Set();
  for (const entry of entries) {
    const dir = skillDirFromPath(entry.filePath);
    if (dir) dirs.add(dir);
  }
  return dirs;
}

function collectChangedSkillDirs(entries) {
  const dirs = new Set();
  for (const entry of entries) {
    const dir = skillDirFromChangedPath(entry.filePath);
    if (dir) dirs.add(dir);
  }
  return dirs;
}

function isValidationRelevantPath(filePath) {
  const posix = toPosix(filePath);
  return (
    posix.startsWith("skills/") ||
    posix.startsWith("project-snippets/") ||
    posix.startsWith("scripts/") ||
    posix.startsWith("docs/") ||
    posix.startsWith(".codex/") ||
    posix === "README.md" ||
    posix === "AGENTS.md" ||
    posix === ".node-version" ||
    posix === "history/skills.md"
  );
}

function hasValidationRelevantChanges(entries) {
  return entries.some((entry) => isValidationRelevantPath(entry.filePath));
}

function htmlPathForSkillDir(skillDir) {
  return skillDir === "." ? "skill.html" : `${skillDir}/skill.html`;
}

function hasDirtyPath(entries, targetPath) {
  return entries.some((entry) => entry.filePath === targetPath);
}

function additionalContext(eventName, context) {
  process.stdout.write(
    `${JSON.stringify({
      hookSpecificOutput: {
        hookEventName: eventName,
        additionalContext: context,
      },
    })}\n`,
  );
}

function truncate(text, maxLength = 3000) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, 1200)}\n...\n${text.slice(-1200)}`;
}

function commandLine(command, args) {
  return [command, ...args].join(" ");
}

function runCommand(root, label, command, args) {
  try {
    const output = execFileSync(command, args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 1024 * 1024 * 10,
      timeout: 120_000,
    });
    return {
      label,
      ok: true,
      command: commandLine(command, args),
      output: truncate(output.trim(), 1600),
    };
  } catch (error) {
    const stdout =
      typeof error?.stdout === "string" ? error.stdout : error?.stdout?.toString?.() ?? "";
    const stderr =
      typeof error?.stderr === "string" ? error.stderr : error?.stderr?.toString?.() ?? "";
    const message = error instanceof Error ? error.message : String(error);
    return {
      label,
      ok: false,
      command: commandLine(command, args),
      output: truncate([message, stdout, stderr].filter(Boolean).join("\n"), 2400),
    };
  }
}

function existingSkillDirs(root, skillDirs) {
  return [...skillDirs]
    .filter((skillDir) => existsSync(path.join(root, skillDir, "SKILL.md")))
    .sort();
}

function runValidation(root, skillDirs) {
  const targets = existingSkillDirs(root, skillDirs);
  const results = [];

  results.push(
    runCommand(
      root,
      targets.length ? "Changed skill frontmatter" : "All skill frontmatter",
      "node",
      targets.length ? ["scripts/validate-skill.ts", ...targets] : ["scripts/validate-skill.ts"],
    ),
  );

  for (const skillDir of targets) {
    const skillName = path.basename(skillDir);
    const validatorPath = `${skillDir}/scripts/validate-${skillName}.ts`;
    if (existsSync(path.join(root, validatorPath))) {
      results.push(
        runCommand(root, `${skillName} validator`, "node", [validatorPath, skillDir]),
      );
    }
  }

  results.push(runCommand(root, "Skill HTML validator", "node", ["scripts/validate-skill-html.ts", "."]));
  results.push(runCommand(root, "Repo validator", "node", ["scripts/validate-skill-repo.ts", "."]));

  return results;
}

function validationFailed(results) {
  return results.some((result) => !result.ok);
}

function formatValidationResults(results) {
  return results
    .map((result) => {
      const status = result.ok ? "PASS" : "FAIL";
      const output = result.output ? `\n${result.output}` : "";
      return `- ${status} ${result.label}: ${result.command}${output}`;
    })
    .join("\n");
}

function runSkillToHtml(root, reminders) {
  const targets = reminders.map((reminder) => `- ${reminder.skillDir}`).join("\n");
  const prompt = [
    "You are running from a Codex hook in a shared skills repo.",
    "A shared skill source instruction changed, and the adjacent human visual guide is stale or missing.",
    "",
    "Use $markdown-to-html at skills/markdown-to-html/SKILL.md and follow its visual guide standards.",
    "For this hook run, update only the adjacent skill.html files for the target skill folders.",
    "Do not edit SKILL.md, references, validators, README, AGENTS, project snippets, history, docs, or unrelated files.",
    "Do not commit, push, install packages, or start a dev server.",
    "Keep the output static HTML with embedded CSS/SVG and no external assets.",
    "",
    "Target skill folders:",
    targets,
  ].join("\n");

  if (dryRun) return "dry-run: would run codex exec for markdown-to-html";

  const output = execFileSync(
    "codex",
    [
      "exec",
      "-C",
      root,
      "--ephemeral",
      "--sandbox",
      "workspace-write",
      "-c",
      "features.hooks=false",
      prompt,
    ],
    {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        SKILL_HTML_HOOK_ACTIVE: "1",
      },
      maxBuffer: 1024 * 1024 * 10,
      timeout: 240_000,
    },
  );

  return truncate(output.trim());
}

const input = await readStdin();
let payload = {};
try {
  payload = JSON.parse(input || "{}");
} catch {
  process.stdout.write("{}\n");
  process.exit(0);
}

const eventName = payload.hook_event_name ?? "PostToolUse";
const root = gitRoot(payload.cwd ?? process.cwd());
if (!isLocalRepoRoot(root)) {
  process.stdout.write("{}\n");
  process.exit(0);
}
const entries = parseGitStatus(root);
const candidateDirs = collectDirtySkillDirs(entries);
const changedSkillDirs = collectChangedSkillDirs(entries);
const validationRelevant = hasValidationRelevantChanges(entries);

const reminders = [];

for (const skillDir of [...candidateDirs].sort()) {
  const skillPath = skillDir === "." ? "SKILL.md" : `${skillDir}/SKILL.md`;
  const htmlPath = htmlPathForSkillDir(skillDir);
  const absoluteSkillPath = path.join(root, skillPath);
  const absoluteHtmlPath = path.join(root, htmlPath);

  if (!existsSync(absoluteSkillPath)) continue;
  if (hasDirtyPath(entries, htmlPath)) continue;

  reminders.push({
    skillDir,
    skillPath,
    htmlPath,
    htmlExists: existsSync(absoluteHtmlPath),
  });
}

let autoRunMessage = "";

if (reminders.length > 0 && autoRun && !recursionGuard && !noWrite) {
  try {
    const output = runSkillToHtml(root, reminders);
    autoRunMessage = [
      "Codex hook auto-run: updated stale skill.html guide(s) with $markdown-to-html.",
      "",
      ...reminders.map((reminder) => `- ${reminder.htmlPath}`),
      output ? `\nAuto-run output:\n${output}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  } catch (error) {
    const stdout = typeof error?.stdout === "string" ? error.stdout : "";
    const stderr = typeof error?.stderr === "string" ? error.stderr : "";
    const message = truncate(
      [error instanceof Error ? error.message : String(error), stdout, stderr]
        .filter(Boolean)
        .join("\n"),
    );
    additionalContext(
      eventName,
      [
        "Codex hook auto-run failed while trying to update stale skill.html guide(s).",
        "Before finalizing this task, use $markdown-to-html at skills/markdown-to-html/SKILL.md manually for each affected skill folder.",
        "",
        ...reminders.map((reminder) => `- ${reminder.skillDir} -> ${reminder.htmlPath}`),
        "",
        `Failure: ${message}`,
      ].join("\n"),
    );
    process.exit(0);
  }
}

if (validationRelevant && !recursionGuard) {
  const validationResults = runValidation(root, changedSkillDirs);
  if (validationFailed(validationResults)) {
    additionalContext(
      eventName,
      [
        autoRunMessage,
        "Codex hook validation failed after skill/repo changes.",
        "Before finalizing this task, fix the validation errors below.",
        "",
        formatValidationResults(validationResults),
      ]
        .filter(Boolean)
        .join("\n\n"),
    );
    process.exit(0);
  }

  if (autoRunMessage) {
    additionalContext(
      eventName,
      [
        autoRunMessage,
        "Codex hook validation passed after skill/repo changes.",
        "",
        formatValidationResults(validationResults),
      ].join("\n\n"),
    );
    process.exit(0);
  }
}

if (reminders.length === 0) {
  process.stdout.write("{}\n");
  process.exit(0);
}

const lines = [
  recursionGuard
    ? "Codex hook reminder: skill HTML auto-run is already active, so this nested hook will not recurse."
    : "Codex hook reminder: a shared skill source instruction changed, but the matching human visual guide is not dirty.",
  "Before finalizing this task, use $markdown-to-html at skills/markdown-to-html/SKILL.md for each affected skill folder and update the adjacent skill.html.",
  "",
];

for (const reminder of reminders) {
  lines.push(`- Skill source: ${reminder.skillPath}`);
  lines.push(
    `  Required guide: ${reminder.htmlPath}${reminder.htmlExists ? "" : " (missing)"}`,
  );
  lines.push(`  Target folder: ${reminder.skillDir}`);
}

additionalContext(eventName, lines.join("\n"));
