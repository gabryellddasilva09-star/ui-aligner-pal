import { todayKey } from "@/lib/records";

const sleepKey = (date: string) => `vl-sleep-done-${date}`;

export function markSleepDone(date = todayKey()) {
  try { localStorage.setItem(sleepKey(date), "1"); window.dispatchEvent(new Event("vl-progress")); } catch { /* storage unavailable */ }
}

export function isSleepDone(date = todayKey()) {
  try { return localStorage.getItem(sleepKey(date)) === "1"; } catch { return false; }
}

/** Overall share of today's items: each scheduled exercise, each planned meal and the sleep routine count once. */
export function dailyProgress(p: { exDone: number; exTotal: number; mealDone: number; mealTotal: number; sleepDone: boolean }) {
  const total = p.exTotal + p.mealTotal + 1;
  const done = Math.min(p.exDone, p.exTotal) + Math.min(p.mealDone, p.mealTotal) + (p.sleepDone ? 1 : 0);
  return Math.round((done / total) * 100);
}
