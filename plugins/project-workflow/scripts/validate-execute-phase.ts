#!/usr/bin/env node
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const runner = path.join(repoRoot, "plugins/project-workflow/scripts/execute-phase.ts");
const failures: string[] = [];

function makePhase(status: "pending" | "completed"): string {
  const dir = mkdtempSync(path.join(tmpdir(), "project-workflow-phase-"));
  writeFileSync(path.join(dir, "index.json"), `${JSON.stringify({
    project: "smoke",
    phase: "handoff",
    steps: [
      {
        step: 0,
        name: "first",
        status,
        summary: status === "completed" ? "done" : undefined,
        read_files: ["README.md"],
        claimed_write_set: ["docs/example.md"],
        acceptance_commands: ["node --version"],
      },
    ],
  }, null, 2)}\n`);
  writeFileSync(path.join(dir, "step0.md"), "# Step 0\n\nRun smoke step.\n");
  return dir;
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

const pending = makePhase("pending");
const pendingBefore = readFileSync(path.join(pending, "index.json"), "utf8");
const pendingDryRun = run([pending, "--dry-run"]);
const pendingAfter = readFileSync(path.join(pending, "index.json"), "utf8");
assert(pendingDryRun.status === 0, "pending dry-run should exit 0");
assert(pendingDryRun.stdout.includes("feature-workflow step 실행 agent"), "pending dry-run should build feature-workflow adapter prompt");
assert(pendingDryRun.stdout.includes("Target project root:"), "pending dry-run should include project root");
assert(pendingBefore === pendingAfter, "pending dry-run must not mutate index.json");

const completed = makePhase("completed");
const completedBefore = readFileSync(path.join(completed, "index.json"), "utf8");
const completedDryRun = run([completed, "--dry-run"]);
const completedAfter = readFileSync(path.join(completed, "index.json"), "utf8");
assert(completedDryRun.status === 0, "completed dry-run should exit 0");
assert(completedDryRun.stdout.includes("Phase completed"), "completed dry-run should report completion");
assert(completedBefore === completedAfter, "completed dry-run must not mutate index.json");

const missingCommand = run([pending, "--run"]);
assert(missingCommand.status === 2, "--run without --agent-bin should fail");

const dangerous = run([pending, "--run", "--agent-bin", "claude", "--agent-arg", "-p", "--agent-arg", "--dangerously-skip-permissions"]);
assert(dangerous.status === 2, "dangerous permission-bypass flag should fail");
assert(dangerous.stderr.includes("forbidden agent argument"), "dangerous flag failure should explain the reason");

if (failures.length) {
  console.error("execute-phase validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("execute-phase validation passed");
