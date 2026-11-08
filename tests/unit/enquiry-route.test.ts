import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/enquiry/route";

const valid = {
  kind: "project",
  name: "Aoife Byrne",
  email: "aoife@example.ie",
  services: ["website"],
  message: "We need a new website that brings in enquiries and is easy to update.",
};

const json = (body: unknown) =>
  new Request("http://localhost/api/enquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  process.env.FORMSPREE_FORM_ID = "testform";
  delete process.env.FORMSPREE_ENDPOINT;
  delete process.env.TURNSTILE_SECRET_KEY;
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.unstubAllGlobals());

describe("POST /api/enquiry", () => {
  it("forwards a valid enquiry to Formspree and returns a reference", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const res = await POST(json(valid));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reference).toMatch(/^RLG-\d{4}-[A-Z0-9]{4}$/);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://formspree.io/f/testform");
    const sent = JSON.parse(init.body);
    expect(sent).toMatchObject({ name: "Aoife Byrne", services: "Website" });
    expect(sent).not.toHaveProperty("website_url");
  });

  it("silently drops honeypot submissions without calling Formspree", async () => {
    const res = await POST(json({ ...valid, website_url: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("silently drops submissions made faster than a person could type", async () => {
    const res = await POST(json({ ...valid, started: Date.now() - 500 }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns field errors without calling Formspree", async () => {
    const res = await POST(json({ ...valid, email: "bad" }));
    expect(res.status).toBe(422);
    expect((await res.json()).errors.email).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("retries once on a network failure, then reports it", async () => {
    fetchMock.mockRejectedValue(new TypeError("network down"));
    const res = await POST(json(valid));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(res.status).toBe(502);
    expect((await res.json()).code).toBe("unavailable");
  });

  it("passes Formspree's field errors back to the form", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ errors: [{ field: "email", message: "should be an email" }] }), { status: 422 }));
    const res = await POST(json(valid));
    expect(res.status).toBe(422);
    expect((await res.json()).errors.email).toBe("Should be an email.");
  });

  it("reports rate limiting from Formspree", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 429 }));
    const res = await POST(json(valid));
    expect(res.status).toBe(429);
  });

  it("refuses when not configured, rather than pretending to send", async () => {
    delete process.env.FORMSPREE_FORM_ID;
    const res = await POST(json(valid));
    expect((await res.json()).code).toBe("not-configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requires a valid Turnstile token when Turnstile is configured", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: false }), { status: 200 }));
    const res = await POST(json({ ...valid, "cf-turnstile-response": "bad" }));
    expect(res.status).toBe(403);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("redirects plain HTML form posts (no JavaScript)", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    const body = new URLSearchParams({ kind: "project", name: "Aoife", email: "aoife@example.ie", services: "website", message: valid.message });
    const ok = await POST(new Request("http://localhost/api/enquiry", { method: "POST", body }));
    expect(ok.status).toBe(303);
    expect(ok.headers.get("location")).toMatch(/^\/start\/received\?ref=RLG-/);
    body.set("email", "bad");
    const bad = await POST(new Request("http://localhost/api/enquiry", { method: "POST", body }));
    expect(bad.headers.get("location")).toBe("/start?error=invalid#enquiry");
  });
});
