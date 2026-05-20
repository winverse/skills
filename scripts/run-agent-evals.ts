#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

type Mode = "blocking" | "advisory";
type Risk = "low" | "medium" | "high";
type Scope =
  | "skill_invocation"
  | "trigger_quality"
  | "workflow"
  | "project-workflow"
  | "feature-workflow"
  | "safety"
  | "cross_agent_portability"
  | "artifact_hygiene"
  | "output_quality"
  | "regression";
type ExampleType = "typical" | "edge" | "adversarial";
type JsonSchemaType = "string" | "number" | "boolean" | "array" | "object";
type JsonSchemaCheck = {
  required?: string[];
  properties?: Record<string, { type: JsonSchemaType }>;
};

type Check =
  | {
      type: "required_text" | "forbidden_text" | "forbidden_command" | "trace_event";
      file: string;
      value: string;
    }
  | {
      type: "required_link_count";
      file: string;
      min: number;
    }
  | {
      type: "required_file_reference";
      file: string;
      value?: string;
      values?: string[];
    }
  | {
      type: "json_schema";
      file: string;
      schema: JsonSchemaCheck;
    }
  | {
      type: "skill_listed_in";
      skill: string;
      files: string[];
    }
  | {
      type: "command_passed";
      command: string[];
    };

type EvalCase = {
  id: string;
  title: string;
  prompt: string;
  scope: Scope;
  expectedSkills: string[];
  forbiddenSkills?: string[];
  agentSurfaces?: string[];
  assumptionDate?: string;
  exampleType?: ExampleType;
  risk: Risk;
  mode: Mode;
  checks: Check[];
};

type CaseResult = {
  caseId: string;
  mode: Mode;
  status: "pass" | "fail";
  failures: string[];
};

const repoRoot = process.cwd();
const args = process.argv.slice(2);
const scopeFilter = valueFor("--scope");
const modeFilter = valueFor("--mode");
const jsonOutput = args.includes("--json");
const casesDir = path.join(repoRoot, "evals/agent/cases");
const errors: string[] = [];
const externalSystemSkills = new Set(["imagegen", "openai-docs", "plugin-creator", "skill-creator", "skill-installer"]);
const pluginBundledSkillPaths = new Map<string, string>([
  ["project-workflow", "plugins/project-workflow/skills/project-workflow/SKILL.md"],
]);

