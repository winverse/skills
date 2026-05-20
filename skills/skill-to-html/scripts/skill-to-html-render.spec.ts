import { expect, test } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const skillRoot = process.env.SKILL_TO_HTML_ROOT
  ? path.resolve(process.env.SKILL_TO_HTML_ROOT)
  : path.resolve(process.cwd(), "skills/skill-to-html");

const targetUrl = pathToFileURL(path.join(skillRoot, "skill.html")).href;

test.use({ channel: "chrome" });

test.describe("skill-to-html skill.html render", () => {
  test("keeps the first viewport focused and readable", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(targetUrl);

    await expect(page).toHaveTitle(/skill-to-html/);
    await expect(page.getByRole("heading", { name: "skill-to-html" })).toBeVisible();

    const h2Titles = await page.locator("h2").evaluateAll((nodes) =>
      nodes.map((node) => node.textContent?.trim() ?? "").filter(Boolean),
    );
    expect(h2Titles).not.toContain("변환 모델 보드");
    expect(h2Titles).not.toContain("Markdown 변환 모델");
    expect(h2Titles).not.toContain("애니메이션 흐름");
    expect(h2Titles).not.toContain("도구 선택 레일");
    expect(h2Titles.length).toBeLessThanOrEqual(7);

    const layout = await page.evaluate(() => {
      const html = document.documentElement;
      const hero = document.querySelector<HTMLElement>(".stage-shell");
      const visual = document.querySelector<HTMLElement>(".visual");
      const heroSvg = document.querySelector<SVGSVGElement>(".visual svg");
      const heroLines = Array.from(document.querySelectorAll<SVGPathElement>(".hero-line"));
      const contractWidths = Array.from(document.querySelectorAll<HTMLElement>(".contract-tile")).map(
        (item) => item.getBoundingClientRect().width,
      );
      const decisionWidths = Array.from(document.querySelectorAll<HTMLElement>(".decision-card")).map(
        (item) => item.getBoundingClientRect().width,
      );
      const visible = Array.from(document.querySelectorAll<HTMLElement>("body *")).filter((item) => {
        const box = item.getBoundingClientRect();
        const style = getComputedStyle(item);
        return box.width > 0 && box.height > 0 && style.display !== "none" && style.visibility !== "hidden";
      });
      const overflowing = visible.filter((item) => item.scrollWidth > item.clientWidth + 1);
      const offscreen = visible.filter((item) => {
        const box = item.getBoundingClientRect();
        return box.left < -1 || box.right > window.innerWidth + 1;
      });

      return {
        noHorizontalOverflow: html.scrollWidth <= window.innerWidth + 1,
        heroHeight: hero?.getBoundingClientRect().height ?? 0,
        visualHeight: visual?.getBoundingClientRect().height ?? 0,
        svgHeight: heroSvg?.getBoundingClientRect().height ?? 0,
        heroLineCount: heroLines.length,
        heroLineLengths: heroLines.map((line) => Math.round(line.getTotalLength())),
        heroLineDash: heroLines.map((line) => getComputedStyle(line).strokeDasharray),
        minContractWidth: Math.min(...contractWidths),
        minDecisionWidth: Math.min(...decisionWidths),
        overflowingCount: overflowing.length,
        offscreenCount: offscreen.length,
      };
    });

    expect(layout.noHorizontalOverflow).toBe(true);
    expect(layout.heroHeight).toBeLessThanOrEqual(700);
    expect(layout.visualHeight).toBeLessThanOrEqual(285);
    expect(layout.svgHeight).toBeLessThanOrEqual(260);
    expect(layout.heroLineCount).toBe(3);
    expect(layout.heroLineLengths.every((length) => length >= 40)).toBe(true);
    expect(layout.heroLineDash.every((dash) => dash === "none" || dash === "0px")).toBe(true);
    expect(layout.minContractWidth).toBeGreaterThanOrEqual(220);
    expect(layout.minDecisionWidth).toBeGreaterThanOrEqual(260);
    expect(layout.overflowingCount).toBe(0);
    expect(layout.offscreenCount).toBe(0);

    await page.getByRole("button", { name: /IR 변환/ }).click();
    await expect(page.locator("#mode-title")).toHaveText("IR 변환");
    await page.getByRole("button", { name: /신뢰 경계/ }).click();
    await expect(page.locator("#evidence-note")).toContainText("raw HTML");

    expect(consoleErrors).toEqual([]);
  });
});
