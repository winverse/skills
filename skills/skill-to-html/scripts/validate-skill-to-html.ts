#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/skill-to-html";

validateSkillPackage("skill-to-html", skillRoot);

const requiredChecks = [
  ["SKILL.md", "정적 HTML"],
  ["SKILL.md", "요약 화면"],
  ["SKILL.md", "화면에 보이는 일반 설명어는 한국어로 번역한다"],
  ["SKILL.md", "영어 원문이 꼭 필요하면 첫 등장에만"],
  ["SKILL.md", "정확한 파일명, 명령, 코드 식별자"],
  ["SKILL.md", "보기 전환"],
  ["SKILL.md", "단계적 펼침"],
  ["SKILL.md", "inline JavaScript"],
  ["SKILL.md", "외부 CDN"],
  ["SKILL.md", "raw HTML"],
  ["SKILL.md", "event handler"],
  ["SKILL.md", "javascript:"],
  ["SKILL.md", "SkillHtmlModel"],
  ["SKILL.md", "신뢰하지 않는 입력"],
  ["SKILL.md", "신뢰된 템플릿"],
  ["SKILL.md", "하나의 문서 시트"],
  ["SKILL.md", "요약과 단순한 핵심 계약"],
  ["SKILL.md", "선형 리스트"],
  ["SKILL.md", "vbscript:"],
  ["SKILL.md", "<iframe>"],
  ["SKILL.md", "파일과 검증"],
  ["references/visual-guide-standards.md", "정적 요약"],
  ["references/visual-guide-standards.md", "일반 설명어는 한국어"],
  ["references/visual-guide-standards.md", "새 복제본"],
  ["references/visual-guide-standards.md", "실패 분류"],
  ["references/visual-guide-standards.md", "SkillHtmlModel"],
  ["references/visual-guide-standards.md", "신뢰하지 않는 입력"],
  ["references/visual-guide-standards.md", "신뢰된 템플릿"],
  ["references/visual-guide-standards.md", "하나의 문서 시트"],
  ["references/visual-guide-standards.md", "요약과 단순한 핵심 계약"],
  ["references/visual-guide-standards.md", "카드가 아니라 리스트"],
  ["references/visual-guide-standards.md", "간단한 table"],
  ["references/visual-guide-standards.md", "명령 리스트"],
  ["references/visual-guide-standards.md", "외부 script"],
  ["references/visual-guide-standards.md", "읽기 폭"],
  ["skill.html", "정적 요약"],
  ["skill.html", "한국어 우선"],
  ["skill.html", "인터랙션 없음"],
  ["skill.html", "SkillHtmlModel"],
  ["skill.html", "신뢰하지 않는 입력"],
  ["skill.html", "신뢰된 템플릿"],
  ["skill.html", "summary-list"],
  ["skill.html", "contract-list"],
  ["skill.html", "workflow-list"],
  ["skill.html", "rule-table"],
  ["skill.html", "verify-list"],
  ["skill.html", "금지와 허용"],
  ["skill.html", "파일과 검증"],
  ["skill.html", "SKILL.md"],
  ["skill.html", "skill.html"],
  ["../../project-snippets/skill-to-html.md", "정적 요약"],
  ["../../project-snippets/skill-to-html.md", "SkillHtmlModel"],
  ["../../project-snippets/skill-to-html.md", "신뢰하지 않는 입력"],
  ["../../project-snippets/skill-to-html.md", "신뢰된 템플릿"],
  ["../../project-snippets/skill-to-html.md", "하나의 문서 시트"],
  ["../../project-snippets/skill-to-html.md", "요약이나 단순 핵심 계약"],
  ["../../project-snippets/skill-to-html.md", "선형 리스트"],
  ["../../project-snippets/skill-to-html.md", "허용/금지는 table"],
  ["../../project-snippets/skill-to-html.md", "일반 설명어는 한국어"],
  ["../../project-snippets/skill-to-html.md", "인터랙티브 요소를 넣지 않는다"],
  ["../../project-snippets/skill-to-html.md", "외부 CDN"],
  ["../../scripts/validate-skill-html.ts", "scannable"],
  ["agents/openai.yaml", "정적 요약"],
  ["agents/openai.yaml", "SkillHtmlModel"],
  ["agents/openai.yaml", "신뢰하지 않는 입력"],
  ["agents/openai.yaml", "신뢰된 템플릿"],
  ["agents/openai.yaml", "일반 설명어는 한국어"],
  ["agents/openai.yaml", "인터랙티브 요소"],
  ["scripts/skill-to-html-render.spec.ts", "@playwright/test"],
  ["scripts/skill-to-html-render.spec.ts", "script"],
  ["scripts/skill-to-html-render.spec.ts", "button"],
  ["scripts/skill-to-html-render.spec.ts", "정적 요약"],
  ["scripts/validate-skill-to-html-render.ts", "playwright"],
  ["scripts/validate-skill-to-html-render.ts", "SKILL_TO_HTML_ROOT"],
] as const;

