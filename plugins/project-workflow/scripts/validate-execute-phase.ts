#!/usr/bin/env node
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const runner = path.join(repoRoot, "plugins/project-workflow/scripts/execute-phase.ts");
const failures: string[] = [];

type JsonObject = Record<string, unknown>;

function writeJson(filePath: string, value: unknown): void {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

function makeProjectRoot(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "project-workflow-project-"));
  mkdirSync(path.join(dir, "docs"), { recursive: true });
  writeFileSync(path.join(dir, "AGENTS.md"), "# Agent Rules\n\n- codex rule\n", "utf8");
  writeFileSync(path.join(dir, "CLAUDE.md"), "# Claude Rules\n\nSHOULD_NOT_LOAD_CLAUDE\n", "utf8");
  writeFileSync(path.join(dir, "CONTEXT.md"), "# Context\n\nShared language content.\n", "utf8");
  writeFileSync(path.join(dir, "docs/PRD.md"), "# PRD\n\nPRD content.\n", "utf8");
  writeFileSync(path.join(dir, "docs/design.md"), "# Design\n\nDesign content.\n", "utf8");
  return dir;
}

function makePhase(steps: JsonObject[], stepFiles: Record<string, string> = {}): string {
  const dir = mkdtempSync(path.join(tmpdir(), "project-workflow-phase-"));
  writeJson(path.join(dir, "index.json"), {
    project: "smoke",
    phase: "handoff",
    steps,
  });

  for (const [file, body] of Object.entries(stepFiles)) {
    writeFileSync(path.join(dir, file), body, "utf8");
  }

  return dir;
}

function makePendingPhase(): string {
  return makePhase(
    [
      {
        step: 0,
        name: "first",
        status: "pending",
        read_files: ["AGENTS.md", "CONTEXT.md"],
        claimed_write_set: ["docs/example.md"],
        acceptance_commands: ["node --version"],
      },
    ],
    { "step0.md": "# Step 0\n\nRun smoke step.\n" },
  );
}

function makePhaseWithPriorStep(): string {
  return makePhase(
    [
      {
        step: 0,
        name: "setup",
        status: "completed",
        summary: "setup summary",
      },
      {
        step: 1,
        name: "feature",
        status: "pending",
        read_files: ["AGENTS.md"],
        claimed_write_set: ["src/feature.ts"],
        acceptance_commands: ["npm test"],
      },
    ],
    { "step1.md": "# Step 1\n\nBuild the feature.\n" },
  );
}

function makeIdTitlePhase(): string {
  return makePhase(
    [
      {
        id: "step1",
        title: "Domain model and fixtures",
        file: "step1.md",
        status: "pending",
      },
    ],
    { "step1.md": "# step1\n\nRun id/title schema smoke step.\n" },
  );
}

function makeAgentScript(): string {
  const scriptDir = mkdtempSync(path.join(tmpdir(), "project-workflow-agent-"));
  const scriptPath = path.join(scriptDir, "agent.mjs");
  writeFileSync(scriptPath, `
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [phaseDir, mode] = process.argv.slice(2);
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  writeFileSync(path.join(phaseDir, "captured-prompt.md"), input, "utf8");
  writeFileSync(path.join(phaseDir, "captured-cwd.txt"), process.cwd(), "utf8");
  appendFileSync(path.join(phaseDir, "attempts.log"), mode + "\\n", "utf8");

  const indexFile = path.join(phaseDir, "index.json");
  const index = JSON.parse(readFileSync(indexFile, "utf8"));
  const step = index.steps.find((candidate) => candidate.status === "pending");

  if (mode === "complete") {
    step.status = "completed";
    step.summary = "agent completed";
    writeFileSync(indexFile, JSON.stringify(index, null, 2) + "\\n", "utf8");
    console.log("agent completed");
    process.exit(0);
  }

  if (mode === "blocked") {
    step.status = "blocked";
    step.blocked_reason = "needs API key";
    writeFileSync(indexFile, JSON.stringify(index, null, 2) + "\\n", "utf8");
    console.error("agent blocked");
    process.exit(0);
  }

  console.error("agent failed without status update");
  process.exit(1);
});
`, "utf8");
  return scriptPath;
}

