import { describe, expect, it } from "vitest";
import { formatSessionTime, historySchema, reminderSchema, weeklySessions } from "@/data/relaxation";

describe("Relaxation history and controls", () => {
  it("rejects sessions with no performed duration", () => {
    expect(historySchema.safeParse([{ id: "1", name: "Respiração", date: "2026-10-09T12:00:00.000Z", seconds: 0 }]).success).toBe(false);
    expect(historySchema.safeParse([]).success).toBe(true);
  });
  it("counts only this week's actual sessions", () => {
    const records = [{ id: "1", name: "Pausa", date: "2026-10-09T12:00:00.000Z", seconds: 65 }, { id: "2", name: "Pausa", date: "2026-10-01T12:00:00.000Z", seconds: 120 }, { id: "3", name: "Pausa", date: "2026-10-12T12:00:00.000Z", seconds: 120 }];
    expect(weeklySessions(records, new Date("2026-10-09T18:00:00.000Z"))).toHaveLength(1);
  });
  it("formats pause and countdown times", () => {
    expect(formatSessionTime(120)).toBe("02:00");
    expect(formatSessionTime(9)).toBe("00:09");
  });
  it("validates local reminder preferences", () => {
    expect(reminderSchema.safeParse({ enabled: true, time: "19:00", days: [0, 6] }).success).toBe(true);
    expect(reminderSchema.safeParse({ enabled: true, time: "28:99", days: [9] }).success).toBe(false);
  });
});