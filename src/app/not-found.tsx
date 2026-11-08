import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cta } from "@/content/site";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** The "missing sheet": a small moment of character where visitors are mildly lost. */
export default function NotFound() {
  return (
    <section className={`wrap ${styles.page}`} aria-labelledby="nf-title">
      <div className={styles.sheet}>
        <div className={styles.block} aria-label="Drawing title block">
          <span>Sheet not found</span>
          <span>Rev. —</span>
          <span>Drawn by: nobody yet</span>
        </div>
        <h1 id="nf-title" className="display-l">
          This page hasn’t been drawn.
        </h1>
        <p className="lead">It may have moved when we rebuilt the site, or the link may be mistyped.</p>
        <ul className={styles.links}>
          <li>
            <ButtonLink href="/" variant="text" arrow>
              Home
            </ButtonLink>
          </li>
          <li>
            <ButtonLink href="/expertise" variant="text" arrow>
              Expertise
            </ButtonLink>
          </li>
          <li>
            <ButtonLink href={cta.primary.href} arrow>
              {cta.primary.label}
            </ButtonLink>
          </li>
        </ul>
      </div>
    </section>
  );
}
