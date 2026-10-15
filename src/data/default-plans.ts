import { recipes } from "@/data/anti-inflammatory";
import { exercises } from "@/data/exercises";

/** Converts a day -> ids plan into id -> weekdays rows. */
function toRows(byDay: string[][]) {
  const map = new Map<string, number[]>();
  byDay.forEach((ids, day) => ids.forEach(id => map.set(id, [...(map.get(id) ?? []), day])));
  return [...map].map(([id, weekdays]) => ({ id, weekdays: [...new Set(weekdays)].sort() }));
}

const pick = <T,>(list: T[], i: number) => list[i % list.length];

/** One recipe per meal (café, almoço, lanche, janta, ceia) for every weekday. */
export function defaultRecipeSchedule() {
  const cats = ["cafe", "almoco", "lanche", "janta", "ceia"] as const;
  const byDay = Array.from({ length: 7 }, (_, d) =>
    cats.map(c => recipes.filter(r => r.category === c)).filter(l => l.length).map(l => pick(l, d)!.id));
  return toRows(byDay);
}

/** Gentle default session for every weekday: warm-up, mobility, light strength or minimal movement, cool-down. */
export function defaultExerciseSchedule() {
  const by = (cat: string) => exercises.filter(e => e.cat === cat);
  const aq = by("Aquecimento"), mob = by("Mobilidade"), forca = by("Força leve"), min = by("Movimento mínimo"), dq = by("Desaquecimento");
  const byDay = Array.from({ length: 7 }, (_, d) => {
    const ids = [pick(aq, d), pick(mob, d * 2), pick(mob, d * 2 + 1), d % 2 === 1 ? pick(forca, d) : pick(min, d), pick(dq, d)];
    return ids.filter(Boolean).map(e => e!.id);
  });
  return toRows(byDay);
}
