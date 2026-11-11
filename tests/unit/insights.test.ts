import { describe, expect, it } from "vitest";
import { articles, readingMinutes } from "@/content/insights";
import { services } from "@/content/expertise";

const ROUTES = new Set(["/", "/expertise", "/approach", "/group", "/insights", "/start", "/start/call", "/start/sketch", "/colophon", ...services.map((s) => `/expertise/${s.slug}`)]);

describe("Insights articles", () => {
  it("are complete, substantial and dated", () => {
    expect(articles.length).toBeGreaterThanOrEqual(2);
    for (const a of articles) {
      expect(a.title.length).toBeGreaterThan(20);
      expect(a.description.length).toBeGreaterThan(80);
      expect(a.description.length).toBeLessThanOrEqual(170);
      expect(a.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.blocks.filter((b) => b.t === "h2").length).toBeGreaterThanOrEqual(2);
      expect(readingMinutes(a)).toBeGreaterThanOrEqual(3);
    }
  });

  it("link only to pages that exist", () => {
    for (const a of articles) for (const r of a.related) expect(ROUTES.has(r.href), `${a.slug} → ${r.href}`).toBe(true);
  });

  it("contain no placeholders, invented statistics or promised turnaround times", () => {
    for (const a of articles) {
      const text = JSON.stringify(a);
      expect(text).not.toMatch(/lorem|ipsum|TODO|TBC|\[confirm/i);
      expect(text).not.toMatch(/\d+\s?%/);
      expect(text).not.toMatch(/within \d+ (working )?days|guarantee/i);
    }
  });

  it("have unique slugs and titles", () => {
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
    expect(new Set(articles.map((a) => a.title)).size).toBe(articles.length);
  });
});
