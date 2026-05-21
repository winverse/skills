#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.argv[2] ?? process.cwd());
const errors: string[] = [];

function rel(filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function read(filePath: string): string {
  return readFileSync(filePath, "utf8");
}

function skillDirs(): string[] {
  const skillsRoot = path.join(root, "skills");
  if (!existsSync(skillsRoot)) return [];

  return readdirSync(skillsRoot)
    .filter((name) => {
      const fullPath = path.join(skillsRoot, name);
      return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, "SKILL.md"));
    })
    .map((name) => path.join(skillsRoot, name))
    .sort();
}

function fail(skillPath: string, message: string): void {
  errors.push(`${rel(skillPath)}: ${message}`);
}

function countMatches(text: string, pattern: RegExp): number {
  return [...text.matchAll(pattern)].length;
}

function hasAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function parseAttributes(tag: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const match of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)="([^"]*)"/g)) {
    attributes[match[1]] = match[2];
  }
  return attributes;
}

function parseNumber(value: string | undefined): number | undefined {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : undefined;
}

type Point = {
  x: number;
  y: number;
};

type Rect = Point & {
  width: number;
  height: number;
};

function parsePathEndpoint(d: string): Point | undefined {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  if (!tokens) return undefined;

  let index = 0;
  let command = "";
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let last: Point | undefined;

  const isCommand = (value: string | undefined): boolean => Boolean(value && /^[a-zA-Z]$/.test(value));
  const canRead = (count: number): boolean => index + count <= tokens.length && !isCommand(tokens[index]);
  const read = (): number => Number.parseFloat(tokens[index++]);
  const moveTo = (nextX: number, nextY: number, relative: boolean): void => {
    x = relative ? x + nextX : nextX;
    y = relative ? y + nextY : nextY;
    last = { x, y };
  };

  while (index < tokens.length) {
    if (isCommand(tokens[index])) command = tokens[index++];
    if (!command) return undefined;

    const relative = command === command.toLowerCase();
    const upper = command.toUpperCase();

    if (upper === "M" || upper === "L" || upper === "T") {
      while (canRead(2)) {
        moveTo(read(), read(), relative);
        if (upper === "M") {
          startX = x;
          startY = y;
          command = relative ? "l" : "L";
        }
      }
      continue;
    }

    if (upper === "H") {
      while (canRead(1)) {
        const nextX = read();
        x = relative ? x + nextX : nextX;
        last = { x, y };
      }
      continue;
    }

    if (upper === "V") {
      while (canRead(1)) {
        const nextY = read();
        y = relative ? y + nextY : nextY;
        last = { x, y };
      }
      continue;
    }

    if (upper === "C") {
      while (canRead(6)) {
        read();
        read();
        read();
        read();
        moveTo(read(), read(), relative);
      }
      continue;
    }

    if (upper === "S" || upper === "Q") {
      while (canRead(4)) {
        read();
        read();
        moveTo(read(), read(), relative);
      }
      continue;
    }

    if (upper === "A") {
      while (canRead(7)) {
        read();
        read();
        read();
        read();
        read();
        moveTo(read(), read(), relative);
      }
      continue;
    }

    if (upper === "Z") {
      x = startX;
      y = startY;
      last = { x, y };
      continue;
    }

    return undefined;
  }

  return last;
}

function isNearRect(point: Point, rect: Rect, tolerance: number): boolean {
  return (
    point.x >= rect.x - tolerance &&
    point.x <= rect.x + rect.width + tolerance &&
    point.y >= rect.y - tolerance &&
    point.y <= rect.y + rect.height + tolerance
  );
}

function stripTags(text: string): string {
  return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function visibleLabelTexts(html: string): string[] {
  const labels: string[] = [];
  const patterns = [
    /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi,
    /<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi,
    /<span[^>]*class="[^"]*(?:tag|badge|pill|map-title|chip)[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
    /<div[^>]*class="[^"]*(?:map-title|tag|badge|pill|chip)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    /<text[^>]*>([\s\S]*?)<\/text>/gi,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const label = stripTags(match[1]);
      if (label) labels.push(label);
    }
  }

  return labels;
}

function validateLocalLinks(skillPath: string, html: string): void {
  const hrefPattern = /href="([^"]+)"/g;
  for (const match of html.matchAll(hrefPattern)) {
    const href = match[1];
    if (/^(#|data:|mailto:)/.test(href)) continue;
    if (/^(https?:|\/\/)/.test(href)) {
      fail(skillPath, `external link in skill.html: ${href}`);
      continue;
    }

    const target = path.resolve(skillPath, href);
    if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
      fail(skillPath, `href escapes repo root: ${href}`);
      continue;
    }

    if (!existsSync(target)) {
      fail(skillPath, `broken local href: ${href}`);
    }
  }
}

