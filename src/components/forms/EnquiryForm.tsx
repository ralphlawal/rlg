"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BUDGETS,
  EXISTING,
  PLATFORMS,
  SERVICES,
  TIMELINES,
  validateEnquiry,
  type FieldErrors,
} from "@/lib/enquiry";
import { site } from "@/content/site";
import { ErrorSummary, FieldError, SpamFields, useStartedStamp, ERROR_COPY, mailtoFallback } from "./shared";
import { Turnstile } from "./Turnstile";
import styles from "./form.module.css";

type Props = {
  initialServices?: string[];
  sketch?: string;
  source?: string;
  serverError?: string;
};

const FIELD_ORDER = ["name", "email", "services", "existing", "link", "message", "form"];

export function EnquiryForm({ initialServices = [], sketch, source = "start", serverError }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const [services, setServices] = useState<string[]>(initialServices);
  const [existing, setExisting] = useState("");
  const [attachedSketch, setAttachedSketch] = useState(sketch ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "failed">("idle");
  const [failure, setFailure] = useState<string | null>(serverError ? ERROR_COPY[serverError] ?? ERROR_COPY.unavailable : null);
  const { started, markStarted } = useStartedStamp();

  // Native validation stays on without JavaScript; once enhanced, our own messages take over.
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length || failure) summaryRef.current?.focus();
  }, [errors, failure]);

  const toggleService = (value: string) =>
    setServices((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, unknown> = Object.fromEntries(fd.entries());
    payload.services = fd.getAll("services").map(String);
    payload.kind = "project";

    const check = validateEnquiry(payload);
    if (!check.ok) {
      setFailure(null);
      setErrors(check.errors);
      return;
    }
    setErrors({});
    setFailure(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as
        | { status: "ok"; reference: string }
        | { status: "invalid"; errors: FieldErrors }
        | { status: "error"; code: string }
        | null;
      if (data?.status === "ok") {
        router.push(`/start/received?ref=${encodeURIComponent(data.reference)}&kind=project`);
        return;
      }
      setStatus("failed");
      if (data?.status === "invalid") setErrors(data.errors);
      else setFailure(ERROR_COPY[data?.status === "error" ? data.code : "unavailable"] ?? ERROR_COPY.unavailable);
    } catch {
      setStatus("failed");
      setFailure(ERROR_COPY.network);
    }
  }

  const describedBy = (field: string, help?: string) =>
    [help ? `${uid}-${field}-help` : null, errors[field] ? `${uid}-${field}-error` : null].filter(Boolean).join(" ") || undefined;

  const showPlatforms = services.includes("mobile-app");
  const showLink = existing === "Replacing something" || existing === "Adding to something";

  return (
    <form
      ref={formRef}
      id="enquiry"
      className={styles.form}
      action="/api/enquiry"
      method="post"
      onSubmit={onSubmit}
      onFocus={markStarted}
      aria-labelledby="enquiry-title"
    >
      <input type="hidden" name="kind" value="project" />
      <input type="hidden" name="source" value={source} />
      <SpamFields started={started} />

      <ErrorSummary
        ref={summaryRef}
        errors={errors}
        order={FIELD_ORDER}
        idFor={(f) => (f === "services" ? `${uid}-services-first` : `${uid}-${f}`)}
        failure={failure}
        mailto={() => mailtoFallback(formRef.current, "Project enquiry")}
      />

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor={`${uid}-name`}>Your name</label>
          <input id={`${uid}-name`} name="name" autoComplete="name" required maxLength={120} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
          <FieldError id={`${uid}-name-error`} message={errors.name} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-email`}>Email address</label>
          <input id={`${uid}-email`} name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={!!errors.email} aria-describedby={describedBy("email", "y")} />
          <p id={`${uid}-email-help`} className={styles.help}>We’ll reply here.</p>
          <FieldError id={`${uid}-email-error`} message={errors.email} />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${uid}-company`}>
          Company or organisation <span className={styles.optional}>Optional</span>
        </label>
        <input id={`${uid}-company`} name="company" autoComplete="organization" maxLength={160} aria-describedby={`${uid}-company-help`} />
        <p id={`${uid}-company-help`} className={styles.help}>Leave blank if it’s a personal project.</p>
      </div>

      <fieldset className={styles.fieldset} aria-describedby={describedBy("services", "y")} aria-invalid={!!errors.services}>
        <legend>What do you need?</legend>
        <p id={`${uid}-services-help`} className={styles.help}>Choose all that apply.</p>
        <div className={styles.chips}>
          {SERVICES.map((s, i) => (
            <label key={s.value} className={styles.chip}>
              <input
                id={i === 0 ? `${uid}-services-first` : undefined}
                type="checkbox"
                name="services"
                value={s.value}
                checked={services.includes(s.value)}
                onChange={() => toggleService(s.value)}
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
        <FieldError id={`${uid}-services-error`} message={errors.services} />
      </fieldset>

      {showPlatforms ? (
        <fieldset className={styles.fieldset}>
          <legend>
            Which platforms? <span className={styles.optional}>Optional</span>
          </legend>
          <div className={styles.chips}>
            {PLATFORMS.map((p) => (
              <label key={p} className={styles.chip}>
                <input type="radio" name="platforms" value={p} />
                <span>{p}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <fieldset className={styles.fieldset}>
        <legend>
          Is there an existing product? <span className={styles.optional}>Optional</span>
        </legend>
        <div className={styles.chips}>
          {EXISTING.map((e) => (
            <label key={e} className={styles.chip}>
              <input type="radio" name="existing" value={e} checked={existing === e} onChange={() => setExisting(e)} />
              <span>{e}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {showLink ? (
        <div className={styles.field}>
          <label htmlFor={`${uid}-link`}>
            Link to the current product <span className={styles.optional}>Optional</span>
          </label>
          <input id={`${uid}-link`} name="link" type="url" inputMode="url" placeholder="https://" aria-invalid={!!errors.link} aria-describedby={describedBy("link")} />
          <FieldError id={`${uid}-link-error`} message={errors.link} />
        </div>
      ) : null}

      <div className={styles.field}>
        <label htmlFor={`${uid}-message`}>Tell us about the project</label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={7}
          required
          minLength={30}
          maxLength={5000}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message", "y")}
        />
        <p id={`${uid}-message-help`} className={styles.help}>
          What it should do, who it’s for, and anything you’ve already decided. A few sentences is fine.
        </p>
        <FieldError id={`${uid}-message-error`} message={errors.message} />
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor={`${uid}-budget`}>
            Indicative budget <span className={styles.optional}>Optional</span>
          </label>
          <select id={`${uid}-budget`} name="budget" defaultValue="" aria-describedby={`${uid}-budget-help`}>
            <option value="">Choose a range</option>
            {BUDGETS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <p id={`${uid}-budget-help`} className={styles.help}>Helps us suggest the right approach.</p>
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-timeline`}>
            Ideal timing <span className={styles.optional}>Optional</span>
          </label>
          <select id={`${uid}-timeline`} name="timeline" defaultValue="">
            <option value="">Choose a timing</option>
            {TIMELINES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {attachedSketch ? (
        <div className={styles.sketch}>
          <div className={styles.sketchHead}>
            <p className="label">Your Scope Sketch is attached</p>
            <button type="button" className={styles.remove} onClick={() => setAttachedSketch("")}>
              Remove
            </button>
          </div>
          <pre>{attachedSketch}</pre>
          <input type="hidden" name="sketch" value={attachedSketch} />
        </div>
      ) : null}

      <Turnstile />

      <div className={styles.submitRow}>
        <button type="submit" className={styles.submit} disabled={status === "sending"} aria-describedby={`${uid}-privacy`}>
          {status === "sending" ? "Sending…" : "Send enquiry"}
          <span aria-hidden="true">→</span>
        </button>
        <p id={`${uid}-privacy`} className={styles.privacy}>
          We use these details only to reply to your enquiry. They’re delivered to us through Formspree. See our{" "}
          <a href="/privacy">privacy notice</a>. Prefer email? <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {status === "sending" ? "Sending your enquiry." : ""}
      </p>
    </form>
  );
}
