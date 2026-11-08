import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { Block } from "@/components/ui/Block";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cta, site } from "@/content/site";
import styles from "@/components/ui/pages.module.css";
import own from "./group.module.css";

export const metadata: Metadata = {
  title: "About Ralph Lawal Group",
  description:
    "A founder-led technology studio in Dublin, Ireland, designing and building digital products for businesses in Ireland and abroad.",
  alternates: { canonical: "/group" },
};

const beliefs = [
  { title: "Execution is the difference.", text: "Good ideas are common. The careful, unglamorous work of making them reliable is not. That’s where we put our effort." },
  { title: "Clarity is a kindness.", text: "In our software, our proposals and our invoices." },
  { title: "Privacy is designed in.", text: "People trust products with personal parts of their lives. We build as if that trust is the product, because often it is." },
  { title: "Small and accountable.", text: "You work directly with the founder. No account managers in between." },
];

export default function GroupPage() {
  return (
    <>
      <PageIntro
        label="The Group"
        title="A founder-led technology studio, built on doing the work properly."
        lead={`Ralph Lawal Group designs and builds digital products: mobile apps, web platforms, AI systems and custom software. It was started by ${site.founder}, trades under his name, and works with businesses in Ireland and internationally from ${site.location}.`}
      />

      <Block n="01" title="What we believe" id="beliefs">
        <div className={styles.cols}>
          {beliefs.map((b) => (
            <div key={b.title}>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block n="02" title="From the founder" id="founder">
        <div className={own.founder}>
          {/* Typographic portrait: complete without a photograph; a real photo can replace it later. */}
          <div className={own.portrait} aria-hidden="true">
            <span className={own.initials}>RL</span>
            <span className="label">Founder</span>
          </div>
          <figure className={own.letter}>
            <blockquote>
              <p>
                I started Ralph Lawal Group to build software the way I’d want it built for me: thought through, honest
                about trade-offs, and still working well long after launch day.
              </p>
              <p>
                I hold every project to that standard, from the first conversation to long after launch. If you have
                something worth building, I’d like to hear about it.
              </p>
            </blockquote>
            <figcaption>
              <strong>{site.founder}</strong>
              <span className="label">Founder · {site.location}</span>
            </figcaption>
          </figure>
        </div>
      </Block>

      <Block n="03" title="Where we are" id="where">
        <div className={styles.prose}>
          <p>
            Based in {site.location}. Working with clients in Ireland and abroad, remotely, and in person when it helps.
          </p>
          <p>
            Email <a href={`mailto:${site.email}`}>{site.email}</a> or follow{" "}
            <a href={site.social.x.url} rel="me noopener">
              {site.social.x.handle}
            </a>{" "}
            on X.
          </p>
        </div>
        <div className={styles.actions}>
          <ButtonLink href={cta.primary.href} arrow>
            {cta.primary.label}
          </ButtonLink>
          <ButtonLink href={cta.secondary.href} variant="text">
            {cta.secondary.label}
          </ButtonLink>
        </div>
      </Block>
    </>
  );
}
