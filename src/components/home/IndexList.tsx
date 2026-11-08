import Link from "next/link";
import styles from "./home.module.css";

type Row = { key: string; num: string; title: string; detail?: string; to: string; href: string };

/** Full-width rows that invert on hover/focus. Used for situations and client entries. */
export function IndexList({ rows, label }: { rows: Row[]; label?: string }) {
  return (
    <ol className={styles.index} aria-label={label}>
      {rows.map((row) => (
        <li key={row.key}>
          <Link href={row.href} className={styles.indexRow}>
            <span className={styles.indexNum}>{row.num}</span>
            <span className={styles.indexText}>
              {row.title}
              {row.detail ? <small>{row.detail}</small> : null}
            </span>
            <span className={styles.indexTo}>{row.to}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
