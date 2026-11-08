import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { LegalInfo } from "@/components/legal/LegalInfo";
import { TableWrap } from "@/components/legal/TableWrap";
import page from "@/components/ui/pages.module.css";
import styles from "@/components/legal/legal.module.css";

export const metadata: Metadata = {
  title: "Cookies",
  description: "What this website stores on your device, which is very little, and why there’s no cookie banner.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <>
      <PageIntro label="Cookies" title="Cookies and storage." lead="This site sets no advertising or analytics cookies, which is why there’s no cookie banner." />
      <section className={`wrap ${styles.page}`} aria-label="Cookies">
        <div className="grid">
          <div className={page.introBody}>
            <LegalInfo />
            <div className={page.prose}>
              <h2>What is stored on your device</h2>
              <TableWrap label="What is stored on your device">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Purpose</th>
                    <th scope="col">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>rlg-theme</td>
                    <td>Local storage</td>
                    <td>Remembers whether you chose the light or dark theme</td>
                    <td>Until you clear it</td>
                  </tr>
                </tbody>
              </table>
              </TableWrap>

              <h2>Only when you use them</h2>
              <ul>
                <li>
                  <strong>Spam protection on forms (Cloudflare Turnstile)</strong>, when enabled, loads only when you reach a form
                  and may store a short-lived token needed for the check.
                </li>
                <li>
                  <strong>Booking a discovery call (Cal.com)</strong> happens on Cal.com’s own page, which has its own cookie notice.
                </li>
              </ul>

              <h2>Visit statistics</h2>
              <p>
                We count visits with Vercel Web Analytics, which doesn’t use cookies and doesn’t track you across other websites.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
