import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { IndexList } from "@/components/home/IndexList";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { articles, formatDate, readingMinutes } from "@/content/insights";
import { cta } from "@/content/site";
import styles from "@/components/ui/pages.module.css";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Practical writing on apps, websites, AI, security and product decisions, for people planning a digital product.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const sorted = [...articles].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <>
      <PageIntro
        label="Insights"
        title="Notes from the work."
        lead="Practical writing for people planning a digital product: what to decide early, what to ask, and what we’d tell a client before they spend money."
      />
      <section className="wrap" aria-label="Articles">
        <div className="grid">
          <div className={styles.introBody}>
            <IndexList
              label="Articles"
              rows={sorted.map((a, i) => ({
                key: a.slug,
                num: String(i + 1).padStart(2, "0"),
                title: a.title,
                detail: a.description,
                to: `${a.topic} · ${readingMinutes(a)} min`,
                href: `/insights/${a.slug}`,
              }))}
            />
            <p className="label" style={{ marginTop: 16 }}>
              Published {formatDate(sorted[0].published)}
            </p>
            <div className={styles.actions} style={{ marginBlock: "48px 120px" }}>
              <ButtonLink href={cta.primary.href} arrow>
                {cta.primary.label}
              </ButtonLink>
              <ButtonLink href={cta.call.href} variant="text">
                {cta.call.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