const forbiddenChecks = [
  ["SKILL.md", "그림 우선"],
  ["SKILL.md", "애니메이션 중심"],
  ["SKILL.md", "Framer Motion"],
  ["SKILL.md", "GSAP"],
  ["SKILL.md", "mode switch"],
  ["SKILL.md", "click-driven"],
  ["skill.html", "data-view"],
  ["skill.html", "addEventListener"],
  ["skill.html", "<button"],
  ["skill.html", "<script"],
  ["skill.html", "Framer Motion"],
  ["skill.html", "GSAP"],
  ["../../project-snippets/skill-to-html.md", "animated"],
  ["../../project-snippets/skill-to-html.md", "mode switch"],
  ["../../project-snippets/skill-to-html.md", "progressive disclosure"],
  ["agents/openai.yaml", "animated"],
  ["agents/openai.yaml", "mode switches"],
] as const;

const failures: string[] = [];

function resolveTarget(relativePath: string): string {
  return relativePath.startsWith("../..")
    ? path.resolve(skillRoot, relativePath)
    : path.join(skillRoot, relativePath);
}

for (const [relativePath, needle] of requiredChecks) {
  const target = resolveTarget(relativePath);
  if (!existsSync(target)) {
    failures.push(`${relativePath} is missing`);
    continue;
  }
  const text = readFileSync(target, "utf8");
  if (!text.includes(needle)) {
    failures.push(`${relativePath} must include ${needle}`);
  }
}

for (const [relativePath, needle] of forbiddenChecks) {
  const target = resolveTarget(relativePath);
  if (!existsSync(target)) continue;
  const text = readFileSync(target, "utf8");
  if (text.includes(needle)) {
    failures.push(`${relativePath} must not include ${needle}`);
  }
}

const htmlPath = path.join(skillRoot, "skill.html");
if (existsSync(htmlPath)) {
  const html = readFileSync(htmlPath, "utf8");
  const structuralBlocks: Array<[RegExp, string]> = [
    [/<(?:iframe|object|embed|base)\b/i, "skill.html must not contain iframe/object/embed/base elements"],
    [/<meta\b[^>]*\bhttp-equiv\s*=/i, "skill.html must not contain meta http-equiv"],
    [/<[^>]+\son[a-z]+\s*=/i, "skill.html must not contain inline event attributes"],
    [
      /\b(?:href|src)\s*=\s*(['"])\s*(?:javascript:|vbscript:)/i,
      "skill.html must not contain javascript: or vbscript: URL attributes",
    ],
    [/\bsrc\s*=\s*(['"])\s*data:/i, "skill.html must not contain data: src attributes"],
  ];

  for (const [pattern, message] of structuralBlocks) {
    if (pattern.test(html)) failures.push(message);
  }
}

if (failures.length) {
  console.error("skill-to-html validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("skill-to-html validation passed");
