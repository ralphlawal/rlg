// Visual review: screenshots each page at phone/tablet/desktop in both themes,
// and reports console errors, CSP violations, horizontal overflow and failed requests.
// Usage: node scripts/review.mjs <baseUrl> <outDir> [paths...]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [base = "http://localhost:3100", out = "review", ...paths] = process.argv.slice(2);
const routes = paths.length ? paths : ["/"];
const viewports = [["phone", 390, 844], ["tablet", 820, 1180], ["desktop", 1440, 900]];
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const problems = [];
for (const route of routes) {
  for (const [name, width, height] of viewports) {
    for (const theme of ["light", "dark"]) {
      const ctx = await browser.newContext({ viewport: { width, height } });
      await ctx.addInitScript((t) => { try { localStorage.setItem("rlg-theme", t); } catch {} }, theme);
      const page = await ctx.newPage();
      const tag = `${route} ${name} ${theme}`;
      page.on("console", (m) => { if (m.type() === "error" || /Content Security Policy/i.test(m.text())) problems.push(`${tag}: console ${m.type()}: ${m.text()}`); });
      page.on("pageerror", (e) => problems.push(`${tag}: pageerror ${e.message}`));
      page.on("requestfailed", (r) => problems.push(`${tag}: request failed ${r.url()} ${r.failure()?.errorText}`));
      page.on("response", (r) => { if (r.status() >= 400 && !r.url().includes("favicon")) problems.push(`${tag}: HTTP ${r.status()} ${r.url()}`); });
      await page.goto(base + route, { waitUntil: "networkidle" });
      for (let y = 0; y < 14000; y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(50); }
      await page.evaluate(() => { window.scrollTo(0, 0); document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in")); });
      await page.waitForTimeout(400);
      const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, theme: document.documentElement.dataset.theme }));
      if (o.sw > o.cw) problems.push(`${tag}: horizontal overflow ${o.sw} > ${o.cw}`);
      if (o.theme !== theme) problems.push(`${tag}: theme not applied (${o.theme})`);
      const file = `${out}/${route === "/" ? "home" : route.slice(1).replace(/\//g, "_")}-${name}-${theme}`;
      await page.screenshot({ path: `${file}.png`, fullPage: true });
      await ctx.close();
    }
  }
}
await browser.close();
console.log(problems.length ? problems.join("\n") : "No problems found.");
