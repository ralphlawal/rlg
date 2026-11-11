import { Pencil } from "@/lib/sketch";
import { Drawing, Glyph } from "./Drawing";
import type { GlyphName } from "./glyphs";
import styles from "./figures.module.css";

/**
 * Fig. 0: a box with its lid just lifted. Something is being made; the drawing doesn't say what.
 * Hidden edges are dashed, the dimensions are left open.
 */
function heroStrokes() {
  const p = new Pencil("fig-0", 1);
  const A = [150, 292] as const, B = [72, 247] as const, C = [228, 247] as const, D = [150, 202] as const;
  const up = (q: readonly [number, number], h = 100) => [q[0], q[1] - h] as const;
  const [A1, B1, C1, D1] = [up(A), up(B), up(C), up(D)];
  // Hidden edges first, so the ink lands on top of them.
  p.poly([B, D, C], false, "dash").line(D[0], D[1], D1[0], D1[1], "dash");
  // Shading on the right face.
  for (let t = 0.08; t < 1; t += 0.085) {
    const x = A[0] + (C[0] - A[0]) * t;
    const y = A[1] + (C[1] - A[1]) * t;
    p.line(x, y - 4, x, y - 96, "fine");
  }
  p.poly([B, A, C], false).line(A[0], A[1], A1[0], A1[1]).line(B[0], B[1], B1[0], B1[1]).line(C[0], C[1], C1[0], C1[1]);
  p.poly([B1, A1, C1, D1]);
  // The lid, lifted and turned slightly.
  const L = [[158, 168], [80, 121], [156, 78], [236, 124]] as const;
  p.poly(L.map(([x, y]) => [x, y] as const));
  p.line(L[1][0], L[1][1], L[1][0], L[1][1] + 6).line(L[0][0], L[0][1], L[0][0], L[0][1] + 6).line(L[3][0], L[3][1], L[3][0], L[3][1] + 6);
  p.poly([[L[1][0], L[1][1] + 6], [L[0][0], L[0][1] + 6], [L[3][0], L[3][1] + 6]], false);
  // Something escaping from the gap.
  p.line(104, 150, 92, 132, "fine").line(124, 162, 116, 140, "fine").line(196, 160, 206, 140, "fine").line(214, 150, 228, 134, "fine");
  // Centre mark on the opening.
  p.line(144, 145, 156, 145, "fine").line(150, 139, 150, 151, "fine");
  // Dimensions, left open.
  p.line(62, 262, 140, 307, "fine").line(60, 258, 66, 268, "fine").line(138, 303, 144, 313, "fine");
  p.line(250, 247, 250, 147, "fine").line(246, 247, 254, 247, "fine").line(246, 147, 254, 147, "fine");
  // Leader to the note.
  p.poly([[236, 118], [262, 64], [306, 64]], false, "fine");
  p.circle(236, 118, 1.6, "fill");
  return p.strokes;
}

export function HeroFigure({ className }: { className?: string }) {
  return (
    <figure className={`${styles.hero} ${className ?? ""}`} aria-hidden="true">
      <Drawing strokes={heroStrokes()} viewBox="0 0 320 340" width={320} height={340}>
        <text className="t t-ink" x={306} y={56} textAnchor="end">Fig. 0</text>
        <text className="t" x={306} y={78} textAnchor="end">Not yet named</text>
        <text className="t" x={92} y={296} transform="rotate(30 92 296)">?</text>
        <text className="t" x={262} y={200}>?</text>
        <text className="t" x={160} y={334} textAnchor="middle">53.3498° N · 6.2603° W</text>
      </Drawing>
    </figure>
  );
}

/** The 404 sheet: an empty frame where a drawing should be, and the pencil that hasn't started it. */
function lostStrokes() {
  const p = new Pencil("lost-sheet", 1);
  p.rect(14, 16, 138, 112, "dash");
  for (const [x, y, sx, sy] of [[14, 16, 1, 1], [152, 16, -1, 1], [14, 128, 1, -1], [152, 128, -1, -1]] as const) {
    p.line(x - 8 * sx, y, x - 3 * sx, y, "fine").line(x, y - 8 * sy, x, y - 3 * sy, "fine");
  }
  p.line(66, 72, 100, 72, "fine").line(83, 55, 83, 89, "fine");
  // The pencil, lying across the corner.
  const P0 = [168, 142] as const, P1 = [222, 70] as const;
  const o = [3.2, 2.4] as const, d = [0.6, -0.8] as const;
  const at = (q: readonly [number, number], s: number) => [q[0] + o[0] * s, q[1] + o[1] * s] as const;
  const a = at(P0, 1), b = at(P0, -1), c = at(P1, 1), e = at(P1, -1);
  p.line(a[0], a[1], c[0], c[1]).line(b[0], b[1], e[0], e[1]).line(a[0], a[1], b[0], b[1]);
  const Q = [P0[0] + d[0] * 9, P0[1] + d[1] * 9] as const;
  p.line(at(Q, 1)[0], at(Q, 1)[1], at(Q, -1)[0], at(Q, -1)[1]);
  const tip = [P1[0] + d[0] * 15, P1[1] + d[1] * 15] as const;
  p.line(c[0], c[1], tip[0], tip[1]).line(e[0], e[1], tip[0], tip[1]);
  p.line(P0[0] + d[0] * 4, P0[1] + d[1] * 4, P1[0], P1[1], "fine");
  p.circle(tip[0], tip[1], 1, "fill");
  // Where it last touched the paper.
  p.curve([[120, 136], [132, 131], [140, 138], [154, 132]], "fine");
  return p.strokes;
}

export function LostSheetFigure({ className }: { className?: string }) {
  return (
    <div className={`${styles.lost} ${className ?? ""}`} aria-hidden="true">
      <Drawing strokes={lostStrokes()} viewBox="0 0 240 156" width={240} height={156}>
        <text className="t" x={83} y={110} textAnchor="middle">Fig. —</text>
      </Drawing>
    </div>
  );
}

/** A service's icon, drawn large on its own sheet with registration marks and a figure number. */
export function SheetFigure({ name, n, label, className }: { name: GlyphName; n: string; label: string; className?: string }) {
  return (
    <figure className={`${styles.sheet} ${className ?? ""}`} aria-hidden="true">
      <Glyph name={name} size={150} className={styles.sheetGlyph} />
      <figcaption>
        <span>Fig. {n}</span>
        <span>{label}</span>
      </figcaption>
    </figure>
  );
}
