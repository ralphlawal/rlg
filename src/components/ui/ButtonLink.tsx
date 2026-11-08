import Link from "next/link";
import styles from "./Button.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "text";
  size?: "md" | "sm";
  arrow?: boolean;
  className?: string;
};

/** Links styled as the site's buttons. Internal paths use next/link; others a plain anchor. */
export function ButtonLink({ href, children, variant = "primary", size = "md", arrow = false, className }: Props) {
  const cls = [variant === "primary" ? styles.primary : styles.text, size === "sm" ? styles.sm : "", className ?? ""].join(" ");
  const content = (
    <>
      {children}
      {arrow ? (
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      ) : null}
    </>
  );
  return href.startsWith("/") ? (
    <Link href={href} className={cls}>
      {content}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {content}
    </a>
  );
}
