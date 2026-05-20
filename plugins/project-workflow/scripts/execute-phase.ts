#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

type StepStatus = "pending" | "completed" | "error" | "blocked";

type PhaseStep = {
  step?: number;
  id?: string;
  name?: string;
  title?: string;
  file?: string;
  status: StepStatus;
  summary?: string;
  error_message?: string;
  blocked_reason?: string;
  started_at?: string;
  completed_at?: string;
  failed_at?: string;
  blocked_at?: string;
  read_files?: string[];
  claimed_write_set?: string[];
  acceptance_commands?: string[];
};

type PhaseIndex = {
  project: string;
  phase: string;
  created_at?: string;
  completed_at?: string;
  steps: PhaseStep[];
};

type Options = {
  phaseDir: string;
  projectRoot: string;
  run: boolean;
  agent: "codex" | "custom";
  agentBin?: string;
  agentArgs: string[];
  maxRetries: number;
};

const forbiddenAgentArgs = new Set([
  "--dangerously-skip-permissions",
  "--allow-all",
  "--no-approval",
  "--force",
]);

function usage(): never {
  console.error(`Usage:
  node plugins/project-workflow/scripts/execute-phase.ts <phase-dir> [--dry-run]
  node plugins/project-workflow/scripts/execute-phase.ts <phase-dir> --project-root <target-project-root> [--dry-run]
  node plugins/project-workflow/scripts/execute-phase.ts <phase-dir> --run --agent codex --agent-bin codex --agent-arg exec

Notes:
  - Default is dry-run. It prints the next prompt only.
  - --run requires --agent-bin.
  - Pass each command argument with repeated --agent-arg.
  - Project docs are loaded from --project-root, defaulting to the current working directory.
  - The agent command receives the full prompt on stdin.
  - This runner is Codex-first; custom commands are explicit fallback only.
  - Known permission-bypass flags are rejected.`);
  process.exit(2);
}

