import { describe, expect, it } from "vitest";
import { GLYPHS, glyphKey, glyphStrokes } from "@/components/drawings/glyphs";
import { services } from "@/content/expertise";
import { capabilities, stages, whatWeDo } from "@/content/home";

describe("drawings", () => {
  it("has an icon for every service, capability and stage shown on the site", () => {
    const needed = [
      ...services.map((s) => s.slug),
      ...whatWeDo.map((s) => s.href.split("/").pop()!),
      ...capabilities.map((c) => glyphKey(c.title)),
      ...stages.map((s) => glyphKey(s.name)),
    ];
    for (const name of needed) expect(GLYPHS, name).toContain(name);
  });

  it("draws the same strokes every time, with no broken numbers", () => {
    for (const name of GLYPHS) {
      const a = glyphStrokes(name, 0.7);
      expect(a.length).toBeGreaterThan(2);
      expect(a.map((s) => s.d).join()).not.toMatch(/NaN|Infinity|undefined/);
      expect(glyphStrokes(name, 0.7)).toEqual(a);
    }
  });
});
