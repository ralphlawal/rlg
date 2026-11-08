import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { LegalInfo } from "@/components/legal/LegalInfo";
import { site } from "@/content/site";
import page from "@/components/ui/pages.module.css";
import styles from "@/components/legal/legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using the Ralph Lawal Group website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageIntro label="Terms" title="Website terms of use." lead="The rules for using this website. Project work is covered separately by each project’s own contract." />
      <section className={`wrap ${styles.page}`} aria-label="Terms of use">
        <div className="grid">
          <div className={page.introBody}>
            <LegalInfo />
            <div className={page.prose}>
              <h2>About this website</h2>
              <p>This website is operated by Ralph Lawal, trading as Ralph Lawal Group, based in {site.location}.</p>

              <h2>Information on this site</h2>
              <p>
                The content here is general information about our work and services. It isn’t professional advice for your
                specific situation, and it isn’t an offer to enter into a contract. Any project is agreed in writing, including
                its scope, price, deliverables, ownership and licensing.
              </p>

              <h2>Using the site</h2>
              <ul>
                <li>Please don’t misuse the site, attempt to break its security, or use the forms to send spam.</li>
                <li>Content, design and code on this site belong to their owners. Please ask before reusing them.</li>
                <li>Links to other websites are provided for convenience; we aren’t responsible for their content.</li>
              </ul>

              <h2>Liability</h2>
              <p>
                We take care to keep this site accurate and available, but can’t guarantee it will always be either. Nothing in
                these terms limits any rights you have that can’t be limited by law.
              </p>

              <h2>Law</h2>
              <p>These terms are governed by the laws of Ireland, and the Irish courts have jurisdiction.</p>

              <h2>Contact</h2>
              <p>
                Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
