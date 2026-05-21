#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/markdown-to-html";

validateSkillPackage("markdown-to-html", skillRoot);

const requiredChecks = [
  ["SKILL.md", "script 없는 HTML"],
  ["SKILL.md", "Markdown 문서를"],
  ["SKILL.md", "화면에 보이는 일반 설명어는 한국어로 쓴다"],
  ["SKILL.md", "영어 원문이 꼭 필요하면 첫 등장에만"],
  ["SKILL.md", "정확한 파일명, 명령, 코드 식별자"],
  ["SKILL.md", "보기 전환"],
  ["SKILL.md", "단계적 펼침"],
  ["SKILL.md", "inline JavaScript"],
  ["SKILL.md", "외부 CDN"],
  ["SKILL.md", "raw HTML"],
  ["SKILL.md", "event handler"],
  ["SKILL.md", "javascript:"],
  ["SKILL.md", "Markdown AST"],
  ["SKILL.md", "token stream"],
  ["SKILL.md", "MarkdownHtmlModel"],
  ["SKILL.md", "실행 가능한 HTML"],
  ["SKILL.md", "신뢰된 템플릿"],
  ["SKILL.md", "allowlist sanitizer"],
  ["SKILL.md", "URL은 `http:`, `https:`, `mailto:`"],
  ["SKILL.md", "mode 기준"],
  ["SKILL.md", "스킬 HTML mode"],
  ["SKILL.md", "일반 Markdown 문서 mode"],
  ["SKILL.md", "섹션끼리는 충분한 margin"],
  ["SKILL.md", "불필요한 중첩 card"],
  ["SKILL.md", "요약과 단순한 중요 기준"],
  ["SKILL.md", "UI 설계 의도나 레이아웃 설명"],
  ["SKILL.md", "보이는 문장은 스킬 원문에서 뽑은 의미"],
  ["SKILL.md", "선형 리스트"],
  ["SKILL.md", "표는 비교 축"],
  ["SKILL.md", "텍스트 heading과 table 구조"],
  ["SKILL.md", "chart library"],
  ["SKILL.md", "Chart.js"],
  ["SKILL.md", "Observable Plot"],
  ["SKILL.md", "D3"],
  ["SKILL.md", "vbscript:"],
  ["SKILL.md", "<iframe>"],
  ["SKILL.md", "보안 경계"],
  ["SKILL.md", "파일과 검증"],
  ["references/visual-guide-standards.md", "짧은 HTML"],
  ["references/visual-guide-standards.md", "일반 설명어는 한국어"],
  ["references/visual-guide-standards.md", "새 복제본"],
  ["references/visual-guide-standards.md", "실패 분류"],
  ["references/visual-guide-standards.md", "MarkdownHtmlModel"],
  ["references/visual-guide-standards.md", "내용만 읽고"],
  ["references/visual-guide-standards.md", "실행 가능한 HTML"],
  ["references/visual-guide-standards.md", "신뢰된 템플릿"],
  ["references/visual-guide-standards.md", "allowlist sanitizer"],
  ["references/visual-guide-standards.md", "URL"],
  ["references/visual-guide-standards.md", "diagram"],
  ["references/visual-guide-standards.md", "mode 기준"],
  ["references/visual-guide-standards.md", "스킬 HTML mode"],
  ["references/visual-guide-standards.md", "일반 Markdown 문서 mode"],
  ["references/visual-guide-standards.md", "섹션끼리는 충분한 margin"],
  ["references/visual-guide-standards.md", "불필요한 중첩 card"],
  ["references/visual-guide-standards.md", "요약과 단순한 중요 기준"],
  ["references/visual-guide-standards.md", "UI 설계 의도"],
  ["references/visual-guide-standards.md", "보이는 문장은 스킬 원문에서 뽑은 의미"],
  ["references/visual-guide-standards.md", "카드가 아니라 리스트"],
  ["references/visual-guide-standards.md", "간단한 table"],
  ["references/visual-guide-standards.md", "명령 리스트"],
  ["references/visual-guide-standards.md", "표는 비교 축"],
  ["references/visual-guide-standards.md", "텍스트 heading과 간단한 table 구조"],
  ["references/visual-guide-standards.md", "chart library"],
  ["references/visual-guide-standards.md", "Chart.js"],
  ["references/visual-guide-standards.md", "Observable Plot"],
  ["references/visual-guide-standards.md", "D3"],
  ["references/visual-guide-standards.md", "외부 script"],
  ["references/visual-guide-standards.md", "읽기 폭"],
  ["references/markdown-rendering-research.md", "CommonMark"],
  ["references/markdown-rendering-research.md", "markdown-it"],
  ["references/markdown-rendering-research.md", "remark-parse"],
  ["references/markdown-rendering-research.md", "rehype-sanitize"],
  ["references/markdown-rendering-research.md", "DOMPurify"],
  ["references/markdown-rendering-research.md", "OWASP"],
  ["fixtures/unsafe-markdown.md", "javascript:"],
  ["fixtures/unsafe-markdown.md", "vbscript:"],
  ["fixtures/unsafe-markdown.md", "<iframe"],
  ["fixtures/unsafe-markdown.md", "onerror="],
  ["fixtures/expected-boundary.json", "blockedNeedles"],
  ["fixtures/expected-boundary.json", "allowedProtocols"],
  ["fixtures/expected-boundary.json", "requiredModelFields"],
  ["skill.html", "Markdown parse"],
  ["skill.html", "스킬 HTML mode"],
  ["skill.html", "한국어 우선"],
  ["skill.html", "인터랙션 없음"],
  ["skill.html", "MarkdownHtmlModel"],
  ["skill.html", "신뢰된 템플릿"],
  ["skill.html", "allowlist sanitizer"],
  ["skill.html", "summary-list"],
  ["skill.html", "contract-list"],
  ["skill.html", "중요한 기준"],
  ["skill.html", "workflow-list"],
  ["skill.html", "rule-zones"],
  ["skill.html", "rule-zone"],
  ["skill.html", "rule-table"],
  ["skill.html", "verify-list"],
  ["skill.html", "meta-line"],
  ["skill.html", "조건부 허용"],
  ["skill.html", "실행/외부 의존"],
  ["skill.html", "보안 경계"],
  ["skill.html", "본문 자기해설"],
  ["skill.html", "URL 제한"],
  ["skill.html", "markdown-rendering-research.md"],
  ["skill.html", "unsafe-markdown.md"],
  ["skill.html", "expected-boundary.json"],
  ["skill.html", "파일과 검증"],
  ["skill.html", "SKILL.md"],
  ["skill.html", "skill.html"],
  ["../../project-snippets/markdown-to-html.md", "MarkdownHtmlModel"],
  ["../../project-snippets/markdown-to-html.md", "skill HTML mode"],
  ["../../project-snippets/markdown-to-html.md", "general Markdown document mode"],
  ["../../project-snippets/markdown-to-html.md", "allowed URL protocols"],
  ["../../project-snippets/markdown-to-html.md", "raw HTML"],
  ["../../project-snippets/markdown-to-html.md", "allowlist sanitizer"],
  ["../../project-snippets/markdown-to-html.md", "trusted template"],
  ["../../project-snippets/markdown-to-html.md", "섹션끼리는 충분한 margin"],
  ["../../project-snippets/markdown-to-html.md", "불필요한 중첩 card"],
  ["../../project-snippets/markdown-to-html.md", "요약이나 단순 중요 기준"],
  ["../../project-snippets/markdown-to-html.md", "UI design rationale"],
  ["../../project-snippets/markdown-to-html.md", "Visible sentences should contain only meaning"],
  ["../../project-snippets/markdown-to-html.md", "선형 리스트"],
  ["../../project-snippets/markdown-to-html.md", "허용/금지는 텍스트 heading과 table 구조"],
  ["../../project-snippets/markdown-to-html.md", "comparison axes"],
  ["../../project-snippets/markdown-to-html.md", "Chart.js"],
  ["../../project-snippets/markdown-to-html.md", "Observable Plot"],
  ["../../project-snippets/markdown-to-html.md", "D3"],
  ["../../project-snippets/markdown-to-html.md", "일반 설명어는 한국어"],
  ["../../project-snippets/markdown-to-html.md", "인터랙티브 요소를 넣지 않는다"],
  ["../../project-snippets/markdown-to-html.md", "외부 CDN"],
  ["../../scripts/validate-skill-html.ts", "scannable"],
  ["agents/openai.yaml", "short, safe"],
  ["agents/openai.yaml", "default_prompt: >-"],
  ["agents/openai.yaml", "skill HTML mode"],
  ["agents/openai.yaml", "general Markdown document mode"],
  ["agents/openai.yaml", "MarkdownHtmlModel"],
  ["agents/openai.yaml", "raw HTML"],
  ["agents/openai.yaml", "allowlist sanitizer"],
  ["agents/openai.yaml", "trusted template"],
  ["agents/openai.yaml", "Chart.js"],
  ["agents/openai.yaml", "Observable Plot"],
  ["agents/openai.yaml", "D3"],
  ["agents/openai.yaml", "허용/금지는 텍스트 heading과 table 구조"],
  ["agents/openai.yaml", "Do not put UI design rationale"],
  ["agents/openai.yaml", "visible sentences should contain only source-derived meaning"],
  ["agents/openai.yaml", "Visible general prose should be Korean"],
  ["agents/openai.yaml", "인터랙티브 요소"],
  ["scripts/markdown-to-html-render.spec.ts", "@playwright/test"],
  ["scripts/markdown-to-html-render.spec.ts", "script"],
  ["scripts/markdown-to-html-render.spec.ts", "button"],
  ["scripts/markdown-to-html-render.spec.ts", "rule-zone-heading span"],
  ["scripts/validate-markdown-to-html-render.ts", "playwright"],
  ["scripts/validate-markdown-to-html-render.ts", "MARKDOWN_TO_HTML_ROOT"],
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
  ["skill.html", "class=\"badges\""],
  ["skill.html", "class=\"badge\""],
  ["skill.html", "class=\"rule-copy\""],
  ["skill.html", "색만으로 판정을 구분"],
  ["skill.html", "색만으로 구분"],
  ["skill.html", "색만으로 표시"],
  ["skill.html", "구역 안에서 항목과 기준"],
  ["skill.html", "먼저 나눈 뒤"],
  ["skill.html", "정적 요약"],
  ["skill.html", "정적 요약에 바로 쓸 수 있음"],
  ["skill.html", "프로젝트 조건이 맞을 때만 사용"],
  ["skill.html", "정적 요약에 넣지 않음"],
  ["skill.html", "간이 차트"],
  ["skill.html", "Chart.js"],
  ["skill.html", "Observable Plot"],
  ["skill.html", "D3"],
  ["skill.html", "금지와 허용"],
  ["skill.html", "SkillHtmlModel"],
  ["skill.html", "Framer Motion"],
  ["skill.html", "GSAP"],
  ["../../project-snippets/markdown-to-html.md", "animated"],
  ["../../project-snippets/markdown-to-html.md", "mode switch"],
  ["../../project-snippets/markdown-to-html.md", "progressive disclosure"],
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

const unsafeFixturePath = path.join(skillRoot, "fixtures/unsafe-markdown.md");
const boundaryFixturePath = path.join(skillRoot, "fixtures/expected-boundary.json");
if (existsSync(unsafeFixturePath) && existsSync(boundaryFixturePath) && existsSync(htmlPath)) {
  const unsafeMarkdown = readFileSync(unsafeFixturePath, "utf8");
  const boundary = JSON.parse(readFileSync(boundaryFixturePath, "utf8")) as {
    allowedProtocols?: unknown;
    blockedNeedles?: unknown;
    requiredModelFields?: unknown;
  };
  const html = readFileSync(htmlPath, "utf8");

  if (!Array.isArray(boundary.blockedNeedles) || !boundary.blockedNeedles.every((item) => typeof item === "string")) {
    failures.push("fixtures/expected-boundary.json must define string[] blockedNeedles");
  } else {
    for (const needle of boundary.blockedNeedles) {
      if (!unsafeMarkdown.includes(needle)) {
        failures.push(`fixtures/unsafe-markdown.md must include blocked sample ${needle}`);
      }
      if (html.includes(needle)) {
        failures.push(`skill.html must not include unsafe fixture payload ${needle}`);
      }
    }
  }

  if (
    !Array.isArray(boundary.allowedProtocols) ||
    !["http:", "https:", "mailto:", "relative"].every((protocol) => boundary.allowedProtocols?.includes(protocol))
  ) {
    failures.push("fixtures/expected-boundary.json must list http:, https:, mailto:, and relative allowed protocols");
  }

  if (
    !Array.isArray(boundary.requiredModelFields) ||
    !["name", "purpose", "input", "output", "criteria", "workflow", "guardrails", "files", "validation"].every((field) =>
      boundary.requiredModelFields?.includes(field),
    )
  ) {
    failures.push("fixtures/expected-boundary.json must list required MarkdownHtmlModel fields");
  }
}

if (failures.length) {
  console.error("markdown-to-html validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("markdown-to-html validation passed");
