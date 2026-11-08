// Quick screenshots: node scripts/snap.mjs <outDir> <path> [path...]  (desktop light + phone dark, full page)
import { chromium } from "@playwright/test";
const [out, ...paths] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome" });
for (const path of paths) for (const [n, w, h, theme] of [["desktop", 1440, 900, "light"], ["phone", 390, 844, "dark"]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript((t) => localStorage.setItem("rlg-theme", t), theme);
  const p = await ctx.newPage();
  await p.goto("http://localhost:3100" + path, { waitUntil: "networkidle" });
  await p.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in")));
  const name = path.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home";
  await p.screenshot({ path: `${out}/${name}-${n}.png`, fullPage: true });
  await ctx.close();
}
await b.close();
