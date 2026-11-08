import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { gone, htmlOnly, moved, redirectEntries } from "@/content/redirects";

describe("Redirect map", () => {
  const entries = redirectEntries();
  it("covers every old page in both forms", () => {
    for (const from of Object.keys(moved)) {
      expect(entries.some((e) => e.source === `${from}.html`)).toBe(true);
      if (from !== "/index") expect(entries.some((e) => e.source === from)).toBe(true);
    }
    for (const p of htmlOnly) expect(entries.some((e) => e.source === `${p}.html` && e.destination === p)).toBe(true);
  });
  it("never redirects to another redirect (single hop)", () => {
    const sources = new Set(entries.map((e) => e.source));
    for (const e of entries) expect(sources.has(e.destination.split("#")[0])).toBe(false);
  });
  it("never redirects to a retired page", () => {
    for (const e of entries) expect(gone).not.toContain(e.destination);
  });
  it("keeps the 410 proxy matcher in sync with the retired list", () => {
    const proxy = readFileSync("src/proxy.ts", "utf8");
    for (const p of gone) {
      expect(proxy).toContain(`"${p}"`);
      expect(proxy).toContain(`"${p}.html"`);
    }
  });
});

import { EXPERTISE_SLUGS } from "@/content/slugs";
describe("Proxy slug list", () => {
  it("matches the expertise content", async () => {
    const { services } = await import("@/content/expertise");
    expect([...EXPERTISE_SLUGS].sort()).toEqual(services.map((s) => s.slug).sort());
  });
});
