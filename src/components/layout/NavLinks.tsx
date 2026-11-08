"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavLinks.module.css";

type Item = { readonly href: string; readonly label: string };

export function NavLinks({ items, variant = "bar", onNavigate }: { items: readonly Item[]; variant?: "bar" | "menu"; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className={variant === "bar" ? styles.bar : styles.menu}>
      {items.map((item) => {
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link href={item.href} aria-current={current ? "page" : undefined} className={styles.link} onClick={onNavigate}>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
