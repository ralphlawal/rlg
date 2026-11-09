import type { Sketch } from "@/lib/scope-rules";
import styles from "./sketch.module.css";

/** The drawn outline. Server-safe, so the no-JavaScript version renders the same thing. */
export function SketchOutput({
  result,
  compact = false,
  noteId,
  children,
}: {
  result: Sketch;
  compact?: boolean;
  noteId?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.out} role="region" aria-labelledby="sketch-out-title">
      <p className="label">Your sketch</p>
      <h3 id="sketch-out-title" className={styles.outTitle}>
        The parts it needs
      </h3>
      {/* Keyed by content, so the outline visibly redraws whenever an answer changes. */}
      <div className={styles.parts} key={[...result.clients, ...result.services].join("|")}>
        {result.clients.map((c) => (
          <span key={c} className={styles.node}>
            {c}
          </span>
        ))}
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
        <span className={styles.node}>{result.services.filter((s) => s !== "Database").join(" · ")}</span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
        <span className={styles.node}>Database</span>
      </div>
      <h4>Decide early</h4>
      <ul>
        {result.decisions.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <h4>Likely in version one</h4>
      <ul>
        {result.versionOne.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      {compact ? null : (
        <>
          <h4>Probably later</h4>
          <ul>
            {result.later.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <h4>Questions we’d ask you</h4>
          <ul>
            {result.questions.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </>
      )}
      <p className={styles.note} id={noteId}>
        A starting outline from your answers, not a quote. Rules only: no AI, no prices.
      </p>
      {children ? <div className={styles.actions}>{children}</div> : null}
    </div>
  );
}
