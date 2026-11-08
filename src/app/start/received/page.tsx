import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cta } from "@/content/site";
import styles from "../start.module.css";

export const metadata: Metadata = {
  title: "Received",
  robots: { index: false, follow: false },
};

/** Rendered fully on the server per request, so URL-driven content (prefills, errors, sketch results)
 *  appears without JavaScript. Streaming would need a script to swap it in. */
export const instant = false;

export default function ReceivedPage(props: PageProps<"/start/received">) {
  return (
    <section className={`wrap ${styles.page}`} aria-labelledby="received-title">
      <div className="grid">
        <FromUrl searchParams={props.searchParams} />
      </div>
    </section>
  );
}

async function FromUrl({ searchParams }: { searchParams: PageProps<"/start/received">["searchParams"] }) {
  const p = await searchParams;
  const ref = typeof p.ref === "string" && /^RLG-\d{4}-[A-Z0-9]{4}$/.test(p.ref) ? p.ref : null;
  return <Content reference={ref} kind={p.kind === "call" ? "call" : "project"} />;
}

function Content({ reference, kind }: { reference: string | null; kind: "project" | "call" }) {
  return (
    <>
      <p className={`label ${styles.label}`}>
        <b>Received</b>
        {reference ? <span className={styles.ref}> · {reference}</span> : null}
      </p>
      <div className={styles.head}>
        <h1 id="received-title" className="display-l" tabIndex={-1}>
          {kind === "call" ? "Thanks. We’ll be in touch to agree a time." : "Thank you. We have your enquiry."}
        </h1>
        {reference ? (
          <p className="lead">
            Your reference is <strong className={styles.ref}>{reference}</strong>. Quote it if you write to us about this
            {kind === "call" ? " call" : " enquiry"}.
          </p>
        ) : null}
        <ol className={styles.steps}>
          {kind === "call" ? (
            <>
              <li>We’ll reply by email with a time that suits, based on what you suggested.</li>
              <li>You’ll receive a calendar invitation with a video link.</li>
            </>
          ) : (
            <>
              <li>We read your enquiry ourselves.</li>
              <li>We get back to you with questions or a suggested next step.</li>
              <li>If it’s a good fit, we arrange a call and then send a written proposal.</li>
            </>
          )}
        </ol>
        <div className={styles.actions}>
          {kind === "project" ? (
            <ButtonLink href={cta.call.href} arrow>
              {cta.call.label}
            </ButtonLink>
          ) : null}
          <ButtonLink href={cta.secondary.href} variant="text" arrow>
            {cta.secondary.label}
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
