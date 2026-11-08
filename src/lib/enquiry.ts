import { z } from "zod";

/** One schema for the browser and the server, so rules and messages always match. */

export const SERVICES = [
  { value: "mobile-app", label: "Mobile app" },
  { value: "website", label: "Website" },
  { value: "web-app", label: "Web application" },
  { value: "ai-automation", label: "AI or automation" },
  { value: "custom-software", label: "Custom software or SaaS" },
  { value: "backend", label: "Backend or integrations" },
  { value: "product-design", label: "Product design" },
  { value: "consulting", label: "Consulting" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const BUDGETS = ["Under €10k", "€10–25k", "€25–50k", "€50–100k", "Over €100k", "Not sure yet"] as const;
export const TIMELINES = ["As soon as possible", "Within 3 months", "3–6 months", "Flexible"] as const;
export const PLATFORMS = ["iPhone", "Android", "Both", "Not sure"] as const;
export const EXISTING = ["New", "Replacing something", "Adding to something"] as const;

type ServiceValue = (typeof SERVICES)[number]["value"];
const serviceValues = SERVICES.map((s) => s.value) as [ServiceValue, ...ServiceValue[]];

const trimmed = (max: number) => z.string().trim().max(max);
const optionalChoice = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), z.enum(values).optional());

export const MESSAGES = {
  name: "Please enter your name.",
  email: "Please enter an email address like name@example.com.",
  services: "Choose at least one option, or ‘Not sure yet’.",
  messageShort: "Please add a little more detail, at least a couple of sentences.",
  messageLong: "That’s more than 5,000 characters. Please shorten it, or send the rest by email.",
  link: "Please enter a full web address, starting with https://",
  times: "Please tell us a few days or times that suit you.",
} as const;

export const projectEnquirySchema = z.object({
  kind: z.literal("project"),
  name: trimmed(120).min(1, MESSAGES.name),
  email: trimmed(254).pipe(z.email(MESSAGES.email)),
  company: trimmed(160).optional(),
  services: z.array(z.enum(serviceValues)).min(1, MESSAGES.services),
  platforms: optionalChoice(PLATFORMS),
  existing: optionalChoice(EXISTING),
  link: z.preprocess((v) => (v === "" ? undefined : v), z.url({ protocol: /^https?$/, error: MESSAGES.link }).max(500).optional()),
  message: trimmed(5000 + 1).min(30, MESSAGES.messageShort).max(5000, MESSAGES.messageLong),
  budget: optionalChoice(BUDGETS),
  timeline: optionalChoice(TIMELINES),
  sketch: trimmed(4000).optional(),
  source: trimmed(80).optional(),
});

export const callRequestSchema = z.object({
  kind: z.literal("call"),
  name: trimmed(120).min(1, MESSAGES.name),
  email: trimmed(254).pipe(z.email(MESSAGES.email)),
  company: trimmed(160).optional(),
  times: trimmed(500).min(3, MESSAGES.times),
  message: trimmed(2000).optional(),
});

export const enquirySchema = z.discriminatedUnion("kind", [projectEnquirySchema, callRequestSchema]);
export type Enquiry = z.infer<typeof enquirySchema>;

export type FieldErrors = Partial<Record<string, string>>;

/** Validation result in a shape both the form and the API can use. */
export function validateEnquiry(input: unknown): { ok: true; data: Enquiry } | { ok: false; errors: FieldErrors } {
  const result = enquirySchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return { ok: false, errors };
}

/** Converts submitted FormData (no-JavaScript path) into the schema's shape. */
export function formDataToObject(fd: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of new Set(fd.keys())) {
    if (key === "services") out.services = fd.getAll("services").map(String);
    else out[key] = String(fd.get(key) ?? "");
  }
  if (out.kind === "project" && !out.services) out.services = [];
  return out;
}

export function serviceLabel(value: string) {
  return SERVICES.find((s) => s.value === value)?.label ?? value;
}

/** RLG-YYMM-XXXX: readable, quotable in an email, no personal data in it. */
export function makeReference(now = new Date(), random = crypto.getRandomValues(new Uint32Array(1))[0]) {
  const yymm = `${String(now.getUTCFullYear()).slice(2)}${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const code = random.toString(36).toUpperCase().padStart(4, "0").slice(-4);
  return `RLG-${yymm}-${code}`;
}

/** Fields sent to Formspree. Nothing else (no IP, no analytics identifiers). */
export function toFormspreePayload(e: Enquiry, reference: string) {
  if (e.kind === "call") {
    return {
      _subject: `Discovery call request · ${e.name}`,
      reference,
      type: "Discovery call request",
      name: e.name,
      email: e.email,
      company: e.company || undefined,
      preferred_times: e.times,
      message: e.message || undefined,
    };
  }
  const services = e.services.map(serviceLabel);
  return {
    _subject: `Enquiry · ${services[0]} · ${e.name}`,
    reference,
    type: "Project enquiry",
    name: e.name,
    email: e.email,
    company: e.company || undefined,
    services: services.join(", "),
    platforms: e.platforms,
    existing: e.existing,
    link: e.link,
    message: e.message,
    budget: e.budget,
    timeline: e.timeline,
    sketch: e.sketch || undefined,
    source: e.source || undefined,
  };
}
