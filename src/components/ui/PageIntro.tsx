import { Breadcrumbs } from "./Breadcrumbs";
import styles from "./pages.module.css";

type Props = {
  label: string;
  title: string;
  lead?: React.ReactNode;
  titleId?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
};

/** The opening of every inner page: mono label in the annotation column, large title, lead. */
export function PageIntro({ label, title, lead, titleId = "page-title", breadcrumbs, children }: Props) {
  return (
    <header className={`wrap ${styles.intro}`}>
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="grid">
        <p className={`label ${styles.introLabel}`}>
          <b>{label}</b>
        </p>
        <div className={styles.introBody}>
          <h1 id={titleId} className="display-l">
            {title}
          </h1>
          {lead ? <p className="lead">{lead}</p> : null}
          {children}
        </div>
      </div>
    </header>
  );
}
