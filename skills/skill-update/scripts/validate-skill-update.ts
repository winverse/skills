#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/skill-update";
const repoRoot = path.resolve(skillRoot, "../..");

validateSkillPackage("skill-update", skillRoot);

const requiredChecks = [
  ["SKILL.md", "original/upstream provenance preflight"],
  ["SKILL.md", "docs/update-source-registry.md"],
  ["SKILL.md", ".gitmodules"],
  ["SKILL.md", "Plugin update list"],
  ["SKILL.md", "`adopt`, `adapt`, `reject`, `defer`"],
  ["SKILL.md", "source URL, checked date, upstream version/commit"],
  ["SKILL.md", "plugin package, MCP config, submodule 자체를 incidental하게 업데이트하지 않는다"],
  ["SKILL.md", "plugin update lane"],
  ["SKILL.md", "dependency update sweep"],
  ["SKILL.md", "project-workflow"],
  ["SKILL.md", "feature-workflow"],
  ["SKILL.md", "scripts/validate-plugins.ts"],
  ["SKILL.md", "SVG arrow endpoint"],
  ["SKILL.md", "overflow, text overlap"],
  ["references/update-checklist.md", "docs/update-source-registry.md"],
  ["references/update-checklist.md", ".gitmodules"],
  ["references/update-checklist.md", "Plugin update list"],
  ["references/update-checklist.md", "scripts/validate-plugins.ts"],
  ["references/update-checklist.md", "plugin update lane"],
  ["references/update-checklist.md", "dependency update sweep"],
  ["references/update-checklist.md", "workflow primitive lane"],
  ["references/update-checklist.md", "넓은 범위 표가 2열 layout 안에서 깨짐"],
  ["references/update-checklist.md", "`skill-update` 호출 자체가 original/upstream provenance preflight"],
  ["references/update-checklist.md", "source URL, checked date, upstream version/commit"],
  ["references/update-checklist.md", "plugin metadata를 원본 증거로 읽는 것을 plugin 자체 업데이트 권한으로 오해함"],
  ["agents/openai.yaml", "every invocation starts with original/upstream provenance preflight"],
  ["agents/openai.yaml", "docs/update-source-registry.md"],
  ["agents/openai.yaml", ".gitmodules"],
  ["agents/openai.yaml", "dependency update sweep"],
  ["agents/openai.yaml", "SVG arrow endpoints"],
  ["skill.html", "원본 delta 분류"],
  ["skill.html", "레지스트리"],
  ["skill.html", "Plugin update list"],
  ["skill.html", "Dependency update sweep"],
  ["skill.html", "source package, primitive name, adopted role"],
  ["skill.html", "adopt"],
  ["skill.html", "adapt"],
  ["skill.html", "reject"],
  ["skill.html", "defer"],
  ["skill.html", "SVG arrow endpoint"],
  ["../../docs/update-source-registry.md", ".gitmodules"],
  ["../../docs/update-source-registry.md", "## Dependency update sweep"],
  ["../../docs/update-source-registry.md", "Vendored plugin lane"],
  ["../../docs/update-source-registry.md", "Repo-owned plugin lane"],
  ["../../docs/update-source-registry.md", "Workflow primitive lane"],
  ["../../docs/update-source-registry.md", "## Plugin update list"],
  ["../../docs/update-source-registry.md", "workflow provenance-only primitive"],
  ["../../project-snippets/skill-update.md", "verify the original with `web-research` before editing the local package"],
  ["../../project-snippets/skill-update.md", "Read `docs/update-source-registry.md` first"],
  ["../../project-snippets/skill-update.md", "`.gitmodules` as the canonical source"],
  ["../../project-snippets/skill-update.md", "Treat every `skill-update` invocation as an original/upstream provenance preflight"],
  ["../../project-snippets/skill-update.md", "Use `scripts/validate-plugins.ts`"],
  ["../../project-snippets/skill-update.md", "plugin update lane"],
  ["../../project-snippets/skill-update.md", "dependency update sweep"],
  ["../../project-snippets/base.md", "verify that source with `web-research` first"],
  ["../../project-snippets/base.md", "read `docs/update-source-registry.md` first"],
  ["../../project-snippets/base.md", "`.gitmodules` as the canonical source"],
  ["../../project-snippets/base.md", "original/upstream provenance preflight"],
  ["../../project-snippets/base.md", "plugin update lane"],
  ["../../project-snippets/base.md", "dependency update sweep"],
  ["../../project-snippets/claude-base.md", "verify that source with `web-research` first"],
  ["../../project-snippets/claude-base.md", "read `docs/update-source-registry.md` first"],
  ["../../project-snippets/claude-base.md", "`.gitmodules` as the canonical source"],
  ["../../project-snippets/claude-base.md", "original/upstream provenance preflight"],
  ["../../project-snippets/claude-base.md", "plugin update lane"],
  ["../../project-snippets/claude-base.md", "dependency update sweep"],
] as const;

const failures: string[] = [];
for (const [relativePath, needle] of requiredChecks) {
  const target = relativePath.startsWith("../..")
    ? path.join(repoRoot, relativePath.slice(6))
    : path.join(skillRoot, relativePath);
  const text = readFileSync(target, "utf8");
  if (!text.includes(needle)) {
    failures.push(`${relativePath} must include ${needle}`);
  }
}

if (failures.length) {
  console.error("skill-update validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
