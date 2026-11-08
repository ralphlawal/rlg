import { describe, expect, it } from "vitest";
import { decodeAnswers, encodeAnswers } from "@/lib/scope-share";

describe("Scope Sketch sharing", () => {
  it("round-trips answers, including non-ASCII text", () => {
    const a = { idea: "Booking for a café in Dún Laoghaire", where: ["ios" as const, "web" as const], ai: "docs" as const };
    expect(decodeAnswers(encodeAnswers(a))).toEqual(a);
  });
  it("rejects malformed, oversized or unexpected input", () => {
    expect(decodeAnswers("not-base64!!")).toBeNull();
    expect(decodeAnswers("x".repeat(3000))).toBeNull();
    expect(decodeAnswers(encodeAnswers({ where: ["windows" as never] }))).toBeNull();
    expect(decodeAnswers(undefined)).toBeNull();
  });
});
