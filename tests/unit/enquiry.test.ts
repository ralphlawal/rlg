import { describe, expect, it } from "vitest";
import { MESSAGES, formDataToObject, makeReference, toFormspreePayload, validateEnquiry } from "@/lib/enquiry";

const valid = {
  kind: "project",
  name: "Aoife Byrne",
  email: "aoife@example.ie",
  services: ["mobile-app"],
  message: "We need a booking app for our three clinics, with reminders and payments.",
};

describe("Enquiry validation", () => {
  it("accepts a complete project enquiry and trims text", () => {
    const r = validateEnquiry({ ...valid, name: "  Aoife Byrne  ", budget: "", timeline: "Flexible" });
    expect(r.ok).toBe(true);
    if (r.ok && r.data.kind === "project") {
      expect(r.data.name).toBe("Aoife Byrne");
      expect(r.data.budget).toBeUndefined();
    }
  });

  it("returns friendly, field-specific messages", () => {
    const r = validateEnquiry({ kind: "project", name: "", email: "nope", services: [], message: "short" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.name).toBe(MESSAGES.name);
      expect(r.errors.email).toBe(MESSAGES.email);
      expect(r.errors.services).toBe(MESSAGES.services);
      expect(r.errors.message).toBe(MESSAGES.messageShort);
    }
  });

  it("rejects over-long messages and unknown options", () => {
    const long = validateEnquiry({ ...valid, message: "a".repeat(5001) });
    expect(!long.ok && long.errors.message).toBe(MESSAGES.messageLong);
    expect(validateEnquiry({ ...valid, budget: "A million" }).ok).toBe(false);
    expect(validateEnquiry({ ...valid, services: ["hacking"] }).ok).toBe(false);
  });

  it("only accepts http(s) links", () => {
    expect(validateEnquiry({ ...valid, link: "javascript:alert(1)" }).ok).toBe(false);
    expect(validateEnquiry({ ...valid, link: "https://example.ie" }).ok).toBe(true);
  });

  it("validates discovery call requests", () => {
    expect(validateEnquiry({ kind: "call", name: "Seán", email: "sean@example.ie", times: "Tuesday afternoon" }).ok).toBe(true);
    const r = validateEnquiry({ kind: "call", name: "Seán", email: "sean@example.ie", times: "" });
    expect(!r.ok && r.errors.times).toBe(MESSAGES.times);
  });

  it("reads multi-value checkboxes from plain form posts", () => {
    const fd = new FormData();
    fd.append("kind", "project");
    fd.append("services", "website");
    fd.append("services", "product-design");
    expect(formDataToObject(fd).services).toEqual(["website", "product-design"]);
  });

  it("makes references in the documented format", () => {
    expect(makeReference(new Date("2026-11-08T12:00:00Z"), 123456)).toMatch(/^RLG-2611-[A-Z0-9]{4}$/);
  });

  it("sends only the enquiry fields to Formspree, with readable labels", () => {
    const r = validateEnquiry(valid);
    if (!r.ok) throw new Error("expected valid");
    const p = toFormspreePayload(r.data, "RLG-2611-ABCD");
    expect(p._subject).toBe("Enquiry · Mobile app · Aoife Byrne");
    expect(p).toMatchObject({ reference: "RLG-2611-ABCD", services: "Mobile app", email: "aoife@example.ie" });
    expect(Object.keys(p)).not.toContain("ip");
  });
});
