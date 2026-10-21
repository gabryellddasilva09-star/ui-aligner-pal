import { describe, expect, it } from "vitest";
import { dailyProgress } from "@/lib/daily-progress";

describe("daily progress", () => {
  it("starts at zero", () => {
    expect(dailyProgress({ exDone: 0, exTotal: 5, mealDone: 0, mealTotal: 5, sleepDone: false })).toBe(0);
  });
  it("counts the sleep routine once done", () => {
    expect(dailyProgress({ exDone: 0, exTotal: 0, mealDone: 0, mealTotal: 0, sleepDone: true })).toBe(100);
  });
  it("reaches 100% only when everything is done", () => {
    expect(dailyProgress({ exDone: 5, exTotal: 5, mealDone: 5, mealTotal: 5, sleepDone: false })).toBe(91);
    expect(dailyProgress({ exDone: 5, exTotal: 5, mealDone: 5, mealTotal: 5, sleepDone: true })).toBe(100);
  });
});
