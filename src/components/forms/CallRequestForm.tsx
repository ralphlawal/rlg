"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { validateEnquiry, type FieldErrors } from "@/lib/enquiry";
import { ErrorSummary, FieldError, SpamFields, useStartedStamp, ERROR_COPY, mailtoFallback } from "./shared";
import { Turnstile } from "./Turnstile";
import styles from "./form.module.css";

/**
 * Used while online booking isn't connected. Asks for preferred times; nothing is "booked".
 * The success page says we'll reply to agree a time.
 */
export function CallRequestForm({ serverError }: { serverError?: string }) {
  const router = useRouter();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failure, setFailure] = useState<string | null>(serverError ? ERROR_COPY[serverError] ?? ERROR_COPY.unavailable : null);
  const [sending, setSending] = useState(false);
  const { started, markStarted } = useStartedStamp();

  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
  }, []);
  useEffect(() => {
    if (Object.keys(errors).length || failure) summaryRef.current?.focus();
  }, [errors, failure]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: Record<string, unknown> = Object.fromEntries(new FormData(event.currentTarget).entries());
    payload.kind = "call";
    const check = validateEnquiry(payload);
    if (!check.ok) {
      setFailure(null);
      setErrors(check.errors);
      return;
    }
    setErrors({});
    setFailure(null);
    setSending(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as { status: string; reference?: string; errors?: FieldErrors; code?: string } | null;
      if (data?.status === "ok" && data.reference) {
        router.push(`/start/received?ref=${encodeURIComponent(data.reference)}&kind=call`);
        return;
      }
      if (data?.status === "invalid" && data.errors) setErrors(data.errors);
      else setFailure(ERROR_COPY[data?.code ?? "unavailable"] ?? ERROR_COPY.unavailable);
    } catch {
      setFailure(ERROR_COPY.network);
    }
    setSending(false);
  }

  const desc = (f: string, help = false) =>
    [help ? `${uid}-${f}-help` : null, errors[f] ? `${uid}-${f}-error` : null].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} id="enquiry" className={styles.form} action="/api/enquiry" method="post" onSubmit={onSubmit} onFocus={markStarted} aria-label="Request a discovery call">
      <input type="hidden" name="kind" value="call" />
      <SpamFields started={started} />
      <ErrorSummary
        ref={summaryRef}
        errors={errors}
        order={["name", "email", "times", "form"]}
        idFor={(f) => `${uid}-${f}`}
        failure={failure}
        mailto={() => mailtoFallback(formRef.current, "Discovery call request")}
      />
      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor={`${uid}-name`}>Your name</label>
          <input id={`${uid}-name`} name="name" autoComplete="name" required maxLength={120} aria-invalid={!!errors.name} aria-describedby={desc("name")} />
          <FieldError id={`${uid}-name-error`} message={errors.name} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-email`}>Email address</label>
          <input id={`${uid}-email`} name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={!!errors.email} aria-describedby={desc("email")} />
          <FieldError id={`${uid}-email-error`} message={errors.email} />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor={`${uid}-company`}>
          Company or organisation <span className={styles.optional}>Optional</span>
        </label>
        <input id={`${uid}-company`} name="company" autoComplete="organization" maxLength={160} />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${uid}-times`}>When suits you?</label>
        <textarea id={`${uid}-times`} name="times" rows={3} required minLength={3} maxLength={500} aria-invalid={!!errors.times} aria-describedby={desc("times", true)} />
        <p id={`${uid}-times-help`} className={styles.help}>
          Two or three days or times, with your time zone if you’re outside Ireland. For example: “Tuesday or Thursday afternoon”.
        </p>
        <FieldError id={`${uid}-times-error`} message={errors.times} />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${uid}-message`}>
          What would you like to talk about? <span className={styles.optional}>Optional</span>
        </label>
        <textarea id={`${uid}-message`} name="message" rows={4} maxLength={2000} />
      </div>
      <Turnstile />
      <div className={styles.submitRow}>
        <button type="submit" className={styles.submit} disabled={sending}>
          {sending ? "Sending…" : "Request a call"} <span aria-hidden="true">→</span>
        </button>
        <p className={styles.privacy}>
          We use these details only to arrange the call. See our <a href="/privacy">privacy notice</a>.
        </p>
      </div>
    </form>
  );
}
