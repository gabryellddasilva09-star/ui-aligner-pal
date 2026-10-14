import { describe, expect, it } from "vitest";
import { movementProgress, movementWeek } from "@/lib/movement-progress";

describe("real movement progress", () => {
  it("starts empty and only counts scheduled exercises", () => {
    expect(movementProgress(["pescoco", "ombros"], []).value).toBe(0);
    expect(movementProgress(["pescoco", "ombros"], ["pescoco", "pernas"]).value).toBe(0.5);
    expect(movementProgress([], ["pescoco"]).value).toBe(0);
  });
  it("does not double count repeat completions", () => {
    expect(movementProgress(["pescoco"], ["pescoco", "pescoco"]).done).toBe(1);
  });
  it("shows the current Sunday through Saturday with dates", () => {
    const week = movementWeek(new Date(2026, 9, 14));
    expect(week[0]).toEqual({ key: "2026-10-11", label: "11/10" });
    expect(week[3]).toEqual({ key: "2026-10-14", label: "14/10" });
    expect(week[6]?.key).toBe("2026-10-17");
  });
  it("handles month and year boundaries", () => {
    const week = movementWeek(new Date(2027, 0, 1));
    expect(week[0]?.key).toBe("2026-12-27");
    expect(week[6]?.key).toBe("2027-01-02");
  });
});