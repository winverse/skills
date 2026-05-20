#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.argv[2] ?? process.cwd());
const errors: string[] = [];

function requireFile(relativePath: string): void {
  if (!existsSync(path.join(root, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

function readJson<T>(relativePath: string): T | undefined {
  const fullPath = path.join(root, relativePath);
  if (!existsSync(fullPath)) return undefined;
  try {
    return JSON.parse(readFileSync(fullPath, "utf8")) as T;
  } catch (error) {
    errors.push(`Invalid JSON in ${relativePath}: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}

function requireText(relativePath: string, needle: string): void {
  const fullPath = path.join(root, relativePath);
  if (!existsSync(fullPath)) return;
  const text = readFileSync(fullPath, "utf8");
  if (!text.includes(needle)) {
    errors.push(`${relativePath} must include ${needle}`);
  }
}

type CodexPluginManifest = {
  name?: string;
  version?: string;
  repository?: string;
  license?: string;
  mcpServers?: string;
  hooks?: string;
  skills?: string;
  scripts?: string;
  interface?: {
    displayName?: string;
    category?: string;
  };
};

type ContextModeMcpConfig = {
  mcpServers?: {
    "context-mode"?: {
      command?: string;
      args?: string[];
      cwd?: string;
    };
  };
};

type CodeReviewGraphMcpConfig = {
  mcpServers?: {
    "code-review-graph"?: {
      command?: string;
      args?: string[];
    };
  };
};

type CavemanPackage = {
  name?: string;
  version?: string;
  license?: string;
  homepage?: string;
  repository?: {
    url?: string;
  };
  engines?: {
    node?: string;
  };
};

type CavemanClaudePluginManifest = {
  name?: string;
  description?: string;
  author?: {
    name?: string;
    url?: string;
  };
  hooks?: {
    SessionStart?: unknown[];
    UserPromptSubmit?: unknown[];
  };
};

type PluginHooksConfig = {
  hooks?: {
    SessionStart?: Array<{
      matcher?: string;
      hooks?: Array<{
        type?: string;
        command?: string;
      }>;
    }>;
  };
};

type SubmoduleEntry = {
  name: string;
  path: string;
  url: string;
};

function normalizeRepoUrl(url: string): string {
  return url.replace(/\.git$/, "");
}

function parseGitmodules(): SubmoduleEntry[] {
  const fullPath = path.join(root, ".gitmodules");
  if (!existsSync(fullPath)) return [];

  const entries: SubmoduleEntry[] = [];
  const sections = readFileSync(fullPath, "utf8").split(/\n(?=\[submodule )/);
  for (const section of sections) {
    const name = section.match(/^\[submodule "([^"]+)"\]/m)?.[1];
    const modulePath = section.match(/^\s*path\s*=\s*(.+)$/m)?.[1]?.trim();
    const url = section.match(/^\s*url\s*=\s*(.+)$/m)?.[1]?.trim();
    if (!name) continue;
    if (!modulePath || !url) {
      errors.push(`.gitmodules entry ${name} must include path and url`);
      continue;
    }
    entries.push({ name, path: modulePath, url });
  }
  return entries;
}

function pluginRootsMentioned(relativePath: string): Set<string> {
  const roots = new Set<string>();
  const fullPath = path.join(root, relativePath);
  if (!existsSync(fullPath)) return roots;
  const text = readFileSync(fullPath, "utf8");
  for (const match of text.matchAll(/plugins\/([a-z0-9-]+)/g)) {
    roots.add(`plugins/${match[1]}`);
  }
  return roots;
}

requireFile(".gitmodules");
const submodules = parseGitmodules();
const submodulePaths = new Set(submodules.map((entry) => entry.path));
const repoOwnedPluginPaths = new Set(["plugins/project-workflow"]);
const knownPluginPaths = new Set([...submodulePaths, ...repoOwnedPluginPaths]);

for (const entry of submodules) {
  if (!entry.path.startsWith("plugins/")) {
    errors.push(`Vendored submodule must live under plugins/: ${entry.path}`);
  }
  requireFile(entry.path);
}

const duplicateSubmodulePaths = submodules
  .map((entry) => entry.path)
  .filter((pluginPath, index, paths) => paths.indexOf(pluginPath) !== index);
for (const pluginPath of new Set(duplicateSubmodulePaths)) {
  errors.push(`Duplicate .gitmodules path: ${pluginPath}`);
}

requireFile("plugins/context-mode/.codex-plugin/plugin.json");
requireFile("plugins/context-mode/.codex-plugin/mcp.json");
requireFile("plugins/context-mode/start.mjs");
requireFile("plugins/context-mode/skills");
requireFile("plugins/code-review-graph/.mcp.json");
requireFile("plugins/code-review-graph/pyproject.toml");
requireFile("plugins/code-review-graph/skills");
requireFile(path.posix.join("plugins/code-review-graph/skills", "review-pr", "SKILL.md"));
requireFile(path.posix.join("plugins/code-review-graph/skills", "review-changes", "SKILL.md"));
requireFile("plugins/caveman/package.json");
requireFile("plugins/caveman/.claude-plugin/plugin.json");
requireFile("plugins/caveman/plugins/caveman/.codex-plugin/plugin.json");
requireFile("plugins/caveman/plugins/caveman/.codex-plugin/hooks.json");
requireFile("plugins/caveman/plugins/caveman/hooks/codex/sessionstart.mjs");
requireFile("plugins/caveman/commands");
requireFile("plugins/caveman/skills");
requireFile(path.posix.join("plugins/caveman/skills", "caveman", "SKILL.md"));
requireFile(path.posix.join("plugins/caveman/skills", "caveman-help", "SKILL.md"));
requireFile(path.posix.join("plugins/caveman/skills", "caveman-compress", "SKILL.md"));
requireFile(path.posix.join("plugins/caveman/skills", "caveman-commit", "SKILL.md"));
requireFile(path.posix.join("plugins/caveman/skills", "caveman-review", "SKILL.md"));
requireFile(path.posix.join("plugins/caveman/skills", "caveman-stats", "SKILL.md"));
requireFile(path.posix.join("plugins/caveman/skills", "cavecrew", "SKILL.md"));
requireFile("plugins/caveman/LICENSE");
requireFile("docs/plugin-catalog.md");
requireFile("docs/update-source-registry.md");

for (const entry of submodules) {
  for (const relativePath of ["docs/plugin-catalog.md", "docs/update-source-registry.md"]) {
    requireText(relativePath, entry.path);
    const text = readFileSync(path.join(root, relativePath), "utf8");
    if (!text.includes(entry.url) && !text.includes(normalizeRepoUrl(entry.url))) {
      errors.push(`${relativePath} must include upstream URL for ${entry.path}: ${entry.url}`);
    }
  }
}

for (const relativePath of ["docs/plugin-catalog.md", "docs/update-source-registry.md"]) {
  for (const pluginPath of pluginRootsMentioned(relativePath)) {
    if (!knownPluginPaths.has(pluginPath)) {
      errors.push(`${relativePath} mentions ${pluginPath}, but .gitmodules or repo-owned plugin list does not list it`);
    }
  }
}

requireFile("plugins/project-workflow/.codex-plugin/plugin.json");
requireFile("plugins/project-workflow/README.md");
requireFile("plugins/project-workflow/references/plugin-boundary-review.md");
requireFile("plugins/project-workflow/scripts/execute-phase.ts");
requireFile("plugins/project-workflow/scripts/validate-execute-phase.ts");
requireFile(path.posix.join("plugins/project-workflow/skills", "project-workflow", "SKILL.md"));
requireFile(path.posix.join("plugins/project-workflow/skills", "project-workflow", "references", "project-workflow-playbook.md"));
requireText(".gitmodules", "path = plugins/context-mode");
requireText(".gitmodules", "url = https://github.com/mksglu/context-mode.git");
requireText(".gitmodules", "path = plugins/code-review-graph");
requireText(".gitmodules", "url = https://github.com/tirth8205/code-review-graph.git");
requireText(".gitmodules", "path = plugins/caveman");
requireText(".gitmodules", "url = https://github.com/JuliusBrussee/caveman.git");
requireText("README.md", "plugins/context-mode");
requireText("README.md", "plugins/code-review-graph");
requireText("README.md", "plugins/caveman");
requireText("README.md", "plugins/project-workflow");
requireText("README.md", "JuliusBrussee/caveman");
requireText("README.md", "node scripts/validate-plugins.ts .");
requireText("AGENTS.md", "Plugin folders live under `plugins/`");
requireText("AGENTS.md", "plugins/project-workflow");
requireText("docs/plugin-catalog.md", "`context-mode`");
requireText("docs/plugin-catalog.md", "`project-workflow`");
requireText("docs/plugin-catalog.md", "repo-owned plugin");
requireText("docs/plugin-catalog.md", "v1.0.136");
requireText("docs/plugin-catalog.md", "`code-review-graph`");
requireText("docs/plugin-catalog.md", "v2.3.3");
requireText("docs/plugin-catalog.md", "uvx code-review-graph serve");
requireText("docs/plugin-catalog.md", "`caveman`");
requireText("docs/plugin-catalog.md", "v1.8.2");
requireText("docs/plugin-catalog.md", "JuliusBrussee/caveman");
requireText("docs/plugin-catalog.md", "plugins/caveman/skills/caveman/SKILL.md");
requireText("docs/plugin-catalog.md", "plugins/caveman/plugins/caveman/.codex-plugin/plugin.json");
requireText("docs/plugin-catalog.md", "plugins/caveman/plugins/caveman/.codex-plugin/hooks.json");
requireText("docs/plugin-catalog.md", "plugins/caveman/plugins/caveman/hooks/codex/sessionstart.mjs");
requireText("docs/plugin-catalog.md", "canonical source는 `.gitmodules`");
requireText("docs/update-source-registry.md", ".gitmodules");
requireText("docs/update-source-registry.md", "Repo-owned plugin");
requireText("docs/update-source-registry.md", "## Plugin update list");
requireText("docs/update-source-registry.md", "`project-workflow` | `plugins/project-workflow`");
requireText("docs/update-source-registry.md", "`context-mode` | `plugins/context-mode` | `https://github.com/mksglu/context-mode.git`");
requireText("docs/update-source-registry.md", "`code-review-graph` | `plugins/code-review-graph` | `https://github.com/tirth8205/code-review-graph.git`");
requireText("docs/update-source-registry.md", "`caveman` | `plugins/caveman` | `https://github.com/JuliusBrussee/caveman.git`");
requireText("docs/update-source-registry.md", "plugins/caveman/plugins/caveman/.codex-plugin/hooks.json");
requireText("docs/update-source-registry.md", "docs/plugin-catalog.md");
requireText("docs/update-source-registry.md", "workflow provenance-only primitive");
requireText("history/skills.md", "`code-review-graph` plugin reference added");
requireText("history/skills.md", "`caveman` plugin reference added");
requireText("history/skills.md", "Project workflow plugin boundary added");

const projectWorkflowManifest = readJson<CodexPluginManifest>("plugins/project-workflow/.codex-plugin/plugin.json");
if (projectWorkflowManifest) {
  const expectedProjectWorkflowManifest: Array<[unknown, string]> = [
    [projectWorkflowManifest.name === "project-workflow", "project-workflow plugin name"],
    [projectWorkflowManifest.version === "0.1.0", "project-workflow version"],
    [projectWorkflowManifest.repository === "https://github.com/winverse/agents-skills", "project-workflow repository URL"],
    [projectWorkflowManifest.license === "MIT", "project-workflow license"],
    [projectWorkflowManifest.skills === "./skills/", "project-workflow bundled skills path"],
    [projectWorkflowManifest.scripts === "./scripts/", "project-workflow scripts path"],
    [projectWorkflowManifest.interface?.displayName === "Project Workflow", "project-workflow display name"],
    [projectWorkflowManifest.interface?.category === "Productivity", "project-workflow category"],
  ];
  for (const [ok, label] of expectedProjectWorkflowManifest) {
    if (!ok) errors.push(`Unexpected manifest value for ${label}`);
  }
}

requireText("plugins/project-workflow/README.md", "feature-workflow`는 이 plugin에 넣지 않는다");
requireText("plugins/project-workflow/README.md", "agent-eval-harness");
requireText("plugins/project-workflow/README.md", "execute-phase.ts");
requireText("plugins/project-workflow/README.md", "--agent-bin");
requireText("plugins/project-workflow/README.md", "--project-root");
requireText("plugins/project-workflow/references/plugin-boundary-review.md", "`project-workflow` | plugin core");
requireText("plugins/project-workflow/references/plugin-boundary-review.md", "`feature-workflow` | 별도 skill 유지");
requireText("plugins/project-workflow/references/plugin-boundary-review.md", "`agent-eval-harness` | companion skill 유지");
requireText("plugins/project-workflow/references/plugin-boundary-review.md", "execute-phase.ts");
requireText("plugins/project-workflow/scripts/execute-phase.ts", "agent-neutral");
requireText("plugins/project-workflow/scripts/execute-phase.ts", "--agent-bin");
requireText("plugins/project-workflow/scripts/execute-phase.ts", "--agent-arg");
requireText("plugins/project-workflow/scripts/execute-phase.ts", "--project-root");
requireText("plugins/project-workflow/scripts/execute-phase.ts", "shell: false");
requireText("plugins/project-workflow/scripts/validate-execute-phase.ts", "completed dry-run must not mutate index.json");
requireText("plugins/project-workflow/skills/project-workflow/SKILL.md", "canonical source");

const manifest = readJson<CodexPluginManifest>("plugins/context-mode/.codex-plugin/plugin.json");
if (manifest) {
  const expected: Array<[unknown, string]> = [
    [manifest.name === "context-mode", "context-mode plugin name"],
    [manifest.version === "1.0.136", "context-mode pinned version v1.0.136"],
    [manifest.repository === "https://github.com/mksglu/context-mode", "context-mode repository URL"],
    [manifest.license === "Elastic-2.0", "context-mode license"],
    [manifest.mcpServers === "./.codex-plugin/mcp.json", "Codex MCP manifest path"],
    [manifest.hooks === "./.codex-plugin/hooks.json", "Codex hooks manifest path"],
    [manifest.skills === "./skills/", "bundled plugin skills path"],
    [manifest.interface?.displayName === "context-mode", "plugin display name"],
    [manifest.interface?.category === "Productivity", "plugin category"],
  ];
  for (const [ok, label] of expected) {
    if (!ok) errors.push(`Unexpected manifest value for ${label}`);
  }
}

const mcp = readJson<ContextModeMcpConfig>("plugins/context-mode/.codex-plugin/mcp.json");
const server = mcp?.mcpServers?.["context-mode"];
if (server) {
  if (server.command !== "node") errors.push("context-mode MCP command must be node");
  if (server.cwd !== ".") errors.push("context-mode MCP cwd must be .");
  if (server.args?.[0] !== "./start.mjs") errors.push("context-mode MCP args must start ./start.mjs");
}

const codeReviewGraphPyproject = path.join(root, "plugins/code-review-graph/pyproject.toml");
if (existsSync(codeReviewGraphPyproject)) {
  const pyproject = readFileSync(codeReviewGraphPyproject, "utf8");
  const expectedPyprojectText = [
    'name = "code-review-graph"',
    'version = "2.3.3"',
    'license = "MIT"',
    'Repository = "https://github.com/tirth8205/code-review-graph"',
    'code-review-graph = "code_review_graph.cli:main"',
  ];
  for (const needle of expectedPyprojectText) {
    if (!pyproject.includes(needle)) {
      errors.push(`plugins/code-review-graph/pyproject.toml must include ${needle}`);
    }
  }
}

const codeReviewGraphMcp = readJson<CodeReviewGraphMcpConfig>("plugins/code-review-graph/.mcp.json");
const codeReviewGraphServer = codeReviewGraphMcp?.mcpServers?.["code-review-graph"];
if (codeReviewGraphServer) {
  if (codeReviewGraphServer.command !== "uvx") {
    errors.push("code-review-graph MCP command must be uvx");
  }
  const args = codeReviewGraphServer.args ?? [];
  if (args[0] !== "code-review-graph" || args[1] !== "serve") {
    errors.push("code-review-graph MCP args must be code-review-graph serve");
  }
}

const cavemanPackage = readJson<CavemanPackage>("plugins/caveman/package.json");
if (cavemanPackage) {
  const expectedCavemanPackage: Array<[unknown, string]> = [
    [cavemanPackage.name === "caveman-installer", "caveman package name"],
    [cavemanPackage.version === "0.1.0", "caveman installer package version"],
    [cavemanPackage.license === "MIT", "caveman license"],
    [cavemanPackage.homepage === "https://github.com/JuliusBrussee/caveman", "caveman homepage"],
    [cavemanPackage.repository?.url === "git+https://github.com/JuliusBrussee/caveman.git", "caveman repository URL"],
    [cavemanPackage.engines?.node === ">=18", "caveman Node engine"],
  ];
  for (const [ok, label] of expectedCavemanPackage) {
    if (!ok) errors.push(`Unexpected package value for ${label}`);
  }
}

const cavemanClaudePlugin = readJson<CavemanClaudePluginManifest>("plugins/caveman/.claude-plugin/plugin.json");
if (cavemanClaudePlugin) {
  const expectedCavemanPlugin: Array<[unknown, string]> = [
    [cavemanClaudePlugin.name === "caveman", "caveman Claude plugin name"],
    [
      typeof cavemanClaudePlugin.description === "string" &&
        cavemanClaudePlugin.description.includes("Ultra-compressed communication mode"),
      "caveman Claude plugin description",
    ],
    [cavemanClaudePlugin.author?.name === "Julius Brussee", "caveman author name"],
    [cavemanClaudePlugin.author?.url === "https://github.com/JuliusBrussee", "caveman author URL"],
    [Array.isArray(cavemanClaudePlugin.hooks?.SessionStart), "caveman SessionStart hook"],
    [Array.isArray(cavemanClaudePlugin.hooks?.UserPromptSubmit), "caveman UserPromptSubmit hook"],
  ];
  for (const [ok, label] of expectedCavemanPlugin) {
    if (!ok) errors.push(`Unexpected manifest value for ${label}`);
  }
}

const cavemanCodexPlugin = readJson<CodexPluginManifest>(
  "plugins/caveman/plugins/caveman/.codex-plugin/plugin.json",
);
if (cavemanCodexPlugin) {
  const expectedCavemanCodexPlugin: Array<[unknown, string]> = [
    [cavemanCodexPlugin.name === "caveman", "caveman Codex plugin name"],
    [cavemanCodexPlugin.repository === "https://github.com/JuliusBrussee/caveman", "caveman Codex repository URL"],
    [cavemanCodexPlugin.hooks === "./.codex-plugin/hooks.json", "caveman Codex hooks manifest path"],
    [cavemanCodexPlugin.skills === "./skills/", "caveman Codex bundled skills path"],
    [cavemanCodexPlugin.interface?.displayName === "Caveman", "caveman Codex display name"],
  ];
  for (const [ok, label] of expectedCavemanCodexPlugin) {
    if (!ok) errors.push(`Unexpected manifest value for ${label}`);
  }
}

const cavemanCodexHooks = readJson<PluginHooksConfig>(
  "plugins/caveman/plugins/caveman/.codex-plugin/hooks.json",
);
const cavemanSessionStart = cavemanCodexHooks?.hooks?.SessionStart?.[0]?.hooks?.[0];
if (cavemanSessionStart) {
  if (cavemanSessionStart.type !== "command") {
    errors.push("caveman Codex SessionStart hook type must be command");
  }
  if (!cavemanSessionStart.command?.includes("${PLUGIN_ROOT}/hooks/codex/sessionstart.mjs")) {
    errors.push("caveman Codex SessionStart hook must call hooks/codex/sessionstart.mjs");
  }
}
requireText(
  "plugins/caveman/plugins/caveman/hooks/codex/sessionstart.mjs",
  ["skills", "caveman", "SKILL.md"].join("/"),
);
requireText(
  "plugins/caveman/plugins/caveman/hooks/codex/sessionstart.mjs",
  "CAVEMAN MODE ACTIVE",
);

if (errors.length) {
  console.error("plugin validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("plugin validation passed");
