import type { Metadata } from "next";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { SERVICES } from "@/lib/enquiry";
import { decodeAnswers } from "@/lib/scope-share";
import { sketchToText } from "@/lib/scope-rules";
import { site } from "@/content/site";
import { StartTabs } from "./StartTabs";
import styles from "./start.module.css";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Tell us what you’re building. Send a project enquiry, book a free 20-minute discovery call, or email hello@ralphlawalgroup.com.",
  alternates: { canonical: "/start" },
};

/** Rendered fully on the server per request, so URL-driven content (prefills, errors, sketch results)
 *  appears without JavaScript. Streaming would need a script to swap it in. */
export const instant = false;

export default async function StartPage(props: PageProps<"/start">) {
  return (
    <section className={`wrap ${styles.page}`} aria-labelledby="enquiry-title">
      <div className="grid">
        <p className={`label ${styles.label}`}>
          <b>01</b> / Start a project
        </p>
        <div className={styles.head}>
          <h1 id="enquiry-title" className="display-l">
            Tell us what you’re building.
          </h1>
          <p className="lead">We’ll review your enquiry and get back to you. There are three ways to begin; choose whichever suits you.</p>
          <StartTabs current="project" />
        </div>
        <div className={styles.body}>
          <PrefilledForm searchParams={props.searchParams} />
        </div>
        <aside className={styles.aside} aria-labelledby="next-title">
          <h2 id="next-title">What happens next</h2>
          <ol className={styles.steps}>
            <li>We read your enquiry ourselves.</li>
            <li>We get back to you with questions or a suggested next step.</li>
            <li>If it’s a good fit, we arrange a call and then send a written proposal.</li>
          </ol>
          <p style={{ marginTop: 16 }}>
            Prefer to write directly? <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </aside>
      </div>
    </section>
  );
}

const SERVICE_VALUES = new Set<string>(SERVICES.map((s) => s.value));

/** Reads ?service=, ?sketch= and ?error= (set by the no-JavaScript path). */
async function PrefilledForm({ searchParams }: { searchParams: PageProps<"/start">["searchParams"] }) {
  const params = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const service = one(params.service);
  const answers = decodeAnswers(one(params.sketch));
  const error = one(params.error);
  return (
    <EnquiryForm
      initialServices={service && SERVICE_VALUES.has(service) ? [service] : []}
      sketch={answers ? sketchToText(answers) : undefined}
      source={answers ? "sketch" : service ? `service:${service}` : "start"}
      serverError={error && /^[a-z-]{2,20}$/.test(error) ? error : undefined}
    />
  );
}
