import Link from "next/link";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cta, primaryNav, site } from "@/content/site";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header} data-el="<header>">
      <div className={`wrap ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={`${site.name}, home`}>
          <Logo variant="full" height={68} preload className={styles.full} />
          <Logo variant="mark" height={36} preload className={styles.mark} />
        </Link>
        <nav aria-label="Primary" className={styles.nav}>
          <NavLinks items={primaryNav} />
        </nav>
        <div className={styles.tools}>
          <ThemeToggle />
          <ButtonLink href={cta.primary.href} size="sm" className={styles.cta}>
            {cta.primary.label}
          </ButtonLink>
          <MobileMenu items={primaryNav} />
        </div>
      </div>
    </header>
  );
}
