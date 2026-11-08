import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

/** Visible breadcrumbs. Structured data is added separately by each page. */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <ol>
        {items.map((item, i) => (
          <li key={item.label}>
            {item.href && i < items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