function valueFor(flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function rel(filePath: string): string {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function readRepo(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function instructionPathForSkill(skill: string): string {
  return pluginBundledSkillPaths.get(skill) ?? `skills/${skill}/SKILL.md`;
}

function repoPath(relativePath: string): string {
  const resolved = path.resolve(repoRoot, relativePath);
  if (resolved !== repoRoot && !resolved.startsWith(`${repoRoot}${path.sep}`)) {
    throw new Error(`Path escapes repo root: ${relativePath}`);
  }
  return resolved;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isJsonSchemaCheck(value: unknown): value is JsonSchemaCheck {
  if (!isRecord(value)) return false;
  if (value.required !== undefined && !isStringArray(value.required)) return false;
  if (value.properties !== undefined) {
    if (!isRecord(value.properties)) return false;
    for (const property of Object.values(value.properties)) {
      if (!isRecord(property) || typeof property.type !== "string") return false;
      if (!["string", "number", "boolean", "array", "object"].includes(property.type)) return false;
    }
  }
  return true;
}

function isCheck(value: unknown): value is Check {
  if (!isRecord(value) || typeof value.type !== "string") return false;

  if (
    value.type === "required_text" ||
    value.type === "forbidden_text" ||
    value.type === "forbidden_command" ||
    value.type === "trace_event"
  ) {
    return typeof value.file === "string" && typeof value.value === "string";
  }

  if (value.type === "required_link_count") {
    return typeof value.file === "string" && typeof value.min === "number" && value.min >= 0;
  }

  if (value.type === "required_file_reference") {
    return (
      typeof value.file === "string" &&
      (value.value === undefined || typeof value.value === "string") &&
      (value.values === undefined || isStringArray(value.values)) &&
      (typeof value.value === "string" || isStringArray(value.values))
    );
  }

  if (value.type === "json_schema") {
    return typeof value.file === "string" && isJsonSchemaCheck(value.schema);
  }

  if (value.type === "skill_listed_in") {
    return typeof value.skill === "string" && isStringArray(value.files);
  }

  if (value.type === "command_passed") {
    return isStringArray(value.command);
  }

  return false;
}

function textCheckFile(check: Check): string | null {
  if (
    check.type === "required_text" ||
    check.type === "forbidden_text" ||
    check.type === "forbidden_command" ||
    check.type === "trace_event" ||
    check.type === "required_link_count" ||
    check.type === "required_file_reference" ||
    check.type === "json_schema"
  ) {
    return check.file;
  }
  return null;
}

function parseCase(raw: unknown, source: string, index: number): EvalCase | null {
  const caseErrors: string[] = [];

  if (!isRecord(raw)) {
    errors.push(`${source}[${index}] is not an object`);
    return null;
  }

  const scopes: Scope[] = [
    "skill_invocation",
    "trigger_quality",
    "workflow",
    "project-workflow",
    "feature-workflow",
    "safety",
    "cross_agent_portability",
    "artifact_hygiene",
    "output_quality",
    "regression",
  ];
  const risks: Risk[] = ["low", "medium", "high"];
  const modes: Mode[] = ["blocking", "advisory"];
  const exampleTypes: ExampleType[] = ["typical", "edge", "adversarial"];

  const required = ["id", "title", "prompt", "scope", "risk", "mode", "checks"] as const;
  for (const field of required) {
    if (!(field in raw)) caseErrors.push(`${source}[${index}] missing ${field}`);
  }

  if (typeof raw.id !== "string" || !/^[a-z0-9-]+$/.test(raw.id)) {
    caseErrors.push(`${source}[${index}] id must be kebab-case`);
  }
  if (typeof raw.title !== "string" || !raw.title.trim()) {
    caseErrors.push(`${source}[${index}] title must be non-empty`);
  }
  if (typeof raw.prompt !== "string" || !raw.prompt.trim()) {
    caseErrors.push(`${source}[${index}] prompt must be non-empty`);
  }
  if (typeof raw.scope !== "string" || !scopes.includes(raw.scope as Scope)) {
    caseErrors.push(`${source}[${index}] scope is invalid`);
  }
  if (typeof raw.risk !== "string" || !risks.includes(raw.risk as Risk)) {
    caseErrors.push(`${source}[${index}] risk is invalid`);
  }
  if (typeof raw.mode !== "string" || !modes.includes(raw.mode as Mode)) {
    caseErrors.push(`${source}[${index}] mode is invalid`);
  }
  if (!isStringArray(raw.expectedSkills)) {
    caseErrors.push(`${source}[${index}] expectedSkills must be a string array`);
  }
  if (raw.forbiddenSkills !== undefined && !isStringArray(raw.forbiddenSkills)) {
    caseErrors.push(`${source}[${index}] forbiddenSkills must be a string array`);
  }
  if (raw.agentSurfaces !== undefined && !isStringArray(raw.agentSurfaces)) {
    caseErrors.push(`${source}[${index}] agentSurfaces must be a string array`);
  }
  if (
    raw.assumptionDate !== undefined &&
    (typeof raw.assumptionDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw.assumptionDate))
  ) {
    caseErrors.push(`${source}[${index}] assumptionDate must be YYYY-MM-DD`);
  }
  if (
    raw.exampleType !== undefined &&
    (typeof raw.exampleType !== "string" || !exampleTypes.includes(raw.exampleType as ExampleType))
  ) {
    caseErrors.push(`${source}[${index}] exampleType is invalid`);
  }
  if (!Array.isArray(raw.checks) || !raw.checks.every(isCheck)) {
    caseErrors.push(`${source}[${index}] checks contain an unsupported shape`);
  }
  if (
    (raw.scope === "workflow" || raw.scope === "project-workflow" || raw.scope === "feature-workflow") &&
    Array.isArray(raw.checks) &&
    raw.checks.every(isCheck) &&
    !raw.checks.some((check) => {
      const file = textCheckFile(check);
      return (
        file?.startsWith("evals/agent/fixtures/project-workflow/") ||
        file?.startsWith("evals/agent/fixtures/feature-workflow/")
      );
    })
  ) {
    caseErrors.push(
      `${source}[${index}] workflow cases must check a saved workflow output fixture under evals/agent/fixtures/project-workflow/ or evals/agent/fixtures/feature-workflow/`,
    );
  }

  if (caseErrors.length) {
    errors.push(...caseErrors);
    return null;
  }

  return {
    id: raw.id as string,
    title: raw.title as string,
    prompt: raw.prompt as string,
    scope: raw.scope as Scope,
    expectedSkills: raw.expectedSkills as string[],
    forbiddenSkills: (raw.forbiddenSkills as string[] | undefined) ?? [],
    agentSurfaces: (raw.agentSurfaces as string[] | undefined) ?? [],
    assumptionDate: raw.assumptionDate as string | undefined,
    exampleType: raw.exampleType as ExampleType | undefined,
    risk: raw.risk as Risk,
    mode: raw.mode as Mode,
    checks: raw.checks as Check[],
  };
}

function loadCases(): EvalCase[] {
  if (!existsSync(casesDir)) {
    errors.push("Missing evals/agent/cases");
    return [];
  }

  const cases: EvalCase[] = [];
  for (const fileName of readdirSync(casesDir).filter((name) => name.endsWith(".json")).sort()) {
    const filePath = path.join(casesDir, fileName);
    const source = rel(filePath);
    const raw = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
    if (!Array.isArray(raw)) {
      errors.push(`${source} must contain an array of cases`);
      continue;
    }

    raw.forEach((item, index) => {
      const parsed = parseCase(item, source, index);
      if (parsed) cases.push(parsed);
    });
  }

  return cases;
}

function skillNames(): Set<string> {
  const skillsRoot = path.join(repoRoot, "skills");
  if (!existsSync(skillsRoot)) return new Set();

  return new Set(
    readdirSync(skillsRoot).filter((name) => {
      const fullPath = path.join(skillsRoot, name);
      return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, "SKILL.md"));
    }),
  );
}

function readCheckText(file: string): string | null {
  const fullPath = repoPath(file);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath, "utf8");
}

