import Link from "next/link";
import { Logo } from "./Logo";
import { BlueprintToggle } from "@/components/blueprint/BlueprintToggle";
import { cta, site } from "@/content/site";
import styles from "./Footer.module.css";

const groups = [
  {
    title: "Studio",
    links: [
      { href: "/expertise", label: "Expertise" },
      { href: "/approach", label: "Approach" },
      { href: "/group", label: "Group" },
    ],
  },
  {
    title: "Contact",
    links: [
      { href: cta.primary.href, label: cta.primary.label },
      { href: cta.call.href, label: cta.call.label },
      { href: `mailto:${site.email}`, label: "Email" },
      { href: site.social.x.url, label: `X (${site.social.x.handle})` },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/cookies", label: "Cookies" },
      { href: "/terms", label: "Terms" },
      { href: "/colophon", label: "Colophon" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className={styles.footer} data-el="<footer>">
      <div className="wrap grid">
        <div className={styles.brand}>
          <Logo variant="full" height={96} className={styles.logo} />
          <p>A founder-led technology studio based in {site.location}, working with clients internationally.</p>
        </div>
        {groups.map((group) => (
          <div key={group.title} className={styles.col}>
            <h2 className="label">{group.title}</h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href}>{link.label}</Link>
                  ) : (
                    <a href={link.href} rel={link.href.startsWith("http") ? "me noopener" : undefined}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className={styles.base}>
          <p>
            © {site.copyrightYear} {site.name}. {site.legalLine}
          </p>
          <BlueprintToggle />
          <p className={styles.whisper}>Drawn in Ireland. Built to be used.</p>
        </div>
      </div>
    </footer>
  );
}
