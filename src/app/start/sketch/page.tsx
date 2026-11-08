import type { Metadata } from "next";
import Link from "next/link";
import { Chip } from "@/components/sketch/Chip";
import { SketchOutput } from "@/components/sketch/SketchOutput";
import { sketch, type Answers } from "@/lib/scope-rules";
import { answersSchema, encodeAnswers } from "@/lib/scope-share";
import styles from "../start.module.css";
import sk from "@/components/sketch/sketch.module.css";

export const metadata: Metadata = {
  title: "Scope Sketch: Outline Your Project",
  description:
    "Answer a few questions and get a first outline of your app or software project: the parts it needs, early decisions and what can wait.",
  alternates: { canonical: "/start/sketch" },
};

type Q = { name: keyof Answers; legend: string; multi?: boolean; options: [string, string][] };

const QUESTIONS: Q[] = [
  { name: "stage", legend: "Is this new, a rebuild, or an addition?", options: [["new", "Something new"], ["rebuild", "Rebuilding something"], ["addition", "Adding to something"]] },
  { name: "audience", legend: "Who will use it?", options: [["public", "Customers or the public"], ["team", "Your team"], ["both", "Both"]] },
  { name: "where", legend: "Where should it work?", multi: true, options: [["ios", "iPhone"], ["android", "Android"], ["web", "Web browser"], ["internal", "Internal tool"]] },
  { name: "auth", legend: "Will people sign in?", options: [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] },
  { name: "payments", legend: "Will it take payments?", options: [["once", "One-off"], ["subs", "Subscriptions"], ["no", "No"], ["unsure", "Not sure"]] },
  { name: "data", legend: "What personal data will it hold?", options: [["contact", "Contact details"], ["sensitive", "Sensitive (health, money, children, location)"], ["none", "None"], ["unsure", "Not sure"]] },
  { name: "integrations", legend: "Should it connect to anything?", multi: true, options: [["payments", "A payment provider"], ["accounting", "Accounting or CRM"], ["existing-api", "An existing database or API"]] },
  { name: "ai", legend: "Any AI or automation in mind?", options: [["docs", "Answer from our documents"], ["tasks", "Automate repetitive tasks"], ["no", "Not needed"]] },
];

/**
 * The full Scope Sketch. A plain GET form: the server draws the sketch from the answers in the URL,
 * so it works identically with or without JavaScript, and a sketch can be bookmarked.
 */
/** Rendered fully on the server per request, so URL-driven content (prefills, errors, sketch results)
 *  appears without JavaScript. Streaming would need a script to swap it in. */
export const instant = false;

export default function SketchPage(props: PageProps<"/start/sketch">) {
  return (
    <section className={`wrap ${styles.page}`} aria-labelledby="sketch-title">
      <div className="grid">
        <p className={`label ${styles.label}`}>
          <b>03</b> / Scope Sketch
        </p>
        <div className={styles.head}>
          <h1 id="sketch-title" className="display-l">
            Sketch your project.
          </h1>
          <p className="lead">
            Answer what you can and skip what you can’t. You’ll get a first outline: the parts your product needs, the
            decisions worth making early, and what can wait.
          </p>
          <p className={styles.notice}>
            Your answers stay on this page and in its address. Nothing is sent to us unless you choose to send it.
          </p>
        </div>
        <div className={styles.body} style={{ gridColumn: "1 / -1" }}>
          <FromUrl searchParams={props.searchParams} />
        </div>
      </div>
    </section>
  );
}

async function FromUrl({ searchParams }: { searchParams: PageProps<"/start/sketch">["searchParams"] }) {
  const p = await searchParams;
  if (!("drawn" in p)) return <SketchForm answers={null} />;
  const list = (v: unknown) => (Array.isArray(v) ? v : v ? [v] : []);
  const one = (v: unknown) => (Array.isArray(v) ? v[0] : v) || undefined;
  const parsed = answersSchema.safeParse({
    idea: one(p.idea),
    stage: one(p.stage),
    audience: one(p.audience),
    where: list(p.where),
    auth: one(p.auth),
    payments: one(p.payments),
    data: one(p.data),
    integrations: list(p.integrations),
    ai: one(p.ai),
  });
  return <SketchForm answers={parsed.success ? parsed.data : null} invalid={!parsed.success} />;
}

function SketchForm({ answers, invalid = false }: { answers: Answers | null; invalid?: boolean }) {
  const isChecked = (name: keyof Answers, value: string) => {
    const v = answers?.[name];
    return Array.isArray(v) ? v.includes(value as never) : v === value;
  };
  return (
    <div className={sk.layout} style={{ marginTop: 0 }}>
      <form className={sk.form} method="get" action="/start/sketch#your-sketch">
        <input type="hidden" name="drawn" value="1" />
        <div className={sk.idea}>
          <label htmlFor="idea">
            <strong>In one sentence, what do you want to build?</strong>
          </label>
          <p className={sk.more}>Optional. It isn’t analysed; it’s simply carried into your notes.</p>
          <textarea id="idea" name="idea" rows={3} maxLength={280} defaultValue={answers?.idea ?? ""} />
        </div>
        {QUESTIONS.map((q) => (
          <fieldset key={q.name}>
            <legend>{q.legend}</legend>
            <div className={sk.chips}>
              {q.options.map(([value, label]) => (
                <Chip key={value} type={q.multi ? "checkbox" : "radio"} name={q.name} value={value} defaultChecked={isChecked(q.name, value)}>
                  {label}
                </Chip>
              ))}
            </div>
          </fieldset>
        ))}
        <button type="submit" className={sk.send}>
          {answers ? "Redraw my sketch" : "Draw my sketch"} <span aria-hidden="true">→</span>
        </button>
        {invalid ? <p className={sk.more}>Some answers couldn’t be read, so they were left out.</p> : null}
      </form>
      <div id="your-sketch" tabIndex={-1}>
        {answers ? (
          <SketchOutput result={sketch(answers)}>
            <Link className={sk.send} href={`/start?sketch=${encodeAnswers(answers)}#enquiry`}>
              Send this with your enquiry <span aria-hidden="true">→</span>
            </Link>
            <Link href="/start/sketch" className={sk.reset}>
              Start again
            </Link>
          </SketchOutput>
        ) : (
          <div className={sk.out}>
            <p className="label">Your sketch</p>
            <h2 className={sk.outTitle}>Answer a few questions, then draw your sketch.</h2>
            <p className={sk.note}>A starting outline from your answers, not a quote. Rules only: no AI, no prices.</p>
          </div>
        )}
      </div>
    </div>
  );
}
