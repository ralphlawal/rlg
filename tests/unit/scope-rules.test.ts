import { describe, expect, it } from "vitest";
import { sketch, sketchToText } from "@/lib/scope-rules";

describe("Scope Sketch rules", () => {
  it("suggests one shared codebase when both phone platforms are chosen", () => {
    const s = sketch({ where: ["ios", "android"] });
    expect(s.clients[0]).toMatch(/one shared codebase/);
    expect(s.services).toContain("Notifications");
  });

  it("warns about app-store billing only for subscriptions inside phone apps", () => {
    const inApp = sketch({ where: ["ios"], payments: "subs" });
    const web = sketch({ where: ["web"], payments: "subs" });
    expect(inApp.decisions.some((d) => d.includes("in-app purchase"))).toBe(true);
    expect(web.decisions.some((d) => d.includes("in-app purchase"))).toBe(false);
  });

  it("raises a data protection assessment for sensitive data", () => {
    expect(sketch({ where: ["web"], data: "sensitive" }).decisions.join(" ")).toMatch(/impact assessment/);
  });

  it("always gives at least one decision and a version-one list", () => {
    const s = sketch({ where: [] });
    expect(s.clients).toEqual(["Interface to be decided"]);
    expect(s.decisions.length).toBeGreaterThan(0);
    expect(s.versionOne.length).toBeGreaterThan(0);
  });

  it("never mentions prices or timelines", () => {
    const text = sketchToText({ where: ["ios", "android", "web"], payments: "subs", data: "sensitive", ai: "docs", auth: "yes", stage: "rebuild" });
    expect(text).not.toMatch(/€|\$|week|month|day(s)?\b/i);
  });

  it("does not list the same service twice", () => {
    const s = sketch({ where: ["web"], payments: "once", integrations: ["payments"] });
    expect(new Set(s.services).size).toBe(s.services.length);
    expect(s.services).not.toContain("Payment provider integration");
  });
});
