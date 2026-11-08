import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { LegalInfo } from "@/components/legal/LegalInfo";
import { TableWrap } from "@/components/legal/TableWrap";
import { site } from "@/content/site";
import page from "@/components/ui/pages.module.css";
import styles from "@/components/legal/legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How Ralph Lawal Group collects, uses and protects personal data, in plain language.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro label="Privacy" title="Privacy notice." lead="What we collect, why, who helps us process it, how long we keep it, and your rights." />
      <section className={`wrap ${styles.page}`} aria-label="Privacy notice">
        <div className="grid">
          <div className={page.introBody}>
            <LegalInfo />
            <div className={page.prose}>
              <h2>Who we are</h2>
              <p>
                Ralph Lawal Group is the trading name of Ralph Lawal, based in {site.location}. For the personal data described
                here, Ralph Lawal is the data controller. Contact: <a href={`mailto:${site.email}`}>{site.email}</a>. We have not
                appointed a data protection officer.
              </p>

              <h2>What we collect, and why</h2>
              <TableWrap label="What we collect, and why">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Data</th>
                    <th scope="col">Why</th>
                    <th scope="col">Lawful basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Project enquiries: name, email, optional company, project details, optional budget, timing and Scope Sketch</td>
                    <td>To reply and, if you wish, prepare a proposal</td>
                    <td>Steps taken at your request before a contract</td>
                  </tr>
                  <tr>
                    <td>Discovery call requests: name, email, optional company, preferred times and topic</td>
                    <td>To arrange the call</td>
                    <td>Steps taken at your request before a contract</td>
                  </tr>
                  <tr>
                    <td>Emails you send us</td>
                    <td>To reply</td>
                    <td>Our legitimate interest in answering correspondence</td>
                  </tr>
                  <tr>
                    <td>Technical data: server logs and spam-check signals</td>
                    <td>To keep the site secure and working</td>
                    <td>Our legitimate interest in security</td>
                  </tr>
                  <tr>
                    <td>Aggregate visit statistics, without cookies</td>
                    <td>To understand which pages are useful</td>
                    <td>Our legitimate interest in improving the site</td>
                  </tr>
                </tbody>
              </table>
              </TableWrap>
              <p>We don’t ask for your phone number or address, don’t sell data, and don’t use it for advertising.</p>

              <h2>Who processes it for us</h2>
              <ul>
                <li>Vercel: website hosting and cookieless visit statistics.</li>
                <li>Formspree: delivers enquiries from the website to our inbox.</li>
                <li>Cloudflare Turnstile: spam protection on forms, when enabled.</li>
                <li>Cal.com: booking discovery calls, once online booking is connected.</li>
                <li>Our email provider: holds the messages we receive.</li>
              </ul>
              <p>
                Some of these providers are based outside the European Economic Area. Where they process personal data outside
                it, they rely on recognised safeguards such as the EU–US Data Privacy Framework or Standard Contractual Clauses.
              </p>

              <h2>How long we keep it</h2>
              <ul>
                <li>Enquiries are removed from Formspree once received, and kept in our inbox for up to 24 months if no project follows.</li>
                <li>If we work together, project correspondence is kept for as long as our business records require.</li>
                <li>Server logs and spam-check signals are kept only for short periods set by our providers.</li>
              </ul>

              <h2>Your rights</h2>
              <p>
                You can ask to access, correct or delete your personal data, to restrict or object to how we use it, or to receive
                it in a portable format. Email <a href={`mailto:${site.email}`}>{site.email}</a>. We’ll respond within one month.
              </p>
              <p>
                If you’re unhappy with how we handle your data, you can complain to the Data Protection Commission at{" "}
                <a href="https://www.dataprotection.ie" rel="noopener">
                  dataprotection.ie
                </a>
                .
              </p>

              <h2>Cookies</h2>
              <p>
                We don’t use advertising or analytics cookies. See the <a href="/cookies">cookies page</a> for the little that is
                stored on your device.
              </p>

              <h2>Changes</h2>
              <p>We’ll update this notice when what we do changes, and show the date at the top.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
