import { Pencil, type Stroke } from "@/lib/sketch";

/**
 * The studio's own icon set, drawn on a 64 × 64 sheet with the pencil in src/lib/sketch.ts.
 * Plain drafting subjects (tools, sheets, flow symbols), no stock pictograms.
 */
const T = Math.PI;

const defs = {
  // Services --------------------------------------------------------------
  "mobile-apps": (p: Pencil) => {
    p.line(32, 2, 32, 62, "dash");
    p.rect(20, 6, 24, 52);
    p.rect(23.5, 13, 17, 37, "fine");
    p.line(29, 9.5, 35, 9.5);
    p.circle(32, 54, 1.6);
    p.line(50, 6, 50, 58, "fine").line(48, 6, 52, 6, "fine").line(48, 58, 52, 58, "fine");
  },
  web: (p: Pencil) => {
    p.rect(6, 12, 52, 40);
    p.line(6, 20, 58, 20);
    p.circle(10.5, 16, 1.1, "fill").circle(14.5, 16, 1.1, "fill").circle(18.5, 16, 1.1, "fill");
    p.rect(11, 25, 19, 14, "fine").hatch(11, 25, 19, 14, 3.5);
    p.line(35, 26, 53, 26).line(35, 31, 49, 31, "fine").line(35, 36, 52, 36, "fine");
    p.line(11, 45, 53, 45, "fine");
  },
  "ai-automation": (p: Pencil) => {
    p.rect(3, 26, 13, 12);
    p.line(16, 32, 22, 32).head(22, 32, 0, 3.5);
    p.poly([[32, 22], [42, 32], [32, 42], [22, 32]]);
    p.circle(32, 32, 1.4, "fill");
    p.line(42, 32, 48, 32).head(48, 32, 0, 3.5);
    p.rect(48, 26, 13, 12);
    p.poly([[32, 42], [32, 52], [9.5, 52], [9.5, 39]], false, "dash");
    p.head(9.5, 39, -T / 2, 3.5);
  },
  "custom-software": (p: Pencil) => {
    p.poly([[5, 18], [28, 18], [28, 26], [34, 26], [34, 38], [28, 38], [28, 46], [5, 46]]);
    p.poly([[32, 18], [59, 18], [59, 46], [32, 46], [32, 39.5], [38, 39.5], [38, 24.5], [32, 24.5]], true, "fine");
    p.hatch(42, 21, 14, 22, 4);
    p.line(5, 54, 59, 54, "dash");
  },
  "backend-cloud": (p: Pencil) => {
    p.ellipse(32, 13, 18, 5);
    p.line(14, 13, 14, 49).line(50, 13, 50, 49);
    for (const y of [25, 37, 49]) p.arc(32, y, 18, 5, 0, T, y === 49 ? "main" : "fine");
    for (const y of [20, 32, 44]) p.circle(44, y, 1.1, "fill");
    p.line(40, 20, 22, 20, "fine");
  },
  "product-design": (p: Pencil) => {
    p.line(32, 2, 32, 7);
    p.circle(32, 10, 3);
    p.line(30.5, 12.8, 15, 55).line(33.5, 12.8, 47, 52);
    p.line(14.5, 55, 15.5, 59);
    p.arc(32, 10, 47, 47, 1.98, 1.2, "dash");
    p.line(20.5, 40, 43, 40, "fine");
  },

  // Capabilities ----------------------------------------------------------
  accessibility: (p: Pencil) => {
    p.rect(3, 15, 58, 34, "dash");
    p.rect(8, 20, 48, 24);
    p.line(18, 32, 40, 32).head(40, 32, 0, 4);
    p.line(43, 26, 43, 38);
  },
  "security-and-privacy": (p: Pencil) => {
    p.arc(32, 27, 11, 12, T, 2 * T);
    p.line(21, 27, 21, 32).line(43, 27, 43, 32);
    p.rect(14, 32, 36, 26);
    p.circle(32, 42, 3).line(32, 45, 32, 51);
  },
  performance: (p: Pencil) => {
    p.circle(32, 37, 21);
    p.rect(28, 7, 8, 5);
    p.line(32, 12, 32, 16);
    p.line(47.5, 20.5, 51, 17);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * 2 * T;
      const r0 = i % 3 === 0 ? 15.5 : 17.5;
      p.line(32 + Math.cos(a) * r0, 37 + Math.sin(a) * r0, 32 + Math.cos(a) * 19, 37 + Math.sin(a) * 19, "fine");
    }
    p.line(32, 37, 42, 26.5);
    p.circle(32, 37, 1.6, "fill");
  },
  testing: (p: Pencil) => {
    [12, 27].forEach((y) => {
      p.rect(8, y, 10, 10);
      p.poly([[10, y + 5], [12.5, y + 8], [17.5, y + 1.5]], false);
      p.line(24, y + 5, 56, y + 5, "fine");
    });
    p.rect(8, 42, 10, 10, "dash");
    p.line(24, 47, 46, 47, "dash");
  },
  "search-and-measurement": (p: Pencil) => {
    p.circle(26, 26, 16);
    p.line(37.5, 37.5, 56, 56).line(40.5, 35, 58.5, 53.5, "fine");
    p.line(16, 34, 36, 34, "fine");
    p.line(19.5, 34, 19.5, 27).line(25.5, 34, 25.5, 20).line(31.5, 34, 31.5, 24);
  },
  "documentation-and-handover": (p: Pencil) => {
    p.poly([[14, 6], [42, 6], [52, 16], [52, 58], [14, 58]]);
    p.poly([[42, 6], [42, 16], [52, 16]], false, "fine");
    p.line(20, 24, 46, 24).line(20, 30, 46, 30, "fine").line(20, 36, 44, 36, "fine").line(20, 42, 36, 42, "fine");
    p.curve([[20, 51], [24, 48], [26, 52], [30, 49], [34, 51]]);
  },

  // Project stages --------------------------------------------------------
  understand: (p: Pencil) => {
    p.rect(5, 8, 34, 20).poly([[12, 28], [12, 35], [19, 28]], false);
    p.line(10, 15, 33, 15, "fine").line(10, 21, 26, 21, "fine");
    p.rect(25, 34, 34, 18, "fine").poly([[52, 52], [52, 58], [46, 52]], false, "fine");
    p.circle(35, 43, 1.2, "fill").circle(42, 43, 1.2, "fill").circle(49, 43, 1.2, "fill");
  },
  shape: (p: Pencil) => {
    p.poly([[8, 56], [8, 8], [56, 56]]);
    p.poly([[16, 48], [16, 30], [34, 48]], true, "fine");
    for (let x = 14; x < 54; x += 6) p.line(x, 56, x, 52, "fine");
  },
  build: (p: Pencil) => {
    p.rect(8, 42, 22, 14).rect(32, 42, 22, 14);
    p.rect(19, 26, 24, 14);
    p.rect(24, 8, 16, 14, "dash");
    p.line(4, 58, 60, 58, "fine");
  },
  run: (p: Pencil) => {
    p.arc(32, 32, 21, 21, 0.35, 2 * T - 0.25);
    p.head(32 + Math.cos(2 * T - 0.25) * 21, 32 + Math.sin(2 * T - 0.25) * 21, 2 * T - 0.25 + T / 2, 5);
    p.poly([[28, 25], [39, 32], [28, 39]]);
  },
} satisfies Record<string, (p: Pencil) => void>;

export type GlyphName = keyof typeof defs;
export const GLYPHS = Object.keys(defs) as GlyphName[];

const cache = new Map<string, Stroke[]>();

/** Strokes for one glyph. `rough` stays low for icons so they read cleanly at small sizes. */
export function glyphStrokes(name: GlyphName, rough = 0.55): Stroke[] {
  const key = `${name}:${rough}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const p = new Pencil(name, rough);
  defs[name](p);
  cache.set(key, p.strokes);
  return p.strokes;
}

/** "Security and privacy" → "security-and-privacy". */
export const glyphKey = (title: string) => title.toLowerCase().replace(/[^a-z]+/g, "-") as GlyphName;
