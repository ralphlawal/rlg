import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { AUTHOR, articles, formatDate, getArticle, readingMinutes, type Article, type ArticleBlock } from "@/content/insights";
import { cta, site } from "@/content/site";
import { Glyph } from "@/components/drawings/Drawing";
import type { GlyphName } from "@/components/drawings/glyphs";
import styles from "./article.module.css";

const TOPIC_GLYPH: Record<Article["topic"], GlyphName> = {
  Mobile: "mobile-apps",
  Product: "product-design",
  "AI and automation": "ai-automation",
  "Security and privacy": "security-and-privacy",
};

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const a = getArticle((await props.params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/insights/${a.slug}` },
    authors: [{ name: AUTHOR.name }],
    openGraph: {
      type: "article",
      title: a.title,
      description: a.description,
      url: `/insights/${a.slug}`,
      publishedTime: a.published,
      authors: [AUTHOR.name],
    },
  };
}

export default async function ArticlePage(props: PageProps<"/insights/[slug]">) {
  const a = getArticle((await props.params).slug);
  if (!a) notFound();
  const others = articles.filter((x) => x.slug !== a.slug).slice(0, 3);
  const url = `${site.url}/insights/${a.slug}`;

  return (
    <article className={styles.article} aria-labelledby="article-title">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.description,
            datePublished: a.published,
            dateModified: a.published,
            author: { "@type": "Person", name: AUTHOR.name, jobTitle: "Founder" },
            publisher: { "@type": "Organization", name: site.name, url: site.url, logo: { "@type": "ImageObject", url: `${site.url}/brand/app-icon-black-512.png` } },
            mainEntityOfPage: url,
            image: `${url}/opengraph-image`,
            articleSection: a.topic,
            inLanguage: "en-IE",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Insights", item: `${site.url}/insights` },
              { "@type": "ListItem", position: 2, name: a.title, item: url },
            ],
          },
        ]}
      />
      <header className={`wrap ${styles.head}`}>
        <Breadcrumbs items={[{ label: "Insights", href: "/insights" }, { label: a.topic }]} />
        <div className={styles.measure}>
          <Glyph name={TOPIC_GLYPH[a.topic]} size={48} className={styles.topicGlyph} />
          <p className="label">
            <b>{a.topic}</b> · <time dateTime={a.published}>{formatDate(a.published)}</time> · {readingMinutes(a)} min read
          </p>
          <h1 id="article-title" className={styles.title}>
            {a.title}
          </h1>
          <p className={styles.standfirst}>{a.standfirst}</p>
          <p className={styles.byline}>
            By <strong>{AUTHOR.name}</strong>, {AUTHOR.role}
          </p>
        </div>
      </header>

      <div className={`wrap ${styles.body}`}>
        <div className={styles.measure}>
          {a.blocks.map((b, i) => (
            <Block key={i} block={b} />
          ))}

          <aside className={styles.related} aria-labelledby="related-title">
            <h2 id="related-title" className="label">
              Related
            </h2>
            <div className={styles.relatedLinks}>
              {a.related.map((r) => (
                <ButtonLink key={r.href} href={r.href} variant="text" arrow>
                  {r.label}
                </ButtonLink>
              ))}
            </div>
          </aside>

          <section className={styles.cta} aria-labelledby="cta-title">
            <h2 id="cta-title">Planning something like this?</h2>
            <p>Tell us what you’re building, or talk it through first on a free 20-minute call.</p>
            <div className={styles.ctaActions}>
              <ButtonLink href={cta.primary.href} arrow>
                {cta.primary.label}
              </ButtonLink>
              <ButtonLink href={cta.call.href} variant="text">
                {cta.call.label}
              </ButtonLink>
            </div>
          </section>
        </div>
      </div>

      {others.length ? (
        <nav className={`wrap ${styles.more}`} aria-label="More insights">
          <p className="label">More insights</p>
          <ul>
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/insights/${o.slug}`}>
                  <span className="label">{o.topic}</span>
                  <span className={styles.moreTitle}>{o.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </article>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.t) {
    case "h2":
      return <h2 className={styles.h2}>{block.text}</h2>;
    case "ul":
      return (
        <ul className={styles.ul}>
          {block.items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className={styles.ol}>
          {block.items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      );
    case "note":
      return (
        <aside className={styles.note}>
          <span className="label">Note</span>
          <p>{block.text}</p>
        </aside>
      );
    default:
      return <p className={styles.p}>{block.text}</p>;
  }
}
