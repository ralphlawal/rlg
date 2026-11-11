import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/expertise";
import { articles } from "@/content/insights";

/** Only indexable, finished pages. No priority/changefreq: search engines ignore them. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-08");
  const paths = [
    "/",
    "/expertise",
    ...services.map((s) => `/expertise/${s.slug}`),
    "/approach",
    "/insights",
    ...articles.map((a) => `/insights/${a.slug}`),
    "/group",
    "/start",
    "/start/call",
    "/start/sketch",
    "/privacy",
    "/cookies",
    "/terms",
    "/colophon",
  ];
  return paths.map((p) => ({ url: `${site.url}${p === "/" ? "" : p}`, lastModified: p.startsWith("/insights") ? new Date("2026-11-11") : lastModified }));
}