function validateScriptSafety(skillPath: string, html: string): void {
  for (const scriptMatch of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = parseAttributes(scriptMatch[1] ?? "");
    const body = scriptMatch[2] ?? "";

    if (attributes.src) {
      fail(skillPath, `external script src in skill.html: ${attributes.src}`);
      continue;
    }

    const forbiddenPatterns = [
      ["network fetch", /\bfetch\s*\(/],
      ["XMLHttpRequest", /\bXMLHttpRequest\b/],
      ["WebSocket", /\bWebSocket\b/],
      ["EventSource", /\bEventSource\b/],
      ["sendBeacon", /\bnavigator\.sendBeacon\b/],
      ["dynamic import", /\bimport\s*\(/],
      ["eval", /\beval\s*\(/],
      ["Function constructor", /\bnew\s+Function\b/],
      ["document.cookie", /\bdocument\.cookie\b/],
      ["localStorage", /\blocalStorage\b/],
      ["sessionStorage", /\bsessionStorage\b/],
    ] as const;

    for (const [label, pattern] of forbiddenPatterns) {
      if (pattern.test(body)) {
        fail(skillPath, `inline script should not use ${label}`);
        break;
      }
    }
  }
}

function validateWideVisualStructure(skillPath: string, html: string): void {
  if (/<div[^>]*class="[^"]*\btwo\b[^"]*"[^>]*>[\s\S]{0,4000}<div[^>]*class="[^"]*\bscope\b/.test(html)) {
    fail(skillPath, "wide scope table should not be nested inside a two-column layout");
  }
}

function validateReadableCardGrids(skillPath: string, html: string): void {
  const contractsBlock = /\.contracts\s*\{(?<body>[^}]*)\}/i.exec(html)?.groups?.body ?? "";
  if (contractsBlock) {
    if (/grid-template-columns\s*:\s*repeat\(\s*5\s*,/i.test(contractsBlock)) {
      fail(skillPath, "contract card grids must use readable minmax width and wrap instead of forcing five columns");
    }

    const fixedFourColumnMatch = /grid-template-columns\s*:\s*repeat\(\s*4\s*,\s*(?:1fr|minmax\(\s*0\b)/i;
    if (fixedFourColumnMatch.test(contractsBlock)) {
      fail(skillPath, "contract card grids must use readable minmax width, not four narrow equal columns");
    }

    const minmaxWidth = /minmax\(\s*(\d+)px\s*,\s*1fr\s*\)/i.exec(contractsBlock)?.[1];
    if (minmaxWidth !== undefined && Number(minmaxWidth) < 180) {
      fail(skillPath, "contract card grids must use readable minmax width of at least 180px");
    }
  }

  for (const statusPanel of html.matchAll(/<div[^>]*class="[^"]*\bstatus-panel\b[^"]*"[^>]*>/gi)) {
    const start = (statusPanel.index ?? 0) + statusPanel[0].length;
    const firstClose = html.indexOf("</div>", start);
    const directPanelBody = firstClose === -1 ? html.slice(start) : html.slice(start, firstClose);
    if (/<div[^>]*class="[^"]*\bcontracts\b/.test(directPanelBody)) {
      fail(skillPath, "contract card rail should not be nested inside a narrow status panel");
    }
  }
}

function validateSvgArrowEndpoints(skillPath: string, html: string): void {
  let svgIndex = 0;
  for (const svgMatch of html.matchAll(/<svg\b[\s\S]*?<\/svg>/gi)) {
    svgIndex += 1;
    const svg = svgMatch[0];
    const rects: Rect[] = [];

    for (const rectMatch of svg.matchAll(/<rect\b[^>]*>/gi)) {
      const attributes = parseAttributes(rectMatch[0]);
      const x = parseNumber(attributes.x);
      const y = parseNumber(attributes.y);
      const width = parseNumber(attributes.width);
      const height = parseNumber(attributes.height);
      if (x === undefined || y === undefined || width === undefined || height === undefined) continue;
      rects.push({ x, y, width, height });
    }

    if (rects.length < 2) continue;

    for (const pathMatch of svg.matchAll(/<path\b(?=[^>]*marker-end=)[^>]*>/gi)) {
      const attributes = parseAttributes(pathMatch[0]);
      if (attributes["data-open-arrow"] === "true") continue;

      const endpoint = parsePathEndpoint(attributes.d ?? "");
      if (!endpoint) continue;

      if (!rects.some((rect) => isNearRect(endpoint, rect, 14))) {
        fail(
          skillPath,
          `svg ${svgIndex} has an arrow endpoint that does not reach a visible node: ${attributes.d}`,
        );
        return;
      }
    }
  }
}

function validateSkillHtml(skillPath: string): void {
  const htmlPath = path.join(skillPath, "skill.html");
  const skillName = path.basename(skillPath);

  if (!existsSync(htmlPath)) {
    fail(skillPath, "missing skill.html");
    return;
  }

  const html = read(htmlPath);

  if (!/^<!doctype html>/i.test(html.trim())) {
    fail(skillPath, "skill.html should start with <!doctype html>");
  }

  if (!/<html[^>]+lang="ko"/.test(html)) {
    fail(skillPath, "skill.html should use lang=\"ko\"");
  }

  if (!html.includes(skillName)) {
    fail(skillPath, `skill.html should visibly name the skill: ${skillName}`);
  }

  validateScriptSafety(skillPath, html);

  if (/https?:\/\/(?!(?:127\.0\.0\.1|localhost|\[::1\]|0\.0\.0\.0)(?::|\/))|src="\/\//i.test(html)) {
    fail(skillPath, "skill.html should not depend on external URLs or assets");
  }

  if (/\/Users\/|\/home\/|\/private\/tmp|Desktop\/skills/.test(html)) {
    fail(skillPath, "skill.html contains a non-portable local path");
  }

  if (!/html[\s\S]*background:\s*var\(--bg\)|html[\s\S]*background:\s*#[0-9a-f]{3,6}/i.test(html)) {
    fail(skillPath, "html element should paint the page background");
  }

  if (!/body[\s\S]*background:\s*var\(--bg\)|body[\s\S]*background:\s*#[0-9a-f]{3,6}/i.test(html)) {
    fail(skillPath, "body element should paint the page background");
  }

  if (!/max-width:\s*(1120px|1180px|1192px|1200px|1240px)/.test(html)) {
    fail(skillPath, "main shell should use a stable desktop max-width");
  }

  if (!/margin:\s*0 auto/.test(html)) {
    fail(skillPath, "main shell should be centered with margin: 0 auto");
  }

  if (!/letter-spacing:\s*0/.test(html)) {
    fail(skillPath, "skill.html should explicitly keep letter-spacing at 0");
  }

  if (/font-size:\s*clamp\(|font-size:\s*[0-9.]+vw/.test(html)) {
    fail(skillPath, "skill.html should not scale font size with viewport width");
  }

  if (!/overflow-wrap:\s*anywhere|overflow-x:\s*auto|white-space:\s*pre/.test(html)) {
    fail(skillPath, "long labels, paths, or snippets need wrapping or scroll policy");
  }

  validateLocalLinks(skillPath, html);
  validateWideVisualStructure(skillPath, html);
  validateReadableCardGrids(skillPath, html);
  validateSvgArrowEndpoints(skillPath, html);

  const sectionHeadingCount = countMatches(html, /<h2\b/g);
  if (sectionHeadingCount < 6) {
    fail(skillPath, "skill.html should have at least 6 scannable h2 sections");
  }

  const visualSignals = [
    ["use decision", ["사용 판단", "검증 강도 매트릭스", "조사 예산 선택"]],
    ["workflow", ["흐름", "플로우", "루프", "생성 흐름"]],
    ["resource map", ["파일 관계", "파일 관계도", "스킬 파일 관계도", "관계 지도"]],
    ["validation or risk", ["검증", "위험", "품질 게이트", "비밀값 검사"]],
    ["misuse guardrails", ["금지와 허용", "허용", "금지"]],
  ] as const;

  for (const [label, terms] of visualSignals) {
    if (!hasAny(html, terms)) {
      fail(skillPath, `skill.html missing ${label} section`);
    }
  }

  if (!/SKILL\.md/.test(html) || !/skill\.html/.test(html)) {
    fail(skillPath, "skill.html should show the SKILL.md + skill.html file pair");
  }

  const englishOnlyLabelPattern =
    /^(Decision Matrix|Workflow|Resource Map|Input \/ Output(?: Schema)?|Project Connection|Do Not|Do \/ Do Not|Do \/ Don't|Risk Meter|Four Principles|Default Stack|Folder Structure Trees|Env Contract|GraphQL Codegen Contract|Structure Verification|Package Coverage|Conflict Priority Chart|Research budget router|Agentic research loop|Parallel sub-agent fan-out|Secret Guard|API contract|Cache|Auth|Generated artifacts|Desktop shell|Use now|Use|Skip|Ask|Output|Input|Hard block|Required pair|Skill folder pair|Branch|Target|Viewport|Interact|Report|Diff|Behavior|Boundaries|Tests|Findings|Surface|Hierarchy|Layout|States|Inspect|Classify|Review lanes|Patch|Verify|Read skills|Merge|Group|Recommend|Static|Inventory|Claim Ledger|Resolve or Ask|Patch Docs|Validate|Preserve|Extract|Visualize|Skill visual guide|Project kind|Outputs|Bug fix|Refactor|Small edit|repo checks|coordination|always|often|material|source folder|human guide|agent guide|style rules|project setup|project setup checks|trigger|checks|docs|code|scope|regression|missing|severity|direction|repro|check|folder|official docs \/ standards|source repos \/ papers|government \/ vendor original|reputable secondary|seo blog \/ unsourced)$/i;
  for (const label of visibleLabelTexts(html)) {
    if (englishOnlyLabelPattern.test(label)) {
      fail(skillPath, `visible label should be Korean-first, not English-only: ${label}`);
      break;
    }
  }
}

for (const skillPath of skillDirs()) {
  validateSkillHtml(skillPath);
}

if (errors.length) {
  console.error("skill HTML validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("skill HTML validation passed");
