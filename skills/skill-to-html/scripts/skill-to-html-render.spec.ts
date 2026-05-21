import { expect, test } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const skillRoot = process.env.SKILL_TO_HTML_ROOT
  ? path.resolve(process.env.SKILL_TO_HTML_ROOT)
  : path.resolve(process.cwd(), "skills/skill-to-html");

const targetUrl = pathToFileURL(path.join(skillRoot, "skill.html")).href;

test.use({ channel: "chrome" });

test.describe("skill-to-html skill.html render", () => {
  test("renders a static summary without interaction code", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(targetUrl);

    await expect(page).toHaveTitle(/skill-to-html/);
    await expect(page.getByRole("heading", { name: "skill-to-html" })).toBeVisible();
    await expect(page.getByText("정적 요약", { exact: true })).toBeVisible();
    await expect(page.getByText("인터랙션 없음", { exact: true })).toBeVisible();
    await expect(page.getByText("SkillHtmlModel").first()).toBeVisible();
    await expect(page.getByText("신뢰하지 않는 입력").first()).toBeVisible();
    await expect(page.getByText("신뢰된 템플릿").first()).toBeVisible();
    await expect(page.locator(".summary-list li")).toHaveCount(3);
    await expect(page.locator(".contract-list li")).toHaveCount(5);
    await expect(page.locator(".workflow-list li")).toHaveCount(4);
    await expect(page.locator(".rule-table tbody tr")).toHaveCount(2);
    await expect(page.locator(".verify-list li")).toHaveCount(2);

    await expect(page.locator(".summary-list")).toHaveCSS("border-top-width", "0px");
    await expect(page.locator(".contract-list")).toHaveCSS("border-top-width", "0px");
    await expect(page.locator(".rule-table")).toHaveCSS("border-top-width", "0px");
    await expect(page.locator(".summary-list li").last()).toHaveCSS("border-bottom-width", "0px");
    await expect(page.locator(".contract-list li").last()).toHaveCSS("border-bottom-width", "0px");
    await expect(page.locator(".rule-table tbody tr").last().locator("td")).toHaveCSS("border-bottom-width", "0px");
    await expect(page.locator(".verify-list li").first()).toHaveCSS("border-top-width", "0px");

    const h2Titles = await page.locator("h2").evaluateAll((nodes) =>
      nodes.map((node) => node.textContent?.trim() ?? "").filter(Boolean),
    );
    expect(h2Titles).toEqual([
      "요약",
      "사용 판단",
      "핵심 계약",
      "작업 흐름",
      "금지와 허용",
      "파일과 검증",
    ]);

    const staticShape = await page.evaluate(() => {
      const html = document.documentElement;
      const visible = Array.from(document.querySelectorAll<HTMLElement>("body *")).filter((item) => {
        const box = item.getBoundingClientRect();
        const style = getComputedStyle(item);
        return box.width > 0 && box.height > 0 && style.display !== "none" && style.visibility !== "hidden";
      });
      const overflowing = visible.filter((item) => {
        const style = getComputedStyle(item);
        return style.overflowX !== "auto" && item.scrollWidth > item.clientWidth + 1;
      });
      const offscreen = visible.filter((item) => {
        const box = item.getBoundingClientRect();
        return box.left < -1 || box.right > window.innerWidth + 1;
      });

      return {
        noHorizontalOverflow: html.scrollWidth <= window.innerWidth + 1,
        scriptCount: document.querySelectorAll("script").length,
        buttonCount: document.querySelectorAll("button").length,
        inlineHandlerCount: Array.from(document.querySelectorAll("*")).filter((node) =>
          Array.from(node.attributes).some((attribute) => attribute.name.startsWith("on")),
        ).length,
        summaryStripCount: document.querySelectorAll(".summary-strip").length,
        summaryCardCount: document.querySelectorAll(".summary-node").length,
        contractCardCount: document.querySelectorAll(".contracts .item").length,
        genericCardCount: document.querySelectorAll("main .item").length,
        sectionCardCount: Array.from(document.querySelectorAll("section")).filter((node) => {
          const style = getComputedStyle(node);
          return style.backgroundColor !== "rgba(0, 0, 0, 0)" && style.borderTopWidth !== "1px";
        }).length,
        unsafeElementCount: document.querySelectorAll("iframe, object, embed, base").length,
        unsafeUrlAttributeCount: Array.from(document.querySelectorAll("[href], [src]")).filter((node) => {
          const value = node.getAttribute("href") ?? node.getAttribute("src") ?? "";
          return /^(javascript:|vbscript:)/i.test(value.trim());
        }).length,
        dataSrcCount: Array.from(document.querySelectorAll("[src]")).filter((node) => {
          const value = node.getAttribute("src") ?? "";
          return /^data:/i.test(value.trim());
        }).length,
        externalAssetCount: Array.from(document.querySelectorAll("[src], link[href]")).filter((node) => {
          const value = node.getAttribute("src") ?? node.getAttribute("href") ?? "";
          return /^https?:\/\//.test(value) || value.startsWith("//");
        }).length,
        overflowingCount: overflowing.length,
        offscreenCount: offscreen.length,
      };
    });

    expect(staticShape.noHorizontalOverflow).toBe(true);
    expect(staticShape.scriptCount).toBe(0);
    expect(staticShape.buttonCount).toBe(0);
    expect(staticShape.inlineHandlerCount).toBe(0);
    expect(staticShape.summaryStripCount).toBe(0);
    expect(staticShape.summaryCardCount).toBe(0);
    expect(staticShape.contractCardCount).toBe(0);
    expect(staticShape.genericCardCount).toBe(0);
    expect(staticShape.sectionCardCount).toBe(0);
    expect(staticShape.unsafeElementCount).toBe(0);
    expect(staticShape.unsafeUrlAttributeCount).toBe(0);
    expect(staticShape.dataSrcCount).toBe(0);
    expect(staticShape.externalAssetCount).toBe(0);
    expect(staticShape.overflowingCount).toBe(0);
    expect(staticShape.offscreenCount).toBe(0);
    expect(consoleErrors).toEqual([]);
  });
});
