/**
 * Redirect map from the old site (docs/phase-2/06-redirect-map.md), built from the live sitemap and a crawl
 * on 8 November 2026. The old site answered both with and without ".html", so both forms are covered.
 * Used by next.config.ts (redirects), src/proxy.ts (410 Gone) and the redirect tests.
 */

export const CANONICAL_HOST = "www.ralphlawalgroup.com";
export const OLD_HOST = "ralphlawalgroup.com";

/** Old path (without .html) → new path. */
export const moved: Record<string, string> = {
  "/index": "/",
  "/about": "/group",
  "/divisions": "/expertise",
  "/portfolio": "/expertise", // Work is hidden for now; restore to "/work" when it returns
  "/contact": "/start",
  "/book": "/start/call",
  "/thank-you": "/start",
  "/blog": "/insights",
  "/services/tech": "/expertise",
  "/services/consulting": "/approach#consulting",
  "/pricing": "/start",
  "/blog/post7-ai-small-business-2026": "/expertise/ai-automation",
  "/blog/post2-pwa": "/expertise/web",
};

/** Paths whose ".html" form redirects to the same clean path. */
export const htmlOnly = ["/privacy", "/terms"];

/** Retired: services no longer offered, removed features and off-topic posts. Answer 410 Gone. */
export const gone = [
  "/services/marketing",
  "/services/media",
  "/services/education",
  "/ai-advisor",
  "/auth",
  "/dashboard",
  "/admin",
  "/blog/post",
  "/blog/post3-examora",
  "/blog/post4-dublin-nigeria",
  "/blog/post5-artist-media",
  "/blog/post6-coding-education",
  "/blog/post8-brand-trends-2026",
  "/blog/post9-afrobeats-global-2026",
];

/** "/blog" goes to Insights, which isn't live yet; until it is, send it to Expertise instead. */
export const INSIGHTS_LIVE = false;

export function redirectEntries() {
  const entries: { source: string; destination: string }[] = [];
  for (const [from, to] of Object.entries(moved)) {
    const dest = to === "/insights" && !INSIGHTS_LIVE ? "/expertise" : to;
    if (from !== "/index") entries.push({ source: from, destination: dest });
    entries.push({ source: `${from}.html`, destination: dest });
  }
  for (const p of htmlOnly) entries.push({ source: `${p}.html`, destination: p });
  entries.push({ source: "/manifest.json", destination: "/manifest.webmanifest" });
  return entries;
}