function parseArgs(argv: string[]): Options {
  const [phaseDir, ...rest] = argv;
  if (!phaseDir) usage();

  const options: Options = {
    phaseDir,
    projectRoot: process.cwd(),
    run: false,
    agent: "custom",
    agentArgs: [],
    maxRetries: 3,
  };

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === "--dry-run") options.run = false;
    else if (arg === "--run") options.run = true;
    else if (arg === "--agent") {
      const value = rest[++i] as Options["agent"] | undefined;
      if (!value || !["codex", "custom"].includes(value)) usage();
      options.agent = value;
    } else if (arg === "--agent-bin") {
      options.agentBin = rest[++i];
      if (!options.agentBin) usage();
    } else if (arg === "--agent-arg") {
      const value = rest[++i];
      if (!value) usage();
      options.agentArgs.push(value);
    } else if (arg === "--project-root") {
      options.projectRoot = path.resolve(rest[++i] ?? "");
      if (!options.projectRoot) usage();
    } else if (arg === "--max-retries") {
      const value = Number(rest[++i]);
      if (!Number.isInteger(value) || value < 1 || value > 10) usage();
      options.maxRetries = value;
    } else {
      usage();
    }
  }

  if (options.run && !options.agentBin) {
    console.error("ERROR: --run requires --agent-bin.");
    usage();
  }

  for (const value of [options.agentBin, ...options.agentArgs]) {
    if (value && forbiddenAgentArgs.has(value)) {
      console.error(`ERROR: forbidden agent argument: ${value}`);
      process.exit(2);
    }
  }

  return options;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown): void {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function stamp(): string {
  return new Date().toISOString();
}

function findPhaseDir(input: string): string {
  const direct = path.resolve(input);
  if (existsSync(path.join(direct, "index.json"))) return direct;

  const scratch = path.resolve(".scratch", input, "phases");
  if (existsSync(path.join(scratch, "index.json"))) return scratch;

  const phases = path.resolve("phases", input);
  if (existsSync(path.join(phases, "index.json"))) return phases;

  console.error(`ERROR: phase index not found for ${input}`);
  process.exit(1);
}

function loadDocs(projectRoot: string): string {
  const candidates = [
    "AGENTS.md",
    "CONTEXT.md",
    "docs/PRD.md",
    "docs/ARCHITECTURE.md",
    "docs/ADR.md",
    "docs/design.md",
    "design.md",
  ];

  return candidates
    .map((candidate) => ({ candidate, fullPath: path.join(projectRoot, candidate) }))
    .filter(({ fullPath }) => existsSync(fullPath))
    .map(({ candidate, fullPath }) => `## ${candidate}\n\n${readFileSync(fullPath, "utf8")}`)
    .join("\n\n---\n\n");
}

function completedSummary(index: PhaseIndex): string {
  const lines = index.steps
    .filter((step) => step.status === "completed" && step.summary)
    .map((step, position) => `- Step ${stepLabel(step, position)} (${stepName(step, position)}): ${step.summary}`);
  return lines.length ? `## 완료된 이전 step\n\n${lines.join("\n")}` : "";
}

function stepLabel(step: PhaseStep, position: number): string {
  if (typeof step.step === "number") return String(step.step);
  if (step.id) return step.id;
  return String(position + 1);
}

function stepName(step: PhaseStep, position: number): string {
  return step.name ?? step.title ?? step.id ?? `step ${position + 1}`;
}

function stepFileName(step: PhaseStep, position: number): string {
  if (step.file) return step.file;
  if (typeof step.step === "number") return `step${step.step}.md`;
  if (step.id) return `${step.id}.md`;
  return `step${position + 1}.md`;
}

function stepOutputStem(step: PhaseStep, position: number): string {
  const stem = typeof step.step === "number" ? `step${step.step}` : step.id ?? `step${position + 1}`;
  return stem.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function findMatchingStep(steps: PhaseStep[], original: PhaseStep, originalPosition: number): PhaseStep | undefined {
  if (typeof original.step === "number") {
    const byNumber = steps.find((candidate) => candidate.step === original.step);
    if (byNumber) return byNumber;
  }
  if (original.id) {
    const byId = steps.find((candidate) => candidate.id === original.id);
    if (byId) return byId;
  }
  return steps[originalPosition];
}

function buildPrompt(
  projectRoot: string,
  phaseDir: string,
  index: PhaseIndex,
  step: PhaseStep,
  stepPosition: number,
  previousError?: string,
): string {
  const stepFile = path.join(phaseDir, stepFileName(step, stepPosition));
  const stepBody = existsSync(stepFile) ? readFileSync(stepFile, "utf8") : "";
  const docs = loadDocs(projectRoot);
  const prior = completedSummary(index);
  const retry = previousError
    ? `## 이전 실패\n\n${previousError}\n\n이 실패 원인을 먼저 반영하고 같은 실수를 반복하지 마라.`
    : "";

  return [
    `# ${index.project} / ${index.phase} / Step ${stepLabel(step, stepPosition)}: ${stepName(step, stepPosition)}`,
    `Target project root: ${projectRoot}`,
    "당신은 이 target project의 Codex feature-workflow step 실행 agent다. Codex instruction surface와 project docs를 기준으로 작업하라.",
    docs,
    prior,
    retry,
    "## 실행 규칙",
    "- 이 step에 명시된 범위만 수행한다.",
    "- project-workflow가 만든 초기 셋팅 산출물을 읽고, production edit은 feature-workflow의 lane ownership과 검증 규칙을 따른다.",
    "- 먼저 read_files와 기존 코드를 읽고, claimed_write_set 밖의 production file은 수정하지 않는다.",
    "- Acceptance Criteria는 실제 명령으로 실행하고 결과를 기록한다.",
    "- 성공하면 index.json의 해당 step을 completed로 바꾸고 summary를 한 줄로 쓴다.",
    "- 사용자 개입이 필요하면 blocked와 blocked_reason을 쓴다.",
    "- 실패하면 error와 error_message를 구체적으로 쓴다.",
    "## Step 정의",
    stepBody || JSON.stringify(step, null, 2),
  ].filter(Boolean).join("\n\n---\n\n");
}

function runAgent(bin: string, args: string[], prompt: string): { code: number; stdout: string; stderr: string } {
  const result = spawnSync(bin, args, {
    input: prompt,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    shell: false,
  });

  return {
    code: typeof result.status === "number" ? result.status : 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? String(result.error ?? ""),
  };
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const phaseDir = findPhaseDir(options.phaseDir);
  const indexFile = path.join(phaseDir, "index.json");
  const index = readJson<PhaseIndex>(indexFile);

  const blockedIndex = index.steps.findIndex((candidate) => candidate.status === "blocked");
  if (blockedIndex >= 0) {
    const blocked = index.steps[blockedIndex];
    console.error(`BLOCKED: Step ${stepLabel(blocked, blockedIndex)} ${stepName(blocked, blockedIndex)}: ${blocked.blocked_reason ?? "reason missing"}`);
    process.exit(2);
  }

  const failedIndex = index.steps.findIndex((candidate) => candidate.status === "error");
  if (failedIndex >= 0) {
    const failed = index.steps[failedIndex];
    console.error(`ERROR: Step ${stepLabel(failed, failedIndex)} ${stepName(failed, failedIndex)}: ${failed.error_message ?? "message missing"}`);
    process.exit(1);
  }

  const stepIndex = index.steps.findIndex((candidate) => candidate.status === "pending");
  if (stepIndex < 0) {
    if (!options.run) {
      console.log(`Phase completed: ${index.phase}`);
      return;
    }
    index.completed_at = index.completed_at ?? stamp();
    writeJson(indexFile, index);
    console.log(`Phase completed: ${index.phase}`);
    return;
  }

  const step = index.steps[stepIndex];
  const prompt = buildPrompt(options.projectRoot, phaseDir, index, step, stepIndex);
  if (!options.run) {
    console.log(prompt);
    return;
  }

  if (!index.created_at) {
    index.created_at = stamp();
  }
  step.started_at = step.started_at ?? stamp();
  writeJson(indexFile, index);

  for (let attempt = 1; attempt <= options.maxRetries; attempt += 1) {
    const result = runAgent(options.agentBin!, options.agentArgs, prompt);
    const outputFile = path.join(phaseDir, `${stepOutputStem(step, stepIndex)}-output.json`);
    writeJson(outputFile, {
      step: stepLabel(step, stepIndex),
      name: stepName(step, stepIndex),
      agent: options.agent,
      command: [options.agentBin, ...options.agentArgs].join(" "),
      argv: [options.agentBin, ...options.agentArgs],
      attempt,
      exitCode: result.code,
      stdout: result.stdout,
      stderr: result.stderr,
      finished_at: stamp(),
    });

    const updated = readJson<PhaseIndex>(indexFile);
    const current = findMatchingStep(updated.steps, step, stepIndex);
    if (current?.status === "completed") {
      current.completed_at = current.completed_at ?? stamp();
      writeJson(indexFile, updated);
      console.log(`completed: step ${stepLabel(step, stepIndex)} ${stepName(step, stepIndex)}`);
      return;
    }
    if (current?.status === "blocked") {
      current.blocked_at = current.blocked_at ?? stamp();
      writeJson(indexFile, updated);
      console.error(`blocked: step ${stepLabel(step, stepIndex)} ${stepName(step, stepIndex)}`);
      process.exit(2);
    }
    if (attempt === options.maxRetries) {
      if (current) {
        current.status = "error";
        current.error_message = current.error_message ?? `Agent command failed after ${options.maxRetries} attempts.`;
        current.failed_at = stamp();
      }
      writeJson(indexFile, updated);
      console.error(`failed: step ${stepLabel(step, stepIndex)} ${stepName(step, stepIndex)}`);
      process.exit(1);
    }
  }
}

main();
