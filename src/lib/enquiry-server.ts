import "server-only";
import type { FieldErrors } from "./enquiry";
import { buildConfirmation, type ConfirmationKind } from "./confirmation-email";

type SendResult =
  | { ok: true }
  | { ok: false; kind: "invalid"; errors: FieldErrors }
  | { ok: false; kind: "rate-limited" | "unavailable" };

const FIELD_FROM_FORMSPREE: Record<string, string> = { email: "email", name: "name", message: "message" };

/**
 * Sends one enquiry to Formspree as JSON. 8-second timeout, one retry on network errors or 5xx.
 * Never logs the enquiry's content.
 */
export function formspreeUrl(formId: string, override = process.env.FORMSPREE_ENDPOINT) {
  // FORMSPREE_ENDPOINT exists only so tests can point at a local mock instead of sending real email.
  return override || `https://formspree.io/f/${encodeURIComponent(formId)}`;
}

export async function forwardToFormspree(
  formId: string,
  payload: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  const url = formspreeUrl(formId);
  const body = JSON.stringify(Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined && v !== "")));
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetchImpl(url, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });
      if (res.ok) return { ok: true };
      if (res.status === 422 || res.status === 400) {
        const data = (await res.json().catch(() => ({}))) as { errors?: { field?: string; message?: string }[] };
        const errors: FieldErrors = {};
        for (const e of data.errors ?? []) errors[FIELD_FROM_FORMSPREE[e.field ?? ""] ?? "form"] ??= e.message ? capitalise(e.message) : "Please check this field.";
        if (Object.keys(errors).length === 0) errors.form = "Please check the form and try again.";
        return { ok: false, kind: "invalid", errors };
      }
      if (res.status === 429) return { ok: false, kind: "rate-limited" };
      if (res.status < 500) return { ok: false, kind: "unavailable" };
    } catch {
      // Network error or timeout: retry once.
    }
    if (attempt === 1) await new Promise((r) => setTimeout(r, 400));
  }
  console.error("[enquiry] Formspree delivery failed after retry");
  return { ok: false, kind: "unavailable" };
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1) + (s.endsWith(".") ? "" : ".");
}

/** Cloudflare Turnstile server-side verification. */
export async function verifyTurnstile(token: string, secret: string, ip?: string, fetchImpl: typeof fetch = fetch) {
  if (!token) return false;
  try {
    const form = new URLSearchParams({ secret, response: token });
    if (ip) form.set("remoteip", ip);
    const res = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

/**
 * Sends the visitor an instant confirmation from hello@ via Resend. Best effort: the enquiry has already
 * been delivered, so a failure here is logged (without personal data) and never shown as an error.
 * Skipped when RESEND_API_KEY isn't configured.
 */
export async function sendConfirmation(
  to: string,
  kind: ConfirmationKind,
  name: string,
  reference: string,
  fetchImpl: typeof fetch = fetch,
): Promise<"sent" | "skipped" | "failed"> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "skipped";
  const { subject, html, text } = buildConfirmation(kind, name, reference);
  const from = process.env.CONFIRMATION_FROM || "Ralph Lawal Group <hello@ralphlawalgroup.com>";
  try {
    const res = await fetchImpl(process.env.RESEND_ENDPOINT || "https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `confirmation-${reference}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: "hello@ralphlawalgroup.com",
        subject,
        html,
        text,
        tags: [{ name: "type", value: kind === "call" ? "call_confirmation" : "enquiry_confirmation" }],
      }),
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    if (res.ok) return "sent";
    console.error(`[enquiry] confirmation email not sent (HTTP ${res.status})`);
    return "failed";
  } catch {
    console.error("[enquiry] confirmation email not sent (network or timeout)");
    return "failed";
  }
}
