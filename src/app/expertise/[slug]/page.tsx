import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui/PageIntro";
import { Block } from "@/components/ui/Block";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { getService, services } from "@/content/expertise";
import { cta, site } from "@/content/site";
import styles from "@/components/ui/pages.module.css";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/expertise/[slug]">): Promise<Metadata> {
  const s = getService((await props.params).slug);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: `/expertise/${s.slug}` },
    openGraph: { title: `${s.metaTitle} · ${site.name}`, description: s.metaDescription, url: `/expertise/${s.slug}` },
  };
}

export default async function ServicePage(props: PageProps<"/expertise/[slug]">) {
  const s = getService((await props.params).slug);
  if (!s) notFound();
  const quoteHref = `/start?service=${s.enquiry}#enquiry`;
  // Block numbers follow the blocks actually shown.
  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <article aria-labelledby="page-title">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.name,
            description: s.metaDescription,
            serviceType: s.name,
            provider: { "@type": "Organization", name: site.name, url: site.url },
            areaServed: [{ "@type": "Country", name: "Ireland" }, "Worldwide"],
            url: `${site.url}/expertise/${s.slug}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Expertise", item: `${site.url}/expertise` },
              { "@type": "ListItem", position: 2, name: s.name, item: `${site.url}/expertise/${s.slug}` },
            ],
          },
        ]}
      />
      <PageIntro
        label={s.name}
        title={s.title}
        lead={s.intro}
        breadcrumbs={[{ label: "Expertise", href: "/expertise" }, { label: s.name }]}
      >
        <div className={styles.actions}>
          <ButtonLink href={quoteHref} arrow>
            {cta.quote.label}
          </ButtonLink>
          <ButtonLink href={cta.call.href} variant="text">
            {cta.call.label}
          </ButtonLink>
        </div>
      </PageIntro>

      <Block n={num()} title="Who it’s for" id="who">
        <ul className={styles.list}>
          {s.audience.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Block>

      <Block n={num()} title="Problems it solves" id="problems">
        <ul className={styles.list}>
          {s.problems.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Block>

      <Block n={num()} title="What you get" id="deliverables">
        <ul className={styles.list}>
          {s.deliverables.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Block>

      <Block n={num()} title="How we approach it" id="approach">
        <div className={`${styles.cols} ${styles.cols3}`}>
          {s.approach.map((a) => (
            <div key={a.title}>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </div>
          ))}
        </div>
      </Block>

      {s.related.length ? (
        <Block n={num()} title="Related" id="related">
          <div className={styles.actions} style={{ marginTop: 0 }}>
            {s.related.map((r) => (
              <ButtonLink key={r.href} href={r.href} variant="text" arrow>
                {r.label}
              </ButtonLink>
            ))}
          </div>
        </Block>
      ) : null}

      <Block n={num()} title="Common questions" id="faq">
        <div className={styles.faq}>
          {s.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <div className={styles.actions}>
          <ButtonLink href={quoteHref} arrow>
            {s.quoteLabel}
          </ButtonLink>
        </div>
      </Block>
    </article>
  );
}
