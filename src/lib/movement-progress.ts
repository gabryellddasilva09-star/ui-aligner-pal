import { todayKey } from "@/lib/records";

export function movementWeek(today = new Date()) {
  const sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + index);
    return { key: todayKey(date), label: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) };
  });
}

export function movementProgress(exerciseIds: string[], completedIds: string[]) {
  const completed = new Set(completedIds);
  const done = exerciseIds.filter(id => completed.has(id)).length;
  return { done, total: exerciseIds.length, value: exerciseIds.length ? done / exerciseIds.length : 0 };
}