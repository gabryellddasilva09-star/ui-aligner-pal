import { describe, expect, it } from "vitest";
import { scheduleInputSchema } from "@/lib/movement-schedule";

describe("exercise weekday selections", () => {
  it("allows all seven days", () => {
    expect(scheduleInputSchema.parse({ exerciseId: "pescoco", weekdays: [0, 1, 2, 3, 4, 5, 6] }).weekdays).toHaveLength(7);
  });
  it("allows removing the exercise from every day", () => {
    expect(scheduleInputSchema.parse({ exerciseId: "ombros", weekdays: [] }).weekdays).toEqual([]);
  });
  it("sorts days and removes duplicates", () => {
    expect(scheduleInputSchema.parse({ exerciseId: "bracos", weekdays: [6, 1, 1] }).weekdays).toEqual([1, 6]);
  });
  it("rejects invalid days and unknown exercises", () => {
    expect(scheduleInputSchema.safeParse({ exerciseId: "pescoco", weekdays: [7] }).success).toBe(false);
    expect(scheduleInputSchema.safeParse({ exerciseId: "unknown", weekdays: [0] }).success).toBe(false);
  });
});