"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { sketch, type Answers, type Where } from "@/lib/scope-rules";
import { encodeAnswers } from "@/lib/scope-share";
import { Chip } from "./Chip";
import { SketchOutput } from "./SketchOutput";
import styles from "./sketch.module.css";

const WHERE: [Where, string][] = [
  ["ios", "iPhone"],
  ["android", "Android"],
  ["web", "Web browser"],
  ["internal", "Internal tool"],
];

/**
 * Compact Scope Sketch for the homepage. Runs entirely in the browser.
 * Without JavaScript, the "Open the full sketch" link leads to the server-rendered version.
 */
export function SketchTeaser() {
  const [a, setA] = useState<Answers>({ where: ["web"], auth: "unsure", payments: "no", data: "contact", ai: "no" });
  const result = useMemo(() => sketch(a), [a]);
  const toggleWhere = (w: Where) =>
    setA((prev) => ({ ...prev, where: prev.where.includes(w) ? prev.where.filter((x) => x !== w) : [...prev.where, w] }));

  return (
    <div className={styles.layout}>
      <form className={styles.form} aria-describedby="teaser-note" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>Where should it work?</legend>
          <div className={styles.chips}>
            {WHERE.map(([value, label]) => (
              <Chip key={value} type="checkbox" name="where" value={value} checked={a.where.includes(value)} onChange={() => toggleWhere(value)}>
                {label}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Will people sign in?</legend>
          <div className={styles.chips}>
            {([["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] as const).map(([v, l]) => (
              <Chip key={v} type="radio" name="auth" value={v} checked={a.auth === v} onChange={() => setA({ ...a, auth: v })}>
                {l}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Will it take payments?</legend>
          <div className={styles.chips}>
            {([["once", "One-off"], ["subs", "Subscriptions"], ["no", "No"]] as const).map(([v, l]) => (
              <Chip key={v} type="radio" name="payments" value={v} checked={a.payments === v} onChange={() => setA({ ...a, payments: v })}>
                {l}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>What personal data will it hold?</legend>
          <div className={styles.chips}>
            {([["contact", "Contact details"], ["sensitive", "Sensitive (health, money, children, location)"], ["none", "None"]] as const).map(([v, l]) => (
              <Chip key={v} type="radio" name="data" value={v} checked={a.data === v} onChange={() => setA({ ...a, data: v })}>
                {l}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Any AI or automation?</legend>
          <div className={styles.chips}>
            {([["docs", "Answer from our documents"], ["tasks", "Automate repetitive tasks"], ["no", "Not needed"]] as const).map(([v, l]) => (
              <Chip key={v} type="radio" name="ai" value={v} checked={a.ai === v} onChange={() => setA({ ...a, ai: v })}>
                {l}
              </Chip>
            ))}
          </div>
        </fieldset>
        <p className={styles.more}>
          <Link href="/start/sketch">Open the full sketch</Link> for more questions, including your idea in your own words.
        </p>
      </form>
      <p className="sr-only" role="status">
        Sketch updated: {result.clients.length + result.services.length} parts, {result.decisions.length} decisions to make early.
      </p>
      <SketchOutput result={result} compact noteId="teaser-note">
        <Link className={styles.send} href={`/start?sketch=${encodeAnswers(a)}#enquiry`}>
          Send this with your enquiry <span aria-hidden="true">→</span>
        </Link>
      </SketchOutput>
    </div>
  );
}
