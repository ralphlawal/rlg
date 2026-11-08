import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/expertise";

/** Only indexable, finished pages. No priority/changefreq: search engines ignore them. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-08");
  const paths = [
    "/",
    "/expertise",
    ...services.map((s) => `/expertise/${s.slug}`),
    "/approach",
    "/group",
    "/start",
    "/start/call",
    "/start/sketch",
    "/privacy",
    "/cookies",
    "/terms",
    "/colophon",
  ];
  return paths.map((p) => ({ url: `${site.url}${p === "/" ? "" : p}`, lastModified }));
}
