#!/usr/bin/env node
import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

const skillRoot = path.resolve(process.argv[2] ?? "skills/skill-to-html");
const specPath = path.join(skillRoot, "scripts/skill-to-html-render.spec.ts");

if (!existsSync(path.join(skillRoot, "skill.html"))) {
  console.error(`missing skill.html: ${skillRoot}`);
  process.exit(1);
}

if (!existsSync(specPath)) {
  console.error(`missing Playwright render spec: ${specPath}`);
  process.exit(1);
}

const result = spawnSync(
  "npx",
  ["playwright", "test", specPath, "--browser=chromium", "--reporter=line"],
  {
    cwd: path.resolve(skillRoot, "../.."),
    env: {
      ...process.env,
      SKILL_TO_HTML_ROOT: skillRoot,
    },
    stdio: "inherit",
  },
);

if (result.error) {
  console.error(`failed to run Playwright render test: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
