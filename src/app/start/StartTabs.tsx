import Link from "next/link";
import { cta, site } from "@/content/site";
import styles from "./start.module.css";

/** Three ways to begin. Real links: each is its own page, so they work without JavaScript. */
export function StartTabs({ current }: { current: "project" | "call" }) {
  return (
    <nav aria-label="Ways to get in touch" className={styles.tabs}>
      <Link href="/start" aria-current={current === "project" ? "page" : undefined}>
        {cta.primary.label}
      </Link>
      <Link href={cta.call.href} aria-current={current === "call" ? "page" : undefined}>
        {cta.call.label}
      </Link>
      <a href={`mailto:${site.email}`}>Email</a>
    </nav>
  );
}
