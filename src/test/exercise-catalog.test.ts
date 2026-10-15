import { describe, expect, it } from "vitest";
import { exercises, allExercises, exerciseCategories } from "@/data/exercises";
import { scheduleInputSchema } from "@/lib/movement-schedule";

describe("supplied PDF exercise catalog", () => {
  it("includes all 26 exercises in their original sections", () => {
    expect(exercises).toHaveLength(26);
    expect(exerciseCategories.map(cat => exercises.filter(e => e.cat === cat).length)).toEqual([4, 11, 5, 4, 2]);
    expect(new Set(allExercises.map(e => e.id)).size).toBe(allExercises.length);
  });
  it("keeps matching illustrations, instructions and safety notes for every exercise", () => {
    for (const exercise of exercises) {
      expect(exercise.img).toMatch(/^https:\/\//);
      expect(exercise.steps.length).toBeGreaterThanOrEqual(4);
      expect(exercise.attention).toBeTruthy();
      expect(exercise.breathing).toBeTruthy();
      expect(exercise.benefit).toBeTruthy();
      expect(scheduleInputSchema.safeParse({ exerciseId: exercise.id, weekdays: [0, 3] }).success).toBe(true);
    }
  });
  it("retains per-side durations without undercounting planned time", () => {
    expect(exercises.find(e => e.id === "f1-3")?.min).toBe(4);
    expect(exercises.find(e => e.id === "f3-3")?.min).toBe(6);
    expect(exercises.find(e => e.id === "aq2")?.min).toBe(1.5);
  });
});