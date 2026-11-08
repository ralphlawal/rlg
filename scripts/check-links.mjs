// Crawls the site from "/" and checks every internal link, in-page anchor and image, plus external links once.
// Usage: node scripts/check-links.mjs [baseUrl]
import { chromium } from "@playwright/test";
const base = process.argv[2] ?? "http://localhost:3100";
const b = await chromium.launch({ channel: "chrome" });
const page = await b.newPage();
const seen = new Set(["/"]);
const queue = ["/"];
const external = new Map();
const problems = [];
const status = new Map();

async function statusOf(url) {
  if (status.has(url)) return status.get(url);
  const res = await fetch(url, { redirect: "manual" }).catch(() => null);
  const s = res ? res.status : 0;
  status.set(url, s);
  return s;
}

while (queue.length) {
  const path = queue.shift();
  const res = await page.goto(base + path, { waitUntil: "networkidle" });
  if (!res || res.status() >= 400) { problems.push(`${path}: page returned ${res?.status()}`); continue; }
  const found = await page.evaluate(() => ({
    links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
    ids: [...document.querySelectorAll("[id]")].map((e) => e.id),
    imgs: [...document.images].map((i) => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0, lazy: i.loading === "lazy" })),
  }));
  for (const img of found.imgs) if (!img.lazy && !img.ok) problems.push(`${path}: image failed ${img.src}`);
  for (const href of found.links) {
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.startsWith("#")) { if (!found.ids.includes(href.slice(1))) problems.push(`${path}: missing anchor ${href}`); continue; }
    if (/^https?:/.test(href)) { if (!external.has(href)) external.set(href, path); continue; }
    const url = new URL(href, base + path);
    const target = url.pathname + url.search;
    if (!seen.has(target)) {
      seen.add(target);
      const s = await statusOf(base + target);
      if (s >= 400 || s === 0) problems.push(`${path}: broken link ${href} (${s})`);
      else if (s >= 300) problems.push(`${path}: link goes through a redirect ${href} (${s})`);
      else if (!url.search) queue.push(url.pathname);
    }
    if (url.hash) {
      const ids = await (async () => { const p2 = await b.newPage(); await p2.goto(base + url.pathname, { waitUntil: "domcontentloaded" }); const r = await p2.evaluate(() => [...document.querySelectorAll("[id]")].map((e) => e.id)); await p2.close(); return r; })();
      if (!ids.includes(url.hash.slice(1))) problems.push(`${path}: missing anchor ${href}`);
    }
  }
}
for (const [href, from] of external) {
  const res = await fetch(href, { method: "GET", redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 link-check" } }).catch((e) => ({ status: 0, e }));
  const s = res.status;
  console.log(`external ${s} ${href}`);
  if (s >= 400 && s !== 403 && s !== 429) problems.push(`${from}: external link ${href} returned ${s}`);
  if (s === 0) problems.push(`${from}: external link ${href} unreachable`);
}
await b.close();
console.log(`Crawled ${seen.size} internal URLs.`);
console.log(problems.length ? problems.join("\n") : "No broken links.");
