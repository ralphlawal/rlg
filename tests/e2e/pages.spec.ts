import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  "/", "/expertise", "/expertise/mobile-apps", "/expertise/web",
  "/expertise/ai-automation", "/expertise/custom-software", "/expertise/backend-cloud", "/expertise/product-design",
  "/approach", "/group", "/start", "/start/call", "/start/sketch", "/start/received?ref=RLG-2611-AB12&kind=project",
  "/privacy", "/cookies", "/terms", "/colophon", "/this-page-does-not-exist",
];

for (const path of PAGES) {
  for (const theme of ["light", "dark"] as const) {
    test(`${path} [${theme}] has no WCAG 2.2 AA violations and sound structure`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("rlg-theme", t), theme);
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && !/404|Failed to load resource/.test(m.text()) && errors.push(m.text()));
      const res = await page.goto(path, { waitUntil: "networkidle" });
      expect(res?.status()).toBe(path.includes("does-not-exist") ? 404 : 200);
      await page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in")));

      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const summary = axe.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
      expect(summary, summary.join("\n")).toEqual([]);

      expect(await page.locator("h1").count()).toBe(1);
      if (!path.includes("does-not-exist") && !path.includes("received")) {
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/www\.ralphlawalgroup\.com/);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }
}
