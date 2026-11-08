import { chromium } from "@playwright/test";
const out = process.argv[2];
const b = await chromium.launch({ channel: "chrome" });
for (const [n, w, h] of [["desk", 1440, 900], ["phone", 390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto("http://localhost:3100/", { waitUntil: "networkidle" });
  const info = await p.evaluate(() => { const hd = document.querySelector("header"); const r = hd.getBoundingClientRect(); const cs = getComputedStyle(hd); return { top: r.top, h: r.height, vis: cs.visibility, op: cs.opacity, disp: cs.display, imgs: [...hd.querySelectorAll("img")].map(i => ({ w: i.getBoundingClientRect().width, vis: getComputedStyle(i).display, op: getComputedStyle(i.closest("span")).opacity })) }; });
  console.log(n, JSON.stringify(info));
  await p.screenshot({ path: `${out}/hdr-${n}-top.png` });
  await p.evaluate(() => window.scrollTo(0, 600)); await p.waitForTimeout(300);
  await p.screenshot({ path: `${out}/hdr-${n}-scrolled.png`, clip: { x: 0, y: 0, width: w, height: 120 } });
  if (n === "phone") { await p.click("text=Menu"); await p.waitForTimeout(400); await p.screenshot({ path: `${out}/menu-phone.png` }); }
  await p.close();
}
await b.close();
