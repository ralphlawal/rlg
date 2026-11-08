import type { Metadata } from "next";
import { CallRequestForm } from "@/components/forms/CallRequestForm";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { site } from "@/content/site";
import { StartTabs } from "../StartTabs";
import styles from "../start.module.css";

export const metadata: Metadata = {
  title: "Book a Discovery Call",
  description: "Book a free 20-minute discovery call to talk through your project with Ralph Lawal Group.",
  alternates: { canonical: "/start/call" },
};

/** Set when the Cal.com account and 20-minute event exist. Empty = request mode. */
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

/** Rendered fully on the server per request, so URL-driven content (prefills, errors, sketch results)
 *  appears without JavaScript. Streaming would need a script to swap it in. */
export const instant = false;

export default function CallPage(props: PageProps<"/start/call">) {
  return (
    <section className={`wrap ${styles.page}`} aria-labelledby="call-title">
      <div className="grid">
        <p className={`label ${styles.label}`}>
          <b>02</b> / Discovery call
        </p>
        <div className={styles.head}>
          <h1 id="call-title" className="display-l">
            A free 20-minute discovery call.
          </h1>
          <p className="lead">
            Twenty minutes to talk through what you want to build, what’s in the way, and whether we’re the right people to
            help. No cost and no obligation. You’ll speak with {site.founder} directly, by video call.
          </p>
          <StartTabs current="call" />
        </div>
        <div className={styles.body}>
          <h2 className="heading" style={{ marginBottom: 16 }}>
            What we’ll cover
          </h2>
          <p style={{ maxWidth: "38em", color: "var(--fg-2)" }}>
            Your goals, who the product is for, any constraints such as timing, budget or existing systems, and sensible
            next steps, even if they don’t involve us.
          </p>
          <div style={{ marginTop: 48 }}>
            {BOOKING_URL ? (
              <>
                <ButtonLink href={BOOKING_URL} arrow>
                  Choose a time
                </ButtonLink>
                <p className={styles.notice}>
                  The times you’ll see come live from our calendar. You’ll receive a calendar invitation and can reschedule
                  or cancel from it. None suit? Email <a href={`mailto:${site.email}`}>{site.email}</a>.
                </p>
              </>
            ) : (
              <>
                <p className={styles.notice} style={{ marginTop: 0, marginBottom: 32 }}>
                  Online booking is being set up. In the meantime, tell us when suits you and we’ll confirm a time by email.
                  Nothing is booked until we reply.
                </p>
                <WithError searchParams={props.searchParams} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

async function WithError({ searchParams }: { searchParams: PageProps<"/start/call">["searchParams"] }) {
  const p = await searchParams;
  const error = typeof p.error === "string" && /^[a-z-]{2,20}$/.test(p.error) ? p.error : undefined;
  return <CallRequestForm serverError={error} />;
}
