import { expect, test } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const skillRoot = process.env.MARKDOWN_TO_HTML_ROOT
  ? path.resolve(process.env.MARKDOWN_TO_HTML_ROOT)
  : path.resolve(process.cwd(), "skills/markdown-to-html");

const targetUrl = pathToFileURL(path.join(skillRoot, "skill.html")).href;

test.use({ channel: "chrome" });

test.describe("markdown-to-html skill.html render", () => {
  test("renders a static summary without interaction code", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(targetUrl);

    await expect(page).toHaveTitle(/markdown-to-html/);
    await expect(page.getByRole("heading", { name: "markdown-to-html" })).toBeVisible();
    await expect(page.locator(".meta-line")).toContainText("스킬 HTML mode");
    await expect(page.locator(".meta-line")).toContainText("Markdown parse");
    await expect(page.locator(".meta-line")).toContainText("인터랙션 없음");
    await expect(page.getByText("MarkdownHtmlModel").first()).toBeVisible();
    await expect(page.getByText("신뢰된 템플릿").first()).toBeVisible();
    await expect(page.getByText("allowlist sanitizer").first()).toBeVisible();
    await expect(page.locator(".meta-line")).toContainText("보안 경계");
    await expect(page.locator(".summary-list li")).toHaveCount(5);
    await expect(page.locator(".contract-list li")).toHaveCount(6);
    await expect(page.locator(".workflow-list li")).toHaveCount(5);
    await expect(page.locator(".rule-table tbody tr")).toHaveCount(6);
    await expect(page.locator(".rule-zone")).toHaveCount(3);
    await expect(page.locator(".rule-copy")).toHaveCount(0);
    await expect(page.locator(".rule-zone-heading strong")).toHaveText(["허용", "조건부 허용", "금지"]);
    await expect(page.locator(".rule-zone-heading span")).toHaveCount(0);
    await expect(page.locator(".rule-table").first().locator("thead th")).toHaveText(["항목", "기준"]);
    await expect(page.getByText("실행/외부 의존")).toBeVisible();
    await expect(page.getByText("본문 자기해설")).toBeVisible();
    await expect(page.getByText("mode 선택")).toBeVisible();
    await expect(page.getByText("URL 제한")).toBeVisible();
    await expect(page.getByText("markdown-rendering-research.md").first()).toBeVisible();
    await expect(page.getByText("fixture 검증")).toBeVisible();
    await expect(page.getByText("unsafe-markdown.md").first()).toBeVisible();
    await expect(page.getByText("expected-boundary.json").first()).toBeVisible();
    await expect(page.locator(".verify-list li")).toHaveCount(3);

    await expect(page.locator(".summary-list")).toHaveCSS("border-top-width", "0px");
    await expect(page.locator(".contract-list")).toHaveCSS("border-top-width", "0px");
    const ruleTableTopBorders = await page.locator(".rule-table").evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).borderTopWidth),
    );
    expect(ruleTableTopBorders.every((width) => width === "0px")).toBe(true);
    await expect(page.locator(".summary-list li").last()).toHaveCSS("border-bottom-width", "0px");
    await expect(page.locator(".contract-list li").last()).toHaveCSS("border-bottom-width", "0px");
    const lastRuleBorders = await page.locator(".rule-table tbody tr").last().locator("th, td").evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).borderBottomWidth),
    );
    expect(lastRuleBorders.every((width) => width === "0px")).toBe(true);
    await expect(page.locator(".verify-list li").first()).toHaveCSS("border-top-width", "0px");
    await expect(page.locator(".shell")).toHaveCSS("border-top-width", "0px");
    await expect(page.locator("section").first()).toHaveCSS("margin-top", "16px");
    await expect(page.locator("section").first()).toHaveCSS("border-radius", "8px");

    const h2Titles = await page.locator("h2").evaluateAll((nodes) =>
      nodes.map((node) => node.textContent?.trim() ?? "").filter(Boolean),
    );
    expect(h2Titles).toEqual([
      "요약",
      "사용 판단",
      "중요한 기준",
      "작업 흐름",
      "보안 경계",
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
        badgeCount: document.querySelectorAll(".badge, .badges").length,
        genericCardCount: document.querySelectorAll("main .item").length,
        ruleZoneCount: document.querySelectorAll(".rule-zone").length,
        ruleCopyCount: document.querySelectorAll(".rule-copy").length,
        ruleStatusCount: document.querySelectorAll(".rule-status").length,
        uiRationaleTextCount: [
          "색만으로 판정을 구분",
          "구역 안에서 항목과 기준",
          "먼저 나눈 뒤",
        ].filter((text) => document.body.innerText.includes(text)).length,
        shellBorderWidth: getComputedStyle(document.querySelector(".shell")!).borderTopWidth,
        firstSectionMarginTop: getComputedStyle(document.querySelector("section")!).marginTop,
        workflowContainerBorderWidth: getComputedStyle(document.querySelector(".workflow-list")!).borderTopWidth,
        workflowContainerBackground: getComputedStyle(document.querySelector(".workflow-list")!).backgroundColor,
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
    expect(staticShape.badgeCount).toBe(0);
    expect(staticShape.genericCardCount).toBe(0);
    expect(staticShape.ruleZoneCount).toBe(3);
    expect(staticShape.ruleCopyCount).toBe(0);
    expect(staticShape.ruleStatusCount).toBe(0);
    expect(staticShape.uiRationaleTextCount).toBe(0);
    expect(staticShape.shellBorderWidth).toBe("0px");
    expect(staticShape.firstSectionMarginTop).toBe("16px");
    expect(staticShape.workflowContainerBorderWidth).toBe("0px");
    expect(staticShape.workflowContainerBackground).toBe("rgba(0, 0, 0, 0)");
    expect(staticShape.unsafeElementCount).toBe(0);
    expect(staticShape.unsafeUrlAttributeCount).toBe(0);
    expect(staticShape.dataSrcCount).toBe(0);
    expect(staticShape.externalAssetCount).toBe(0);
    expect(staticShape.overflowingCount).toBe(0);
    expect(staticShape.offscreenCount).toBe(0);
    expect(consoleErrors).toEqual([]);
  });
});