function countLinks(text: string): number {
  const links = new Set<string>();
  const markdownLinkPattern = /\[[^\]]+\]\((https?:\/\/[^)\s]+)[^)]*\)/g;
  const bareLinkPattern = /https?:\/\/[^\s)\]]+/g;
  for (const match of text.matchAll(markdownLinkPattern)) links.add(match[1]);
  for (const match of text.matchAll(bareLinkPattern)) links.add(match[0]);
  return links.size;
}

function jsonTypeMatches(value: unknown, expected: JsonSchemaType): boolean {
  if (expected === "array") return Array.isArray(value);
  if (expected === "object") return isRecord(value);
  return typeof value === expected;
}

function validateJsonSchema(file: string, schema: JsonSchemaCheck): string | null {
  const fullPath = repoPath(file);
  if (!existsSync(fullPath)) return `${file} does not exist`;

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(fullPath, "utf8")) as unknown;
  } catch (error) {
    return `${file} is not valid JSON${error instanceof Error ? ` (${error.message})` : ""}`;
  }

  if (!isRecord(parsed)) return `${file} must contain a JSON object`;

  for (const field of schema.required ?? []) {
    if (!(field in parsed)) return `${file} missing required JSON field: ${field}`;
  }

  for (const [field, rule] of Object.entries(schema.properties ?? {})) {
    if (field in parsed && !jsonTypeMatches(parsed[field], rule.type)) {
      return `${file} field ${field} must be ${rule.type}`;
    }
  }

  return null;
}

