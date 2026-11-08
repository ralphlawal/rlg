import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { IndexList } from "@/components/home/IndexList";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { consulting, services } from "@/content/expertise";
import { cta } from "@/content/site";
import styles from "@/components/ui/pages.module.css";

export const metadata: Metadata = {
  title: "Expertise: Apps, Web, AI and Software",
  description:
    "Mobile apps, websites, AI and automation, custom software, backend and cloud, and product design, from one founder-led studio in Dublin.",
  alternates: { canonical: "/expertise" },
};

export default function ExpertisePage() {
  return (
    <>
      <PageIntro
        label="Expertise"
        title="What we build, and how we think about it."
        lead="We work across the whole product: the interface people see, the systems underneath, and the infrastructure that keeps it running. That matters because most problems sit between those layers."
      />
      <section className="wrap" aria-label="Services">
        <div className="grid">
          <div className={styles.introBody}>
            <IndexList
              label="Services"
              rows={[
                ...services.map((s, i) => ({
                  key: s.slug,
                  num: String(i + 1).padStart(2, "0"),
                  title: s.name,
                  detail: s.summary,
                  to: "Read more",
                  href: `/expertise/${s.slug}`,
                })),
                {
                  key: "consulting",
                  num: String(services.length + 1).padStart(2, "0"),
                  title: consulting.name,
                  detail: consulting.summary,
                  to: "How we work",
                  href: consulting.href,
                },
              ]}
            />
            <div className={styles.actions} style={{ marginBlock: "56px 120px" }}>
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
