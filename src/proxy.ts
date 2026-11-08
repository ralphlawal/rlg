import { NextResponse, type NextRequest } from "next/server";
import { EXPERTISE_SLUGS } from "./content/slugs";

/**
 * Runs only on the paths in the matcher (a literal list), never on other requests.
 * 1. Unknown /expertise/* slugs → the real 404 page with a 404 status (prerendered
 *    dynamic routes would otherwise stream a 200 shell).
 * 2. Retired pages from the old site → 410 Gone. Kept in sync with `gone` in src/content/redirects.ts
 *    by tests/unit/redirects.test.ts.
 */
const known: Record<string, readonly string[]> = { expertise: EXPERTISE_SLUGS };

export function proxy(request: NextRequest) {
  const [, section, slug, extra] = request.nextUrl.pathname.split("/");
  if (section in known && slug) {
    if (extra === undefined && known[section].includes(slug)) return NextResponse.next();
    if (extra === "opengraph-image" && known[section].includes(slug)) return NextResponse.next();
    return NextResponse.rewrite(new URL("/_missing", request.url));
  }
  return new NextResponse(GONE_HTML, {
    status: 410,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600", "X-Robots-Tag": "noindex" },
  });
}

export const config = {
  matcher: [
    "/expertise/:slug/:rest*",
    "/services/marketing", "/services/marketing.html",
    "/services/media", "/services/media.html",
    "/services/education", "/services/education.html",
    "/ai-advisor", "/ai-advisor.html",
    "/auth", "/auth.html",
    "/dashboard", "/dashboard.html",
    "/admin", "/admin.html",
    "/blog/post", "/blog/post.html",
    "/blog/post3-examora", "/blog/post3-examora.html",
    "/blog/post4-dublin-nigeria", "/blog/post4-dublin-nigeria.html",
    "/blog/post5-artist-media", "/blog/post5-artist-media.html",
    "/blog/post6-coding-education", "/blog/post6-coding-education.html",
    "/blog/post8-brand-trends-2026", "/blog/post8-brand-trends-2026.html",
    "/blog/post9-afrobeats-global-2026", "/blog/post9-afrobeats-global-2026.html",
  ],
};

const GONE_HTML = `<!doctype html><html lang="en-IE"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>This page has been retired · Ralph Lawal Group</title><style>
:root{color-scheme:light dark}body{margin:0;font:18px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;background:#fff;color:#000}
@media (prefers-color-scheme:dark){body{background:#000;color:#fff}.m{color:#949494!important}a.b{background:#fff!important;color:#000!important}}
main{max-width:46rem;margin:0 auto;padding:12vh 20px}.m{font:12px ui-monospace,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#6b6b6b}
h1{font-size:clamp(2.25rem,7vw,4rem);line-height:1;letter-spacing:-.03em;margin:16px 0 20px}a{color:inherit}a.b{display:inline-block;margin:24px 24px 0 0;padding:12px 20px;background:#000;color:#fff;text-decoration:none}</style></head>
<body><main><p class="m">410 · Retired page · Ralph Lawal Group</p><h1>This page has been retired.</h1>
<p>Ralph Lawal Group now focuses on technology: mobile apps, websites and web applications, AI and automation, and custom software. The page you were looking for covered something we no longer offer or publish.</p>
<p><a class="b" href="/">Go to the homepage</a><a href="/expertise">See what we do</a></p></main></body></html>`;
