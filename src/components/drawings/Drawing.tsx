import type { Stroke } from "@/lib/sketch";
import { glyphStrokes, type GlyphName } from "./glyphs";
import styles from "./drawings.module.css";

type Props = {
  strokes: Stroke[];
  viewBox: string;
  width: number;
  height: number;
  className?: string;
  /** Ink draws itself in. Inside a `.reveal` it waits until the element scrolls into view. */
  draw?: boolean;
  /** Extra SVG content (labels) drawn on top. */
  children?: React.ReactNode;
};

/** Decorative line drawing. Hidden from assistive technology; the text around it carries the meaning. */
export function Drawing({ strokes, viewBox, width, height, className, draw = true, children }: Props) {
  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={`${styles.svg} ${draw ? styles.draw : ""} ${className ?? ""}`}
      aria-hidden="true"
      focusable="false"
    >
      {strokes.map((s, i) => (
        <path
          key={i}
          d={s.d}
          className={s.k === "dash" || s.k === "fill" ? styles[s.k] : `${styles.ink} ${s.k === "fine" ? styles.fine : ""}`}
          pathLength={s.k === "dash" || s.k === "fill" ? undefined : 1}
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
      {children}
    </svg>
  );
}

/** One of the studio's icons. */
export function Glyph({ name, size = 44, className, draw = true }: { name: GlyphName; size?: number; className?: string; draw?: boolean }) {
  return <Drawing strokes={glyphStrokes(name)} viewBox="0 0 64 64" width={size} height={size} className={`${styles.glyph} ${className ?? ""}`} draw={draw} />;
}
