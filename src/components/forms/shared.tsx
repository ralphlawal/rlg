"use client";

import { forwardRef, useCallback, useState } from "react";
import { site } from "@/content/site";
import styles from "./form.module.css";

export const ERROR_COPY: Record<string, string> = {
  invalid: "Some details need checking. Please review the form and send it again.",
  "spam-check": "We couldn’t confirm you’re not an automated system. Please try again, or email us directly.",
  "rate-limited": "You’ve sent several messages in a short time. Please wait a few minutes, or email us directly.",
  unavailable: "Something went wrong on our side and your message wasn’t sent. Your details are still here: try again, or send it by email.",
  "not-configured": "Our form is temporarily unavailable. Please email us directly; nothing you’ve typed has been sent.",
  network: "We couldn’t reach our server. Check your connection and try again. Your message is still here.",
};

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className={styles.error}>
      <span aria-hidden="true" className={styles.errorIcon}>
        !
      </span>
      {message}
    </p>
  );
}

type SummaryProps = {
  errors: Record<string, string | undefined>;
  order: string[];
  idFor: (field: string) => string;
  failure: string | null;
  mailto: () => string;
};

/** Takes focus after a failed submit, lists each problem as a link to its field. */
export const ErrorSummary = forwardRef<HTMLDivElement, SummaryProps>(function ErrorSummary({ errors, order, idFor, failure, mailto }, ref) {
  const keys = Object.keys(errors).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  if (!keys.length && !failure) return null;
  return (
    <div ref={ref} className={styles.summary} tabIndex={-1} role="alert" aria-labelledby="error-summary-title">
      <h2 id="error-summary-title" className={styles.summaryTitle}>
        {failure ? "Your message wasn’t sent" : "Please check the following"}
      </h2>
      {failure ? (
        <>
          <p>{failure}</p>
          <p>
            <a href={mailto()} className={styles.mailFallback}>
              Send by email instead
            </a>
          </p>
        </>
      ) : (
        <ul>
          {keys.map((k) => (
            <li key={k}>{k === "form" ? errors[k] : <a href={`#${idFor(k)}`}>{errors[k]}</a>}</li>
          ))}
        </ul>
      )}
    </div>
  );
});

/** Honeypot (hidden from people and assistive technology) and the first-interaction timestamp. */
export function SpamFields({ started }: { started: number }) {
  return (
    <>
      <div className={styles.hp} aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name="website_url" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name="started" value={started || ""} />
    </>
  );
}

export function useStartedStamp() {
  const [started, setStarted] = useState(0);
  const markStarted = useCallback(() => setStarted((s) => s || Date.now()), []);
  return { started, markStarted };
}

/** Builds a mailto: link containing what the visitor typed, so nothing is lost if delivery fails. */
export function mailtoFallback(form: HTMLFormElement | null, subject: string) {
  if (!form) return `mailto:${site.email}`;
  const fd = new FormData(form);
  const skip = new Set(["kind", "source", "started", "website_url", "cf-turnstile-response"]);
  const lines: string[] = [];
  for (const key of new Set(fd.keys())) {
    if (skip.has(key)) continue;
    const value = fd.getAll(key).map(String).filter(Boolean).join(", ");
    if (value) lines.push(`${key}: ${value}`);
  }
  const body = lines.join("\n").slice(0, 1800);
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
