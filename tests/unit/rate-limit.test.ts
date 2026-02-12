import { describe, expect, it } from "vitest";
import { checkRateLimit, clearRateLimitBuckets } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("allows calls until threshold and then blocks", () => {
    clearRateLimitBuckets();

    expect(checkRateLimit("k1", 2, 60_000)).toBe(true);
    expect(checkRateLimit("k1", 2, 60_000)).toBe(true);
    expect(checkRateLimit("k1", 2, 60_000)).toBe(false);
  });
});
