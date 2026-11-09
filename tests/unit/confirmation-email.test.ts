import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildConfirmation, safeFirstName } from "@/lib/confirmation-email";
import { sendConfirmation } from "@/lib/enquiry-server";

describe("Confirmation email content", () => {
  it("greets by first name only, cleaned of anything that isn't a name", () => {
    expect(safeFirstName("Aoife Byrne")).toBe("Aoife");
    expect(safeFirstName("Seán")).toBe("Seán");
    expect(safeFirstName("<script>alert(1)</script>")).toBe("scriptalertscript");
    expect(safeFirstName("http://spam.example/buy-now")).toBe("httpspamexamplebuy-now");
    expect(safeFirstName("   ")).toBe("there");
  });

  it("never echoes the visitor's message, and escapes HTML", () => {
    const { html, text, subject } = buildConfirmation("project", "Aoife <b>Byrne</b>", "RLG-2611-AB12");
    expect(subject).toBe("Your project is on our desk · RLG-2611-AB12");
    expect(html).not.toContain("<b>Byrne");
    expect(text).toContain("Hi Aoife,");
    expect(html).toContain("RLG-2611-AB12");
    expect(text).toContain("/start/call");
  });

  it("makes no promise about response times", () => {
    for (const kind of ["project", "call"] as const) {
      const { text } = buildConfirmation(kind, "Aoife", "RLG-2611-AB12");
      expect(text).not.toMatch(/within|hours?\b|working days?|24\/7|guarantee/i);
    }
  });

  it("says a call isn't booked until confirmed", () => {
    expect(buildConfirmation("call", "Seán", "RLG-2611-CD34").text).toMatch(/Nothing is booked until we confirm/);
  });
});

describe("Sending the confirmation", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    delete process.env.RESEND_ENDPOINT;
  });
  afterEach(() => delete process.env.RESEND_API_KEY);

  it("is skipped when no Resend key is configured", async () => {
    const f = vi.fn();
    expect(await sendConfirmation("a@example.ie", "project", "Aoife", "RLG-2611-AB12", f)).toBe("skipped");
    expect(f).not.toHaveBeenCalled();
  });

  it("sends from hello@ with reply-to and an idempotency key", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const f = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    expect(await sendConfirmation("a@example.ie", "project", "Aoife", "RLG-2611-AB12", f)).toBe("sent");
    const [url, init] = f.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers["Idempotency-Key"]).toBe("confirmation-RLG-2611-AB12");
    const body = JSON.parse(init.body);
    expect(body.from).toBe("Ralph Lawal Group <hello@ralphlawalgroup.com>");
    expect(body.reply_to).toBe("hello@ralphlawalgroup.com");
    expect(body.to).toEqual(["a@example.ie"]);
  });

  it("reports failure without throwing", async () => {
    process.env.RESEND_API_KEY = "test-key";
    expect(await sendConfirmation("a@example.ie", "call", "Aoife", "RLG-2611-AB12", vi.fn().mockResolvedValue(new Response("{}", { status: 500 })))).toBe("failed");
    expect(await sendConfirmation("a@example.ie", "call", "Aoife", "RLG-2611-AB12", vi.fn().mockRejectedValue(new Error("down")))).toBe("failed");
  });
});
