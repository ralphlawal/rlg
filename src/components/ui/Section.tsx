import styles from "./Section.module.css";

type Props = {
  id?: string;
  number: number;
  label: string;
  titleId: string;
  children: React.ReactNode;
  className?: string;
  flushBottom?: boolean;
};

/** A numbered section: the mono label sits in the annotation column on desktop. */
export function Section({ id, number, label, titleId, children, className, flushBottom }: Props) {
  const n = String(number).padStart(2, "0");
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      data-el={`<section> ${n}`}
      className={`wrap ${styles.section} ${flushBottom ? styles.flush : ""} ${className ?? ""}`}
    >
      <div className="grid">
        <p className={`label ${styles.label}`}>
          <b>{n}</b> / {label}
        </p>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
