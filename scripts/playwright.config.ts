import { defineConfig } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export default defineConfig({
  testDir: repoRoot,
  outputDir: path.join(repoRoot, ".artifacts/playwright/test-results"),
  reporter: [["line"], ["html", { outputFolder: path.join(repoRoot, ".artifacts/playwright/html-report"), open: "never" }]],
  snapshotPathTemplate: path.join(repoRoot, ".artifacts/playwright/snapshots/{testFilePath}/{arg}{ext}"),
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
});
