// Lab performance check against the budget in docs/phase-2/08 (not a substitute for real-user data).
// Usage: node scripts/perf.mjs <baseUrl> [paths...]  — phone viewport, throttled network and CPU.
import { chromium } from "@playwright/test";
const [base = "http://localhost:3100", ...paths] = process.argv.slice(2);
const routes = paths.length ? paths : ["/", "/approach", "/expertise/web", "/start"];
const b = await chromium.launch({ channel: "chrome" });
for (const route of routes) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const bytes = { js: 0, css: 0, font: 0, img: 0, doc: 0, other: 0 };
  cdp.on("Network.loadingFinished", () => {});
  const types = new Map();
  cdp.on("Network.responseReceived", (e) => types.set(e.requestId, e.type));
  cdp.on("Network.loadingFinished", (e) => {
    const t = types.get(e.requestId);
    const k = t === "Script" ? "js" : t === "Stylesheet" ? "css" : t === "Font" ? "font" : t === "Image" ? "img" : t === "Document" ? "doc" : "other";
    bytes[k] += e.encodedDataLength;
  });
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3), lcpEl: (() => { const e = performance.getEntriesByType("largest-contentful-paint").pop(); return e?.element?.tagName + (e?.element?.id ? "#" + e.element.id : ""); })() }));
  const kb = (n) => `${Math.round(n / 1024)}KB`;
  console.log(`${route.padEnd(16)} LCP ${m.lcp}ms (${m.lcpEl})  CLS ${m.cls}  JS ${kb(bytes.js)}  CSS ${kb(bytes.css)}  fonts ${kb(bytes.font)}  img ${kb(bytes.img)}  html ${kb(bytes.doc)}  total ${kb(Object.values(bytes).reduce((a, c) => a + c, 0))}`);
  await ctx.close();
}
await b.close();
