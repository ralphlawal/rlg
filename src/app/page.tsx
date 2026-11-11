import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { IndexList } from "@/components/home/IndexList";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SketchTeaser } from "@/components/sketch/SketchTeaser";
import { JsonLd } from "@/components/seo/JsonLd";
import { Glyph } from "@/components/drawings/Drawing";
import { glyphKey, type GlyphName } from "@/components/drawings/glyphs";
import { MIN_CLIENTS_TO_SHOW, publishableClients } from "@/content/clients";
import { capabilities, situations, stages, whatWeDo } from "@/content/home";
import { INSIGHTS_PUBLIC, articles, readingMinutes } from "@/content/insights";
import { cta, site } from "@/content/site";
import styles from "@/components/home/home.module.css";

export const metadata: Metadata = {
  title: { absolute: "Ralph Lawal Group · Software, Apps and AI, Built in Dublin" },
  description:
    "We design and build mobile apps, web platforms, AI systems and custom software for businesses in Ireland and abroad. Explore our expertise or start a project.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const clients = publishableClients();
  const showClients = clients.length >= MIN_CLIENTS_TO_SHOW;

  // Numbers follow the sections actually shown, so hiding one never leaves a gap.
  let n = 0;
  const next = () => ++n;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${site.url}/#organization`,
            name: site.name,
            url: site.url,
            logo: `${site.url}/brand/app-icon-black-512.png`,
            email: site.email,
            description: site.description,
            founder: { "@type": "Person", name: site.founder },
            areaServed: [{ "@type": "Country", name: "Ireland" }, "Worldwide"],
            address: { "@type": "PostalAddress", addressLocality: site.address.locality, addressCountry: site.address.countryCode },
            sameAs: [site.social.x.url],
          },
          { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url, publisher: { "@id": `${site.url}/#organization` } },
        ]}
      />
      <Hero />

      <Section number={next()} label="What we do" titleId="what-title">
        <h2 id="what-title" className="display-m reveal">
          One team from the first sketch to the version people rely on.
        </h2>
        <ul className={`${styles.services} ${styles.withIcons} stagger`}>
          {whatWeDo.map((s) => (
            <li key={s.title} className="reveal">
              <Glyph name={s.href.split("/").pop() as GlyphName} />
              <h3>
                <Link href={s.href}>{s.title}</Link>
              </h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ul>
        <p className={styles.after}>
          <ButtonLink href="/expertise" variant="text" arrow>
            All expertise
          </ButtonLink>
        </p>
      </Section>

      <Section number={next()} label="Capabilities" titleId="capabilities-title" id="capabilities">
        <h2 id="capabilities-title" className="display-m reveal">
          Built in from the first day, not added at the end.
        </h2>
        <p className="lead reveal" style={{ marginTop: 24 }}>
          Every project includes the work that decides whether a product can be trusted, whatever its size.
        </p>
        <ul className={`${styles.services} ${styles.withIcons} stagger`}>
          {capabilities.map((c) => (
            <li key={c.title} className="reveal">
              <Glyph name={glyphKey(c.title)} />
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {showClients ? (
        <Section number={next()} label="Client work" titleId="clients-title" id="clients">
          <h2 id="clients-title" className="display-m reveal">
            Trusted With Their Ideas.
          </h2>
          <p className="lead reveal" style={{ marginTop: 24 }}>
            Different ambitions. Different challenges. One commitment: work that makes a difference.
          </p>
          <IndexList
            label="Client work"
            rows={clients.slice(0, 6).map((c) => ({
              key: c.slug,
              num: c.year,
              title: c.name,
              detail: c.summary,
              to: c.services.join(" · "),
              href: c.website ?? cta.primary.href,
            }))}
          />
        </Section>
      ) : null}

      <Section number={next()} label="Where we usually come in" titleId="where-title">
        <h2 id="where-title" className="display-m reveal">
          You don’t need to know the technology. You need to know what’s in the way.
        </h2>
        <IndexList
          label="Situations we help with"
          rows={situations.map((s, i) => ({
            key: s.href + i,
            num: String(i + 1).padStart(2, "0"),
            title: s.text,
            to: s.to,
            href: s.href,
          }))}
        />
      </Section>

      <Section number={next()} label="How a project runs" titleId="approach-title">
        <h2 id="approach-title" className="display-m reveal">
          Fewer surprises, because the hard questions come first.
        </h2>
        <ol className={`${styles.stages} stagger`}>
          {stages.map((s, i) => (
            <li key={s.name} className="reveal">
              <Glyph name={glyphKey(s.name)} size={40} className={styles.stageIcon} />
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.name}</h3>
              <p>{s.text}</p>
              <p className={styles.get}>
                <span className="label">You get</span>
                {s.get}
              </p>
            </li>
          ))}
        </ol>
        <p className={styles.after}>
          <ButtonLink href="/approach" variant="text" arrow>
            How we work in detail
          </ButtonLink>
        </p>
      </Section>

      <Section number={next()} label="Scope Sketch" titleId="sketch-title" id="sketch">
        <h2 id="sketch-title" className="display-m reveal">
          Sketch your project before you talk to anyone.
        </h2>
        <p className="lead" style={{ marginTop: 24 }}>
          Answer a few questions and we’ll lay out what a first version usually involves. Nothing is sent until you choose
          to send it.
        </p>
        <SketchTeaser />
      </Section>

      {INSIGHTS_PUBLIC ? (
        <Section number={next()} label="Insights" titleId="insights-title" id="insights">
          <h2 id="insights-title" className="display-m reveal">
            Notes from the work.
          </h2>
          <p className="lead reveal" style={{ marginTop: 24 }}>
            Practical writing for people planning a digital product.
          </p>
          <IndexList
            label="Latest insights"
            rows={[...articles]
              .sort((a, b) => b.published.localeCompare(a.published))
              .slice(0, 3)
              .map((a, i) => ({
                key: a.slug,
                num: String(i + 1).padStart(2, "0"),
                title: a.title,
                to: `${a.topic} · ${readingMinutes(a)} min`,
                href: `/insights/${a.slug}`,
              }))}
          />
          <p className={styles.after}>
            <ButtonLink href="/insights" variant="text" arrow>
              All insights
            </ButtonLink>
          </p>
        </Section>
      ) : null}

      <Section number={next()} label="Begin" titleId="begin-title" id="begin">
        <h2 id="begin-title" className={`${styles.beginTitle} reveal`}>
          Tell us what you’re building.
        </h2>
        <ul className={styles.routes}>
          <li>
            <span className="label">A</span>
            <h3>{cta.primary.label}</h3>
            <p>Tell us what you’re building. We’ll review your enquiry and get back to you.</p>
            <ButtonLink href={cta.primary.href} arrow>
              {cta.primary.label}
            </ButtonLink>
          </li>
          <li>
            <span className="label">B</span>
            <h3>{cta.call.label}</h3>
            <p>A free 20-minute call to talk it through first.</p>
            <ButtonLink href={cta.call.href} variant="text" arrow>
              {cta.call.label}
            </ButtonLink>
          </li>
          <li>
            <span className="label">C</span>
            <h3>Email us</h3>
            <p>Prefer to write? We read every message ourselves.</p>
            <ButtonLink href={`mailto:${site.email}`} variant="text" className={styles.mail}>
              {site.email}
            </ButtonLink>
          </li>
        </ul>
      </Section>
    </>
  );
}