function runCheck(check: Check): string | null {
  if (
    check.type === "required_text" ||
    check.type === "forbidden_text" ||
    check.type === "forbidden_command" ||
    check.type === "trace_event"
  ) {
    const fullPath = repoPath(check.file);
    if (!existsSync(fullPath)) return `${check.file} does not exist`;
    const text = readFileSync(fullPath, "utf8");
    const includes = text.includes(check.value);
    if ((check.type === "required_text" || check.type === "trace_event") && !includes) {
      return `${check.file} missing required text: ${check.value}`;
    }
    if ((check.type === "forbidden_text" || check.type === "forbidden_command") && includes) {
      return `${check.file} includes forbidden text: ${check.value}`;
    }
    return null;
  }

  if (check.type === "required_link_count") {
    const text = readCheckText(check.file);
    if (text === null) return `${check.file} does not exist`;
    const found = countLinks(text);
    if (found < check.min) return `${check.file} has ${found} links, expected at least ${check.min}`;
    return null;
  }

  if (check.type === "required_file_reference") {
    const text = readCheckText(check.file);
    if (text === null) return `${check.file} does not exist`;
    const values = [check.value, ...(check.values ?? [])].filter((item): item is string => typeof item === "string");
    for (const value of values) {
      if (!text.includes(value)) return `${check.file} missing file reference: ${value}`;
    }
    return null;
  }

  if (check.type === "json_schema") {
    return validateJsonSchema(check.file, check.schema);
  }

  if (check.type === "skill_listed_in") {
    for (const file of check.files) {
      const fullPath = repoPath(file);
      if (!existsSync(fullPath)) return `${file} does not exist`;
      if (!readFileSync(fullPath, "utf8").includes(instructionPathForSkill(check.skill))) {
        return `${file} does not list ${check.skill}`;
      }
    }
    return null;
  }

  if (check.type === "command_passed") {
    if (check.command.length === 0) return "command_passed requires a command";
    try {
      execFileSync(check.command[0], check.command.slice(1), {
        cwd: repoRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 30_000,
      });
      return null;
    } catch (error) {
      return `command failed: ${check.command.join(" ")}${error instanceof Error ? ` (${error.message})` : ""}`;
    }
  }

  return "unknown check";
}

function validateCaseReferences(testCase: EvalCase, allSkills: Set<string>): string[] {
  const failures: string[] = [];
  for (const skill of [...testCase.expectedSkills, ...(testCase.forbiddenSkills ?? [])]) {
    if (!allSkills.has(skill) && !externalSystemSkills.has(skill) && !pluginBundledSkillPaths.has(skill)) {
      failures.push(`referenced skill does not exist: ${skill}`);
    }
  }
  return failures;
}

const loadedCases = loadCases();
const seenIds = new Set<string>();
for (const testCase of loadedCases) {
  if (seenIds.has(testCase.id)) errors.push(`Duplicate case id: ${testCase.id}`);
  seenIds.add(testCase.id);
}

if (
  scopeFilter &&
  ![
    "skill_invocation",
    "trigger_quality",
    "workflow",
    "project-workflow",
    "feature-workflow",
    "safety",
    "cross_agent_portability",
    "artifact_hygiene",
    "output_quality",
    "regression",
  ].includes(scopeFilter)
) {
  errors.push(`Invalid --scope value: ${scopeFilter}`);
}

if (modeFilter && !["blocking", "advisory"].includes(modeFilter)) {
  errors.push(`Invalid --mode value: ${modeFilter}`);
}

if (errors.length) {
  console.error("agent eval case loading failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const allSkills = skillNames();
const selectedCases = loadedCases.filter((testCase) => {
  if (scopeFilter && testCase.scope !== scopeFilter) return false;
  if (modeFilter && testCase.mode !== modeFilter) return false;
  return true;
});

const results: CaseResult[] = selectedCases.map((testCase) => {
  const failures = [
    ...validateCaseReferences(testCase, allSkills),
    ...testCase.checks.map(runCheck).filter((failure): failure is string => failure !== null),
  ];
  return {
    caseId: testCase.id,
    mode: testCase.mode,
    status: failures.length ? "fail" : "pass",
    failures,
  };
});

const blockingFailures = results.filter((result) => result.mode === "blocking" && result.status === "fail");
const advisoryFailures = results.filter((result) => result.mode === "advisory" && result.status === "fail");

if (jsonOutput) {
  console.log(JSON.stringify({ cases: selectedCases.length, results }, null, 2));
} else {
  console.log("Agent eval harness");
  console.log(`- Cases: ${selectedCases.length}/${loadedCases.length}`);
  console.log(`- Passing: ${results.filter((result) => result.status === "pass").length}`);
  console.log(`- Blocking failures: ${blockingFailures.length}`);
  console.log(`- Advisory failures: ${advisoryFailures.length}`);

  for (const result of results.filter((item) => item.status === "fail")) {
    console.log(`\n${result.caseId} (${result.mode})`);
    for (const failure of result.failures) console.log(`- ${failure}`);
  }
}

if (blockingFailures.length) {
  process.exit(1);
}
