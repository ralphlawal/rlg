"use client";

import { useRef } from "react";
import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { cta, site } from "@/content/site";
import styles from "./MobileMenu.module.css";

type Item = { readonly href: string; readonly label: string };

/**
 * Full-screen menu for phones and tablets, built on <dialog>:
 * the browser provides the focus trap, Escape to close and focus return.
 */
export function MobileMenu({ items }: { items: readonly Item[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        className={styles.open}
        aria-haspopup="dialog"
        aria-controls="site-menu"
        onClick={() => ref.current?.showModal()}
      >
        Menu
      </button>
      <dialog id="site-menu" ref={ref} className={styles.dialog} aria-label="Menu">
        <div className={`wrap ${styles.top}`}>
          <Link href="/" onClick={close} aria-label={`${site.name}, home`} className={styles.home}>
            <Logo variant="mark" height={36} />
          </Link>
          <button type="button" className={styles.close} onClick={close}>
            Close
          </button>
        </div>
        <nav aria-label="Menu" className={`wrap ${styles.body}`}>
          <NavLinks items={items} variant="menu" onNavigate={close} />
          <div className={styles.actions}>
            <Link href={cta.primary.href} className={styles.primary} onClick={close}>
              {cta.primary.label} <span aria-hidden="true">→</span>
            </Link>
            <Link href={cta.call.href} className={styles.secondary} onClick={close}>
              {cta.call.label}
            </Link>
          </div>
        </nav>
        <div className={`wrap ${styles.foot}`}>
          <Logo variant="full" height={72} />
          <div className={styles.footRow}>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <ThemeToggle />
          </div>
        </div>
      </dialog>
    </>
  );
}
