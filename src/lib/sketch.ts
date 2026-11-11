/**
 * A tiny pencil. Turns plain geometry into slightly imperfect strokes: lines bow a little and run past
 * their corners, circles don't quite close, the way a drafter's lines do. Seeded, so every drawing comes
 * out the same on every render (no hydration differences, no randomness between visits).
 */

export type StrokeKind = "main" | "fine" | "dash" | "fill";
export type Stroke = { d: string; k?: StrokeKind };
type Pt = readonly [number, number];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFrom(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

const f = (n: number) => Math.round(n * 10) / 10;

export class Pencil {
  private rand: () => number;
  readonly strokes: Stroke[] = [];

  /** `rough` scales every imperfection; about 1 for illustrations, lower for small icons. */
  constructor(seed: string, private rough = 1) {
    this.rand = mulberry32(seedFrom(seed));
  }

  private r(min: number, max: number) {
    return min + (max - min) * this.rand();
  }

  private push(d: string, k?: StrokeKind) {
    this.strokes.push(k ? { d, k } : { d });
  }

  private lineD(x1: number, y1: number, x2: number, y2: number, overshoot = 1) {
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    const j = 0.35 * this.rough;
    const over = Math.min(len * 0.05, 1.8) * this.rough * overshoot;
    const sx = x1 - ux * over * this.r(0, 1) + this.r(-j, j);
    const sy = y1 - uy * over * this.r(0, 1) + this.r(-j, j);
    const ex = x2 + ux * over * this.r(0.2, 1) + this.r(-j, j);
    const ey = y2 + uy * over * this.r(0.2, 1) + this.r(-j, j);
    const bow = this.r(-1, 1) * Math.min(len * 0.015, 2.2) * this.rough;
    const mx = (sx + ex) / 2 - uy * bow;
    const my = (sy + ey) / 2 + ux * bow;
    return `M${f(sx)} ${f(sy)}Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`;
  }

  line(x1: number, y1: number, x2: number, y2: number, k?: StrokeKind) {
    this.push(this.lineD(x1, y1, x2, y2, k === "fill" ? 0 : 1), k);
    return this;
  }

  /** Each side is its own stroke, so corners cross slightly, like a drafted outline. */
  poly(points: Pt[], close = true, k?: StrokeKind) {
    const n = close ? points.length : points.length - 1;
    for (let i = 0; i < n; i++) {
      const [a, b] = [points[i], points[(i + 1) % points.length]];
      this.line(a[0], a[1], b[0], b[1], k);
    }
    return this;
  }

  rect(x: number, y: number, w: number, h: number, k?: StrokeKind) {
    return this.poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true, k);
  }

  /** A smooth hand curve through points (Catmull-Rom), with a little wobble. */
  curve(points: Pt[], k?: StrokeKind) {
    const j = 0.3 * this.rough;
    const p = points.map(([x, y]) => [x + this.r(-j, j), y + this.r(-j, j)] as Pt);
    let d = `M${f(p[0][0])} ${f(p[0][1])}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] ?? p[i];
      const p1 = p[i];
      const p2 = p[i + 1];
      const p3 = p[i + 2] ?? p2;
      const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
    }
    this.push(d, k);
    return this;
  }

  /** Elliptical arc from angle a0 to a1 (radians, clockwise on screen). */
  arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, k?: StrokeKind) {
    const steps = Math.max(4, Math.ceil(Math.abs(a1 - a0) / 0.5));
    const wob = 0.012 * this.rough;
    const pts: Pt[] = [];
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps;
      const s = 1 + this.r(-wob, wob);
      pts.push([cx + Math.cos(a) * rx * s, cy + Math.sin(a) * ry * s]);
    }
    return this.curve(pts, k);
  }

  /** A full ellipse that runs a little past its start, as a hand-drawn circle does. */
  ellipse(cx: number, cy: number, rx: number, ry: number, k?: StrokeKind) {
    const start = this.r(0, Math.PI * 2);
    if (k === "fill") {
      // Filled dots stay neat: a smudge, not a scribble.
      this.push(`M${f(cx - rx)} ${f(cy)}a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0Z`, "fill");
      return this;
    }
    return this.arc(cx, cy, rx, ry, start, start + Math.PI * 2 + this.r(0.12, 0.35) * this.rough, k);
  }

  circle(cx: number, cy: number, r: number, k?: StrokeKind) {
    return this.ellipse(cx, cy, r, r, k);
  }

  /** Two short strokes making an arrowhead at (x, y), pointing along `angle`. */
  head(x: number, y: number, angle: number, size = 4, k?: StrokeKind) {
    for (const s of [-1, 1]) {
      const a = angle + Math.PI - s * 0.5;
      this.push(this.lineD(x, y, x + Math.cos(a) * size, y + Math.sin(a) * size, 0.3), k);
    }
    return this;
  }

  /** 45° shading inside a rectangle. */
  hatch(x: number, y: number, w: number, h: number, gap = 4, k: StrokeKind = "fine") {
    for (let t = -h + gap / 2; t < w; t += gap) {
      let x0 = x + t;
      let y0 = y + h;
      let x1 = x + t + h;
      let y1 = y;
      if (x0 < x) { y0 -= x - x0; x0 = x; }
      if (x1 > x + w) { y1 += x1 - (x + w); x1 = x + w; }
      if (x1 - x0 > 1) this.push(this.lineD(x0, y0, x1, y1, 0.2), k);
    }
    return this;
  }
}
