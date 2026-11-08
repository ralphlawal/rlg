import { NextResponse } from "next/server";
import { formDataToObject, makeReference, toFormspreePayload, validateEnquiry, type FieldErrors } from "@/lib/enquiry";
import { forwardToFormspree, verifyTurnstile } from "@/lib/enquiry-server";

/**
 * POST /api/enquiry
 * Works for the JavaScript form (JSON in, JSON out) and the plain HTML form (form data in, 303 redirect out).
 * Order: honeypot → timing → Turnstile (if configured) → validation → Formspree.
 */

const MIN_FILL_MS = 3000;

type Outcome =
  | { status: "ok"; reference: string; kind: "project" | "call" }
  | { status: "invalid"; errors: FieldErrors; kind: string }
  | { status: "error"; code: "spam-check" | "rate-limited" | "unavailable" | "not-configured"; kind: string };

export async function POST(request: Request) {
  const wantsJson = (request.headers.get("content-type") ?? "").includes("application/json");
  let raw: Record<string, unknown>;
  try {
    raw = wantsJson ? await request.json() : formDataToObject(await request.formData());
  } catch {
    return respond(wantsJson, { status: "invalid", errors: { form: "The form couldn’t be read. Please try again." }, kind: "project" });
  }
  const kind = raw.kind === "call" ? "call" : "project";

  // 1. Honeypot: people never see this field. Pretend success so bots learn nothing.
  if (typeof raw.website_url === "string" && raw.website_url.trim() !== "") {
    return respond(wantsJson, { status: "ok", reference: makeReference(), kind });
  }
  // 2. Timing: the JavaScript form records when it was first used. Instant submissions are bots.
  const started = Number(raw.started);
  if (Number.isFinite(started) && started > 0 && Date.now() - started < MIN_FILL_MS) {
    return respond(wantsJson, { status: "ok", reference: makeReference(), kind });
  }
  // 3. Turnstile, only when keys are configured.
  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = typeof raw["cf-turnstile-response"] === "string" ? raw["cf-turnstile-response"] : "";
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (!(await verifyTurnstile(token, process.env.TURNSTILE_SECRET_KEY, ip))) {
      return respond(wantsJson, { status: "error", code: "spam-check", kind });
    }
  }
  // 4. Validation (same rules as the browser).
  const { website_url: _hp, started: _st, "cf-turnstile-response": _ts, ...fields } = raw;
  void _hp;
  void _st;
  void _ts;
  const result = validateEnquiry({ ...fields, kind });
  if (!result.ok) return respond(wantsJson, { status: "invalid", errors: result.errors, kind });

  // 5. Delivery.
  const formId = process.env.FORMSPREE_FORM_ID;
  if (!formId) return respond(wantsJson, { status: "error", code: "not-configured", kind });
  const reference = makeReference();
  const sent = await forwardToFormspree(formId, toFormspreePayload(result.data, reference));
  if (sent.ok) return respond(wantsJson, { status: "ok", reference, kind });
  if (sent.kind === "invalid") return respond(wantsJson, { status: "invalid", errors: sent.errors, kind });
  return respond(wantsJson, { status: "error", code: sent.kind === "rate-limited" ? "rate-limited" : "unavailable", kind });
}

function respond(json: boolean, outcome: Outcome) {
  if (json) {
    const http = outcome.status === "ok" ? 200 : outcome.status === "invalid" ? 422 : outcome.code === "rate-limited" ? 429 : outcome.code === "spam-check" ? 403 : 502;
    return NextResponse.json(outcome, { status: http, headers: { "Cache-Control": "no-store" } });
  }
  const base = outcome.kind === "call" ? "/start/call" : "/start";
  const target =
    outcome.status === "ok"
      ? `/start/received?ref=${encodeURIComponent(outcome.reference)}&kind=${outcome.kind}`
      : outcome.status === "invalid"
        ? `${base}?error=invalid#enquiry`
        : `${base}?error=${outcome.code}#enquiry`;
  return new NextResponse(null, { status: 303, headers: { Location: target, "Cache-Control": "no-store" } });
}
