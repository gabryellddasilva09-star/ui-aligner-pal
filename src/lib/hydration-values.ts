import { z } from "zod";

export const DEFAULT_WATER_GOAL_ML = 2000;
export const WATER_STEP_ML = 500;
export const MAX_WATER_ML = 10000;
export const waterGoalSchema = z.number().int().min(500).max(MAX_WATER_ML).multipleOf(500);
export function waterGoal(value: unknown) {
  const parsed = waterGoalSchema.safeParse(value);
  return parsed.success ? parsed.data : DEFAULT_WATER_GOAL_ML;
}
export function adjustWater(amount: number, direction: 1 | -1) {
  return Math.max(0, Math.min(MAX_WATER_ML, amount + direction * WATER_STEP_ML));
}
export function waterPercent(amount: number, goal: number) {
  return Math.min(100, Math.max(0, Math.round(amount / waterGoal(goal) * 100)));
}
export function waterLabel(ml: number) {
  return ml < 1000 ? `${ml} ml` : `${(ml / 1000).toLocaleString("pt-BR")} L`;
}