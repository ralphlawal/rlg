import { z } from "zod";
import type { Answers } from "./scope-rules";

/** Answers travel to the enquiry form in the URL (?sketch=…), validated on arrival. No storage involved. */
export const answersSchema = z.object({
  idea: z.string().max(280).optional(),
  stage: z.enum(["new", "rebuild", "addition"]).optional(),
  audience: z.enum(["public", "team", "both"]).optional(),
  where: z.array(z.enum(["ios", "android", "web", "internal"])).max(4).default([]),
  auth: z.enum(["yes", "no", "unsure"]).optional(),
  payments: z.enum(["once", "subs", "no", "unsure"]).optional(),
  data: z.enum(["contact", "sensitive", "none", "unsure"]).optional(),
  integrations: z.array(z.enum(["payments", "accounting", "existing-api"])).max(3).optional(),
  ai: z.enum(["docs", "tasks", "no"]).optional(),
});

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function encodeAnswers(a: Answers): string {
  return toBase64Url(JSON.stringify(a));
}

/** Returns null for anything missing, malformed or out of bounds. */
export function decodeAnswers(value: string | null | undefined): Answers | null {
  if (!value || value.length > 2000) return null;
  try {
    const parsed = answersSchema.safeParse(JSON.parse(fromBase64Url(value)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