function run(args: string[]) {
  return spawnSync("node", [runner, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function assert(condition: unknown, message: string): void {
  if (!condition) failures.push(message);
}

const projectRoot = makeProjectRoot();
const agentScript = makeAgentScript();

const pending = makePhaseWithPriorStep();
const pendingBefore = readFileSync(path.join(pending, "index.json"), "utf8");
const pendingDryRun = run([pending, "--project-root", projectRoot, "--dry-run"]);
const pendingAfter = readFileSync(path.join(pending, "index.json"), "utf8");
assert(pendingDryRun.status === 0, "pending dry-run should exit 0");
assert(pendingDryRun.stdout.includes("Codex feature-workflow step 실행 agent"), "pending dry-run should build Codex feature-workflow adapter prompt");
assert(pendingDryRun.stdout.includes("Target project root:"), "pending dry-run should include project root");
assert(pendingDryRun.stdout.includes("## AGENTS.md"), "pending dry-run should include AGENTS.md");
assert(pendingDryRun.stdout.includes("codex rule"), "pending dry-run should include Codex project rules");
assert(!pendingDryRun.stdout.includes("SHOULD_NOT_LOAD_CLAUDE"), "pending dry-run should not load CLAUDE.md");
assert(pendingDryRun.stdout.includes("## CONTEXT.md"), "pending dry-run should include CONTEXT.md");
assert(pendingDryRun.stdout.includes("## docs/PRD.md"), "pending dry-run should include PRD docs");
assert(pendingDryRun.stdout.includes("## docs/design.md"), "pending dry-run should include design docs");
assert(pendingDryRun.stdout.includes("Step 0 (setup): setup summary"), "pending dry-run should include completed step summary");
assert(pendingDryRun.stdout.includes("# Step 1"), "pending dry-run should include pending step body");
assert(pendingBefore === pendingAfter, "pending dry-run must not mutate index.json");

const idTitle = makeIdTitlePhase();
const idTitleDryRun = run([idTitle, "--dry-run"]);
assert(idTitleDryRun.status === 0, "id/title dry-run should exit 0");
assert(idTitleDryRun.stdout.includes("Step step1: Domain model and fixtures"), "id/title dry-run should use id and title in prompt header");
assert(!idTitleDryRun.stdout.includes("Step undefined"), "id/title dry-run must not print undefined step metadata");

const completed = makePhase([
  {
    step: 0,
    name: "done",
    status: "completed",
    summary: "done",
  },
]);
const completedBefore = readFileSync(path.join(completed, "index.json"), "utf8");
const completedDryRun = run([completed, "--dry-run"]);
const completedAfter = readFileSync(path.join(completed, "index.json"), "utf8");
assert(completedDryRun.status === 0, "completed dry-run should exit 0");
assert(completedDryRun.stdout.includes("Phase completed"), "completed dry-run should report completion");
assert(completedBefore === completedAfter, "completed dry-run must not mutate index.json");

const blocked = makePhase([
  {
    step: 0,
    name: "blocked-step",
    status: "blocked",
    blocked_reason: "manual approval",
  },
]);
const blockedRun = run([blocked, "--dry-run"]);
assert(blockedRun.status === 2, "pre-blocked step should exit 2");
assert(blockedRun.stderr.includes("BLOCKED: Step 0 blocked-step: manual approval"), "pre-blocked step should report blocked reason");

const errored = makePhase([
  {
    step: 0,
    name: "failed-step",
    status: "error",
    error_message: "typecheck failed",
  },
]);
const erroredRun = run([errored, "--dry-run"]);
assert(erroredRun.status === 1, "pre-error step should exit 1");
assert(erroredRun.stderr.includes("ERROR: Step 0 failed-step: typecheck failed"), "pre-error step should report error message");

const missingPhase = run([path.join(tmpdir(), "missing-project-workflow-phase"), "--dry-run"]);
assert(missingPhase.status === 1, "missing phase dir should exit 1");
assert(missingPhase.stderr.includes("phase index not found"), "missing phase dir should explain missing index");

const missingCommand = run([makePendingPhase(), "--run"]);
assert(missingCommand.status === 2, "--run without --agent-bin should fail");

const claudeAgent = run([makePendingPhase(), "--run", "--agent", "claude", "--agent-bin", "claude"]);
assert(claudeAgent.status === 2, "claude agent mode should fail because runner is Codex-first");

const dangerous = run([makePendingPhase(), "--run", "--agent", "codex", "--agent-bin", "codex", "--agent-arg", "exec", "--agent-arg", "--dangerously-skip-permissions"]);
assert(dangerous.status === 2, "dangerous permission-bypass flag should fail");
assert(dangerous.stderr.includes("forbidden agent argument"), "dangerous flag failure should explain the reason");

const implicitCustom = run([makePendingPhase(), "--run", "--agent-bin", "node", "--agent-arg", agentScript]);
assert(implicitCustom.status === 2, "implicit custom command should fail without --agent custom");
assert(implicitCustom.stderr.includes("Use --agent custom"), "implicit custom command failure should explain explicit fallback");

const successful = makePendingPhase();
const successfulRun = run([
  successful,
  "--project-root",
  projectRoot,
  "--run",
  "--agent",
  "custom",
  "--agent-bin",
  "node",
  "--agent-arg",
  agentScript,
  "--agent-arg",
  successful,
  "--agent-arg",
  "complete",
]);
const successfulIndex = readJson<{ created_at?: string; steps: Array<JsonObject> }>(path.join(successful, "index.json"));
const successfulOutput = readJson<JsonObject>(path.join(successful, "step0-output.json"));
const successfulPrompt = readFileSync(path.join(successful, "captured-prompt.md"), "utf8");
const successfulCwd = readFileSync(path.join(successful, "captured-cwd.txt"), "utf8");
const expectedProjectRoot = realpathSync(projectRoot);
assert(successfulRun.status === 0, "successful custom run should exit 0");
assert(successfulRun.stdout.includes("completed: step 0 first"), "successful custom run should report completed step");
assert(successfulIndex.created_at, "successful custom run should stamp phase created_at");
assert(successfulIndex.steps[0]?.status === "completed", "successful custom run should mark step completed");
assert(successfulIndex.steps[0]?.summary === "agent completed", "successful custom run should preserve agent summary");
assert(successfulIndex.steps[0]?.started_at, "successful custom run should stamp started_at");
assert(successfulIndex.steps[0]?.completed_at, "successful custom run should stamp completed_at");
assert(successfulOutput.agent === "custom", "successful custom run should record agent label");
assert(successfulOutput.cwd === projectRoot, "successful custom run should record project root cwd");
assert(successfulOutput.exitCode === 0, "successful custom run should record agent exit code");
assert(successfulPrompt.includes("Codex feature-workflow step 실행 agent"), "successful custom run should pass prompt on stdin");
assert(successfulPrompt.includes("codex rule"), "successful custom run prompt should include project docs");
assert(successfulCwd === expectedProjectRoot, "successful custom run should execute inside project root");
assert(existsSync(path.join(successful, "step0-output.json")), "successful custom run should write step output JSON");

const blockedByAgent = makePendingPhase();
const blockedByAgentRun = run([
  blockedByAgent,
  "--run",
  "--agent",
  "custom",
  "--agent-bin",
  "node",
  "--agent-arg",
  agentScript,
  "--agent-arg",
  blockedByAgent,
  "--agent-arg",
  "blocked",
]);
const blockedByAgentIndex = readJson<{ steps: Array<JsonObject> }>(path.join(blockedByAgent, "index.json"));
assert(blockedByAgentRun.status === 2, "agent-blocked run should exit 2");
assert(blockedByAgentRun.stderr.includes("blocked: step 0 first"), "agent-blocked run should report blocked step");
assert(blockedByAgentIndex.steps[0]?.status === "blocked", "agent-blocked run should keep blocked status");
assert(blockedByAgentIndex.steps[0]?.blocked_reason === "needs API key", "agent-blocked run should preserve blocked reason");
assert(blockedByAgentIndex.steps[0]?.blocked_at, "agent-blocked run should stamp blocked_at");

const retryPhase = makePendingPhase();
const retryRun = run([
  retryPhase,
  "--run",
  "--agent",
  "custom",
  "--agent-bin",
  "node",
  "--agent-arg",
  agentScript,
  "--agent-arg",
  retryPhase,
  "--agent-arg",
  "fail",
  "--max-retries",
  "2",
]);
const retryIndex = readJson<{ steps: Array<JsonObject> }>(path.join(retryPhase, "index.json"));
const retryAttempts = readFileSync(path.join(retryPhase, "attempts.log"), "utf8").trim().split("\n");
const retryOutput = readJson<JsonObject>(path.join(retryPhase, "step0-output.json"));
assert(retryRun.status === 1, "max retries should exit 1");
assert(retryAttempts.length === 2, "max retries should invoke agent twice");
assert(retryIndex.steps[0]?.status === "error", "max retries should mark step error");
assert(typeof retryIndex.steps[0]?.error_message === "string", "max retries should write error_message");
assert(retryIndex.steps[0]?.failed_at, "max retries should stamp failed_at");
assert(retryOutput.attempt === 2, "max retries should keep final attempt output");
assert(retryOutput.exitCode === 1, "max retries should record failed agent exit code");

if (failures.length) {
  console.error("execute-phase validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("execute-phase validation passed");
