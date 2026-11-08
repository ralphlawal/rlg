import styles from "./pages.module.css";

/** A numbered content block on inner pages. */
export function Block({ n, title, id, children }: { n: string; title: string; id: string; children: React.ReactNode }) {
  return (
    <section className={`wrap ${styles.block}`} aria-labelledby={`${id}-title`} id={id}>
      <div className="grid">
        <p className={`label ${styles.blockLabel}`}>
          <b>{n}</b>
        </p>
        <div className={styles.blockBody}>
          <h2 id={`${id}-title`} className="heading">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}
